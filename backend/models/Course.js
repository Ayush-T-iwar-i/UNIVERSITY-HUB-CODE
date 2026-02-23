const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true
    },

    courseCode: {
        type: String,
        required: true
    },

    duration: String

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);