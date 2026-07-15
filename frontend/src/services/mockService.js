import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to convert MongoDB _id to frontend id dynamically
const mapId = (obj) => {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(mapId);
  if (typeof obj === "object") {
    const mapped = { ...obj };
    if (obj._id) {
      mapped.id = obj._id;
    }
    for (const key in mapped) {
      if (mapped[key] && typeof mapped[key] === "object") {
        mapped[key] = mapId(mapped[key]);
      }
    }
    return mapped;
  }
  return obj;
};

export const initMockDatabase = () => {
  // Managed by MongoDB local database
};

export const mockService = {
  // Authentication & Session
  login: async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("currentUser", JSON.stringify(mapId(res.data.data.user)));
      return mapId(res.data.data.user);
    }
    throw new Error(res.data.message || "Invalid credentials");
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  },

  register: async (name, email, password, role) => {
    const res = await API.post("/auth/register", { name, email, password, role });
    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("currentUser", JSON.stringify(mapId(res.data.data.user)));
      return mapId(res.data.data.user);
    }
    throw new Error(res.data.message || "Registration failed");
  },

  // Symptoms Evaluation AI
  analyzeSymptoms: async (age, gender, symptomsText, duration, severity) => {
    const res = await API.post("/patient/triage", { age, gender, symptoms: symptomsText, duration, severity });
    return mapId(res.data.data);
  },

  // Doctors & Marketplace
  getDoctors: async (filters = {}) => {
    const res = await API.get("/marketplace/doctors", { params: filters });
    return mapId(res.data.data);
  },

  getDoctorById: async (id) => {
    const res = await API.get("/marketplace/doctors");
    const doc = res.data.data.find(d => d.userId === id || d._id === id);
    return mapId(doc);
  },

  updateDoctorProfile: async (id, updatedData) => {
    const res = await API.put("/doctor/profile", updatedData);
    const updated = mapId(res.data.data);
    // Sync with currentUser local storage if changed
    const curr = mockService.getCurrentUser();
    if (curr && curr.id === id) {
      curr.name = updatedData.name;
      curr.email = updatedData.email;
      localStorage.setItem("currentUser", JSON.stringify(curr));
    }
    return updated;
  },

  // Slots Management
  getSlots: async (doctorId) => {
    const res = await API.get(`/marketplace/doctors/${doctorId}/slots`);
    return mapId(res.data.data);
  },

  addSlot: async (doctorId, date, time) => {
    const res = await API.post("/doctor/slots", { date, time });
    return mapId(res.data.data);
  },

  deleteSlot: async (slotId) => {
    await API.delete(`/doctor/slots/${slotId}`);
  },

  // Appointments
  bookAppointment: async (patientId, patientName, doctorId, doctorName, slotId) => {
    const res = await API.post("/appointments/book", { doctorId, doctorName, slotId });
    return mapId(res.data.data);
  },

  getAppointments: async (_role, _userId) => {
    const res = await API.get("/appointments");
    return mapId(res.data.data);
  },

  cancelAppointment: async (appointmentId) => {
    await API.put(`/appointments/${appointmentId}/cancel`);
  },

  completeAppointment: async (appointmentId) => {
    await API.put(`/appointments/${appointmentId}/complete`);
  },

  // Prescriptions
  getPrescriptions: async (_patientId) => {
    const res = await API.get("/patient/prescriptions");
    return mapId(res.data.data);
  },

  createPrescription: async (patientId, doctorName, symptoms, medicines, notes) => {
    const res = await API.post("/doctor/prescription", { patientId, symptoms, medicines, notes });
    return mapId(res.data.data);
  },

  // Reviews
  getReviews: async (doctorId) => {
    const res = await API.get(`/marketplace/doctors/${doctorId}/reviews`);
    return mapId(res.data.data);
  },

  addReview: async (doctorId, patientName, rating, comment) => {
    const res = await API.post("/patient/review", { doctorId, rating, comment });
    return mapId(res.data.data);
  },

  // Admin Verification & Operations
  getVerifications: async () => {
    const res = await API.get("/admin/verifications");
    return mapId(res.data.data);
  },

  updateVerificationStatus: async (id, status) => {
    const res = await API.put(`/admin/verifications/${id}`, { status });
    return mapId(res.data.data);
  },

  getAdminStats: async () => {
    const res = await API.get("/admin/stats");
    return mapId(res.data.data);
  },

  getActivityLogs: async () => {
    const res = await API.get("/admin/logs");
    return mapId(res.data.data);
  },

  clearActivityLogs: async () => {
    await API.delete("/admin/logs");
  },

  // Admin Patients CRUD
  getPatients: async () => {
    const res = await API.get("/admin/patients");
    return mapId(res.data.data);
  },

  addPatientByAdmin: async (patientData) => {
    const res = await API.post("/admin/patients", patientData);
    return mapId(res.data.data);
  },

  updatePatientByAdmin: async (id, patientData) => {
    const res = await API.put(`/admin/patients/${id}`, patientData);
    return mapId(res.data.data);
  },

  deletePatientByAdmin: async (id) => {
    await API.delete(`/admin/patients/${id}`);
  },

  // Admin Doctors CRUD
  addDoctorByAdmin: async (doctorData) => {
    const res = await API.post("/admin/doctors", doctorData);
    return mapId(res.data.data);
  },

  updateDoctorByAdmin: async (id, doctorData) => {
    const res = await API.put(`/admin/doctors/${id}`, doctorData);
    return mapId(res.data.data);
  },

  deleteDoctorByAdmin: async (id) => {
    await API.delete(`/admin/doctors/${id}`);
  },

  updatePatientProfile: async (id, updatedData) => {
    const res = await API.put("/patient/profile", updatedData);
    const updated = mapId(res.data.data);
    // Sync with currentUser local storage if changed
    const curr = mockService.getCurrentUser();
    if (curr && curr.id === id) {
      curr.name = updatedData.name;
      curr.email = updatedData.email;
      localStorage.setItem("currentUser", JSON.stringify(curr));
    }
    return updated;
  },

  // Notifications
  getNotifications: async (_userId) => {
    const res = await API.get("/notifications");
    return mapId(res.data.data);
  },

  addNotification: async (_userId, _title, _message, _type = "info") => {
    // Handled by system triggers on backend
  },

  markNotificationAsRead: async (id) => {
    await API.put(`/notifications/${id}/read`);
  },

  markAllNotificationsAsRead: async (_userId) => {
    await API.put("/notifications/read-all");
  },

  clearNotifications: async (_userId) => {
    await API.delete("/notifications/clear-all");
  },

  changePassword: async (currentPassword, newPassword) => {
    await API.put("/auth/password", { currentPassword, newPassword });
  },

  getSymptomReportsHistory: async () => {
    const res = await API.get("/patient/triage");
    return mapId(res.data.data);
  },

  getSymptomReportDetail: async (id) => {
    const res = await API.get(`/patient/triage/${id}`);
    return mapId(res.data.data);
  },

  deleteSymptomReport: async (id) => {
    await API.delete(`/patient/triage/${id}`);
  },

  getPatientReviews: async () => {
    const res = await API.get("/patient/reviews");
    return mapId(res.data.data);
  },

  updatePatientReview: async (id, rating, comment) => {
    const res = await API.put(`/patient/reviews/${id}`, { rating, comment });
    return mapId(res.data.data);
  },

  deletePatientReview: async (id) => {
    await API.delete(`/patient/reviews/${id}`);
  },

  getReminders: async () => {
    const res = await API.get("/patient/reminders");
    return mapId(res.data.data);
  },

  createReminder: async (medicineName, dosage, frequency, time) => {
    const res = await API.post("/patient/reminders", { medicineName, dosage, frequency, time });
    return mapId(res.data.data);
  },

  toggleReminder: async (id) => {
    const res = await API.put(`/patient/reminders/${id}/toggle`);
    return mapId(res.data.data);
  },

  deleteReminder: async (id) => {
    await API.delete(`/patient/reminders/${id}`);
  },

  getDoctorOwnSlots: async () => {
    const res = await API.get("/doctor/slots");
    return mapId(res.data.data);
  },

  toggleOwnSlot: async (id) => {
    const res = await API.put(`/doctor/slots/${id}/toggle`);
    return mapId(res.data.data);
  },

  getDoctorPrescriptionsHistory: async () => {
    const res = await API.get("/doctor/prescriptions");
    return mapId(res.data.data);
  },

  getPrescriptionDetails: async (id) => {
    const res = await API.get(`/doctor/prescriptions/${id}`);
    return mapId(res.data.data);
  },

  getVerificationStatusDetails: async () => {
    const res = await API.get("/doctor/verification");
    return mapId(res.data.data);
  },

  adminGetAllAppointments: async () => {
    const res = await API.get("/admin/appointments");
    return mapId(res.data.data);
  },

  adminUpdateAppointmentStatus: async (id, status) => {
    const res = await API.put(`/admin/appointments/${id}`, { status });
    return mapId(res.data.data);
  },

  adminDeleteAppointment: async (id) => {
    await API.delete(`/admin/appointments/${id}`);
  },

  adminGetAllReviews: async () => {
    const res = await API.get("/admin/reviews");
    return mapId(res.data.data);
  },

  adminDeleteReview: async (id) => {
    await API.delete(`/admin/reviews/${id}`);
  },

  // Chatbot Local Heuristics
  getChatbotResponse: (msg) => {
    const text = msg.toLowerCase();
    let reply = "";
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      reply = "Hello! I am Letters AI Medical Assistant. How can I help you today? You can ask about symptoms, booking appointments, or how the platform operates.";
    } else if (text.includes("symptom") || text.includes("triage") || text.includes("sick") || text.includes("feel")) {
      reply = "If you are feeling unwell, go to the 'AI Symptom Triage' tab in your Patient Dashboard. Enter your age, gender, symptoms, and severity. Our engine will suggest possible conditions and direct you to the right specialist!";
    } else if (text.includes("book") || text.includes("appointment") || text.includes("consult")) {
      reply = "To book a consultation: 1. Go to the 'Find Doctors' tab in your Dashboard. 2. Filter by specialty. 3. Click 'Book Consultation' and select an available time slot. Once confirmed, you can join a secure live video call when the time arrives.";
    } else if (text.includes("prescription") || text.includes("rx") || text.includes("medicine")) {
      reply = "After a successful video consultation, your doctor will issue a secure digital prescription. You can view, review dosage guidelines, and download it instantly in your Patient Dashboard under 'Prescription History'.";
    } else if (text.includes("license") || text.includes("verify") || text.includes("verification")) {
      reply = "Every medical practitioner on Letters Clinic is verified. Doctors upload their official medical license and qualifications, which must be manually approved by our platform administrator before they can take consultations.";
    } else if (text.includes("cost") || text.includes("fee") || text.includes("price") || text.includes("rupee") || text.includes("₹")) {
      reply = "Consultation fees are set by each doctor individually. Typically, consultations range from ₹400 to ₹1000. You can view fees directly in the Doctor Marketplace before booking.";
    } else if (text.includes("thank") || text.includes("thanks") || text.includes("great")) {
      reply = "You're welcome! I'm here to support your clinical journey. Let me know if you have any other questions.";
    } else {
      reply = "I see. As an AI assistant, I recommend booking a consultation with one of our verified clinical specialists for accurate diagnoses. Would you like me to guide you on how to book an appointment?";
    }
    return reply;
  },

  rescheduleAppointment: async (appointmentId, newSlotId) => {
    const res = await API.put(`/appointments/${appointmentId}/reschedule`, { newSlotId });
    return mapId(res.data.data);
  },

  submitVerification: async (license, degree) => {
    const res = await API.post("/doctor/verification/submit", { license, degree });
    return mapId(res.data.data);
  },

  updateReminder: async (id, reminderData) => {
    const res = await API.put(`/patient/reminders/${id}`, reminderData);
    return mapId(res.data.data);
  },

  getDoctorStats: async () => {
    const res = await API.get("/doctor/stats");
    return mapId(res.data.data);
  },

  getPatientStats: async () => {
    const res = await API.get("/patient/stats");
    return mapId(res.data.data);
  }
};
