const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "pending", // pending, approved, rejected
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
