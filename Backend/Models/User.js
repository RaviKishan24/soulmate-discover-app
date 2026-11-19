import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    emailVerified: { type: Boolean, default: false },
    verificationOtp: { type: String, default: null },
    verificationOtpExpires: { type: Date, default: null },
    age: { type: Number, required: true, min: 18 },
    photo: { type: String, required: true },
    bio: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    interests: { type: [String], default: [] },
    isDemo: { type: Boolean, default: false, select: false },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
