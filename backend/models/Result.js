const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
  },
  grade: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);
