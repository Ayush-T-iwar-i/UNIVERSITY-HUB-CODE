const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },
  file: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    default: 0
  }
}, { timestamps: true });



module.exports = mongoose.model("Submission", submissionSchema);
