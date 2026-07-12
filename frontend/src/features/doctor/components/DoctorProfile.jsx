import React from "react";
import { User } from "lucide-react";

export default function DoctorProfile({
  user,
  profileDoc,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profilePassword,
  setProfilePassword,
  profileSpecialty,
  setProfileSpecialty,
  profileExperience,
  setProfileExperience,
  profileFee,
  setProfileFee,
  profileHospital,
  setProfileHospital,
  profileBio,
  setProfileBio,
  handleSaveProfile
}) {
  return (
    <div className="card" style={{ padding: "32px", maxWidth: "600px", margin: "0 auto" }}>
      <h3 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <User size={22} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
        <span>Manage My Practitioner Profile</span>
      </h3>
      <p style={{ fontSize: "14px", color: "var(--color-slate)", marginBottom: "24px" }}>
        Review credentials, affiliations, consult fees, and security details.
      </p>

      <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="grid-2" style={{ gap: "16px", margin: 0 }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Account ID (Read-only)</label>
            <input type="text" className="input" value={user?.id || ""} disabled style={{ cursor: "not-allowed", opacity: 0.7 }} />
          </div>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">License Status</label>
            <input type="text" className="input" value={profileDoc?.verified ? "Verified License" : "Pending Verification"} disabled style={{ cursor: "not-allowed", opacity: 0.7, color: profileDoc?.verified ? "#10b981" : "var(--color-slate)", fontWeight: "bold" }} />
          </div>
        </div>

        <div className="grid-2" style={{ gap: "16px", margin: 0 }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Practitioner Name</label>
            <input type="text" className="input" required value={profileName} onChange={e => setProfileName(e.target.value)} />
          </div>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Email Address</label>
            <input type="email" className="input" required value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
          </div>
        </div>

        <div className="grid-2" style={{ gap: "16px", margin: 0 }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">New Password (Leave blank to keep current)</label>
            <input type="password" className="input" placeholder="••••••••" value={profilePassword} onChange={e => setProfilePassword(e.target.value)} />
          </div>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Specialty Field</label>
            <select className="select" value={profileSpecialty} onChange={e => setProfileSpecialty(e.target.value)}>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>
        </div>

        <div className="grid-3" style={{ gap: "16px", margin: 0 }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Experience (Years)</label>
            <input type="number" className="input" required value={profileExperience} onChange={e => setProfileExperience(e.target.value)} />
          </div>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Consult Fee (₹)</label>
            <input type="number" className="input" required value={profileFee} onChange={e => setProfileFee(e.target.value)} />
          </div>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Hospital / Clinic</label>
            <input type="text" className="input" required value={profileHospital} onChange={e => setProfileHospital(e.target.value)} />
          </div>
        </div>

        <div className="input-group" style={{ margin: 0 }}>
          <label className="label">Biography / Professional Profile</label>
          <textarea className="textarea" rows="3" required value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="Tell patients about your medical background..." />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: "12px", width: "100%", marginTop: "12px" }}>
          Save Profile Changes
        </button>
      </form>
    </div>
  );
}
