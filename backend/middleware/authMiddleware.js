const jwt = require("jsonwebtoken");

// ✅ Verify Token
const verifyToken = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json("Token failed");
  }
};

// ✅ Admin Check
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Access denied. Admin only.");
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json("Access denied. Teacher only.");
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json("Access denied. Student only.");
  }
  next();
};

module.exports = { verifyToken, isAdmin, isTeacher, isStudent };