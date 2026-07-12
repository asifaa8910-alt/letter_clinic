import { body, param, query } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").isIn(["patient", "doctor", "admin"]).withMessage("Invalid role")
];

export const loginValidator = [
  body("email").isEmail().withMessage("Must be a valid email"),
  body("password").notEmpty().withMessage("Password is required")
];

export const doctorProfileUpdateValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Must be a valid email"),
  body("specialty").optional().trim().notEmpty().withMessage("Specialty cannot be empty"),
  body("experience").optional().isInt({ min: 0 }).withMessage("Experience must be a positive integer"),
  body("fee").optional().isNumeric().withMessage("Fee must be a number"),
  body("hospital").optional().trim().notEmpty().withMessage("Hospital cannot be empty"),
  body("bio").optional().trim().notEmpty().withMessage("Bio cannot be empty")
];

export const patientProfileUpdateValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Must be a valid email")
];

export const symptomTriageValidator = [
  body("age").notEmpty().withMessage("Age is required"),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),
  body("symptoms").trim().notEmpty().withMessage("Symptoms text is required"),
  body("duration").trim().notEmpty().withMessage("Duration is required"),
  body("severity").isIn(["Low", "Medium", "Severe"]).withMessage("Invalid severity")
];

export const slotValidator = [
  body("date").trim().notEmpty().withMessage("Date is required"),
  body("time").trim().notEmpty().withMessage("Time is required")
];

export const appointmentBookValidator = [
  body("doctorId").isMongoId().withMessage("Invalid doctorId"),
  body("slotId").isMongoId().withMessage("Invalid slotId")
];

export const prescriptionValidator = [
  body("patientId").isMongoId().withMessage("Invalid patientId"),
  body("symptoms").trim().notEmpty().withMessage("Symptoms are required"),
  body("medicines").isArray().withMessage("Medicines must be an array")
];

export const reviewValidator = [
  body("doctorId").isMongoId().withMessage("Invalid doctorId"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").trim().notEmpty().withMessage("Comment is required")
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters")
];

export const reminderValidator = [
  body("medicineName").trim().notEmpty().withMessage("Medicine name is required"),
  body("dosage").trim().notEmpty().withMessage("Dosage description is required"),
  body("frequency").trim().notEmpty().withMessage("Frequency is required"),
  body("time").trim().notEmpty().withMessage("Time is required")
];

export const reviewUpdateValidator = [
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().trim().notEmpty().withMessage("Comment cannot be empty")
];
