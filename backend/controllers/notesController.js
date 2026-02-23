const Notes = require("../models/Notes");

exports.uploadNotes = async (req, res) => {

    try {

        const notes = await Notes.create({
            title: req.body.title,
            subjectId: req.body.subjectId,
            file: req.file.filename
        });

        res.json(notes);

    } catch (error) {
        res.status(500).json(error.message);
    }
};