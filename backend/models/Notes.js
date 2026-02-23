const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({

    title: String,

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },

    file: String

});

module.exports = mongoose.model("Notes", notesSchema);