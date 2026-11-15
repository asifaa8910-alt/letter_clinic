import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import DoctorOverview from "./components/DoctorOverview";
import DoctorSlots from "./components/DoctorSlots";
import DoctorReviews from "./components/DoctorReviews";
import DoctorProfile from "./components/DoctorProfile";
import PrescriptionFormModal from "./components/PrescriptionFormModal";
import VideoConsultationModal from "../../components/VideoConsultationModal";
import Toast from "../../components/Toast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DoctorDashboard() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from path
  let activeTab = "overview";
  if (location.pathname.includes("/slots")) activeTab = "slots";
  else if (location.pathname.includes("/reviews")) activeTab = "reviews";
  else if (location.pathname.includes("/profile")) activeTab = "profile";

  const setActiveTab = (tabName) => {
    if (tabName === "overview") navigate("/doctor");
    else navigate(`/doctor/${tabName}`);
  };

  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  // Doctor Profile Form state
  const [profileDoc, setProfileDoc] = useState(null);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileSpecialty, setProfileSpecialty] = useState("General Medicine");
  const [profileExperience, setProfileExperience] = useState("");
  const [profileFee, setProfileFee] = useState("");
  const [profileHospital, setProfileHospital] = useState("");
  const [profileBio, setProfileBio] = useState("");

  // Slots Form State
  const [slotDate, setSlotDate] = useState("2026-07-09");
  const [slotTime, setSlotTime] = useState("09:00 AM");

  // Prescription Generator Form State
  const [prescriptionForm, setPrescriptionForm] = useState(null);
  const [rxSymptoms, setRxSymptoms] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "", instructions: "" }]);
  const [rxNotes, setRxNotes] = useState("");

  // Active Video Consultation state
  const [activeConsultation, setActiveConsultation] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
  };

  const refreshData = useCallback(async () => {
    if (user) {
      try {
        const [slotsData, appsData, revsData, docProfile] = await Promise.all([
          apiService.getSlots(user.id),
          apiService.getAppointments("doctor", user.id),
          apiService.getReviews(user.id),
          apiService.getDoctorById(user.id)
        ]);

        setSlots(slotsData || []);
        setAppointments(appsData || []);
        setReviews(revsData || []);

        if (docProfile) {
          setProfileDoc(docProfile);
          setProfileName(docProfile.name || user.name);
          setProfileSpecialty(docProfile.specialty || "General Medicine");
          setProfileExperience(docProfile.experience?.toString() || "0");
          setProfileFee(docProfile.fee?.toString() || "400");
          setProfileHospital(docProfile.hospital || "City Hospital");
          setProfileBio(docProfile.bio || "");
          setProfileEmail(user.email);
        }
      } catch (err) {
        console.error("Doctor refresh error:", err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateDoctorProfile(user.id, {
        name: profileName,
        email: profileEmail,
        password: profilePassword || undefined,
        specialty: profileSpecialty,
        experience: Number(profileExperience),
        fee: Number(profileFee),
        hospital: profileHospital,
        bio: profileBio
      });

      updateUser({ ...user, name: profileName, email: profileEmail });
      showToast("Doctor profile updated successfully.");
      setProfilePassword("");
      await refreshData();
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!slotDate || !slotTime) {
      showToast("Date and time are required", "error");
      return;
    }
    try {
      await apiService.addSlot(user.id, slotDate, slotTime);
      showToast("Availability slot added successfully");
      await refreshData();
    } catch (err) {
      showToast(err.message || "Failed to add slot", "error");
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await apiService.deleteSlot(id);
      showToast("Slot removed");
      await refreshData();
    } catch (err) {
      showToast(err.message || "Failed to delete slot", "error");
    }
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "", instructions: "" }]);
  };

  const handleMedicineChange = (index, field, value) => {
    const newMedicines = [...medicines];
    newMedicines[index][field] = value;
    setMedicines(newMedicines);
  };

  const handleRemoveMedicine = (index) => {
    const newMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(newMedicines);
  };

  const openPrescribeModal = (app) => {
    setPrescriptionForm(app);
    setRxSymptoms("");
    setMedicines([{ name: "", dosage: "", duration: "", instructions: "" }]);
    setRxNotes("");
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    const validMedicines = medicines.filter((m) => m.name.trim() !== "");
    if (validMedicines.length === 0) {
      showToast("Please add at least one medication with a valid name", "error");
      return;
    }

    try {
      await apiService.createPrescription(
        prescriptionForm.patientId,
        user.name,
        rxSymptoms,
        validMedicines,
        rxNotes
      );

      // Auto-complete appointment status
      await apiService.completeAppointment(prescriptionForm.id);
      showToast(`Prescription created and delivered to ${prescriptionForm.patientName}`);
      setPrescriptionForm(null);
      await refreshData();
    } catch (err) {
      showToast(err.message || "Prescription creation failed", "error");
    }
  };

  const handleJoinConsultation = (app) => {
    setActiveConsultation(app);
  };

  const handleEndConsultation = async (appId) => {
    try {
      await apiService.completeAppointment(appId);
      showToast("Consultation completed!");
    } catch (err) {
      console.warn("Complete appointment note:", err.message);
    } finally {
      const appRef = activeConsultation;
      setActiveConsultation(null);
      await refreshData();
      if (appRef) {
        openPrescribeModal(appRef);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading doctor portal..." />;
  }

  return (
    <div className="container py-4">
      {/* Toast Alert */}
      <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg("")} />

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom pb-3 mb-4 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("overview");
            refreshData();
          }}
          className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Consultations Overview
        </button>
        <button
          onClick={() => {
            setActiveTab("slots");
            refreshData();
          }}
          className={`btn ${activeTab === "slots" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Availability Slots
        </button>
        <button
          onClick={() => {
            setActiveTab("reviews");
            refreshData();
          }}
          className={`btn ${activeTab === "reviews" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          Patient Reviews ({reviews.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("profile");
            refreshData();
          }}
          className={`btn ${activeTab === "profile" ? "btn-primary" : "btn-outline-secondary"} rounded-pill px-4 py-2`}
        >
          My Profile & Credentials
        </button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <DoctorOverview
          user={user}
          appointments={appointments}
          openPrescribeModal={openPrescribeModal}
          handleJoinConsultation={handleJoinConsultation}
        />
      )}

      {/* Tab Content 2: Slots management */}
      {activeTab === "slots" && (
        <DoctorSlots
          slots={slots}
          slotDate={slotDate}
          setSlotDate={setSlotDate}
          slotTime={slotTime}
          setSlotTime={setSlotTime}
          handleAddSlot={handleAddSlot}
          handleDeleteSlot={handleDeleteSlot}
        />
      )}

      {/* Tab Content 3: Patient Reviews */}
      {activeTab === "reviews" && <DoctorReviews reviews={reviews} />}

      {/* Tab Content 4: My Profile */}
      {activeTab === "profile" && (
        <DoctorProfile
          user={user}
          profileDoc={profileDoc}
          profileName={profileName}
          setProfileName={setProfileName}
          profileEmail={profileEmail}
          setProfileEmail={setProfileEmail}
          profilePassword={profilePassword}
          setProfilePassword={setProfilePassword}
          profileSpecialty={profileSpecialty}
          setProfileSpecialty={setProfileSpecialty}
          profileExperience={profileExperience}
          setProfileExperience={setProfileExperience}
          profileFee={profileFee}
          setProfileFee={setProfileFee}
          profileHospital={profileHospital}
          setProfileHospital={setProfileHospital}
          profileBio={profileBio}
          setProfileBio={setProfileBio}
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

      {/* Prescription Creator Modal */}
      {prescriptionForm && (
        <PrescriptionFormModal
          prescriptionForm={prescriptionForm}
          setPrescriptionForm={setPrescriptionForm}
          rxSymptoms={rxSymptoms}
          setRxSymptoms={setRxSymptoms}
          medicines={medicines}
          handleCreatePrescription={handleCreatePrescription}
          handleAddMedicine={handleAddMedicine}
          handleMedicineChange={handleMedicineChange}
          handleRemoveMedicine={handleRemoveMedicine}
          rxNotes={rxNotes}
          setRxNotes={setRxNotes}
        />
      )}
    </div>
  );
}
