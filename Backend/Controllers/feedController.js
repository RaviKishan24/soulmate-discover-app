import mongoose from "mongoose";
import User from "../Models/User.js";
import Swipe from "../Models/Swipe.js";

export async function getFeed(req, res) {
  try {
    const meId = req.userId;
    if (!meId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    // 1. Get all IDs that the current user has already swiped on (Like or Pass)
    const swipes = await Swipe.find({ fromUser: meId }).select("toUser");
    const swipedIds = swipes.map((s) => s.toUser);

    // 2. Get current user's city to prioritize local matches (Optional but good UX)
    const me = await User.findById(meId).select("city").lean();

    // 3. Find profiles matching the criteria
    const profiles = await User.find({
      _id: { 
        $ne: meId,           // Exclude myself
        $nin: swipedIds      // Exclude anyone I've already swiped on
      },
      isDemo: false,         // 🚨 CRITICAL: Hide the Demo User from real feeds
    })
      .select("name age photo bio city interests") // Only return public-safe fields
      .limit(30)
      .lean();

    // 4. Optional: Sort so people in the same city appear first
    if (me?.city) {
      profiles.sort((a, b) => {
        const aSameCity = a.city === me.city ? 1 : 0;
        const bSameCity = b.city === me.city ? 1 : 0;
        return bSameCity - aSameCity;
      });
    }

    res.json({ success: true, profiles });
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ success: false, message: "Failed to load feed" });
  }
}