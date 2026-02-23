const express = require("express");
const router = express.Router();

const { createCourse, getCourses } = require("../controllers/courseController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, isAdmin, createCourse);
router.get("/all", verifyToken, getCourses);

module.exports = router;
