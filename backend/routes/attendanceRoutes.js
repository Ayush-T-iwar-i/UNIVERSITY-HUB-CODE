const express = require("express");
const router = express.Router();

const { verifyToken, isTeacher, isStudent } = require("../middleware/authMiddleware");
const Attendance = require("../models/Attendance");
const { getMonthlyReport } = require("../controllers/attendanceController");

// ================= MARK ATTENDANCE (TEACHER) =================
router.post("/mark", verifyToken, isTeacher, async (req, res) => {
  try {
    const { studentId, subjectId, status } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      studentId,
      subjectId,
      date: { $gte: today },
    });

    if (alreadyMarked) {
      return res.status(400).json("Attendance already marked today");
    }

    const attendance = await Attendance.create({
      studentId,
      subjectId,
      status: status.toLowerCase(),
      date: new Date(),
    });

    res.json({
      success: true,
      message: "Attendance Marked",
      attendance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET MY ATTENDANCE (STUDENT) =================
router.get("/my", verifyToken, isStudent, async (req, res) => {
  try {
    const attendance = await Attendance.find({
      studentId: req.user.id,
    }).populate("subjectId", "name");

    res.json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET ATTENDANCE PERCENTAGE (STUDENT) =================
router.get("/percentage", verifyToken, isStudent, async (req, res) => {
  try {
    const studentId = req.user.id;

    const total = await Attendance.countDocuments({ studentId });

    const present = await Attendance.countDocuments({
      studentId,
      status: "present",
    });

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.json({
      totalClasses: total,
      presentClasses: present,
      percentage: percentage + "%",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= GET ATTENDANCE BY SUBJECT (TEACHER) =================
router.get("/subject/:id", verifyToken, isTeacher, async (req, res) => {
  try {
    const data = await Attendance.find({
      subjectId: req.params.id,
    }).populate("studentId", "name email");

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= MONTHLY REPORT (STUDENT) =================
router.get("/monthly-report", verifyToken, isStudent, getMonthlyReport);


module.exports = router;
