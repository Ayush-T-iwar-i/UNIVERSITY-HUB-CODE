const express = require("express");
const router = express.Router();

const { createSubject, getSubjects } = require("../controllers/subjectController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, isAdmin, createSubject);
router.get("/all", verifyToken, getSubjects);

module.exports = router;


// Update Subject
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Subject
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
