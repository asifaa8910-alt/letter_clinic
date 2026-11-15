import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService";
import { RefreshCw } from "lucide-react";
import AdminOverview from "./components/AdminOverview";
import AdminDoctors from "./components/AdminDoctors";
import AdminPatients from "./components/AdminPatients";
import AdminLogs from "./components/AdminLogs";
import Toast from "../../components/Toast";
import LoadingSpinner from "../../components/LoadingSpinner";

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
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

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

  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
  };

  const refreshData = async () => {
    try {
      const [statsData, verificationsData, doctorsData, patientsData, logsData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getVerifications(),
        apiService.getDoctors(),
        apiService.getPatients(),
        apiService.getActivityLogs()
      ]);
      setStats(statsData);
      setVerifications(verificationsData || []);
      setDoctors(doctorsData || []);
      setPatients(patientsData || []);
      setLogs(logsData || []);
    } catch (err) {
      showToast(err.message || "Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiService.updateVerificationStatus(id, status);
      showToast(`Practitioner verification status updated to: ${status}`);
      await refreshData();
    } catch (err) {
      showToast(err.message || "Status update failed", "error");
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
    setDocPassword("");
    setDocSpecialty(doc.specialty);
    setDocExperience(doc.experience?.toString() || "0");
    setDocFee(doc.fee?.toString() || "400");
    setDocHospital(doc.hospital || "");
    setDocBio(doc.bio || "");
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
        await apiService.updateDoctorByAdmin(editingDocId, docData);
        showToast(`Doctor Dr. ${docName} updated successfully.`);
      } else {
        await apiService.addDoctorByAdmin(docData);
        showToast(`Doctor Dr. ${docName} registered successfully.`);
      }
      setShowDocModal(false);
      await refreshData();
    } catch (err) {
      showToast(err.message || "Operation failed", "error");
    }
  };

  const handleDeleteDoc = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete Doctor ${name}? This will remove all their availability slots and appointments.`
      )
    ) {
      try {
        await apiService.deleteDoctorByAdmin(id);
        showToast(`Doctor ${name} deleted.`);
        await refreshData();
      } catch (err) {
        showToast(err.message, "error");
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
        await apiService.updatePatientByAdmin(editingPatId, patData);
        showToast(`Patient ${patName} updated successfully.`);
      } else {
        await apiService.addPatientByAdmin(patData);
        showToast(`Patient ${patName} registered successfully.`);
      }
      setShowPatModal(false);
      await refreshData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeletePat = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete Patient ${name}?`)) {
      try {
        await apiService.deletePatientByAdmin(id);
        showToast(`Patient ${name} deleted.`);
        await refreshData();
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to clear all activity log history?")) {
      await apiService.clearActivityLogs();
      showToast("Activity log history cleared.");
      await refreshData();
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.hospital?.toLowerCase().includes(docSearch.toLowerCase())
  );

  const filteredPatients = patients.filter(
    (pat) =>
      pat.name.toLowerCase().includes(patSearch.toLowerCase()) ||
      pat.email.toLowerCase().includes(patSearch.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Loading administrative portal..." />;
  }

  return (
    <div className="container py-4" style={{ minHeight: "80vh" }}>
      {/* Toast Banner */}
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg("")} />

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: "28px" }}>Platform Administrator Console</h2>
          <p className="text-secondary small mb-0">System metrics, doctor verification board, and security activity audit logs</p>
        </div>
        <button
          onClick={refreshData}
          className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-2 px-3 py-2"
        >
          <RefreshCw size={15} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom pb-3 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab("doctors")}
          className={`btn ${activeTab === "doctors" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Manage Doctors ({doctors.length})
        </button>
        <button
          onClick={() => setActiveTab("patients")}
          className={`btn ${activeTab === "patients" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Manage Patients ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`btn ${activeTab === "logs" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Activity Logs ({logs.length})
        </button>
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
        <AdminLogs logs={logs} handleClearLogs={handleClearLogs} />
      )}
    </div>
  );
}
