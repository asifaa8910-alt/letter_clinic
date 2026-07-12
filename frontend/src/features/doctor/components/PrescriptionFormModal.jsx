import React from "react";

export default function PrescriptionFormModal({
  prescriptionForm,
  setPrescriptionForm,
  rxSymptoms,
  setRxSymptoms,
  medicines,
  handleCreatePrescription,
  handleAddMedicine,
  handleMedicineChange,
  handleRemoveMedicine,
  rxNotes,
  setRxNotes
}) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,7,9,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto", padding: "20px 0" }}>
      <div className="card" style={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
        <h3 style={{ fontSize: "22px", marginBottom: "4px" }}>Generate E-Prescription</h3>
        <p style={{ fontSize: "13px", color: "var(--color-charcoal)", marginBottom: "20px" }}>Patient: <strong>{prescriptionForm.patientName}</strong></p>

        <form onSubmit={handleCreatePrescription}>
          <div className="input-group">
            <label className="label">Diagnostic Summary / Patient Symptoms</label>
            <input
              type="text"
              className="input"
              value={rxSymptoms}
              onChange={(e) => setRxSymptoms(e.target.value)}
              placeholder="e.g. Mild palpitations during physical exertion"
              required
            />
          </div>

          <div style={{ margin: "20px 0", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "16px" }}>
            <div className="flex-between" style={{ marginBottom: "12px" }}>
              <label className="label">Prescribed Medications</label>
              <button type="button" onClick={handleAddMedicine} className="btn btn-text" style={{ fontSize: "12px", padding: "4px 8px" }}>+ Add Medicine</button>
            </div>

            {medicines.map((med, index) => (
              <div key={index} style={{ border: "1px solid rgba(0,0,0,0.04)", background: "var(--color-cloud-gray)", padding: "12px", borderRadius: "10px", marginBottom: "12px", position: "relative" }}>
                {medicines.length > 1 && (
                  <button type="button" onClick={() => handleRemoveMedicine(index)} style={{ position: "absolute", top: "8px", right: "8px", border: "none", background: "none", color: "#b91c1c", cursor: "pointer", fontSize: "11px" }}>Remove</button>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "8px" }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: "bold" }}>Medicine Name</span>
                    <input type="text" className="input" value={med.name} onChange={(e) => handleMedicineChange(index, "name", e.target.value)} placeholder="e.g. Lipitor" required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: "bold" }}>Dosage</span>
                    <input type="text" className="input" value={med.dosage} onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)} placeholder="e.g. 10mg once daily" required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: "bold" }}>Duration</span>
                    <input type="text" className="input" value={med.duration} onChange={(e) => handleMedicineChange(index, "duration", e.target.value)} placeholder="e.g. 30 Days" required />
                  </div>
                  <div className="input-group" style={{ margin: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: "bold" }}>Instructions</span>
                    <input type="text" className="input" value={med.instructions} onChange={(e) => handleMedicineChange(index, "instructions", e.target.value)} placeholder="e.g. Take with dinner" required />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="input-group" style={{ marginBottom: "24px" }}>
            <label className="label">Advisory Notes / Follow Up</label>
            <textarea
              className="textarea"
              rows={2}
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
              placeholder="e.g. Avoid heavy lifting and monitor blood pressure weekly."
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button type="button" onClick={() => setPrescriptionForm(null)} className="btn btn-text">Cancel</button>
            <button type="submit" className="btn btn-primary">Generate & Send Rx</button>
          </div>
        </form>
      </div>
    </div>
  );
}
