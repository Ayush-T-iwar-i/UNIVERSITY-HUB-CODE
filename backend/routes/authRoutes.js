const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { verifyToken } = require("../middleware/authMiddleware");

// ✅ IMPORT FULL CONTROLLER OBJECT (IMPORTANT FIX)
const authController = require("../controllers/authController");

// ================= RATE LIMIT =================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, try again later",
  },
});

router.use(authLimiter);

// ================= EMAIL OTP =================
router.post("/send-email-otp", authController.sendEmailOtp);
router.post("/verify-email-otp", authController.verifyOtp);

// ================= REGISTER =================
router.post("/register", authController.register);

// ================= LOGIN =================
router.post("/login", authController.login);

// ================= REFRESH TOKEN =================
router.post("/refresh-token", authController.refreshToken);

// ================= LOGOUT =================
router.post("/logout", verifyToken, authController.logout);

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", authController.forgotPassword);

// ================= RESET PASSWORD =================
router.post("/reset-password", authController.resetPassword);

// ================= CHANGE PASSWORD =================
router.put("/change-password", verifyToken, authController.changePassword);

module.exports = router;