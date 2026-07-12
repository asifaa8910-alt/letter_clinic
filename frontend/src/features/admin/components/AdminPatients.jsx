import React from "react";
import { Search, Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminPatients({
  patSearch,
  setPatSearch,
  filteredPatients,
  handleOpenAddPat,
  handleOpenEditPat,
  handleDeletePat,
  showPatModal,
  setShowPatModal,
  editingPatId,
  patName,
  setPatName,
  patEmail,
  setPatEmail,
  patPassword,
  setPatPassword,
  handlePatSubmit
}) {
  return (
    <div className="card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "360px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--color-slate)" }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search patient name, email..." 
            style={{ width: "100%", paddingLeft: "42px" }}
            value={patSearch}
            onChange={(e) => setPatSearch(e.target.value)}
          />
        </div>
        <button onClick={handleOpenAddPat} className="btn btn-primary" style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Plus size={18} />
          <span>Add Patient Account</span>
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Patient Name</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Account ID</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}>Email Address</th>
              <th style={{ padding: "12px 8px", color: "var(--color-obsidian)", fontWeight: "600" }}></th >
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: "20px 8px", textAlign: "center", color: "var(--color-slate)", fontStyle: "italic" }}>No patients found.</td>
              </tr>
            ) : (
              filteredPatients.map(pat => (
                <tr key={pat.id} style={{ borderBottom: "1px solid var(--color-border)", verticalAlign: "middle" }}>
                  <td style={{ padding: "16px 8px", fontWeight: "500", color: "var(--color-obsidian)" }}>{pat.name}</td>
                  <td style={{ padding: "16px 8px" }}><code>{pat.id}</code></td>
                  <td style={{ padding: "16px 8px" }}>{pat.email}</td>
                  <td style={{ padding: "16px 8px", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button onClick={() => handleOpenEditPat(pat)} className="btn btn-ghost" style={{ padding: "6px", border: "none" }} title="Edit Patient Details">
                        <Edit size={16} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
                      </button>
                      <button onClick={() => handleDeletePat(pat.id, pat.name)} className="btn btn-ghost" style={{ padding: "6px", border: "none" }} title="Delete Patient Details">
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

      {showPatModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "460px", padding: "32px", background: "var(--color-paper-white)", position: "relative" }}>
            <button onClick={() => setShowPatModal(false)} style={{ position: "absolute", right: "20px", top: "20px", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-slate)" }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: "22px", marginBottom: "24px", color: "var(--color-obsidian)" }}>
              {editingPatId ? `Edit Patient Details` : "Create New Patient Account"}
            </h3>

            <form onSubmit={handlePatSubmit}>
              <div className="input-group" style={{ marginBottom: "16px" }}>
                <label className="label">Patient Full Name</label>
                <input type="text" className="input" required value={patName} onChange={e => setPatName(e.target.value)} placeholder="e.g. Jane Smith" />
              </div>
              <div className="input-group" style={{ marginBottom: "16px" }}>
                <label className="label">Email Address</label>
                <input type="email" className="input" required value={patEmail} onChange={e => setPatEmail(e.target.value)} placeholder="patient@clinic.com" />
              </div>
              <div className="input-group" style={{ marginBottom: "24px" }}>
                <label className="label">Password {editingPatId && "(Leave blank to keep current)"}</label>
                <input type="password" className="input" required={!editingPatId} value={patPassword} onChange={e => setPatPassword(e.target.value)} placeholder="••••••••" />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowPatModal(false)} className="btn btn-ghost" style={{ padding: "12px 24px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: "12px 24px" }}>
                  {editingPatId ? "Update Patient Details" : "Create Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
