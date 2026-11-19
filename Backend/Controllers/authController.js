import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { sendVerificationEmail } from "../Config/mailer.js";

function signToken(userId) {
  return jwt.sign({ userId: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}
function generateOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

export async function register(req, res) {
  try {
    const { name, email, password, phone, age, photo, bio, city, interests } =
      req.body || {};

    if (!name || !email || !password || !age || !photo || !bio || !city) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, age, photo, bio and city are required",
      });
    }

    if (Number(age) < 18) {
      return res.status(400).json({
        success: false,
        message: "You must be at least 18 years old",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    const token = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
      phone: phone || "",
      age: Number(age),
      photo: String(photo).trim(),
      bio: String(bio).trim(),
      city: String(city).trim(),
      interests: Array.isArray(interests) ? interests : [],
      emailVerified: false,
      verificationOtp: otp,
      verificationOtpExpires: expires,
    });

    sendVerificationEmail(normalizedEmail, otp).catch((err) => {
      console.error("Failed to send verification email:", err.message);
    });

    res.status(201).json({
      success: true,
      message: "Registered. Check your email to verify your account.",
      userId: user._id,
      email: normalizedEmail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
}

export async function resendOtp(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Don't leak whether the email exists
    if (!user || user.emailVerified) {
      return res.json({
        success: true,
        message:
          "If that email exists and is unverified, a new code has been sent.",
      });
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationOtp = otp;
    user.verificationOtpExpires = expires;
    await user.save();

    sendVerificationEmail(normalizedEmail, otp).catch((err) => {
      console.error("Failed to resend OTP:", err.message);
    });

    res.json({
      success: true,
      message: "A new 6-digit code has been sent to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not resend OTP" });
  }
}

export async function verifyStatus(req, res) {
  const { email } = req.query;
  if (!email) return res.json({ exists: false, emailVerified: false });
  const user = await User.findOne({
    email: String(email).trim().toLowerCase(),
  }).select("emailVerified");
  return res.json({
    exists: !!user,
    emailVerified: !!user?.emailVerified,
  });
}

export async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body || {};
    console.log("Email for verifiaction",email,"otp ",otp);
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      verificationOtp: String(otp).trim(),
      verificationOtpExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.emailVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    await user.save();

    res.json({
      success: true,
      message: "Email verified. You can now log in.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const token = signToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        photo: user.photo,
        bio: user.bio,
        city: user.city,
        interests: user.interests,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
}
