import React from "react";
import { Calendar, CheckCircle, FileText } from "lucide-react";

export default function DoctorOverview({ user, appointments, openPrescribeModal }) {
  return (
    <div>
      <div className="mb-32">
        <h2 style={{ fontSize: "28px" }}>Doctor Portal — {user?.name}</h2>
        <p style={{ fontSize: "14px" }}>Manage patient consultations, edit diagnostic summaries, and issue prescriptions</p>
      </div>

      <div className="grid-2">
        {/* Appointments */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            <span>Booked Patient Consultations</span>
          </h3>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {appointments.filter(a => a.status === "Booked").length === 0 ? (
              <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No consultations booked today.</p>
            ) : (
              appointments.filter(a => a.status === "Booked").map(app => (
                <div key={app.id} style={{ background: "var(--color-cloud-gray)", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "16px" }}>{app.patientName}</h4>
                    <p style={{ fontSize: "13px", color: "var(--color-charcoal)" }}>{app.slotDate} at {app.slotTime}</p>
                  </div>
                  <div className="flex-gap-16">
                    <button onClick={() => openPrescribeModal(app)} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "12px" }}>
                      <FileText size={14} />
                      <span>Prescribe</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Consultations list */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            <span>Consultation Log History</span>
          </h3>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {appointments.filter(a => a.status === "Completed").length === 0 ? (
              <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No completed consults.</p>
            ) : (
              appointments.filter(a => a.status === "Completed").map(app => (
                <div key={app.id} style={{ border: "1px solid rgba(0,0,0,0.06)", padding: "12px 16px", borderRadius: "12px" }}>
                  <span className="badge" style={{ float: "right", border: "1px solid #10b981", color: "#10b981", fontSize: "10px" }}>COMPLETED</span>
                  <h4 style={{ fontSize: "15px" }}>{app.patientName}</h4>
                  <p style={{ fontSize: "12px", color: "var(--color-charcoal)" }}>{app.slotDate} at {app.slotTime}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
