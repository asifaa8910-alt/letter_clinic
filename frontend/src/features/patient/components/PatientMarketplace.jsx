import React from "react";
import { Search, Star, X } from "lucide-react";

export default function PatientMarketplace({
  search,
  handleSearchChange,
  specialty,
  handleSpecialtyChange,
  feeFilter,
  handleFeeChange,
  doctorsList,
  handleViewReviews,
  loadSlots,
  selectedDoctorSlots,
  setSelectedDoctorSlots,
  selectedDoc,
  handleBook,
  viewReviewsDoc,
  setViewReviewsDoc,
  docReviews
}) {
  return (
    <div>
      <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--color-slate)" }} />
            <input
              type="text"
              placeholder="Search doctors by name..."
              className="input"
              style={{ width: "100%", paddingLeft: "42px" }}
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <select className="select" value={specialty} onChange={handleSpecialtyChange}>
              <option value="">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>
          <div>
            <select className="select" value={feeFilter} onChange={handleFeeChange}>
              <option value="">Any Consultation Fee</option>
              <option value="500">Max ₹500</option>
              <option value="800">Max ₹800</option>
              <option value="1000">Max ₹1000</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {doctorsList.map(doc => (
          <div key={doc.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div className="flex-between mb-16">
                <span className="badge">{doc.specialty}</span>
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>₹{doc.fee} / consult</span>
              </div>
              <h4 style={{ fontSize: "18px", marginBottom: "4px" }}>{doc.name}</h4>
              <p style={{ fontSize: "12px", color: "var(--color-slate)", marginBottom: "12px" }}>{doc.hospital} • {doc.experience} yrs exp</p>
              <p style={{ fontSize: "13px", color: "var(--color-charcoal)", marginBottom: "20px" }}>{doc.bio}</p>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", marginBottom: "16px" }}>
                <Star size={16} fill="gold" stroke="gold" />
                <strong>{doc.rating}</strong>
                <button 
                  onClick={() => handleViewReviews(doc)} 
                  className="btn-text" 
                  style={{ padding: 0, fontSize: "13px", color: "var(--color-surgical-blue)", textDecoration: "underline", cursor: "pointer", background: "transparent", border: "none" }}
                >
                  ({doc.reviewsCount} reviews)
                </button>
              </div>
              <button onClick={() => loadSlots(doc)} className="btn btn-primary" style={{ width: "100%" }}>
                Book Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctorSlots && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(7,7,9,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ width: "100%", maxWidth: "480px", margin: "20px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Available slots for {selectedDoc?.name}</h3>
            <p style={{ fontSize: "13px", marginBottom: "20px" }}>Select a convenient time for your video consultation</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", maxHeight: "200px", overflowY: "auto", marginBottom: "24px" }}>
              {selectedDoctorSlots.filter(s => s.available).length === 0 ? (
                <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No slots currently available.</p>
              ) : (
                selectedDoctorSlots.filter(s => s.available).map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => handleBook(slot.id)}
                    className="btn btn-ghost"
                    style={{ padding: "8px 12px", fontSize: "12px" }}
                  >
                    {slot.date} @ {slot.time}
                  </button>
                ))
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedDoctorSlots(null)} className="btn btn-text">Close</button>
            </div>
          </div>
        </div>
      )}

      {viewReviewsDoc && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "32px", background: "var(--color-paper-white)", position: "relative", maxHeight: "85vh", overflowY: "auto" }}>
            <button onClick={() => setViewReviewsDoc(null)} style={{ position: "absolute", right: "20px", top: "20px", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-slate)" }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: "20px", marginBottom: "4px", color: "var(--color-obsidian)" }}>Patient Reviews</h3>
            <p style={{ fontSize: "14px", color: "var(--color-slate)", marginBottom: "24px" }}>Dr. {viewReviewsDoc.name} • {viewReviewsDoc.specialty}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {docReviews.length === 0 ? (
                <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)", textAlign: "center" }}>No reviews available for this practitioner.</p>
              ) : (
                docReviews.map(rev => (
                  <div key={rev.id} style={{ border: "1px solid var(--color-border)", padding: "16px", borderRadius: "12px", background: "rgba(37, 151, 208, 0.01)" }}>
                    <div className="flex-between mb-8" style={{ flexWrap: "wrap", gap: "12px" }}>
                      <strong>{rev.patientName}</strong>
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < rev.rating ? "gold" : "none"} stroke={i < rev.rating ? "gold" : "var(--color-slate)"} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--color-charcoal)", fontStyle: "italic" }}>"{rev.comment}"</p>
                    <span style={{ fontSize: "11px", color: "var(--color-slate)", display: "block", marginTop: "8px" }}>{rev.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
