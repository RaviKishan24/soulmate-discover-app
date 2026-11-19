import mongoose from "mongoose";
import Swipe from "../Models/Swipe.js";
import Match from "../Models/Match.js";
import User from "../Models/User.js";

export async function postSwipe(req, res) {
  try {
    const { targetUserId, action } = req.body || {};
    const meId = req.userId;

    if (!meId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!targetUserId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ success: false, message: "Invalid targetUserId" });
    }
    if (!["like", "pass"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }
    if (String(targetUserId) === String(meId)) {
      return res.status(400).json({ success: false, message: "Cannot swipe on yourself" });
    }

    const target = await User.findById(targetUserId).lean();
    if (!target) {
      return res.status(404).json({ success: false, message: "Target user not found" });
    }

    let swipe;
    try {
      swipe = await Swipe.create({ fromUser: meId, toUser: targetUserId, action });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ success: false, message: "Already swiped on this user" });
      }
      throw e;
    }

    let isMatch = false;
    let matchDoc = null;

    if (action === "like") {
      const reverse = await Swipe.findOne({
        fromUser: targetUserId,
        toUser: meId,
        action: "like",
      });

      if (reverse) {
        // Canonical sort so [A,B] and [B,A] are always the same document
        const pair = [meId, targetUserId]
          .map((id) => new mongoose.Types.ObjectId(String(id)))
          .sort((a, b) => String(a).localeCompare(String(b)));

        try {
          // 🚨 FIX: Add `seenBy: [meId]` because the person swiping is seeing it right now!
          matchDoc = await Match.create({ 
            users: pair,
            seenBy: [meId] 
          });
        } catch (e) {
          if (e.code === 11000) {
            matchDoc = await Match.findOne({ users: { $all: pair } });
            if (!matchDoc) {
              return res.json({
                success: true,
                isMatch: true,
                message: "It's a match!",
              });
            }
          } else {
            throw e;
          }
        }
        isMatch = true;
      }
    }

    const payload = { success: true, isMatch };
    if (isMatch) {
      payload.message = "It's a match!";
      payload.match = {
        _id: matchDoc._id,
        user: {
          _id: target._id,
          name: target.name,
          age: target.age,
          photo: target.photo,
          bio: target.bio,
        },
      };
    } else {
      payload.message = "Swipe recorded successfully";
    }
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to record swipe" });
  }
}