import React from "react";
import { ArrowRight } from "lucide-react";

export default function PatientTriage({
  age,
  setAge,
  gender,
  setGender,
  symptoms,
  setSymptoms,
  duration,
  setDuration,
  severity,
  setSeverity,
  triageReport,
  handleTriageSubmit,
  setActiveTab,
  filterDocs
}) {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div className="card">
        <h2 style={{ fontSize: "24px", letterSpacing: "-0.03em", marginBottom: "8px" }}>AI Symptom Triage Assessment</h2>
        <p style={{ fontSize: "14px", color: "var(--color-charcoal)", marginBottom: "24px" }}>Fill details accurately. The system will process symptoms and recommend specialist specialties.</p>

        <form onSubmit={handleTriageSubmit}>
          <div className="grid-2">
            <div className="input-group">
              <label className="label">Age</label>
              <input type="number" className="input" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="label">Gender</label>
              <select className="select" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label className="label">Symptom Duration</label>
              <input type="text" className="input" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 3 days" required />
            </div>
            <div className="input-group">
              <label className="label">Severity Level</label>
              <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                <option value="Low">Low (Mild discomfort)</option>
                <option value="Medium">Medium (Affects daily tasks)</option>
                <option value="Severe">Severe (Urgent attention needed)</option>
              </select>
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: "28px" }}>
            <label className="label">Describe Symptoms</label>
            <textarea
              className="textarea"
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. I have mild chest tightness, coughing when lying down, palpitations..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px" }}>
            Analyze Symptoms with AI
          </button>
        </form>
      </div>

      {triageReport && (
        <div className="card" style={{ marginTop: "32px", border: "1px solid var(--color-sky-tint)", background: "rgba(215, 230, 245, 0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span className="badge">AI ANALYSIS RESULT</span>
            <span style={{ fontSize: "12px", color: "var(--color-charcoal)" }}>Confidence: {triageReport.confidenceScore}</span>
          </div>
          <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
            Recommended Specialist: <span style={{ color: "var(--color-surgical-blue)" }}>{triageReport.suggestedSpecialist}</span>
          </h3>

          <div style={{ display: "flex", gap: "24px", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "var(--color-slate)", display: "block" }}>Urgency Level</span>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: triageReport.urgencyLevel === "High" ? "#b91c1c" : "var(--color-obsidian)" }}>{triageReport.urgencyLevel}</span>
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "var(--color-slate)", display: "block" }}>Suggested Conditions</span>
              <span style={{ fontSize: "14px" }}>{triageReport.possibleConditions.join(", ")}</span>
            </div>
          </div>

          <button 
            onClick={() => { 
              setActiveTab("marketplace"); 
              filterDocs("", triageReport.suggestedSpecialist, ""); 
            }} 
            className="btn btn-primary" 
            style={{ width: "100%", display: "flex", justifyContent: "center", gap: "8px" }}
          >
            <span>Search {triageReport.suggestedSpecialist} Doctors</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
