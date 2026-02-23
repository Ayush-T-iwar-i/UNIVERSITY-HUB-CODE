const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");
const User = require("../models/User");
exports.createAssignment = async (req, res) => {

    try {

        const assignment = await Assignment.create({
            title: req.body.title,
            description: req.body.description,
            subjectId: req.body.subjectId,
            file: req.file.filename,
            dueDate: req.body.dueDate
        });

        res.json(assignment);

    } catch (error) {
        res.status(500).json(error.message);
    }
};


exports.getAssignments = async (req, res) => {

    const assignments = await Assignment.find()
        .populate("subjectId");

    res.json(assignments);
};


// After assignment created
const students = await User.find({ role: "student" });

for (let student of students) {
  await Notification.create({
    userId: student._id,
    message: "New assignment has been uploaded.",
  });
}