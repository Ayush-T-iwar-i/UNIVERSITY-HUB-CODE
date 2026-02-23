const User = require("../models/User");
const Result = require("../models/Result");
const bcrypt = require("bcryptjs");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");


// CREATE TEACHER
exports.createTeacher = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher"
    });

    await teacher.save();

    res.json({ message: "Teacher Created" });

  } catch (error) {
    res.status(500).json(error);
  }
};



// CREATE STUDENT
exports.createStudent = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new User({
      name,
      email,
      password: hashedPassword,
      role: "student"
    });

    await student.save();

    res.json({ message: "Student Created" });

  } catch (error) {
    res.status(500).json(error);
  }
};

// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ]
    };

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      users
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= ADMIN ANALYTICS =================
exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });

    const totalLeaves = await Leave.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    // Role-wise data for Pie Chart
    const roleData = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalLeaves,
        totalAttendance
      },
      roleChart: roleData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= TOP 5 STUDENTS =================
exports.getTopStudents = async (req, res) => {
  try {
    const topStudents = await Result.aggregate([
      {
        $group: {
          _id: "$studentId",
          averageMarks: { $avg: "$marks" }
        }
      },
      { $sort: { averageMarks: -1 } },
      { $limit: 5 }
    ]);

    // Populate student details
    const formatted = await Promise.all(
      topStudents.map(async (item, index) => {
        const student = await User.findById(item._id).select("name email");
        return {
          rank: index + 1,
          student,
          averageMarks: item.averageMarks.toFixed(2)
        };
      })
    );

    res.json({
      success: true,
      topStudents: formatted
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= MONTHLY ATTENDANCE GRAPH =================
exports.getMonthlyAttendanceGraph = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const data = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const formatted = months.map((month, index) => {
      const presentData = data.find(
        d => d._id.month === index + 1 && d._id.status === "present"
      );

      const absentData = data.find(
        d => d._id.month === index + 1 && d._id.status === "absent"
      );

      return {
        month,
        present: presentData ? presentData.count : 0,
        absent: absentData ? absentData.count : 0
      };
    });

    res.json({
      success: true,
      year,
      attendanceGraph: formatted
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};