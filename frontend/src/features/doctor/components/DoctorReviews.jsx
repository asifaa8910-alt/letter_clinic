import React from "react";
import { Star } from "lucide-react";

export default function DoctorReviews({ reviews }) {
  return (
    <div className="card" style={{ padding: "24px" }}>
      <h3 className="card-title" style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <Star size={20} fill="gold" stroke="gold" />
        <span>Patient Ratings & Reviews</span>
      </h3>
      <p style={{ fontSize: "14px", color: "var(--color-slate)", marginBottom: "24px" }}>
        Here is what patients have written about your clinical consultations.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reviews.length === 0 ? (
          <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--color-slate)" }}>No reviews received yet.</p>
        ) : (
          reviews.map(rev => (
            <div key={rev.id} style={{ border: "1px solid var(--color-border)", padding: "20px", borderRadius: "12px", background: "rgba(37, 151, 208, 0.02)" }}>
              <div className="flex-between mb-8" style={{ flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <strong style={{ fontSize: "15px", color: "var(--color-obsidian)" }}>{rev.patientName}</strong>
                  <span style={{ fontSize: "12px", color: "var(--color-slate)", marginLeft: "8px" }}>{rev.date}</span>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < rev.rating ? "gold" : "none"} stroke={i < rev.rating ? "gold" : "var(--color-slate)"} />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "var(--color-charcoal)", fontStyle: "italic" }}>"{rev.comment}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
