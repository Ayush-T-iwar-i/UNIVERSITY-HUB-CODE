const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String, // admin or teacher
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
