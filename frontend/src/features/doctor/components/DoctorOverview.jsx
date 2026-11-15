import React from "react";
import { Calendar, CheckCircle, FileText, Video, Clock } from "lucide-react";

export default function DoctorOverview({
  user,
  appointments,
  openPrescribeModal,
  handleJoinConsultation
}) {
  const bookedAppointments = appointments.filter((a) => a.status === "Booked");
  const completedAppointments = appointments.filter((a) => a.status === "Completed");

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: "28px" }}>
          Practitioner Workspace — {user?.name}
        </h2>
        <p className="text-secondary small mb-0">
          Conduct live consultations, review patient queue, and issue certified digital prescriptions
        </p>
      </div>

      <div className="row g-4">
        {/* Booked Consultations Card */}
        <div className="col-lg-7">
          <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="card-title fs-5 fw-bold mb-0 d-flex align-items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <span>Scheduled Patient Appointments</span>
              </h3>
              <span className="badge bg-primary-subtle text-primary rounded-pill">
                {bookedAppointments.length} In Queue
              </span>
            </div>

            <div className="d-flex flex-column gap-3 mt-3">
              {bookedAppointments.length === 0 ? (
                <div className="text-center py-4 bg-light rounded-3">
                  <p className="text-muted fst-italic small mb-0">No consultations booked at the moment.</p>
                </div>
              ) : (
                bookedAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center flex-wrap gap-2 shadow-sm"
                  >
                    <div>
                      <h5 className="fw-bold fs-6 mb-1 text-dark">{app.patientName}</h5>
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
                        onClick={() => openPrescribeModal(app)}
                        className="btn btn-outline-success btn-sm rounded-pill d-flex align-items-center gap-1 px-3"
                      >
                        <FileText size={14} />
                        <span>Prescribe</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Completed Consultations Log */}
        <div className="col-lg-5">
          <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="card-title fs-5 fw-bold mb-0 d-flex align-items-center gap-2">
                <CheckCircle size={20} className="text-success" />
                <span>Consultation Log</span>
              </h3>
              <span className="badge bg-success-subtle text-success rounded-pill">
                {completedAppointments.length} Done
              </span>
            </div>

            <div className="d-flex flex-column gap-3 mt-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {completedAppointments.length === 0 ? (
                <div className="text-center py-4 bg-light rounded-3">
                  <p className="text-muted fst-italic small mb-0">No completed consultations yet.</p>
                </div>
              ) : (
                completedAppointments.map((app) => (
                  <div key={app.id} className="p-3 border rounded-3 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="fs-6 text-dark">{app.patientName}</strong>
                      <span className="badge bg-success-subtle text-success border border-success-subtle">
                        COMPLETED
                      </span>
                    </div>
                    <small className="text-muted d-block">
                      {app.slotDate} at {app.slotTime}
                    </small>
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
