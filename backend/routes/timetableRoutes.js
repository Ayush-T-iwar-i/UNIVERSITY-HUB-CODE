const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const { addTimetable, getAllTimetable } = require("../controllers/timetableController");

// Add Timetable
router.post("/add", verifyToken, isAdmin, addTimetable);

// View Timetable
router.get("/all", verifyToken, getAllTimetable);

module.exports = router;
