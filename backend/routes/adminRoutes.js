const express = require("express");
const router = express.Router();

// ⚠ IMPORTANT: Correct middleware import
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// ⚠ IMPORTANT: Correct controller import
const dashboardController = require("../controllers/dashboardController");

const { getAllUsers } = require("../controllers/adminController");

const { getAdminAnalytics } = require("../controllers/adminController");

const { getTopStudents } = require("../controllers/adminController");

const { getMonthlyAttendanceGraph } = require("../controllers/adminController");

// SAFE ROUTES (No destructuring issue)
router.get("/student", verifyToken, dashboardController.studentDashboard);

router.get("/teacher", verifyToken, dashboardController.teacherDashboard);

router.get("/admin", verifyToken, isAdmin, dashboardController.adminDashboard);

router.get("/users", verifyToken, isAdmin, getAllUsers);

router.get("/analytics", verifyToken, isAdmin, getAdminAnalytics);

router.get("/top-students", verifyToken, isAdmin, getTopStudents);

router.get("/attendance-graph",verifyToken,isAdmin,getMonthlyAttendanceGraph);

module.exports = router;