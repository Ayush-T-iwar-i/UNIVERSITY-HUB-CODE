const Subject = require("../models/Subject");
const User = require("../models/User");
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");

// ================= MARK ATTENDANCE =================
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status } = req.body;

    const student = await User.findById(studentId);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    const subject = await Subject.findById(subjectId);
    if (!subject)
      return res.status(404).json({ message: "Subject not found" });

    const alreadyMarked = await Attendance.findOne({
      studentId,
      subjectId,
      date,
    });

    if (alreadyMarked)
      return res.status(400).json({ message: "Attendance already marked" });

    const attendance = await Attendance.create({
      studentId,
      subjectId,
      date,
      status: status.toLowerCase(), // ✅ important fix
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ATTENDANCE PERCENTAGE =================
exports.getAttendancePercentage = async (req, res) => {
  try {
    const { studentId } = req.params;

    const total = await Attendance.countDocuments({ studentId });

    const present = await Attendance.countDocuments({
      studentId,
      status: "present", // ✅ lowercase fix
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
};

// ================= GET STUDENT ATTENDANCE =================
exports.getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.find({
      studentId: id,
    }).populate("subjectId", "name");

    res.json(attendance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= MONTHLY ATTENDANCE REPORT =================
exports.getMonthlyReport = async (req, res) => {
  try {
    const studentId = req.user.id;

    const report = await Attendance.aggregate([
      {
        $match: { studentId: new mongoose.Types.ObjectId(studentId) }
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalClasses: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(report);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
