const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String, // Monday, Tuesday
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    room: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", timetableSchema);
