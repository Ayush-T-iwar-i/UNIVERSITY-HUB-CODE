const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);