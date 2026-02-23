const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

// ================= GET MY NOTIFICATIONS =================
router.get("/my", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notifications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ================= MARK AS READ =================
router.put("/read/:id", verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // security check
      { isRead: true }, // ✅ correct field name
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
