const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Subject = require("../models/Subject");
const User = require("../models/User");


// ================= STUDENT DASHBOARD =================
exports.studentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const submissions = await Submission.find({ studentId });

    const totalSubmissions = submissions.length;

    const totalMarks = submissions.reduce((acc, item) => {
      return acc + (item.marks || 0);
    }, 0);

    const averageMarks =
      totalSubmissions === 0
        ? 0
        : (totalMarks / totalSubmissions).toFixed(2);

    const highestMarks =
      submissions.length === 0
        ? 0
        : Math.max(...submissions.map((s) => s.marks || 0));

    res.json({
      totalSubmissions,
      totalMarks,
      averageMarks,
      highestMarks,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======== TEACHER DASHBOARD =================
exports.teacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Subjects created by teacher
    const subjects = await Subject.find({ teacherId });
    const subjectIds = subjects.map((s) => s._id);

    // Assignments of those subjects
    const assignments = await Assignment.find({
      subjectId: { $in: subjectIds },
    });

    const assignmentIds = assignments.map((a) => a._id);

    // Submissions of those assignments
    const submissions = await Submission.find({
      assignmentId: { $in: assignmentIds },
    });

    // Total Students (only role student)
    const students = await User.countDocuments({ role: "student" });

    res.json({
      totalSubjects: subjects.length,
      totalAssignments: assignments.length,
      totalSubmissions: submissions.length,
      totalStudents: students,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ========= ADMIN DASHBOARD =======
exports.adminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalSubjects = await Subject.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    res.json({
      totalStudents,
      totalTeachers,
      totalSubjects,
      totalAssignments,
      totalAttendance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= ADMIN TOP STUDENTS =================
exports.adminTopStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });

    let result = [];

    for (let student of students) {
      const submissions = await Submission.find({
        studentId: student._id,
      });

      const totalMarks = submissions.reduce((acc, item) => {
        return acc + (item.marks || 0);
      }, 0);

      const average =
        submissions.length === 0
          ? 0
          : totalMarks / submissions.length;

      result.push({
        studentId: student._id,
        name: student.name,
        email: student.email,
        totalMarks,
        average: average.toFixed(2),
      });
    }

    // Sort by total marks descending
    result.sort((a, b) => b.totalMarks - a.totalMarks);

    // Take Top 5
    const top5 = result.slice(0, 5);

    res.json(top5);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= ADMIN ANALYTICS =================
exports.adminAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });

    const totalSubjects = await Subject.countDocuments();
    const totalAssignments = await Assignment.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    res.json({
      totalStudents,
      totalTeachers,
      totalSubjects,
      totalAssignments,
      totalSubmissions,
      totalAttendance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};