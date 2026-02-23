console.log("AUTH CONTROLLER LOADED");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const sendEmail = require("../utils/sendEmail");

// ================= HELPER =================
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {

    console.log("BODY RECEIVED:", req.body); // 👈 YAHAN PASTE KARO
     console.log("COLLEGE VALUE:", college);

    let {
      name,
      email,
      password,
      phone,
      studentId,
      admissionYear,
      department,
      college,
      gender,
    } = req.body;
    // ✅ Normalize Data
    email = email?.toLowerCase().trim();
    studentId = studentId?.toUpperCase().trim();
    department = department?.toLowerCase().trim();
    college = college?.trim();
    console.log("AFTER TRIM COLLEGE:", college);

    // ✅ Required fields check
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !studentId ||
      !admissionYear ||
      !department ||
      !college
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Format",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const existId = await User.findOne({ studentId });
    if (existId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      studentId,
      admissionYear,
      department,
      college,
      gender,
      password: hash,
      role: "student",
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();
    await sendEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email.",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp) {
      return res.status(400).json({
        success: false,
        message: "Verify account OTP first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        profileImage: user.profileImage,
        admissionYear: user.admissionYear,
        department: user.department,
        college: user.college,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= REFRESH TOKEN =================
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });

  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.refreshToken = null;
    await user.save();

    res.json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: "OTP verified successfully. You can now login.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || user.otpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful. You can now login.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CHANGE PASSWORD =================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};