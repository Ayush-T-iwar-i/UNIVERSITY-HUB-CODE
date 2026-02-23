const express = require("express");
const router = express.Router();

const { verifyToken, isTeacher, isStudent } = require("../middleware/authMiddleware");

const {
  generateCertificate,
  getStudentResult,
  getSubjectRanking,
  exportResultPDF
} = require("../controllers/resultController");

// ================= GENERATE CERTIFICATE (STUDENT) =================
router.get(
  "/certificate",
  verifyToken,
  isStudent,
  generateCertificate
);

// ================= STUDENT RESULT =================
router.get(
  "/my",
  verifyToken,
  isStudent,
  getStudentResult
);

// ================= SUBJECT RANK (TEACHER ONLY) =================
router.get(
  "/rank/:subjectId",
  verifyToken,
  isTeacher,
  getSubjectRanking
);

// ================= EXPORT RESULT PDF (STUDENT) =================
router.get(
  "/export-pdf",
  verifyToken,
  isStudent,
  exportResultPDF
);

module.exports = router;
