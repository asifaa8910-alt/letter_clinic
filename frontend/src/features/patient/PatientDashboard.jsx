import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import PatientOverview from "./components/PatientOverview";
import PatientTriage from "./components/PatientTriage";
import PatientMarketplace from "./components/PatientMarketplace";
import PatientProfile from "./components/PatientProfile";
import VideoConsultationModal from "../../components/VideoConsultationModal";
import PrescriptionViewModal from "../../components/PrescriptionViewModal";
import Toast from "../../components/Toast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PatientDashboard() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  let activeTab = "overview";
  if (location.pathname.includes("/triage")) activeTab = "triage";
  else if (location.pathname.includes("/marketplace")) activeTab = "marketplace";
  else if (location.pathname.includes("/profile")) activeTab = "profile";

  const setActiveTab = (tabName) => {
    if (tabName === "overview") navigate("/patient");
    else navigate(`/patient/${tabName}`);
  };

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePassword, setProfilePassword] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileBloodGroup, setProfileBloodGroup] = useState("O+");
  const [profileMedicalHistory, setProfileMedicalHistory] = useState("");

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileEmail(user.email || "");
    }
  }, [user]);

  // Symptom Triage State
  const [age, setAge] = useState("28");
  const [gender, setGender] = useState("Male");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("2 days");
  const [severity, setSeverity] = useState("Medium");
  const [triageReport, setTriageReport] = useState(null);

  // Marketplace State
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [feeFilter, setFeeFilter] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctorSlots, setSelectedDoctorSlots] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Consultation state
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [reviewDoctorId, setReviewDoctorId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // View Doctor Reviews Modal State
  const [viewReviewsDoc, setViewReviewsDoc] = useState(null);
  const [docReviews, setDocReviews] = useState([]);

  // Prescription View Modal State
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
  };

  const refreshData = useCallback(async () => {
    if (user) {
      try {
        const [apps, rx, docs, rems] = await Promise.all([
          apiService.getAppointments("patient", user.id),
          apiService.getPrescriptions(),
          apiService.getDoctors(),
          apiService.getReminders()
        ]);
        setAppointments(apps || []);
        setPrescriptions(rx || []);
        setDoctorsList(docs || []);
        setReminders(rems || []);
      } catch (err) {
        console.error("Failed to load patient data:", err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle saving patient profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await apiService.updatePatientProfile(user.id, {
        name: profileName,
        email: profileEmail,
        password: profilePassword || undefined,
        phone: profilePhone,
        bloodGroup: profileBloodGroup,
        medicalHistory: profileMedicalHistory
      });
      updateUser(updatedUser);
      showToast("Profile details updated successfully.");
      setProfilePassword("");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    }
  };

  // AI Triage Submission
  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      showToast("Please describe your symptoms", "error");
      return;
    }
    try {
      const report = await apiService.analyzeSymptoms(age, gender, symptoms, duration, severity);
      setTriageReport(report);
      showToast("Symptoms evaluated successfully by AI");
      setSpecialty(report.suggestedSpecialist);
    } catch (err) {
      showToast(err.message || "Triage evaluation failed", "error");
    }
  };

  // Marketplace Doctor Filter
  const filterDocs = async (srch, spec, maxFee) => {
    try {
      const list = await apiService.getDoctors({
        search: srch,
        specialty: spec,
        maxFee: maxFee ? Number(maxFee) : null,
        onlyVerified: true
      });
      setDoctorsList(list || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    filterDocs(e.target.value, specialty, feeFilter);
  };

  const handleSpecialtyChange = (e) => {
    setSpecialty(e.target.value);
    filterDocs(search, e.target.value, feeFilter);
  };

  const handleFeeChange = (e) => {
    setFeeFilter(e.target.value);
    filterDocs(search, specialty, e.target.value);
  };

  const loadSlots = async (doc) => {
    setSelectedDoc(doc);
    try {
      const slots = await apiService.getSlots(doc.id);
      setSelectedDoctorSlots(slots);
    } catch (err) {
      showToast(err.message || "Unable to load slots", "error");
    }
  };

  const handleBook = async (slotId) => {
    try {
      await apiService.bookAppointment(user.id, user.name, selectedDoc.id, selectedDoc.name, slotId);
      showToast(`Appointment booked successfully with ${selectedDoc.name}`);
      setSelectedDoctorSlots(null);
      setSelectedDoc(null);
      await refreshData();
      setActiveTab("overview");
    } catch (err) {
      showToast(err.message || "Booking failed", "error");
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await apiService.cancelAppointment(id);
      showToast("Appointment cancelled successfully");
      await refreshData();
    } catch (err) {
      showToast(err.message || "Cancel failed", "error");
    }
  };

  // Join Live Consultation
  const handleJoinConsultation = (app) => {
    setActiveConsultation(app);
  };

  // End Live Consultation
  const handleEndConsultation = async (appId) => {
    try {
      await apiService.completeAppointment(appId);
      showToast("Consultation completed!");
    } catch (err) {
      console.warn("Complete appointment note:", err.message);
    } finally {
      const docId = activeConsultation?.doctorId;
      setActiveConsultation(null);
      setReviewDoctorId(docId);
      await refreshData();
    }
  };

  // Submit Feedback / Review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast("Please provide feedback comments", "error");
      return;
    }
    try {
      await apiService.addReview(reviewDoctorId, user.name, Number(reviewRating), reviewComment);
      showToast("Thank you for your feedback! Review published.");
      setReviewDoctorId(null);
      setReviewComment("");
      await refreshData();
    } catch (err) {
      showToast(err.message || "Review submission failed", "error");
    }
  };

  const handleViewReviews = async (doc) => {
    setViewReviewsDoc(doc);
    try {
      const data = await apiService.getReviews(doc.id);
      setDocReviews(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleReminder = async (remId) => {
    try {
      await apiService.toggleReminder(remId);
      const updatedRems = await apiService.getReminders();
      setReminders(updatedRems || []);
      showToast("Medication reminder updated");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading patient portal..." />;
  }

  return (
    <div className="container py-4">
      {/* Toast Alert */}
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg("")} />

      {/* Dashboard Sub-navigation Tabs */}
      <div className="d-flex gap-2 border-bottom pb-3 mb-4 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("overview");
            refreshData();
          }}
          className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("triage")}
          className={`btn ${activeTab === "triage" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          AI Symptom Triage
        </button>
        <button
          onClick={() => {
            setActiveTab("marketplace");
            refreshData();
          }}
          className={`btn ${activeTab === "marketplace" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Find Doctors
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`btn ${activeTab === "profile" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          My Profile & Vitals
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <PatientOverview
          user={user}
          appointments={appointments}
          prescriptions={prescriptions}
          reminders={reminders}
          handleJoinConsultation={handleJoinConsultation}
          handleCancelAppointment={handleCancelAppointment}
          handleViewPrescription={(rx) => setSelectedPrescription(rx)}
          handleToggleReminder={handleToggleReminder}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Tab Content 2: AI Triage Tool */}
      {activeTab === "triage" && (
        <PatientTriage
          age={age}
          setAge={setAge}
          gender={gender}
          setGender={setGender}
          symptoms={symptoms}
          setSymptoms={setSymptoms}
          duration={duration}
          setDuration={setDuration}
          severity={severity}
          setSeverity={setSeverity}
          triageReport={triageReport}
          handleTriageSubmit={handleTriageSubmit}
          setActiveTab={setActiveTab}
          filterDocs={filterDocs}
        />
      )}

      {/* Tab Content 3: Doctor Marketplace */}
      {activeTab === "marketplace" && (
        <PatientMarketplace
          search={search}
          handleSearchChange={handleSearchChange}
          specialty={specialty}
          handleSpecialtyChange={handleSpecialtyChange}
          feeFilter={feeFilter}
          handleFeeChange={handleFeeChange}
          doctorsList={doctorsList}
          handleViewReviews={handleViewReviews}
          loadSlots={loadSlots}
          selectedDoctorSlots={selectedDoctorSlots}
          setSelectedDoctorSlots={setSelectedDoctorSlots}
          selectedDoc={selectedDoc}
          handleBook={handleBook}
          viewReviewsDoc={viewReviewsDoc}
          setViewReviewsDoc={setViewReviewsDoc}
          docReviews={docReviews}
        />
      )}

      {/* Tab Content 4: My Profile */}
      {activeTab === "profile" && (
        <PatientProfile
          user={user}
          profileName={profileName}
          setProfileName={setProfileName}
          profileEmail={profileEmail}
          setProfileEmail={setProfileEmail}
          profilePassword={profilePassword}
          setProfilePassword={setProfilePassword}
          profilePhone={profilePhone}
          setProfilePhone={setProfilePhone}
          profileBloodGroup={profileBloodGroup}
          setProfileBloodGroup={setProfileBloodGroup}
          profileMedicalHistory={profileMedicalHistory}
          setProfileMedicalHistory={setProfileMedicalHistory}
          handleSaveProfile={handleSaveProfile}
        />
      )}

      {/* Interactive WebRTC Video Consultation Room */}
      {activeConsultation && (
        <VideoConsultationModal
          appointment={activeConsultation}
          currentUser={user}
          onEndCall={handleEndConsultation}
        />
      )}

      {/* Printable E-Prescription Letterhead Modal */}
      {selectedPrescription && (
        <PrescriptionViewModal
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}

      {/* Post-Consultation Doctor Review Dialog */}
      {reviewDoctorId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(7,7,9,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px"
          }}
        >
          <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "460px", width: "100%" }}>
            <h4 className="fw-bold mb-1">Consultation Feedback</h4>
            <p className="small text-secondary mb-3">How was your telemedicine experience with the doctor?</p>
            <form onSubmit={submitReview}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Rating (1 to 5 Stars)</label>
                <select
                  className="form-select"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                  <option value={3}>⭐⭐⭐ 3 Stars (Satisfactory)</option>
                  <option value={2}>⭐⭐ 2 Stars (Needs Improvement)</option>
                  <option value={1}>⭐ 1 Star (Poor)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Feedback Comments</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details regarding your diagnosis, clarity, and doctor communication..."
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewDoctorId(null)}
                  className="btn btn-outline-secondary rounded-pill px-3"
                >
                  Skip
                </button>
                <button type="submit" className="btn btn-primary rounded-pill px-4">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
