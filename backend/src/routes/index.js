import { Router } from "express";
import {
  authController,
  patientController,
  doctorController,
  marketplaceController,
  appointmentController,
  notificationController,
  adminController
} from "../controllers/index.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validator.middleware.js";
import {
  registerValidator,
  loginValidator,
  doctorProfileUpdateValidator,
  patientProfileUpdateValidator,
  symptomTriageValidator,
  slotValidator,
  appointmentBookValidator,
  prescriptionValidator,
  reviewValidator,
  changePasswordValidator,
  reminderValidator,
  reviewUpdateValidator
} from "../validators/index.js";

const router = Router();

// ==========================================
// AUTH MODULE APIs
// ==========================================
router.post("/auth/register", registerValidator, validateRequest, authController.register);
router.post("/auth/login", loginValidator, validateRequest, authController.login);
router.get("/auth/current-user", protect, authController.getCurrentUser);
router.put("/auth/password", protect, changePasswordValidator, validateRequest, authController.changePassword);

// ==========================================
// PATIENT MODULE APIs
// ==========================================
router.put("/patient/profile", protect, restrictTo("patient"), patientProfileUpdateValidator, validateRequest, patientController.updateProfile);
router.post("/patient/triage", protect, restrictTo("patient"), symptomTriageValidator, validateRequest, patientController.analyzeSymptoms);
router.get("/patient/triage", protect, restrictTo("patient"), patientController.getSymptomReports);
router.get("/patient/triage/:id", protect, restrictTo("patient"), patientController.getSymptomReportById);
router.delete("/patient/triage/:id", protect, restrictTo("patient"), patientController.deleteSymptomReport);
router.get("/patient/prescriptions", protect, restrictTo("patient"), patientController.getPrescriptions);

// Patient Reviews CRUD
router.post("/patient/review", protect, restrictTo("patient"), reviewValidator, validateRequest, patientController.addReview);
router.get("/patient/reviews", protect, restrictTo("patient"), patientController.getPatientReviews);
router.put("/patient/reviews/:id", protect, restrictTo("patient"), reviewUpdateValidator, validateRequest, patientController.updateReview);
router.delete("/patient/reviews/:id", protect, restrictTo("patient"), patientController.deleteReview);

// Medication Reminders
router.get("/patient/reminders", protect, restrictTo("patient"), patientController.getReminders);
router.post("/patient/reminders", protect, restrictTo("patient"), reminderValidator, validateRequest, patientController.createReminder);
router.put("/patient/reminders/:id/toggle", protect, restrictTo("patient"), patientController.toggleReminder);
router.delete("/patient/reminders/:id", protect, restrictTo("patient"), patientController.deleteReminder);

// ==========================================
// DOCTOR MODULE APIs
// ==========================================
router.put("/doctor/profile", protect, restrictTo("doctor"), doctorProfileUpdateValidator, validateRequest, doctorController.updateProfile);
router.get("/doctor/slots", protect, restrictTo("doctor"), doctorController.getSlots);
router.post("/doctor/slots", protect, restrictTo("doctor"), slotValidator, validateRequest, doctorController.addSlot);
router.put("/doctor/slots/:id/toggle", protect, restrictTo("doctor"), doctorController.toggleSlot);
router.delete("/doctor/slots/:id", protect, restrictTo("doctor"), doctorController.deleteSlot);
router.get("/doctor/prescriptions", protect, restrictTo("doctor"), doctorController.getPrescriptions);
router.get("/doctor/prescriptions/:id", protect, doctorController.getPrescriptionById);
router.post("/doctor/prescription", protect, restrictTo("doctor"), prescriptionValidator, validateRequest, doctorController.createPrescription);
router.get("/doctor/verification", protect, restrictTo("doctor"), doctorController.getVerificationStatus);

// ==========================================
// MARKETPLACE APIs (Public/Authenticated)
// ==========================================
router.get("/marketplace/doctors", marketplaceController.getDoctors);
router.get("/marketplace/doctors/:id/reviews", marketplaceController.getDoctorReviews);
router.get("/marketplace/doctors/:id/slots", marketplaceController.getDoctorSlots);

// ==========================================
// APPOINTMENTS MODULE APIs
// ==========================================
router.post("/appointments/book", protect, restrictTo("patient"), appointmentBookValidator, validateRequest, appointmentController.book);
router.get("/appointments", protect, appointmentController.getMyAppointments);
router.put("/appointments/:id/cancel", protect, appointmentController.cancel);
router.put("/appointments/:id/complete", protect, restrictTo("doctor"), appointmentController.complete);

// ==========================================
// NOTIFICATIONS MODULE APIs
// ==========================================
router.get("/notifications", protect, notificationController.getNotifications);
router.put("/notifications/:id/read", protect, notificationController.markRead);
router.put("/notifications/read-all", protect, notificationController.markAllRead);
router.delete("/notifications/clear-all", protect, notificationController.clearAll);

// ==========================================
// ADMIN MODULE APIs
// ==========================================
router.get("/admin/stats", protect, restrictTo("admin"), adminController.getStats);
router.get("/admin/verifications", protect, restrictTo("admin"), adminController.getVerifications);
router.put("/admin/verifications/:id", protect, restrictTo("admin"), adminController.updateVerification);

// Patient CRUD by Admin
router.get("/admin/patients", protect, restrictTo("admin"), adminController.getPatients);
router.post("/admin/patients", protect, restrictTo("admin"), patientProfileUpdateValidator, validateRequest, adminController.addPatient);
router.put("/admin/patients/:id", protect, restrictTo("admin"), patientProfileUpdateValidator, validateRequest, adminController.updatePatient);
router.delete("/admin/patients/:id", protect, restrictTo("admin"), adminController.deletePatient);

// Doctor CRUD by Admin
router.post("/admin/doctors", protect, restrictTo("admin"), doctorProfileUpdateValidator, validateRequest, adminController.addDoctor);
router.put("/admin/doctors/:id", protect, restrictTo("admin"), doctorProfileUpdateValidator, validateRequest, adminController.updateDoctor);
router.delete("/admin/doctors/:id", protect, restrictTo("admin"), adminController.deleteDoctor);

// Appointment Management by Admin
router.get("/admin/appointments", protect, restrictTo("admin"), adminController.getAllAppointments);
router.put("/admin/appointments/:id", protect, restrictTo("admin"), adminController.updateAppointmentStatus);
router.delete("/admin/appointments/:id", protect, restrictTo("admin"), adminController.deleteAppointment);

// Review Management by Admin
router.get("/admin/reviews", protect, restrictTo("admin"), adminController.getAllReviews);
router.delete("/admin/reviews/:id", protect, restrictTo("admin"), adminController.deleteReview);

// Activity Logs
router.get("/admin/logs", protect, restrictTo("admin"), adminController.getLogs);
router.delete("/admin/logs", protect, restrictTo("admin"), adminController.clearLogs);

export default router;
