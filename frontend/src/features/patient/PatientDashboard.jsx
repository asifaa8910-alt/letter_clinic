import React, { useState, useEffect, useCallback } from "react";
import { mockService } from "../../services/mockService";
import PatientOverview from "./components/PatientOverview";
import PatientTriage from "./components/PatientTriage";
import PatientMarketplace from "./components/PatientMarketplace";
import PatientProfile from "./components/PatientProfile";

export default function PatientDashboard({ user, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState("overview"); // overview, triage, marketplace, profile
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  // Patient Profile state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePassword, setProfilePassword] = useState("");

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

  const handleViewReviews = async (doc) => {
    setViewReviewsDoc(doc);
    try {
      const data = await mockService.getReviews(doc.id);
      setDocReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await mockService.updatePatientProfile(user.id, {
        name: profileName,
        email: profileEmail,
        password: profilePassword || undefined
      });
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      showToast("Profile details updated successfully.");
      setProfilePassword("");
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  const refreshData = useCallback(async () => {
    if (user) {
      try {
        const apps = await mockService.getAppointments("patient", user.id);
        const rx = await mockService.getPrescriptions(user.id);
        const docs = await mockService.getDoctors();
        setAppointments(apps);
        setPrescriptions(rx);
        setDoctorsList(docs);
      } catch (err) {
        console.error(err);
      }
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && ["overview", "triage", "marketplace"].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    try {
      const report = await mockService.analyzeSymptoms(age, gender, symptoms, duration, severity);
      setTriageReport(report);
      showToast("Symptoms evaluated successfully by AI");
      setSpecialty(report.suggestedSpecialist);
    } catch (err) {
      alert(err.message);
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

  const filterDocs = async (srch, spec, maxFee) => {
    try {
      const list = await mockService.getDoctors({
        search: srch,
        specialty: spec,
        maxFee: maxFee ? Number(maxFee) : null,
        onlyVerified: true
      });
      setDoctorsList(list);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSlots = async (doc) => {
    setSelectedDoc(doc);
    try {
      const slots = await mockService.getSlots(doc.id);
      setSelectedDoctorSlots(slots);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async (slotId) => {
    try {
      await mockService.bookAppointment(user.id, user.name, selectedDoc.id, selectedDoc.name, slotId);
      showToast(`Appointment booked successfully with ${selectedDoc.name}`);
      setSelectedDoctorSlots(null);
      setSelectedDoc(null);
      await refreshData();
      setActiveTab("overview");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await mockService.cancelAppointment(id);
      showToast("Appointment cancelled successfully");
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinConsultation = (app) => {
    setActiveConsultation(app);
  };

  const handleEndConsultation = async (appId) => {
    try {
      await mockService.completeAppointment(appId);
      showToast("Consultation completed!");
      const docId = activeConsultation.doctorId;
      setActiveConsultation(null);
      setReviewDoctorId(docId);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await mockService.addReview(reviewDoctorId, user.name, reviewRating, reviewComment);
      showToast("Thank you for your feedback!");
      setReviewDoctorId(null);
      setReviewComment("");
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {toastMsg && <div className="toast">✓ {toastMsg}</div>}

      {/* Dashboard Sub-navigation Tabs */}
      <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "16px", marginBottom: "32px", overflowX: "auto" }}>
        <button onClick={() => { setActiveTab("overview"); refreshData(); }} className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Overview</button>
        <button onClick={() => setActiveTab("triage")} className={`btn ${activeTab === "triage" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>AI Symptom Triage</button>
        <button onClick={() => { setActiveTab("marketplace"); refreshData(); }} className={`btn ${activeTab === "marketplace" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Find Doctors</button>
        <button onClick={() => setActiveTab("profile")} className={`btn ${activeTab === "profile" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>My Profile</button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <PatientOverview
          user={user}
          appointments={appointments}
          prescriptions={prescriptions}
          handleJoinConsultation={handleJoinConsultation}
          handleCancelAppointment={handleCancelAppointment}
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
          handleSaveProfile={handleSaveProfile}
        />
      )}

      {/* Simulated Live Video Consultation View */}
      {activeConsultation && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "var(--color-obsidian)", display: "flex", flexDirection: "column", zIndex: 2000 }}>
          <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", color: "white" }}>
            <span>Live Consultation with {activeConsultation.doctorName}</span>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "100px", fontSize: "12px" }}>Room ID: {activeConsultation.videoRoomId}</span>
          </div>

          <div style={{ flex: 1, display: "flex", gap: "20px", padding: "20px", overflow: "hidden" }}>
            <div style={{ flex: 2, background: "#1c1c24", borderRadius: "16px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "white" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--color-surgical-blue)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", fontSize: "24px" }}>
                  {activeConsultation.doctorName.charAt(4)}
                </div>
                <h3>{activeConsultation.doctorName}</h3>
                <p style={{ color: "var(--color-slate)" }}>Connected (Audio/Video active)</p>
              </div>
            </div>

            <div style={{ width: "240px", background: "#2a2a35", borderRadius: "16px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <div style={{ textAlign: "center" }}>
                <p>You ({user?.name})</p>
                <span style={{ fontSize: "11px", color: "green" }}>● Streaming</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "30px", display: "flex", justifyContent: "center", gap: "20px", background: "#111" }}>
            <button onClick={() => handleEndConsultation(activeConsultation.id)} className="btn" style={{ background: "#b91c1c", color: "white", padding: "12px 30px", borderRadius: "100px" }}>
              End Consultation
            </button>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      {reviewDoctorId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,7,9,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ width: "100%", maxWidth: "440px", margin: "20px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Consultation Feedback</h3>
            <p style={{ fontSize: "13px", marginBottom: "20px" }}>How was your experience? Rate and review the doctor.</p>
            <form onSubmit={submitReview}>
              <div className="input-group">
                <label className="label">Rating (1 to 5 Stars)</label>
                <select className="select" value={reviewRating} onChange={(e) => setReviewRating(e.target.value)}>
                  <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                  <option value={3}>⭐⭐⭐ (Satisfactory)</option>
                  <option value={2}>⭐⭐ (Needs Improvement)</option>
                  <option value={1}>⭐ (Poor)</option>
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: "20px" }}>
                <label className="label">Comment / Feedback</label>
                <textarea
                  className="textarea"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Explain details of your consultation..."
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setReviewDoctorId(null)} className="btn btn-text">Skip</button>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
