const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin, isTeacher } = require("../middleware/authMiddleware");
const { createNotice, getAllNotices } = require("../controllers/noticeController");

// Create Notice
router.post(
  "/create",
  verifyToken,
  (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "teacher") {
      next();
    } else {
      return res.status(403).json("Access Denied");
    }
  },
  createNotice
);

// Get Notices
router.get("/all", verifyToken, getAllNotices);

module.exports = router;
