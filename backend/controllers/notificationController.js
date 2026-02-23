const Notification = require("../models/Notification");

// ================= GET MY NOTIFICATIONS =================
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= MARK AS READ =================
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
