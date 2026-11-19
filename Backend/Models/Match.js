import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    users: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      validate: (v) => Array.isArray(v) && v.length === 2,
    },
    // Tracks which users have already seen/been notified about this match
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Prevents duplicate matches between the same two users
matchSchema.index({ "users.0": 1, "users.1": 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);