const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Student Dashboard
router.get(
  "/student",
  authMiddleware.verifyToken,
  dashboardController.studentDashboard
);

// Teacher Dashboard
router.get(
  "/teacher",
  authMiddleware.verifyToken,
  dashboardController.teacherDashboard
);

// Admin Dashboard
router.get(
  "/admin",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  dashboardController.adminDashboard
);

// ================= ADMIN TOP 5 STUDENTS =================
router.get(
  "/admin/top-students",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  dashboardController.adminTopStudents
);

// ================= ADMIN ANALYTICS =================
router.get(
  "/analytics",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  dashboardController.adminAnalytics
);

module.exports = router;
