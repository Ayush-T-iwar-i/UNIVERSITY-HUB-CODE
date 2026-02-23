const { body } = require("express-validator");

exports.leaveApplyValidation = [
  body("fromDate")
    .notEmpty()
    .withMessage("From date is required"),

  body("toDate")
    .notEmpty()
    .withMessage("To date is required"),

  body("reason")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Reason must be at least 5 characters"),

  body("leaveType")
    .notEmpty()
    .withMessage("Leave type is required"),
];
