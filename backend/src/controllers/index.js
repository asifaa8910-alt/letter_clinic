import * as authService from "../services/auth.service.js";
import * as patientService from "../services/patient.service.js";
import * as doctorService from "../services/doctor.service.js";
import * as appointmentService from "../services/appointment.service.js";
import * as notificationService from "../services/notification.service.js";
import * as adminService from "../services/admin.service.js";

// Helper for responses
const sendSuccess = (res, message, data = {}) => {
  res.status(200).json({ success: true, message, data });
};

const sendError = (res, message, status = 400, errors = []) => {
  res.status(status).json({ success: false, message, errors });
};

// Auth Controller
export const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const data = await authService.registerUser(name, email, password, role);
      sendSuccess(res, "Registration successful", data);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const data = await authService.loginUser(email, password);
      sendSuccess(res, "Login successful", data);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      sendSuccess(res, "Fetched current user", req.user);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user._id, currentPassword, newPassword);
      sendSuccess(res, "Password updated successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  }
};

// Patient Controller
export const patientController = {
  updateProfile: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const updatedUser = await patientService.updatePatientProfile(req.user._id, name, email, password);
      sendSuccess(res, "Patient profile updated successfully", updatedUser);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  analyzeSymptoms: async (req, res) => {
    try {
      const { age, gender, symptoms, duration, severity } = req.body;
      const report = await patientService.analyzeSymptoms(req.user._id, age, gender, symptoms, duration, severity);
      sendSuccess(res, "Symptom evaluated successfully", report);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getPrescriptions: async (req, res) => {
    try {
      const list = await doctorService.getPatientPrescriptions(req.user._id);
      sendSuccess(res, "Fetched prescriptions", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  addReview: async (req, res) => {
    try {
      const { doctorId, rating, comment } = req.body;
      const review = await doctorService.addReview(doctorId, req.user.name, rating, comment);
      sendSuccess(res, "Review submitted successfully", review);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getSymptomReports: async (req, res) => {
    try {
      const list = await patientService.getSymptomReports(req.user._id);
      sendSuccess(res, "Fetched symptom reports", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getSymptomReportById: async (req, res) => {
    try {
      const report = await patientService.getSymptomReportById(req.params.id, req.user._id);
      if (!report) return sendError(res, "Report not found", 404);
      sendSuccess(res, "Fetched symptom report details", report);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deleteSymptomReport: async (req, res) => {
    try {
      await patientService.deleteSymptomReport(req.params.id, req.user._id);
      sendSuccess(res, "Symptom report deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getReminders: async (req, res) => {
    try {
      const list = await patientService.getReminders(req.user._id);
      sendSuccess(res, "Fetched medication reminders", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  createReminder: async (req, res) => {
    try {
      const { medicineName, dosage, frequency, time } = req.body;
      const rem = await patientService.createReminder(req.user._id, medicineName, dosage, frequency, time);
      sendSuccess(res, "Medication reminder created", rem);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  toggleReminder: async (req, res) => {
    try {
      const rem = await patientService.toggleReminder(req.params.id, req.user._id);
      sendSuccess(res, "Reminder active status toggled", rem);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deleteReminder: async (req, res) => {
    try {
      await patientService.deleteReminder(req.params.id, req.user._id);
      sendSuccess(res, "Reminder deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getPatientReviews: async (req, res) => {
    try {
      const list = await doctorService.getPatientReviews(req.user.name);
      sendSuccess(res, "Fetched reviews written by patient", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  updateReview: async (req, res) => {
    try {
      const { rating, comment } = req.body;
      const rev = await doctorService.updateReview(req.params.id, req.user.name, rating, comment);
      sendSuccess(res, "Review updated successfully", rev);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deleteReview: async (req, res) => {
    try {
      await doctorService.deleteReview(req.params.id, req.user.name);
      sendSuccess(res, "Review deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  updateReminder: async (req, res) => {
    try {
      const { medicineName, dosage, frequency, time } = req.body;
      const updated = await patientService.updateReminder(req.params.id, req.user._id, { medicineName, dosage, frequency, time });
      sendSuccess(res, "Medication reminder updated successfully", updated);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getStats: async (req, res) => {
    try {
      const stats = await patientService.getPatientStats(req.user._id);
      sendSuccess(res, "Fetched patient dashboard statistics", stats);
    } catch (error) {
      sendError(res, error.message);
    }
  }
};

// Doctor Controller
export const doctorController = {
  updateProfile: async (req, res) => {
    try {
      const updatedDoc = await doctorService.updateDoctorProfile(req.user._id, req.body);
      sendSuccess(res, "Doctor profile updated successfully", updatedDoc);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  addSlot: async (req, res) => {
    try {
      const { date, time } = req.body;
      const slot = await doctorService.addDoctorSlot(req.user._id, date, time);
      sendSuccess(res, "Availability slot added successfully", slot);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deleteSlot: async (req, res) => {
    try {
      await doctorService.deleteDoctorSlot(req.params.id);
      sendSuccess(res, "Slot deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  createPrescription: async (req, res) => {
    try {
      const { patientId, symptoms, medicines, notes } = req.body;
      const rx = await doctorService.createPrescription(patientId, req.user.name, symptoms, medicines, notes);
      sendSuccess(res, "Prescription issued successfully", rx);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getSlots: async (req, res) => {
    try {
      const list = await doctorService.getDoctorSlots(req.user._id);
      sendSuccess(res, "Fetched doctor availability slots", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  toggleSlot: async (req, res) => {
    try {
      const slot = await doctorService.toggleDoctorSlot(req.params.id, req.user._id);
      sendSuccess(res, "Slot availability status toggled", slot);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getPrescriptions: async (req, res) => {
    try {
      const list = await doctorService.getDoctorPrescriptions(req.user.name);
      sendSuccess(res, "Fetched doctor prescriptions history", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getPrescriptionById: async (req, res) => {
    try {
      const rx = await doctorService.getPrescriptionById(req.params.id);
      if (!rx) return sendError(res, "Prescription not found", 404);
      sendSuccess(res, "Fetched prescription details", rx);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getVerificationStatus: async (req, res) => {
    try {
      const status = await doctorService.getDoctorVerificationStatus(req.user._id);
      sendSuccess(res, "Fetched clinical license verification status", status);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  submitVerification: async (req, res) => {
    try {
      const { license, degree } = req.body;
      const ver = await doctorService.submitVerification(req.user._id, license, degree);
      sendSuccess(res, "Verification request submitted successfully", ver);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getStats: async (req, res) => {
    try {
      const stats = await doctorService.getDoctorStats(req.user._id);
      sendSuccess(res, "Fetched doctor dashboard statistics", stats);
    } catch (error) {
      sendError(res, error.message);
    }
  }
};

// Marketplace Controller
export const marketplaceController = {
  getDoctors: async (req, res) => {
    try {
      const doctors = await doctorService.getDoctors(req.query);
      sendSuccess(res, "Fetched doctor marketplace listings", doctors);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getDoctorReviews: async (req, res) => {
    try {
      const reviews = await doctorService.getDoctorReviews(req.params.id);
      sendSuccess(res, "Fetched doctor reviews", reviews);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getDoctorSlots: async (req, res) => {
    try {
      const slots = await doctorService.getDoctorSlots(req.params.id);
      sendSuccess(res, "Fetched doctor slots", slots);
    } catch (error) {
      sendError(res, error.message);
    }
  }
};

// Appointment Controller
export const appointmentController = {
  book: async (req, res) => {
    try {
      const { doctorId, doctorName, slotId } = req.body;
      const app = await appointmentService.bookAppointment(
        req.user._id,
        req.user.name,
        doctorId,
        doctorName,
        slotId
      );
      sendSuccess(res, "Appointment booked successfully", app);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getMyAppointments: async (req, res) => {
    try {
      const list = await appointmentService.getAppointments(req.user.role, req.user._id);
      sendSuccess(res, "Fetched appointments list", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  cancel: async (req, res) => {
    try {
      await appointmentService.cancelAppointment(req.params.id);
      sendSuccess(res, "Appointment cancelled successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  complete: async (req, res) => {
    try {
      await appointmentService.completeAppointment(req.params.id);
      sendSuccess(res, "Appointment completed successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  reschedule: async (req, res) => {
    try {
      const { newSlotId } = req.body;
      const updatedApp = await appointmentService.rescheduleAppointment(req.params.id, newSlotId);
      sendSuccess(res, "Appointment rescheduled successfully", updatedApp);
    } catch (error) {
      sendError(res, error.message);
    }
  }
};

// Notification Controller
export const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const list = await notificationService.getNotifications(req.user._id);
      sendSuccess(res, "Fetched notifications list", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  markRead: async (req, res) => {
    try {
      const notif = await notificationService.markAsRead(req.params.id);
      sendSuccess(res, "Notification marked as read", notif);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  markAllRead: async (req, res) => {
    try {
      await notificationService.markAllAsRead(req.user._id);
      sendSuccess(res, "All notifications marked as read");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  clearAll: async (req, res) => {
    try {
      await notificationService.clearNotifications(req.user._id);
      sendSuccess(res, "Notifications cleared");
    } catch (error) {
      sendError(res, error.message);
    }
  }
};

// Admin Controller
export const adminController = {
  getStats: async (req, res) => {
    try {
      const stats = await adminService.getAdminStats();
      sendSuccess(res, "Fetched platform stats", stats);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getVerifications: async (req, res) => {
    try {
      const verifications = await adminService.getVerifications();
      sendSuccess(res, "Fetched verifications requests", verifications);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  updateVerification: async (req, res) => {
    try {
      const { status } = req.body;
      const ver = await adminService.updateVerificationStatus(req.params.id, status);
      sendSuccess(res, "Updated verification status", ver);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getPatients: async (req, res) => {
    try {
      const list = await adminService.getPatients();
      sendSuccess(res, "Fetched patients list", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  addPatient: async (req, res) => {
    try {
      const patient = await adminService.addPatientByAdmin(req.body);
      sendSuccess(res, "Patient registered successfully", patient);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  updatePatient: async (req, res) => {
    try {
      const patient = await adminService.updatePatientByAdmin(req.params.id, req.body);
      sendSuccess(res, "Patient profile updated successfully", patient);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deletePatient: async (req, res) => {
    try {
      await adminService.deletePatientByAdmin(req.params.id);
      sendSuccess(res, "Patient deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  addDoctor: async (req, res) => {
    try {
      const doc = await adminService.addDoctorByAdmin(req.body);
      sendSuccess(res, "Doctor registered successfully", doc);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  updateDoctor: async (req, res) => {
    try {
      const doc = await adminService.updateDoctorByAdmin(req.params.id, req.body);
      sendSuccess(res, "Doctor profile updated successfully", doc);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deleteDoctor: async (req, res) => {
    try {
      await adminService.deleteDoctorByAdmin(req.params.id);
      sendSuccess(res, "Doctor profile deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getLogs: async (req, res) => {
    try {
      const logs = await adminService.getActivityLogs();
      sendSuccess(res, "Fetched system logs", logs);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  clearLogs: async (req, res) => {
    try {
      await adminService.clearActivityLogs();
      sendSuccess(res, "System logs cleared successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getAllAppointments: async (req, res) => {
    try {
      const list = await adminService.getAllAppointments();
      sendSuccess(res, "Fetched all appointments", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  updateAppointmentStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const app = await adminService.updateAppointmentStatus(req.params.id, status);
      sendSuccess(res, "Appointment status updated", app);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deleteAppointment: async (req, res) => {
    try {
      await adminService.deleteAppointment(req.params.id);
      sendSuccess(res, "Appointment deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  },

  getAllReviews: async (req, res) => {
    try {
      const list = await adminService.getAllReviews();
      sendSuccess(res, "Fetched all reviews", list);
    } catch (error) {
      sendError(res, error.message);
    }
  },

  deleteReview: async (req, res) => {
    try {
      await adminService.deleteReviewByAdmin(req.params.id);
      sendSuccess(res, "Review deleted successfully");
    } catch (error) {
      sendError(res, error.message);
    }
  }
};
