const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

phone: {
  type: String,
  required: function () {
    return this.role === "student" || this.role === "teacher";
  },
},

  studentId: {
  type: String,
  unique: true,
  sparse: true,   // 🔥 ADD THIS
  required: function () {
    return this.role === "student";
  },
},

  admissionYear: {
  type: String,
  required: function () {
    return this.role === "student";
  },
},
    
college: {
  type: String,
  required: false,
},

department: {
  type: String,
  required: function () {
    return this.role === "student";
  },
},

university: {
  type: String,
  required: function () {
    return this.role === "teacher";
  },
  trim: true,
},


age: {
  type: Number,
  required: function () {
    return this.role === "teacher";
  },
},

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
      lowercase: true,
    },

      gender: {
  type: String,
},

    otp: {
      type: String,
    },

    otpExpire: {
      type: Date,
    },

    profileImage: {
      type: String,
    },

    refreshToken: {
      type: String,
    },



  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
