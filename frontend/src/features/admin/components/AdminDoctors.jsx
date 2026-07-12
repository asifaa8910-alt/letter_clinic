import React from "react";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminDoctors({
  docSearch,
  setDocSearch,
  filteredDoctors,
  handleOpenAddDoc,
  handleOpenEditDoc,
  handleDeleteDoc,
  showDocModal,
  setShowDocModal,
  editingDocId,
  docName,
  setDocName,
  docEmail,
  setDocEmail,
  docPassword,
  setDocPassword,
  docSpecialty,
  setDocSpecialty,
  docExperience,
  setDocExperience,
  docFee,
  setDocFee,
  docHospital,
  setDocHospital,
  docBio,
  setDocBio,
  docVerified,
  setDocVerified,
  docLicense,
  setDocLicense,
  docDegree,
  setDocDegree,
  handleDocSubmit
}) {
  return (
    <div className="card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "360px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--color-slate)" }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search specialty, doctor name, hospital..." 
            style={{ width: "100%", paddingLeft: "42px" }}
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
          />
        </div>
        <button onClick={handleOpenAddDoc} className="btn btn-primary" style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} />
          <span>Add Practitioner</span>
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Name</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Specialty</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Hospital</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Experience</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Consult Fee</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Verified</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}></th >
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "20px 8px", textAlign: "center", color: "var(--color-slate)", fontStyle: "italic" }}>No practitioners found.</td>
              </tr>
            ) : (
              filteredDoctors.map(doc => (
                <tr key={doc.id} style={{ borderBottom: "1px solid var(--color-border)", verticalAlign: "middle" }}>
                  <td style={{ padding: "16px 8px", fontWeight: "500", color: "var(--color-obsidian)" }}>{doc.name}</td>
                  <td style={{ padding: "16px 8px" }}>{doc.specialty}</td>
                  <td style={{ padding: "16px 8px" }}>{doc.hospital}</td>
                  <td style={{ padding: "16px 8px" }}>{doc.experience} Years</td>
                  <td style={{ padding: "16px 8px", fontWeight: "bold" }}>₹{doc.fee}</td>
                  <td style={{ padding: "16px 8px" }}>
                    <span className="badge" style={{
                      borderColor: doc.verified ? "#10b981" : "var(--color-slate)",
                      color: doc.verified ? "#10b981" : "var(--color-slate)",
                      background: doc.verified ? "rgba(16,185,129,0.05)" : "transparent"
                    }}>
                      {doc.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => handleOpenEditDoc(doc)} className="btn btn-ghost" style={{ padding: "6px", border: "none" }} title="Edit Doctor Profile">
                        <Edit size={16} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
                      </button>
                      <button onClick={() => handleDeleteDoc(doc.id, doc.name)} className="btn btn-ghost" style={{ padding: "6px", border: "none" }} title="Delete Doctor Profile">
                        <Trash2 size={16} style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDocModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", padding: "32px", background: "var(--color-paper-white)", position: "relative" }}>
            <button onClick={() => setShowDocModal(false)} style={{ position: "absolute", right: "20px", top: "20px", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-slate)" }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: "22px", marginBottom: "24px", color: "var(--color-obsidian)" }}>
              {editingDocId ? `Edit Doctor: Dr. ${docName}` : "Register New Doctor Account"}
            </h3>

            <form onSubmit={handleDocSubmit}>
              <div className="grid-2" style={{ gap: "16px", marginBottom: "16px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="label">Practitioner Name</label>
                  <input type="text" className="input" required value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. Dr. Eleanor Vance" />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" required value={docEmail} onChange={e => setDocEmail(e.target.value)} placeholder="doc@clinic.com" />
                </div>
              </div>

              <div className="grid-2" style={{ gap: "16px", marginBottom: "16px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="label">Password {editingDocId && "(Leave blank to keep current)"}</label>
                  <input type="password" className="input" required={!editingDocId} value={docPassword} onChange={e => setDocPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="label">Specialty Field</label>
                  <select className="select" value={docSpecialty} onChange={e => setDocSpecialty(e.target.value)}>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
              </div>

              <div className="grid-3" style={{ gap: "16px", marginBottom: "16px" }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="label">Experience (Years)</label>
                  <input type="number" className="input" required value={docExperience} onChange={e => setDocExperience(e.target.value)} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="label">Consult Fee (₹)</label>
                  <input type="number" className="input" required value={docFee} onChange={e => setDocFee(e.target.value)} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label className="label">Hospital / Clinic</label>
                  <input type="text" className="input" required value={docHospital} onChange={e => setDocHospital(e.target.value)} placeholder="e.g. City Hospital, Delhi" />
                </div>
              </div>

              {!editingDocId && (
                <div className="grid-2" style={{ gap: "16px", marginBottom: "16px" }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="label">Medical License Number</label>
                    <input type="text" className="input" value={docLicense} onChange={e => setDocLicense(e.target.value)} />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label className="label">Medical Degrees</label>
                    <input type="text" className="input" value={docDegree} onChange={e => setDocDegree(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="input-group" style={{ marginBottom: "20px" }}>
                <label className="label">Biography / Details</label>
                <textarea className="textarea" rows="3" value={docBio} onChange={e => setDocBio(e.target.value)} placeholder="Practitioner's expertise, bio summary..." />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <input type="checkbox" id="verified_chk" checked={docVerified} onChange={e => setDocVerified(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                <label htmlFor="verified_chk" style={{ fontSize: "14px", fontWeight: "500", cursor: "pointer", color: "var(--color-obsidian)" }}>
                  Verified Practitioner License (Approve instantly without verification process)
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowDocModal(false)} className="btn btn-ghost" style={{ padding: "12px 24px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "12px 24px" }}>
                  {editingDocId ? "Save Profile Details" : "Register Doctor Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
