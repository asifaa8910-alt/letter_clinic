// Native Fetch API Client for Letters Clinic REST API
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "/api"
    : "http://localhost:5050/api");

// Helper to normalize MongoDB _id to id across objects and arrays
export const mapId = (obj) => {
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

// Core HTTP wrapper using native window.fetch
async function fetchClient(endpoint, { method = "GET", body, params, headers = {} } = {}) {
  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = localStorage.getItem("token");
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };

  const config = {
    method,
    headers: defaultHeaders,
    credentials: "include" // Enable CORS cookie handling
  };

  if (body && method !== "GET" && method !== "HEAD") {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.errors = data.errors || [];
      throw err;
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiService = {
  // Authentication & Session
  login: async (email, password) => {
    const res = await fetchClient("/auth/login", {
      method: "POST",
      body: { email, password }
    });
    if (res.success && res.data) {
      localStorage.setItem("token", res.data.token);
      const user = mapId(res.data.user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }
    throw new Error(res.message || "Invalid credentials");
  },

  register: async (name, email, password, role) => {
    const res = await fetchClient("/auth/register", {
      method: "POST",
      body: { name, email, password, role }
    });
    if (res.success && res.data) {
      localStorage.setItem("token", res.data.token);
      const user = mapId(res.data.user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    }
    throw new Error(res.message || "Registration failed");
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("currentUser");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  fetchCurrentUser: async () => {
    const res = await fetchClient("/auth/current-user");
    return mapId(res.data);
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await fetchClient("/auth/password", {
      method: "PUT",
      body: { currentPassword, newPassword }
    });
    return res;
  },

  // AI Symptom Triage
  analyzeSymptoms: async (age, gender, symptomsText, duration, severity) => {
    const res = await fetchClient("/patient/triage", {
      method: "POST",
      body: { age, gender, symptoms: symptomsText, duration, severity }
    });
    return mapId(res.data);
  },

  getSymptomReportsHistory: async () => {
    const res = await fetchClient("/patient/triage");
    return mapId(res.data);
  },

  getSymptomReportDetail: async (id) => {
    const res = await fetchClient(`/patient/triage/${id}`);
    return mapId(res.data);
  },

  deleteSymptomReport: async (id) => {
    await fetchClient(`/patient/triage/${id}`, { method: "DELETE" });
  },

  // Patient Profile & Vitals
  updatePatientProfile: async (id, updatedData) => {
    const res = await fetchClient("/patient/profile", {
      method: "PUT",
      body: updatedData
    });
    const updated = mapId(res.data);
    const curr = apiService.getCurrentUser();
    if (curr) {
      curr.name = updatedData.name;
      curr.email = updatedData.email;
      localStorage.setItem("currentUser", JSON.stringify(curr));
    }
    return updated;
  },

  getPatientStats: async () => {
    const res = await fetchClient("/patient/stats");
    return mapId(res.data);
  },

  // Doctors & Marketplace
  getDoctors: async (filters = {}) => {
    const res = await fetchClient("/marketplace/doctors", { params: filters });
    return mapId(res.data);
  },

  getDoctorById: async (id) => {
    const res = await fetchClient("/marketplace/doctors");
    const doc = res.data.find((d) => {
      const uId = d.userId && typeof d.userId === "object" ? d.userId._id : d.userId;
      return uId === id || d._id === id;
    });
    return mapId(doc);
  },

  updateDoctorProfile: async (id, updatedData) => {
    const res = await fetchClient("/doctor/profile", {
      method: "PUT",
      body: updatedData
    });
    const updated = mapId(res.data);
    const curr = apiService.getCurrentUser();
    if (curr && curr.id === id) {
      curr.name = updatedData.name;
      curr.email = updatedData.email;
      localStorage.setItem("currentUser", JSON.stringify(curr));
    }
    return updated;
  },

  getDoctorStats: async () => {
    const res = await fetchClient("/doctor/stats");
    return mapId(res.data);
  },

  // Slots Management
  getSlots: async (doctorId) => {
    const res = await fetchClient(`/marketplace/doctors/${doctorId}/slots`);
    return mapId(res.data);
  },

  getDoctorOwnSlots: async () => {
    const res = await fetchClient("/doctor/slots");
    return mapId(res.data);
  },

  addSlot: async (doctorId, date, time) => {
    const res = await fetchClient("/doctor/slots", {
      method: "POST",
      body: { date, time }
    });
    return mapId(res.data);
  },

  toggleOwnSlot: async (id) => {
    const res = await fetchClient(`/doctor/slots/${id}/toggle`, { method: "PUT" });
    return mapId(res.data);
  },

  deleteSlot: async (slotId) => {
    await fetchClient(`/doctor/slots/${slotId}`, { method: "DELETE" });
  },

  // Appointments
  bookAppointment: async (patientId, patientName, doctorId, doctorName, slotId) => {
    const res = await fetchClient("/appointments/book", {
      method: "POST",
      body: { doctorId, doctorName, slotId }
    });
    return mapId(res.data);
  },

  getAppointments: async (_role, _userId) => {
    const res = await fetchClient("/appointments");
    return mapId(res.data);
  },

  cancelAppointment: async (appointmentId) => {
    await fetchClient(`/appointments/${appointmentId}/cancel`, { method: "PUT" });
  },

  completeAppointment: async (appointmentId) => {
    await fetchClient(`/appointments/${appointmentId}/complete`, { method: "PUT" });
  },

  rescheduleAppointment: async (appointmentId, newSlotId) => {
    const res = await fetchClient(`/appointments/${appointmentId}/reschedule`, {
      method: "PUT",
      body: { newSlotId }
    });
    return mapId(res.data);
  },

  // Prescriptions
  getPrescriptions: async () => {
    const res = await fetchClient("/patient/prescriptions");
    return mapId(res.data);
  },

  getDoctorPrescriptionsHistory: async () => {
    const res = await fetchClient("/doctor/prescriptions");
    return mapId(res.data);
  },

  getPrescriptionDetails: async (id) => {
    const res = await fetchClient(`/doctor/prescriptions/${id}`);
    return mapId(res.data);
  },

  createPrescription: async (patientId, doctorName, symptoms, medicines, notes) => {
    const res = await fetchClient("/doctor/prescription", {
      method: "POST",
      body: { patientId, symptoms, medicines, notes }
    });
    return mapId(res.data);
  },

  // Reviews
  getReviews: async (doctorId) => {
    const res = await fetchClient(`/marketplace/doctors/${doctorId}/reviews`);
    return mapId(res.data);
  },

  getPatientReviews: async () => {
    const res = await fetchClient("/patient/reviews");
    return mapId(res.data);
  },

  addReview: async (doctorId, patientName, rating, comment) => {
    const res = await fetchClient("/patient/review", {
      method: "POST",
      body: { doctorId, rating, comment }
    });
    return mapId(res.data);
  },

  updatePatientReview: async (id, rating, comment) => {
    const res = await fetchClient(`/patient/reviews/${id}`, {
      method: "PUT",
      body: { rating, comment }
    });
    return mapId(res.data);
  },

  deletePatientReview: async (id) => {
    await fetchClient(`/patient/reviews/${id}`, { method: "DELETE" });
  },

  // Medication Reminders
  getReminders: async () => {
    const res = await fetchClient("/patient/reminders");
    return mapId(res.data);
  },

  createReminder: async (medicineName, dosage, frequency, time) => {
    const res = await fetchClient("/patient/reminders", {
      method: "POST",
      body: { medicineName, dosage, frequency, time }
    });
    return mapId(res.data);
  },

  updateReminder: async (id, reminderData) => {
    const res = await fetchClient(`/patient/reminders/${id}`, {
      method: "PUT",
      body: reminderData
    });
    return mapId(res.data);
  },

  toggleReminder: async (id) => {
    const res = await fetchClient(`/patient/reminders/${id}/toggle`, { method: "PUT" });
    return mapId(res.data);
  },

  deleteReminder: async (id) => {
    await fetchClient(`/patient/reminders/${id}`, { method: "DELETE" });
  },

  // Doctor Verification
  getVerificationStatusDetails: async () => {
    const res = await fetchClient("/doctor/verification");
    return mapId(res.data);
  },

  submitVerification: async (license, degree) => {
    const res = await fetchClient("/doctor/verification/submit", {
      method: "POST",
      body: { license, degree }
    });
    return mapId(res.data);
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetchClient("/notifications");
    return mapId(res.data);
  },

  markNotificationAsRead: async (id) => {
    await fetchClient(`/notifications/${id}/read`, { method: "PUT" });
  },

  markAllNotificationsAsRead: async () => {
    await fetchClient("/notifications/read-all", { method: "PUT" });
  },

  clearNotifications: async () => {
    await fetchClient("/notifications/clear-all", { method: "DELETE" });
  },

  // Admin APIs
  getAdminStats: async () => {
    const res = await fetchClient("/admin/stats");
    return mapId(res.data);
  },

  getVerifications: async () => {
    const res = await fetchClient("/admin/verifications");
    return mapId(res.data);
  },

  updateVerificationStatus: async (id, status) => {
    const res = await fetchClient(`/admin/verifications/${id}`, {
      method: "PUT",
      body: { status }
    });
    return mapId(res.data);
  },

  getPatients: async () => {
    const res = await fetchClient("/admin/patients");
    return mapId(res.data);
  },

  addPatientByAdmin: async (patientData) => {
    const res = await fetchClient("/admin/patients", {
      method: "POST",
      body: patientData
    });
    return mapId(res.data);
  },

  updatePatientByAdmin: async (id, patientData) => {
    const res = await fetchClient(`/admin/patients/${id}`, {
      method: "PUT",
      body: patientData
    });
    return mapId(res.data);
  },

  deletePatientByAdmin: async (id) => {
    await fetchClient(`/admin/patients/${id}`, { method: "DELETE" });
  },

  addDoctorByAdmin: async (doctorData) => {
    const res = await fetchClient("/admin/doctors", {
      method: "POST",
      body: doctorData
    });
    return mapId(res.data);
  },

  updateDoctorByAdmin: async (id, doctorData) => {
    const res = await fetchClient(`/admin/doctors/${id}`, {
      method: "PUT",
      body: doctorData
    });
    return mapId(res.data);
  },

  deleteDoctorByAdmin: async (id) => {
    await fetchClient(`/admin/doctors/${id}`, { method: "DELETE" });
  },

  adminGetAllAppointments: async () => {
    const res = await fetchClient("/admin/appointments");
    return mapId(res.data);
  },

  adminUpdateAppointmentStatus: async (id, status) => {
    const res = await fetchClient(`/admin/appointments/${id}`, {
      method: "PUT",
      body: { status }
    });
    return mapId(res.data);
  },

  adminDeleteAppointment: async (id) => {
    await fetchClient(`/admin/appointments/${id}`, { method: "DELETE" });
  },

  adminGetAllReviews: async () => {
    const res = await fetchClient("/admin/reviews");
    return mapId(res.data);
  },

  adminDeleteReview: async (id) => {
    await fetchClient(`/admin/reviews/${id}`, { method: "DELETE" });
  },

  getActivityLogs: async () => {
    const res = await fetchClient("/admin/logs");
    return mapId(res.data);
  },

  clearActivityLogs: async () => {
    await fetchClient("/admin/logs", { method: "DELETE" });
  },

  // AI Chatbot Local Heuristics
  getChatbotResponse: (msg) => {
    const text = msg.toLowerCase();
    if (text.includes("hello" ) || text.includes("hi") || text.includes("hey")) {
      return "Hello! I am Letters AI Medical Assistant. How can I help you today? You can ask about symptoms, booking appointments, or how the platform operates.";
    }
    if (text.includes("symptom") || text.includes("triage") || text.includes("sick") || text.includes("feel")) {
      return "If you are feeling unwell, go to the 'AI Symptom Triage' tab in your Patient Dashboard. Enter your age, gender, symptoms, and severity. Our engine will suggest possible conditions and direct you to the right specialist!";
    }
    if (text.includes("book") || text.includes("appointment") || text.includes("consult")) {
      return "To book a consultation: 1. Go to the 'Find Doctors' tab in your Dashboard. 2. Filter by specialty. 3. Click 'Book Consultation' and select an available time slot. Once confirmed, you can join a secure live video call when the time arrives.";
    }
    if (text.includes("prescription") || text.includes("rx") || text.includes("medicine")) {
      return "After a consultation, your doctor will issue a secure digital prescription. You can view, review dosage guidelines, and download/print it instantly in your Patient Dashboard.";
    }
    if (text.includes("license") || text.includes("verify") || text.includes("verification")) {
      return "Every medical practitioner on Letters Clinic is verified. Doctors submit their medical license and qualifications, which must be approved by our administrator before they can take consultations.";
    }
    if (text.includes("cost") || text.includes("fee") || text.includes("price") || text.includes("₹")) {
      return "Consultation fees are set by each doctor individually, typically ranging from ₹400 to ₹1000. You can view fees directly in the Doctor Marketplace before booking.";
    }
    return "As an AI assistant, I recommend booking a consultation with one of our verified clinical specialists for accurate diagnoses. Would you like me to guide you on how to book an appointment?";
  }
};

