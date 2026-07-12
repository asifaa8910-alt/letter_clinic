import React from "react";
import { User } from "lucide-react";

export default function PatientProfile({
  user,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profilePassword,
  setProfilePassword,
  handleSaveProfile
}) {
  return (
    <div className="card" style={{ padding: "32px", maxWidth: "540px", margin: "0 auto" }}>
      <h3 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <User size={22} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
        <span>Manage My Account Profile</span>
      </h3>
      <p style={{ fontSize: "14px", color: "var(--color-slate)", marginBottom: "24px" }}>
        Review your Letters Clinic credentials and secure password info.
      </p>

      <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="input-group" style={{ margin: 0 }}>
          <label className="label">Account ID (Read-only)</label>
          <input type="text" className="input" value={user?.id || ""} disabled style={{ cursor: "not-allowed", opacity: 0.7 }} />
        </div>

        <div className="input-group" style={{ margin: 0 }}>
          <label className="label">Full Name</label>
          <input type="text" className="input" required value={profileName} onChange={e => setProfileName(e.target.value)} />
        </div>

        <div className="input-group" style={{ margin: 0 }}>
          <label className="label">Email Address</label>
          <input type="email" className="input" required value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
        </div>

        <div className="input-group" style={{ margin: 0 }}>
          <label className="label">New Password (Leave blank to keep current)</label>
          <input type="password" className="input" placeholder="••••••••" value={profilePassword} onChange={e => setProfilePassword(e.target.value)} />
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: "12px", width: "100%", marginTop: "12px" }}>
          Save Profile Changes
        </button>
      </form>
    </div>
  );
}
