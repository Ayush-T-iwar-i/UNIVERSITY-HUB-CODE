const Leave = require("../models/Leave");
const User = require("../models/User");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");

// ================= STUDENT APPLY LEAVE =================
exports.applyLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;

    const leave = await Leave.create({
      studentId: req.user.id,
      reason,
      fromDate,
      toDate,
    });

    // 🔔 Get all teachers
    const teachers = await User.find({ role: "teacher" });

    for (let teacher of teachers) {
      // Create notification (INSIDE async function ✅)
      await Notification.create({
        userId: teacher._id,
        title: "New Leave Request",
        message: `New leave request from student.\nReason: ${reason}`,
      });

      // Send email
      await sendEmail(
        teacher.email,
        `New Leave Request\n\nReason: ${reason}\nFrom: ${fromDate}\nTo: ${toDate}`
      );
    }

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      leave,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VIEW ALL LEAVES =================
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= APPROVE / REJECT =================
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("studentId");

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // 🔔 Create notification for student
    await Notification.create({
      userId: leave.studentId._id,
      title: "Leave Status Updated",
      message: `Your leave request has been ${status}`,
    });

    // Send email
    await sendEmail(
      leave.studentId.email,
      `Your leave request has been ${status}`
    );

    res.json({
      success: true,
      message: "Leave status updated",
      leave,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
