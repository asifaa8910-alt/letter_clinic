import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mockService } from "../../services/mockService";
import DoctorOverview from "./components/DoctorOverview";
import DoctorSlots from "./components/DoctorSlots";
import DoctorReviews from "./components/DoctorReviews";
import DoctorProfile from "./components/DoctorProfile";
import PrescriptionFormModal from "./components/PrescriptionFormModal";

export default function DoctorDashboard({ user, onProfileUpdate }) {
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
  const [toastMsg, setToastMsg] = useState("");

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
  const [prescriptionForm, setPrescriptionForm] = useState(null); // appointment details or null
  const [rxSymptoms, setRxSymptoms] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "", instructions: "" }]);
  const [rxNotes, setRxNotes] = useState("");

  const refreshData = useCallback(async () => {
    if (user) {
      try {
        const slotsData = await mockService.getSlots(user.id);
        const appsData = await mockService.getAppointments("doctor", user.id);
        const revsData = await mockService.getReviews(user.id);
        setSlots(slotsData);
        setAppointments(appsData);
        setReviews(revsData);

        const docProfile = await mockService.getDoctorById(user.id);
        if (docProfile) {
          setProfileDoc(docProfile);
          setProfileName(docProfile.name || user.name);
          setProfileSpecialty(docProfile.specialty);
          setProfileExperience(docProfile.experience.toString());
          setProfileFee(docProfile.fee.toString());
          setProfileHospital(docProfile.hospital);
          setProfileBio(docProfile.bio);
          setProfileEmail(user.email);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await mockService.updateDoctorProfile(user.id, {
        name: profileName,
        email: profileEmail,
        password: profilePassword || undefined,
        specialty: profileSpecialty,
        experience: Number(profileExperience),
        fee: Number(profileFee),
        hospital: profileHospital,
        bio: profileBio
      });
      
      const currentUser = mockService.getCurrentUser();
      if (currentUser) {
        currentUser.name = profileName;
        currentUser.email = profileEmail;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }
      
      showToast("Profile details updated successfully.");
      setProfilePassword("");
      if (onProfileUpdate) onProfileUpdate();
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await mockService.addSlot(user.id, slotDate, slotTime);
      showToast("Availability slot added successfully");
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      await mockService.deleteSlot(id);
      showToast("Slot deleted");
      await refreshData();
    } catch (err) {
      console.error(err);
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
    try {
      await mockService.createPrescription(
        prescriptionForm.patientId,
        user.name,
        rxSymptoms,
        medicines.filter(m => m.name.trim() !== ""),
        rxNotes
      );
      
      // Auto-complete appointment status
      await mockService.completeAppointment(prescriptionForm.id);
      showToast(`Prescription created and sent to ${prescriptionForm.patientName}`);
      setPrescriptionForm(null);
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {toastMsg && <div className="toast">✓ {toastMsg}</div>}

      <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "16px", marginBottom: "32px", overflowX: "auto" }}>
        <button onClick={() => { setActiveTab("overview"); refreshData(); }} className={`btn ${activeTab === "overview" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Dashboard Overview</button>
        <button onClick={() => { setActiveTab("slots"); refreshData(); }} className={`btn ${activeTab === "slots" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Availability Slots</button>
        <button onClick={() => { setActiveTab("reviews"); refreshData(); }} className={`btn ${activeTab === "reviews" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>Patient Reviews ({reviews.length})</button>
        <button onClick={() => { setActiveTab("profile"); refreshData(); }} className={`btn ${activeTab === "profile" ? "btn-primary" : "btn-text"}`} style={{ padding: "8px 20px" }}>My Profile</button>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === "overview" && (
        <DoctorOverview
          user={user}
          appointments={appointments}
          openPrescribeModal={openPrescribeModal}
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
      {activeTab === "reviews" && (
        <DoctorReviews reviews={reviews} />
      )}

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
