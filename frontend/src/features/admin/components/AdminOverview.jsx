import React from "react";
import { Users, TrendingUp, BarChart2, FileText, CheckCircle, XCircle } from "lucide-react";

export default function AdminOverview({ stats, verifications, handleUpdateStatus }) {
  return (
    <div>
      {stats && (
        <div className="grid-3" style={{ marginBottom: "40px" }}>
          <div className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "var(--color-sky-tint)", padding: "12px", borderRadius: "12px" }}>
              <Users size={24} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            </div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--color-slate)", textTransform: "uppercase" }}>Registered Patients</span>
              <h3 style={{ fontSize: "28px", marginTop: "4px" }}>{stats.totalPatients}</h3>
            </div>
          </div>

          <div className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "var(--color-sky-tint)", padding: "12px", borderRadius: "12px" }}>
              <TrendingUp size={24} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            </div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--color-slate)", textTransform: "uppercase" }}>Verified / Total Doctors</span>
              <h3 style={{ fontSize: "28px", marginTop: "4px" }}>{stats.verifiedDoctors} / {stats.totalDoctors}</h3>
            </div>
          </div>

          <div className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "var(--color-sky-tint)", padding: "12px", borderRadius: "12px" }}>
              <BarChart2 size={24} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            </div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--color-slate)", textTransform: "uppercase" }}>Appointments Booked</span>
              <h3 style={{ fontSize: "28px", marginTop: "4px" }}>{stats.totalAppointments}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid-2">
        {/* Verification Board */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <h3 className="card-title" style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <FileText size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            <span>Practitioner Credentials Verification Requests</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {verifications.length === 0 ? (
              <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No verification requests pending.</p>
            ) : (
              verifications.map(req => (
                <div key={req.id} style={{ border: "1px solid var(--color-border)", padding: "20px", borderRadius: "12px", background: req.status === "Pending" ? "rgba(37, 151, 208, 0.04)" : "none" }}>
                  <div className="flex-between mb-16" style={{ flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <h4 style={{ fontSize: "18px", color: "var(--color-obsidian)" }}>{req.doctorName}</h4>
                      <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>Submitted: {req.submittedAt}</span>
                    </div>
                    <div>
                      <span className="badge" style={{
                        borderColor: req.status === "Approved" ? "#10b981" : req.status === "Rejected" ? "#ef4444" : "var(--color-obsidian)",
                        color: req.status === "Approved" ? "#10b981" : req.status === "Rejected" ? "#ef4444" : "var(--color-obsidian)",
                      }}>
                        {req.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid-2" style={{ marginBottom: "20px" }}>
                    <div style={{ background: "var(--color-cloud-gray)", padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                      <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block" }}>Medical License Number</span>
                      <strong style={{ fontSize: "13px", color: "var(--color-obsidian)" }}>{req.license}</strong>
                    </div>
                    <div style={{ background: "var(--color-cloud-gray)", padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                      <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block" }}>Degree Details</span>
                      <strong style={{ fontSize: "13px", color: "var(--color-obsidian)" }}>{req.degree}</strong>
                    </div>
                  </div>

                  {req.status === "Pending" && (
                    <div className="flex-gap-16" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                      <button onClick={() => handleUpdateStatus(req.id, "Rejected")} className="btn btn-ghost" style={{ padding: "8px 16px", borderColor: "#ef4444", color: "#ef4444" }}>
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                      <button onClick={() => handleUpdateStatus(req.id, "Approved")} className="btn btn-primary" style={{ padding: "8px 16px", background: "#10b981" }}>
                        <CheckCircle size={14} />
                        <span>Approve License</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
