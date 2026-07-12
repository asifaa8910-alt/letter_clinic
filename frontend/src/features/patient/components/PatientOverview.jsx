import React from "react";
import { Calendar, FileText, Video, ArrowRight } from "lucide-react";

export default function PatientOverview({ 
  user, 
  appointments, 
  prescriptions, 
  handleJoinConsultation, 
  handleCancelAppointment, 
  setActiveTab 
}) {
  return (
    <div>
      <div className="flex-between mb-32">
        <div>
          <h2 style={{ fontSize: "28px" }}>Welcome, {user?.name}</h2>
          <p style={{ fontSize: "14px" }}>Manage appointments, consultations, and review prescriptions</p>
        </div>
        <button onClick={() => setActiveTab("triage")} className="btn btn-primary" style={{ padding: "10px 20px" }}>
          <span>New AI Triage</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid-2">
        {/* Appointments panel */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            <span>Upcoming Consultations</span>
          </h3>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {appointments.filter(a => a.status === "Booked").length === 0 ? (
              <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No upcoming appointments scheduled.</p>
            ) : (
              appointments.filter(a => a.status === "Booked").map(app => (
                <div key={app.id} style={{ background: "var(--color-cloud-gray)", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "16px" }}>{app.doctorName}</h4>
                    <p style={{ fontSize: "13px", color: "var(--color-charcoal)" }}>{app.slotDate} at {app.slotTime}</p>
                  </div>
                  <div className="flex-gap-16">
                    <button onClick={() => handleJoinConsultation(app)} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "12px", background: "var(--color-surgical-blue)" }}>
                      <Video size={14} />
                      <span>Join</span>
                    </button>
                    <button onClick={() => handleCancelAppointment(app.id)} className="btn btn-text" style={{ padding: "8px 12px", fontSize: "12px", color: "#b91c1c" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Prescriptions panel */}
        <div className="card">
          <h3 className="card-title" style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            <span>Digital E-Prescriptions</span>
          </h3>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {prescriptions.length === 0 ? (
              <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No prescriptions found.</p>
            ) : (
              prescriptions.map(rx => (
                <div key={rx.id} style={{ border: "1px solid rgba(0,0,0,0.06)", padding: "16px", borderRadius: "12px" }}>
                  <div className="flex-between mb-8">
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{rx.doctorName}</span>
                    <span style={{ fontSize: "11px", color: "var(--color-slate)" }}>{rx.date}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--color-charcoal)", marginBottom: "8px" }}><strong>Symptoms:</strong> {rx.symptoms}</p>
                  <div style={{ background: "var(--color-cloud-gray)", padding: "8px 12px", borderRadius: "8px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Prescribed Medicines</span>
                    {rx.medicines.map((m, i) => (
                      <div key={i} style={{ fontSize: "12px", margin: "4px 0" }}>
                        • <strong>{m.name}</strong> - {m.dosage} ({m.duration}) <br/>
                        <span style={{ fontSize: "10px", color: "var(--color-charcoal)" }}>{m.instructions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
