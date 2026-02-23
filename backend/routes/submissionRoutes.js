const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { verifyToken, isTeacher, isStudent } = require("../middleware/authMiddleware");

const Submission = require("../models/Submission");


// ================= STUDENT SUBMIT ASSIGNMENT =================
router.post(
  "/submit",
  verifyToken,
  isStudent,
  upload.single("file"),
  async (req, res) => {
    try {
      const { assignmentId } = req.body;

      if (!req.file) {
        return res.status(400).json("File is required");
      }

      const submission = await Submission.create({
        assignmentId,
        studentId: req.user.id,
        file: req.file.filename,
      });

      res.json({
        success: true,
        message: "Assignment Submitted",
        submission,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// ================= TEACHER: GET SUBMISSIONS =================
router.get("/assignment/:id", verifyToken, isTeacher, async (req, res) => {
  try {
    const submissions = await Submission.find({
      assignmentId: req.params.id,
    }).populate("studentId", "name email");

    res.json(submissions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= TEACHER: GIVE MARKS =================
router.put("/marks/:id", verifyToken, isTeacher, async (req, res) => {
  try {
    const { marks } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks },
      { new: true }
    );

    res.json({
      success: true,
      message: "Marks Updated",
      submission,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= STUDENT: VIEW MY MARKS =================
router.get("/my-marks", verifyToken, isStudent, async (req, res) => {
  try {
    const data = await Submission.find({
      studentId: req.user.id,
    }).populate("assignmentId", "title");

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;