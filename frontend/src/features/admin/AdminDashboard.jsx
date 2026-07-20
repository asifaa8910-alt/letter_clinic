import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mockService } from "../../services/mockService";
import { RefreshCw } from "lucide-react";
import AdminOverview from "./components/AdminOverview";
import AdminDoctors from "./components/AdminDoctors";
import AdminPatients from "./components/AdminPatients";
import AdminLogs from "./components/AdminLogs";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  let activeTab = "overview";
  if (location.pathname.includes("/doctors")) activeTab = "doctors";
  else if (location.pathname.includes("/patients")) activeTab = "patients";
  else if (location.pathname.includes("/logs")) activeTab = "logs";

  const setActiveTab = (tabName) => {
    if (tabName === "overview") navigate("/admin");
    else navigate(`/admin/${tabName}`);
  };
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [logs, setLogs] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  
  // Search Filters
  const [docSearch, setDocSearch] = useState("");
  const [patSearch, setPatSearch] = useState("");
  
  // Modal States
  const [showDocModal, setShowDocModal] = useState(false);
  const [showPatModal, setShowPatModal] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [editingPatId, setEditingPatId] = useState(null);

  // Form States - Doctor
  const [docName, setDocName] = useState("");
  const [docEmail, setDocEmail] = useState("");
  const [docPassword, setDocPassword] = useState("");
  const [docSpecialty, setDocSpecialty] = useState("General Medicine");
  const [docExperience, setDocExperience] = useState("");
  const [docFee, setDocFee] = useState("");
  const [docHospital, setDocHospital] = useState("");
  const [docBio, setDocBio] = useState("");
  const [docVerified, setDocVerified] = useState(false);
  const [docLicense, setDocLicense] = useState("");
  const [docDegree, setDocDegree] = useState("");

  // Form States - Patient
  const [patName, setPatName] = useState("");
  const [patEmail, setPatEmail] = useState("");
  const [patPassword, setPatPassword] = useState("");

  const refreshData = async () => {
    try {
      const statsData = await mockService.getAdminStats();
      const verificationsData = await mockService.getVerifications();
      const doctorsData = await mockService.getDoctors();
      const patientsData = await mockService.getPatients();
      const logsData = await mockService.getActivityLogs();
      setStats(statsData);
      setVerifications(verificationsData);
      setDoctors(doctorsData);
      setPatients(patientsData);
      setLogs(logsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await mockService.updateVerificationStatus(id, status);
      showToast(`Verification status updated to: ${status}`);
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Doctor CRUD handlers
  const handleOpenAddDoc = () => {
    setEditingDocId(null);
    setDocName("");
    setDocEmail("");
    setDocPassword("");
    setDocSpecialty("General Medicine");
    setDocExperience("5");
    setDocFee("500");
    setDocHospital("");
    setDocBio("");
    setDocVerified(true);
    setDocLicense("MCI-ADMIN-CREATED");
    setDocDegree("MBBS");
    setShowDocModal(true);
  };

  const handleOpenEditDoc = (doc) => {
    setEditingDocId(doc.id);
    setDocName(doc.name);
    setDocEmail(doc.email || "");
    setDocPassword(""); // keep empty unless updating
    setDocSpecialty(doc.specialty);
    setDocExperience(doc.experience.toString());
    setDocFee(doc.fee.toString());
    setDocHospital(doc.hospital);
    setDocBio(doc.bio);
    setDocVerified(doc.verified);
    setDocLicense("");
    setDocDegree("");
    setShowDocModal(true);
  };

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    try {
      const docData = {
        name: docName,
        email: docEmail,
        password: docPassword || undefined,
        specialty: docSpecialty,
        experience: Number(docExperience),
        fee: Number(docFee),
        hospital: docHospital,
        bio: docBio,
        verified: docVerified,
        license: docLicense,
        degree: docDegree
      };

      if (editingDocId) {
        await mockService.updateDoctorByAdmin(editingDocId, docData);
        showToast(`Doctor Dr. ${docName} updated successfully.`);
      } else {
        await mockService.addDoctorByAdmin(docData);
        showToast(`Doctor Dr. ${docName} registered successfully.`);
      }
      setShowDocModal(false);
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDoc = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete Doctor ${name}? This will remove all their availability slots and scheduled appointments.`)) {
      try {
        await mockService.deleteDoctorByAdmin(id);
        showToast(`Doctor ${name} deleted.`);
        await refreshData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Patient CRUD handlers
  const handleOpenAddPat = () => {
    setEditingPatId(null);
    setPatName("");
    setPatEmail("");
    setPatPassword("");
    setShowPatModal(true);
  };

  const handleOpenEditPat = (pat) => {
    setEditingPatId(pat.id);
    setPatName(pat.name);
    setPatEmail(pat.email);
    setPatPassword("");
    setShowPatModal(true);
  };

  const handlePatSubmit = async (e) => {
    e.preventDefault();
    try {
      const patData = {
        name: patName,
        email: patEmail,
        password: patPassword || undefined
      };

      if (editingPatId) {
        await mockService.updatePatientByAdmin(editingPatId, patData);
        showToast(`Patient ${patName} updated successfully.`);
      } else {
        await mockService.addPatientByAdmin(patData);
        showToast(`Patient ${patName} registered successfully.`);
      }
      setShowPatModal(false);
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePat = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete Patient ${name}? This will remove all their scheduled appointments.`)) {
      try {
        await mockService.deletePatientByAdmin(id);
        showToast(`Patient ${name} deleted.`);
        await refreshData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to clear all activity log history?")) {
      await mockService.clearActivityLogs();
      showToast("Activity log history cleared.");
      await refreshData();
    }
  };

  // Filters
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(docSearch.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(docSearch.toLowerCase())
  );

  const filteredPatients = patients.filter(pat => 
    pat.name.toLowerCase().includes(patSearch.toLowerCase()) ||
    pat.email.toLowerCase().includes(patSearch.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: "40px 24px", minHeight: "80vh" }}>
      {toastMsg && <div className="toast">✓ {toastMsg}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2 style={{ fontSize: "28px" }}>Platform Admin Dashboard</h2>
          <p style={{ fontSize: "14px" }}>System monitoring, practitioners verification, and client logs database</p>
        </div>
        <button onClick={refreshData} className="btn btn-ghost" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <RefreshCw size={16} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Admin Dashboard Sub-navigation Tabs */}
      <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "16px", marginBottom: "32px", overflowX: "auto" }}>
        <button onClick={() => setActiveTab("overview")} className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>System Overview</button>
        <button onClick={() => setActiveTab("doctors")} className={`btn ${activeTab === "doctors" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Manage Doctors ({doctors.length})</button>
        <button onClick={() => setActiveTab("patients")} className={`btn ${activeTab === "patients" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Manage Patients ({patients.length})</button>
        <button onClick={() => setActiveTab("logs")} className={`btn ${activeTab === "logs" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Activity Logs ({logs.length})</button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <AdminOverview
          stats={stats}
          verifications={verifications}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Tab Content 2: Manage Doctors */}
      {activeTab === "doctors" && (
        <AdminDoctors
          docSearch={docSearch}
          setDocSearch={setDocSearch}
          filteredDoctors={filteredDoctors}
          handleOpenAddDoc={handleOpenAddDoc}
          handleOpenEditDoc={handleOpenEditDoc}
          handleDeleteDoc={handleDeleteDoc}
          showDocModal={showDocModal}
          setShowDocModal={setShowDocModal}
          editingDocId={editingDocId}
          docName={docName}
          setDocName={setDocName}
          docEmail={docEmail}
          setDocEmail={setDocEmail}
          docPassword={docPassword}
          setDocPassword={setDocPassword}
          docSpecialty={docSpecialty}
          setDocSpecialty={setDocSpecialty}
          docExperience={docExperience}
          setDocExperience={setDocExperience}
          docFee={docFee}
          setDocFee={setDocFee}
          docHospital={docHospital}
          setDocHospital={setDocHospital}
          docBio={docBio}
          setDocBio={setDocBio}
          docVerified={docVerified}
          setDocVerified={setDocVerified}
          docLicense={docLicense}
          setDocLicense={setDocLicense}
          docDegree={docDegree}
          setDocDegree={setDocDegree}
          handleDocSubmit={handleDocSubmit}
        />
      )}

      {/* Tab Content 3: Manage Patients */}
      {activeTab === "patients" && (
        <AdminPatients
          patSearch={patSearch}
          setPatSearch={setPatSearch}
          filteredPatients={filteredPatients}
          handleOpenAddPat={handleOpenAddPat}
          handleOpenEditPat={handleOpenEditPat}
          handleDeletePat={handleDeletePat}
          showPatModal={showPatModal}
          setShowPatModal={setShowPatModal}
          editingPatId={editingPatId}
          patName={patName}
          setPatName={setPatName}
          patEmail={patEmail}
          setPatEmail={setPatEmail}
          patPassword={patPassword}
          setPatPassword={setPatPassword}
          handlePatSubmit={handlePatSubmit}
        />
      )}

      {/* Tab Content 4: System Activity Logs */}
      {activeTab === "logs" && (
        <AdminLogs
          logs={logs}
          handleClearLogs={handleClearLogs}
        />
      )}
    </div>
  );
}
