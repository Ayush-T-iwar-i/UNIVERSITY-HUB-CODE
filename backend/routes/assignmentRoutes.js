const express = require("express");
const router = express.Router();

const { verifyToken, isTeacher } = require("../middleware/authMiddleware");
const Assignment = require("../models/Assignment");

// ================= CREATE ASSIGNMENT =================
router.post("/", verifyToken, isTeacher, async (req, res) => {
  try {
    const { title, description, subjectId, dueDate } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      subjectId,
      teacherId: req.user.id,
      dueDate,
    });

    res.json({
      success: true,
      message: "Assignment Created",
      assignment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= GET ALL ASSIGNMENTS =================
router.get("/", verifyToken, async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("subjectId", "name")
      .populate("teacherId", "name email");

    res.json(assignments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;



// ================= UPDATE ASSIGNMENT =================
router.put("/:id", verifyToken, isTeacher, async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Assignment Updated",
      updated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= DELETE ASSIGNMENT =================
router.delete("/:id", verifyToken, isTeacher, async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Assignment Deleted",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
