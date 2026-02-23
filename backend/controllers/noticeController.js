const Notice = require("../models/Notice");
const Notification = require("../models/Notification");

// Create Notice (Admin/Teacher)
exports.createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    const notice = await Notice.create({
      title,
      message,
      postedBy: req.user.id,
      role: req.user.role,
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Notices (Student View)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(notices);
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
