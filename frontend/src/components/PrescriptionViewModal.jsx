import React from "react";
import { Printer, Activity } from "lucide-react";

export default function PrescriptionViewModal({ prescription, onClose }) {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(7, 7, 9, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px"
      }}
    >
      <div
        className="card shadow-lg bg-white text-dark rounded-4"
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          border: "none"
        }}
      >
        {/* Printable Prescription Body */}
        <div className="p-4 printable-prescription">
          {/* Letterhead Header */}
          <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--color-surgical-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}
              >
                <Activity size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold" style={{ color: "var(--color-obsidian)" }}>
                  Letters Clinic
                </h4>
                <small className="text-muted">Digital Telemedicine & Clinical Care</small>
              </div>
            </div>

            <div className="text-end">
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-1">
                E-Prescription ID: #{prescription.id ? prescription.id.slice(-6).toUpperCase() : "RX-2026"}
              </span>
              <p className="small text-muted mb-0">Date: {prescription.date}</p>
            </div>
          </div>

          {/* Doctor & Patient Metadata Row */}
          <div className="row g-3 mb-4 p-3 bg-light rounded-3 border">
            <div className="col-sm-6">
              <span className="text-muted small d-block">Prescribing Practitioner:</span>
              <strong className="fs-6 text-dark">{prescription.doctorName}</strong>
              <small className="d-block text-secondary">Verified Specialist</small>
            </div>
            <div className="col-sm-6">
              <span className="text-muted small d-block">Presenting Symptoms:</span>
              <strong className="fs-6 text-dark">{prescription.symptoms || "General Clinical Consultation"}</strong>
            </div>
          </div>

          {/* Rx Symbol & Medicines Table */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ fontSize: "24px", fontFamily: "serif", fontWeight: "bold", color: "var(--color-surgical-blue)" }}>
                ℞
              </span>
              <h6 className="mb-0 fw-bold text-uppercase text-secondary" style={{ letterSpacing: "0.05em", fontSize: "12px" }}>
                Prescribed Medications
              </h6>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle mb-0" style={{ fontSize: "13px" }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "30%" }}>Medicine</th>
                    <th style={{ width: "20%" }}>Dosage</th>
                    <th style={{ width: "20%" }}>Duration</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescription.medicines && prescription.medicines.length > 0 ? (
                    prescription.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td className="fw-semibold text-primary">{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.duration}</td>
                        <td className="text-muted">{med.instructions}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        No medications prescribed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor's Clinical Notes */}
          {prescription.notes && (
            <div className="mb-4 p-3 border-start border-4 border-info bg-light rounded">
              <h6 className="fw-bold mb-1" style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--color-charcoal)" }}>
                Physician's Advice & Remarks
              </h6>
              <p className="small mb-0 text-secondary">{prescription.notes}</p>
            </div>
          )}

          {/* Verification Watermark Footer */}
          <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-4 text-muted small">
            <div>
              <small>Digitally signed & encrypted per Telemedicine Guidelines 2020.</small>
            </div>
            <div className="text-end">
              <strong>{prescription.doctorName}</strong>
              <small className="d-block text-secondary">Authorized Signature</small>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer (hidden during print) */}
        <div className="d-flex justify-content-end gap-2 p-3 bg-light border-top no-print">
          <button type="button" onClick={onClose} className="btn btn-outline-secondary px-3 rounded-pill">
            Close
          </button>
          <button type="button" onClick={handlePrint} className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-pill">
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
