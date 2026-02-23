const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");
const { updateProfile } = require("../controllers/userController");

// ================= GET PROFILE =================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ================= UPDATE PROFILE =================
router.put("/update-profile", verifyToken, updateProfile);

module.exports = router;

