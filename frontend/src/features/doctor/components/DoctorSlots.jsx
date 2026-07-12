import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function DoctorSlots({
  slots,
  slotDate,
  setSlotDate,
  slotTime,
  setSlotTime,
  handleAddSlot,
  handleDeleteSlot
}) {
  return (
    <div className="grid-2">
      {/* Add Slot */}
      <div className="card">
        <h3 className="card-title" style={{ fontSize: "20px", marginBottom: "16px" }}>Add Availability Slot</h3>
        <form onSubmit={handleAddSlot}>
          <div className="input-group">
            <label className="label">Consultation Date</label>
            <input type="date" className="input" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} required />
          </div>
          <div className="input-group" style={{ marginBottom: "24px" }}>
            <label className="label">Consultation Time</label>
            <input type="text" className="input" value={slotTime} onChange={(e) => setSlotTime(e.target.value)} placeholder="e.g. 09:30 AM" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
            <Plus size={16} />
            <span>Create Slot</span>
          </button>
        </form>
      </div>

      {/* List Slots */}
      <div className="card">
        <h3 className="card-title" style={{ fontSize: "20px", marginBottom: "16px" }}>Existing Slots</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "350px", overflowY: "auto" }}>
          {slots.length === 0 ? (
            <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No slots configured.</p>
          ) : (
            slots.map(slot => (
              <div key={slot.id} className="flex-between" style={{ background: "var(--color-cloud-gray)", padding: "12px 16px", borderRadius: "10px" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>{slot.date}</span>
                  <span style={{ fontSize: "13px", color: "var(--color-charcoal)", marginLeft: "8px" }}>at {slot.time}</span>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: slot.available ? "#d1fae5" : "#fee2e2", color: slot.available ? "#065f46" : "#991b1b", marginLeft: "12px" }}>
                    {slot.available ? "Available" : "Booked"}
                  </span>
                </div>
                <button onClick={() => handleDeleteSlot(slot.id)} className="btn btn-text" style={{ padding: "6px", color: "#b91c1c" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
