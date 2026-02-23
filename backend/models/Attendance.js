const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);