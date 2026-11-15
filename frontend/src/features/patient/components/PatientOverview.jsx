import React from "react";
import { Calendar, FileText, Video, ArrowRight, Printer, Bell, Check, Clock } from "lucide-react";

export default function PatientOverview({
  user,
  appointments,
  prescriptions,
  reminders = [],
  handleJoinConsultation,
  handleCancelAppointment,
  handleViewPrescription,
  handleToggleReminder,
  setActiveTab
}) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: "28px" }}>Welcome, {user?.name}</h2>
          <p className="text-secondary small mb-0">Manage appointments, live consultations, digital prescriptions, and daily medication reminders</p>
        </div>
        <button onClick={() => setActiveTab("triage")} className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm">
          <span>New AI Symptom Triage</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="row g-4">
        {/* Appointments Panel */}
        <div className="col-lg-6">
          <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="card-title fs-5 fw-bold mb-0 d-flex align-items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <span>Upcoming Consultations</span>
              </h3>
              <span className="badge bg-primary-subtle text-primary rounded-pill">
                {appointments.filter((a) => a.status === "Booked").length} Active
              </span>
            </div>

            <div className="d-flex flex-column gap-3 mt-3">
              {appointments.filter((a) => a.status === "Booked").length === 0 ? (
                <div className="text-center py-4 bg-light rounded-3">
                  <p className="text-muted fst-italic small mb-2">No upcoming consultations booked.</p>
                  <button
                    onClick={() => setActiveTab("marketplace")}
                    className="btn btn-sm btn-outline-primary rounded-pill"
                  >
                    Find a Doctor & Book Slot
                  </button>
                </div>
              ) : (
                appointments
                  .filter((a) => a.status === "Booked")
                  .map((app) => (
                    <div
                      key={app.id}
                      className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center flex-wrap gap-2"
                    >
                      <div>
                        <h5 className="fw-bold fs-6 mb-1 text-dark">{app.doctorName}</h5>
                        <p className="text-secondary small mb-0 d-flex align-items-center gap-1">
                          <Clock size={13} />
                          <span>{app.slotDate} at {app.slotTime}</span>
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleJoinConsultation(app)}
                          className="btn btn-primary btn-sm rounded-pill d-flex align-items-center gap-1 px-3 shadow-sm"
                        >
                          <Video size={14} />
                          <span>Join Call</span>
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* E-Prescriptions Panel */}
        <div className="col-lg-6">
          <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="card-title fs-5 fw-bold mb-0 d-flex align-items-center gap-2">
                <FileText size={20} className="text-primary" />
                <span>Digital E-Prescriptions</span>
              </h3>
              <span className="badge bg-secondary-subtle text-secondary rounded-pill">
                {prescriptions.length} Records
              </span>
            </div>

            <div className="d-flex flex-column gap-3 mt-3">
              {prescriptions.length === 0 ? (
                <div className="text-center py-4 bg-light rounded-3">
                  <p className="text-muted fst-italic small mb-0">No prescriptions issued yet.</p>
                </div>
              ) : (
                prescriptions.map((rx) => (
                  <div key={rx.id} className="p-3 border rounded-3 bg-white shadow-sm">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <strong className="fs-6 text-dark d-block">{rx.doctorName}</strong>
                        <small className="text-muted">{rx.date}</small>
                      </div>
                      <button
                        onClick={() => handleViewPrescription(rx)}
                        className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1 px-3"
                      >
                        <Printer size={13} />
                        <span>View / Print PDF</span>
                      </button>
                    </div>

                    <p className="small text-secondary mb-2">
                      <strong>Symptoms:</strong> {rx.symptoms}
                    </p>

                    <div className="p-2 bg-light rounded small">
                      <span className="fw-bold text-uppercase d-block mb-1 text-secondary" style={{ fontSize: "10px" }}>
                        Medicines Prescribed:
                      </span>
                      {rx.medicines?.map((m, i) => (
                        <div key={i} className="mb-1 text-dark" style={{ fontSize: "12px" }}>
                          • <strong>{m.name}</strong> ({m.dosage}) — {m.duration}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Medication Reminders Widget */}
        <div className="col-12">
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="card-title fs-5 fw-bold mb-0 d-flex align-items-center gap-2">
                <Bell size={20} className="text-primary" />
                <span>Daily Medication Reminders</span>
              </h3>
              <span className="badge bg-info-subtle text-info rounded-pill">
                {reminders.filter((r) => r.active).length} Active Reminders
              </span>
            </div>

            <div className="row g-3 mt-1">
              {reminders.length === 0 ? (
                <div className="col-12 text-center py-3 bg-light rounded-3">
                  <p className="text-muted fst-italic small mb-0">No medication reminders set.</p>
                </div>
              ) : (
                reminders.map((rem) => (
                  <div key={rem.id} className="col-md-4 col-sm-6">
                    <div
                      className={`p-3 rounded-3 border h-100 d-flex justify-content-between align-items-center ${
                        rem.active ? "bg-white shadow-sm border-primary-subtle" : "bg-light opacity-75"
                      }`}
                    >
                      <div>
                        <strong className="d-block text-dark small">
                          {rem.medicineName || rem.message}
                        </strong>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <Clock size={12} />
                          <span>{rem.time}</span>
                          {rem.frequency && <span>• {rem.frequency}</span>}
                        </small>
                      </div>
                      <button
                        onClick={() => handleToggleReminder && handleToggleReminder(rem.id)}
                        className={`btn btn-sm rounded-circle p-2 ${rem.active ? "btn-success" : "btn-outline-secondary"}`}
                        title={rem.active ? "Mark Done / Deactivate" : "Activate Reminder"}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
