import { Router } from "express";
import { requireAuth } from "../Middleware/auth.js";
import { getFeed } from "../Controllers/feedController.js";
import { postSwipe } from "../Controllers/swipeController.js";
import { getMatches, markMatchesSeen } from "../Controllers/matchController.js";
import { 
  register, 
  verifyEmail, 
  login, 
  resendOtp, 
  verifyStatus 
} from "../Controllers/authController.js";

const router = Router();

// ── PUBLIC AUTH ROUTES ──
router.post("/auth/register", register);
router.post("/auth/verify-email", verifyEmail);
router.post("/auth/login", login);
router.post("/auth/resend-otp", resendOtp);
router.get("/auth/verify-status", verifyStatus);

// ── PROTECTED APP ROUTES (Require JWT) ──
router.get("/feed", requireAuth, getFeed);
router.post("/swipe", requireAuth, postSwipe);

// Matches
router.get("/matches", requireAuth, getMatches);
router.put("/matches/mark-seen", requireAuth, markMatchesSeen);

export default router;