const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");

const { uploadNotes } = require("../controllers/notesController");

router.post("/upload", verifyToken, upload.single("file"), uploadNotes);

module.exports = router;