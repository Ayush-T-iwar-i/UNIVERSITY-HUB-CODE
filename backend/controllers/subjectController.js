const Subject = require("../models/Subject");

exports.createSubject = async (req, res) => {

    try {

        const subject = await Subject.create(req.body);

        res.json(subject);

    } catch (error) {
        res.status(500).json(error.message);
    }
};


exports.getSubjects = async (req, res) => {

    const subjects = await Subject.find()
        .populate("courseId")
        .populate("teacherId");

    res.json(subjects);
};