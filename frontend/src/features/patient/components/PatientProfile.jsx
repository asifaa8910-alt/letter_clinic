import React from "react";
import { User, Phone, Heart, FileText } from "lucide-react";

export default function PatientProfile({
  user,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profilePassword,
  setProfilePassword,
  profilePhone,
  setProfilePhone,
  profileBloodGroup,
  setProfileBloodGroup,
  profileMedicalHistory,
  setProfileMedicalHistory,
  handleSaveProfile
}) {
  return (
    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: "580px", margin: "0 auto" }}>
      <div className="d-flex align-items-center gap-2 mb-2">
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "rgba(37, 151, 208, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-surgical-blue)"
          }}
        >
          <User size={22} />
        </div>
        <h3 className="fs-5 fw-bold mb-0">Patient Account & Medical Vitals</h3>
      </div>
      <p className="text-secondary small mb-4">
        Keep your clinical credentials, contact info, and medical history updated for doctors during consultations.
      </p>

      <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-3">
        <div>
          <label className="form-label small fw-semibold text-secondary">Account ID</label>
          <input
            type="text"
            className="form-control form-control-sm bg-light text-muted"
            value={user?.id || ""}
            disabled
          />
        </div>

        <div>
          <label className="form-label small fw-semibold text-dark">Full Name</label>
          <input
            type="text"
            className="form-control"
            required
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label small fw-semibold text-dark">Email Address</label>
          <input
            type="email"
            className="form-control"
            required
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
          />
        </div>

        <div className="row g-2">
          <div className="col-md-7">
            <label className="form-label small fw-semibold text-dark d-flex align-items-center gap-1">
              <Phone size={13} />
              <span>Contact Phone</span>
            </label>
            <input
              type="tel"
              className="form-control"
              placeholder="+91 98765 43210"
              value={profilePhone || ""}
              onChange={(e) => setProfilePhone && setProfilePhone(e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label small fw-semibold text-dark d-flex align-items-center gap-1">
              <Heart size={13} />
              <span>Blood Group</span>
            </label>
            <select
              className="form-select"
              value={profileBloodGroup || "O+"}
              onChange={(e) => setProfileBloodGroup && setProfileBloodGroup(e.target.value)}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label small fw-semibold text-dark d-flex align-items-center gap-1">
            <FileText size={13} />
            <span>Known Medical Conditions / Allergies</span>
          </label>
          <textarea
            className="form-control"
            rows={2}
            placeholder="e.g. Penicillin allergy, Asthma, Type 2 Diabetes..."
            value={profileMedicalHistory || ""}
            onChange={(e) => setProfileMedicalHistory && setProfileMedicalHistory(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label small fw-semibold text-dark">
            New Password <span className="text-muted fw-normal">(Leave blank to keep unchanged)</span>
          </label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={profilePassword}
            onChange={(e) => setProfilePassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary rounded-3 py-2 fw-semibold mt-2 shadow-sm">
          Save Profile Details
        </button>
      </form>
    </div>
  );
}
