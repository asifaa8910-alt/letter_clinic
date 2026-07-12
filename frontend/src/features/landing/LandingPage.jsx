import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, FileText, CheckCircle, Headphones, Shield, Landmark, PhoneCall, HelpCircle, Search, Video, Activity } from "lucide-react";
import { mockService } from "../../services/mockService";

export default function LandingPage() {
  const user = mockService.getCurrentUser();
  let findDoctorsPath = "/register";
  if (user) {
    if (user.role === "patient") findDoctorsPath = "/patient?tab=marketplace";
    else if (user.role === "doctor") findDoctorsPath = "/doctor";
    else if (user.role === "admin") findDoctorsPath = "/admin";
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient" style={{ padding: "80px 0 100px" }}>
        <div className="container" style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px", flexWrap: "wrap" }}>
          
          {/* Hero Content Left */}
          <div style={{ flex: "1.2", minWidth: "320px", textAlign: "left" }}>
            <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", fontSize: "14px", marginBottom: "24px", fontWeight: 500 }}>
              <Sparkles size={16} fill="white" />
              <span>Telemedicine Guidelines 2020 Compliant</span>
            </div>
            
            <h1 className="hero-title" style={{ maxWidth: "680px", margin: "0 0 24px", textAlign: "left", lineHeight: "1.15" }}>
              Morning clinic<br />under open sky.
            </h1>
            
            <p className="hero-subtitle" style={{ maxWidth: "540px", fontSize: "17px", marginBottom: "40px", textAlign: "left", opacity: 0.9 }}>
              India's minimal clinical workspace. Assess symptoms using AI triage, consult verified practitioners, and download secure e-prescriptions.
            </p>
            
            <div className="flex-gap-24" style={{ display: "flex", justifyContent: "flex-start", gap: "16px" }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}>
                <span>Start Assessment</span>
                <ArrowRight size={18} />
              </Link>
              <Link to={findDoctorsPath} className="btn-hero-ghost" style={{ padding: "14px 32px", fontSize: "16px" }}>
                Find Doctors
              </Link>
            </div>
          </div>

          {/* Hero Icon Emblem Card Right */}
          <div style={{ flex: "0.8", minWidth: "320px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="card" style={{ 
              width: "100%", 
              maxWidth: "340px", 
              padding: "32px", 
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              animation: "float-non-translated 6s ease-in-out infinite"
            }}>
              <div style={{ 
                width: "140px", 
                height: "140px", 
                borderRadius: "50%", 
                background: "linear-gradient(135deg, #2597d0 0%, #155e82 100%)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 12px 30px rgba(37, 151, 208, 0.4)",
                marginBottom: "24px",
                position: "relative"
              }}>
                {/* Subtle glowing ring */}
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  left: "-8px",
                  right: "-8px",
                  bottom: "-8px",
                  borderRadius: "50%",
                  border: "2px dashed rgba(255,255,255,0.2)",
                  animation: "spin 20s linear infinite"
                }}></div>
                <Activity size={64} style={{ color: "white", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} />
              </div>
              
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#ffffff", letterSpacing: "-0.02em" }}>Letters Clinic</h3>
                <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.8)", marginTop: "6px", lineHeight: "1.4" }}>
                  Instant Symptom Assessment & Verified Practitioner Network
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "24px", width: "100%" }}>
                <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.08)", padding: "12px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <span style={{ display: "block", fontSize: "18px", fontWeight: "bold", color: "#ffffff" }}>50k+</span>
                  <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.7)" }}>Consultations</span>
                </div>
                <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.08)", padding: "12px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <span style={{ display: "block", fontSize: "18px", fontWeight: "bold", color: "#ffffff" }}>4.9 ★</span>
                  <span style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.7)" }}>Rating</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Metrics Bar */}
      <section style={{ padding: "50px 0", background: "transparent", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container grid-3" style={{ textAlign: "center", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px" }}>
          <div>
            <h3 style={{ fontSize: "36px", color: "var(--color-surgical-blue)", fontWeight: "bold", margin: 0 }}>50k+</h3>
            <p style={{ fontSize: "13px", color: "var(--color-slate)", marginTop: "4px" }}>Clinical consultations completed securely</p>
          </div>
          <div>
            <h3 style={{ fontSize: "36px", color: "var(--color-surgical-blue)", fontWeight: "bold", margin: 0 }}>4.9/5 ★</h3>
            <p style={{ fontSize: "13px", color: "var(--color-slate)", marginTop: "4px" }}>Average patient review and feedback score</p>
          </div>
          <div>
            <h3 style={{ fontSize: "36px", color: "var(--color-surgical-blue)", fontWeight: "bold", margin: 0 }}>100%</h3>
            <p style={{ fontSize: "13px", color: "var(--color-slate)", marginTop: "4px" }}>Compliance with 2020 Indian Telemedicine Guidelines</p>
          </div>
        </div>
      </section>

      {/* ABDM & ABHA Locker Section */}
      <section style={{ padding: "40px 0", background: "transparent", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container flex-between" style={{ flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "var(--color-sky-tint)", padding: "10px", borderRadius: "50%" }}>
              <Landmark size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            </div>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 600 }}>ABHA Integration Ready</h4>
              <p style={{ fontSize: "12px", color: "var(--color-slate)" }}>Link your 14-digit Ayushman Bharat Health Account to pull medical records instantly</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "var(--color-sky-tint)", padding: "10px", borderRadius: "50%" }}>
              <PhoneCall size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
            </div>
            <div>
              <h4 style={{ fontSize: "15px", fontWeight: 600 }}>National Health Helpline</h4>
              <p style={{ fontSize: "12px", color: "var(--color-slate)" }}>Call 104 or 1075 for official Indian government medical assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "80px 0", background: "transparent", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="badge" style={{ marginBottom: "16px" }}>Process Flow</div>
            <h2 style={{ fontSize: "var(--text-heading)", letterSpacing: "-0.04em", fontWeight: 600, color: "var(--color-obsidian)" }}>
              How Letters Clinic works.
            </h2>
          </div>

          <div className="grid-4" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div className="card" style={{ flex: 1, minWidth: "220px", padding: "24px", position: "relative" }}>
              <div style={{ position: "absolute", top: "16px", right: "20px", fontSize: "28px", fontWeight: "bold", opacity: 0.1 }}>01</div>
              <div style={{ background: "var(--color-sky-tint)", padding: "10px", borderRadius: "50%", display: "inline-flex", marginBottom: "16px" }}>
                <Sparkles size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
              </div>
              <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>1. AI Symptom Triage</h4>
              <p style={{ fontSize: "13px", color: "var(--color-slate)" }}>Input symptoms to evaluate severity and recommend the right specialty.</p>
            </div>

            <div className="card" style={{ flex: 1, minWidth: "220px", padding: "24px", position: "relative" }}>
              <div style={{ position: "absolute", top: "16px", right: "20px", fontSize: "28px", fontWeight: "bold", opacity: 0.1 }}>02</div>
              <div style={{ background: "var(--color-sky-tint)", padding: "10px", borderRadius: "50%", display: "inline-flex", marginBottom: "16px" }}>
                <Search size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
              </div>
              <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>2. Find Specialists</h4>
              <p style={{ fontSize: "13px", color: "var(--color-slate)" }}>Browse verified practitioner details, fees, slot schedules, and reviews.</p>
            </div>

            <div className="card" style={{ flex: 1, minWidth: "220px", padding: "24px", position: "relative" }}>
              <div style={{ position: "absolute", top: "16px", right: "20px", fontSize: "28px", fontWeight: "bold", opacity: 0.1 }}>03</div>
              <div style={{ background: "var(--color-sky-tint)", padding: "10px", borderRadius: "50%", display: "inline-flex", marginBottom: "16px" }}>
                <Video size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
              </div>
              <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>3. Video Consultation</h4>
              <p style={{ fontSize: "13px", color: "var(--color-slate)" }}>Join an encrypted live consultation call directly in your portal.</p>
            </div>

            <div className="card" style={{ flex: 1, minWidth: "220px", padding: "24px", position: "relative" }}>
              <div style={{ position: "absolute", top: "16px", right: "20px", fontSize: "28px", fontWeight: "bold", opacity: 0.1 }}>04</div>
              <div style={{ background: "var(--color-sky-tint)", padding: "10px", borderRadius: "50%", display: "inline-flex", marginBottom: "16px" }}>
                <FileText size={20} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
              </div>
              <h4 style={{ fontSize: "16px", marginBottom: "8px" }}>4. Secure Rx Log</h4>
              <p style={{ fontSize: "13px", color: "var(--color-slate)" }}>Receive, inspect guidance details, and print signed digital prescriptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Canvas */}
      <section id="features" style={{ padding: "100px 0", background: "transparent" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <div className="badge" style={{ marginBottom: "16px" }}>Core Modules</div>
            <h2 style={{ fontSize: "var(--text-heading)", letterSpacing: "-0.04em", fontWeight: 600, color: "var(--color-obsidian)" }}>
              Save hours of clinical paperwork.
            </h2>
          </div>

          <div className="grid-2">
            {/* Feature Card 1: Letters / AI Symptom Triage */}
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div className="badge">
                    <FileText size={14} style={{ marginRight: "4px", color: "var(--color-surgical-blue)" }} />
                    <span>AI Symptom Triage</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>01 / TRIAGE</span>
                </div>
                <h3 style={{ fontSize: "var(--text-heading-sm)", marginBottom: "16px", letterSpacing: "-0.03em" }}>
                  Intelligent symptom assessment.
                </h3>
                <p style={{ marginBottom: "32px", color: "var(--color-charcoal)", fontSize: "15px" }}>
                  Input your age, gender, and clinical symptoms. Our rule-based AI engine analyzes severity, estimates possible conditions, and recommends the correct Indian medical specialty.
                </p>
              </div>

              {/* Before/After stacked card illustration */}
              <div style={{ position: "relative", height: "160px", background: "var(--color-cloud-gray)", borderRadius: "12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Before handwritten card */}
                <div style={{ position: "absolute", width: "160px", background: "var(--color-paper-white)", padding: "12px", borderRadius: "8px", boxShadow: "var(--shadow-subtle)", transform: "rotate(-6deg) translateX(-40px)", border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "8px", color: "red" }}>✕ PRE-TRIAGE</span>
                  </div>
                  <p className="handwriting" style={{ fontSize: "15px", opacity: 0.8 }}>
                    Patient has high fever, dry cough, severe fatigue since 3 days...
                  </p>
                </div>
                {/* After typed card */}
                <div style={{ position: "absolute", width: "180px", background: "var(--color-paper-white)", padding: "14px", borderRadius: "8px", boxShadow: "var(--shadow-xl)", transform: "rotate(4deg) translateX(40px)", border: "1px solid var(--color-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "8px", color: "var(--color-surgical-blue)", fontWeight: "bold" }}>✓ AI SUGGESTION</span>
                    <span style={{ fontSize: "8px", color: "white", background: "var(--color-obsidian)", padding: "2px 6px", borderRadius: "4px" }}>Pediatrics</span>
                  </div>
                  <p style={{ fontSize: "10px", color: "var(--color-obsidian)", fontWeight: 500 }}>
                    Urgency: Medium
                  </p>
                  <p style={{ fontSize: "9px", color: "var(--color-charcoal)" }}>
                    Confidence Score: 78%
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Card 2: Doctor Marketplace */}
            <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                  <div className="badge">
                    <Headphones size={14} style={{ marginRight: "4px", color: "var(--color-surgical-blue)" }} />
                    <span>Doctor Marketplace</span>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--color-slate)" }}>02 / CONSULT</span>
                </div>
                <h3 style={{ fontSize: "var(--text-heading-sm)", marginBottom: "16px", letterSpacing: "-0.03em" }}>
                  Find verified doctors.
                </h3>
                <p style={{ marginBottom: "32px", color: "var(--color-charcoal)", fontSize: "15px" }}>
                  Search by specialty, hospital name, consult fee (in ₹), and ratings. Book instant video consultations, complete with slot management and digital prescription logs.
                </p>
              </div>

              {/* Waveform audio/video illustration */}
              <div style={{ background: "var(--color-cloud-gray)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", color: "var(--color-obsidian)" }}>Consultation Recording</span>
                  <span style={{ fontSize: "10px", color: "var(--color-surgical-blue)", fontWeight: "bold" }}>02:45 / 05:00</span>
                </div>
                <div className="waveform-container" style={{ margin: 0, padding: "8px 12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-surgical-blue)" }}></div>
                  <div className="waveform-bars">
                    {[30, 70, 45, 90, 60, 30, 80, 50, 40, 75, 90, 45, 20, 60, 85, 30, 40, 75, 20].map((h, i) => (
                      <div
                        key={i}
                        className={`waveform-bar ${i < 13 ? "active" : ""}`}
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section style={{ padding: "80px 0 100px", background: "transparent" }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: "center" }}>
            <div style={{ padding: "20px" }}>
              <Shield size={36} style={{ color: "var(--color-surgical-blue)", marginBottom: "16px" }} />
              <h4 style={{ marginBottom: "8px" }}>Secure MCI/NMC Verification</h4>
              <p style={{ fontSize: "14px" }}>Doctors must upload credentials which are verified manually by administrators before getting verified badge.</p>
            </div>
            <div style={{ padding: "20px" }}>
              <CheckCircle size={36} style={{ color: "var(--color-surgical-blue)", marginBottom: "16px" }} />
              <h4 style={{ marginBottom: "8px" }}>Seamless Booking</h4>
              <p style={{ fontSize: "14px" }}>Manage, reschedule, or cancel bookings in real-time. Fully integrated availability slots system.</p>
            </div>
            <div style={{ padding: "20px" }}>
              <FileText size={36} style={{ color: "var(--color-surgical-blue)", marginBottom: "16px" }} />
              <h4 style={{ marginBottom: "8px" }}>E-Prescriptions (Form 8A)</h4>
              <p style={{ fontSize: "14px" }}>Get secure, digital prescriptions with detailed medicine details, dosage, instructions, and duration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section style={{ padding: "80px 0", background: "transparent", borderTop: "1px solid var(--color-border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="badge" style={{ marginBottom: "16px" }}>Information</div>
            <h2 style={{ fontSize: "var(--text-heading-sm)", letterSpacing: "-0.03em" }}>Frequently Asked Questions</h2>
          </div>
          <div className="grid-2" style={{ gap: "24px" }}>
            <div className="card" style={{ padding: "24px" }}>
              <h4 style={{ fontSize: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <HelpCircle size={16} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
                <span>Are e-prescriptions legal in India?</span>
              </h4>
              <p style={{ fontSize: "13px" }}>
                Yes. Under the Telemedicine Practice Guidelines issued in March 2020 by the Ministry of Health and Family Welfare (MoHFW), registered medical practitioners are authorized to issue digital prescriptions online.
              </p>
            </div>
            <div className="card" style={{ padding: "24px" }}>
              <h4 style={{ fontSize: "16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <HelpCircle size={16} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
                <span>What details are needed for doctor registration?</span>
              </h4>
              <p style={{ fontSize: "13px" }}>
                Doctors must provide their Medical Council of India (MCI) or State Medical Council (SMC) registration number and upload their MBBS/MD degree certificate for verification.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
