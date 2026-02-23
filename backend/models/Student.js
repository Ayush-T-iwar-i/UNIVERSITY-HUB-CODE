const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    studentId: { type: String, unique: true },
    admissionYear: String,
    department: String,
    college: String,
    password: String,
    role: { type: String, default: "student" },
    gender: String,
    otp: String,
    otpExpire: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);