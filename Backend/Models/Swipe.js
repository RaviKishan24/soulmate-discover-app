import mongoose from "mongoose";

const swipeSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["like", "pass"], required: true }
  },
  { timestamps: true }
);

swipeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

export default mongoose.model("Swipe", swipeSchema);