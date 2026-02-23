const Timetable = require("../models/Timetable");

// Add Timetable (Admin)
exports.addTimetable = async (req, res) => {
  try {
    const data = await Timetable.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Timetable
exports.getAllTimetable = async (req, res) => {
  try {
    const data = await Timetable.find()
      .populate("subjectId", "name")
      .populate("teacherId", "name");

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
