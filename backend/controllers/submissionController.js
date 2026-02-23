const Submission = require("../models/Submission");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;

    const submission = await Submission.create({
      studentId: req.user.id,
      assignmentId,
      file: req.file.path
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all submissions (Teacher)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("studentId", "name email")
      .populate("assignmentId", "title");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Give marks (Teacher)
exports.giveMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      id,
      { marks },
      { new: true }
    );

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
