const Course = require("../models/Course");

exports.createCourse = async (req, res) => {

    try {

        const course = await Course.create(req.body);

        res.json(course);

    } catch (error) {
        res.status(500).json(error.message);
    }
};


exports.getCourses = async (req, res) => {

    const courses = await Course.find();

    res.json(courses);
};