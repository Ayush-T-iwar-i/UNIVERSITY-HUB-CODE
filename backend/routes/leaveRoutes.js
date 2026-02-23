const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const { leaveApplyValidation } = require("../validators/leaveValidator");

const {
  verifyToken,
  isStudent,
  isTeacher,
  isAdmin,
} = require("../middleware/authMiddleware");

const {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");

// Student Apply Leave
router.post(
  "/apply",
  verifyToken,
  isStudent,
  leaveApplyValidation,
  validate,
  applyLeave
);

// Teacher/Admin View Leaves
router.get(
  "/all",
  verifyToken,
  isTeacher,
  getAllLeaves
);

// Approve / Reject Leave
router.put(
  "/update/:id",
  verifyToken,
  isTeacher,
  updateLeaveStatus
);

module.exports = router;
