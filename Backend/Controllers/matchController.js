import Match from "../Models/Match.js";

export async function getMatches(req, res) {
  try {
    // 1. Get the logged-in user's ID from the JWT (requireAuth middleware)
    const meId = req.userId;
    
    if (!meId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // 2. Find all matches where I am one of the users
    const matches = await Match.find({ users: meId })
      .populate("users", "name age photo bio city interests")
      .sort({ createdAt: -1 })
      .lean();

    // 3. Format the response to show the *other* person's profile
    const payload = matches
      .map((m) => {
        const other = m.users.find((u) => String(u._id) !== String(meId));
        return { 
          _id: m._id, 
          user: other, 
          createdAt: m.createdAt,
          // Check if I have already seen this match (for the notification badge)
          isSeen: m.seenBy ? m.seenBy.includes(meId) : true
        };
      })
      .filter((m) => m.user); // Safety: drop match if the other user was deleted

    res.json({ success: true, matches: payload });
  } catch (err) {
    console.error("Get matches error:", err);
    res.status(500).json({ success: false, message: "Failed to load matches" });
  }
}

// ── Mark matches as seen ──
export async function markMatchesSeen(req, res) {
  try {
    const meId = req.userId;

    // Add my ID to the seenBy array for all matches I'm part of
    await Match.updateMany(
      { users: meId, seenBy: { $ne: meId } },
      { $addToSet: { seenBy: meId } }
    );

    res.json({ success: true, message: "Matches marked as seen" });
  } catch (err) {
    console.error("Mark seen error:", err);
    res.status(500).json({ success: false, message: "Failed to mark matches as seen" });
  }
}