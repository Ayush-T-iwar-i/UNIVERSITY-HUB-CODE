const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    subjectName: String,

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

module.exports = mongoose.model("Subject", subjectSchema);