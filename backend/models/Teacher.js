const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    department: String,
    college: String,
    password: String,
    role: { type: String, default: "teacher" },
    gender: String,
    otp: String,
    otpExpire: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);