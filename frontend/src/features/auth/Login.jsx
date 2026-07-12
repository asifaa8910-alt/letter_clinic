import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, Mail, Lock } from "lucide-react";
import { mockService } from "../../services/mockService";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("patient@clinic.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await mockService.login(email, password);
      onLoginSuccess(user);
      if (user.role === "patient") navigate("/patient");
      else if (user.role === "doctor") navigate("/doctor");
      else if (user.role === "admin") navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  const prefill = (role) => {
    if (role === "patient") {
      setEmail("patient@clinic.com");
      setPassword("password");
    } else if (role === "doctor") {
      setEmail("doctor@clinic.com");
      setPassword("password");
    } else if (role === "admin") {
      setEmail("admin@clinic.com");
      setPassword("password");
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Decorative blurred glow spheres */}
      <div className="auth-page-glow-1"></div>
      <div className="auth-page-glow-2"></div>

      {/* Redesigned Glass Card */}
      <div className="glass-auth-card">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-sky-tint)", borderRadius: "50%", marginBottom: "16px" }}>
            <Activity size={28} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
          </div>
          <h3 style={{ fontSize: "26px", letterSpacing: "-0.02em", color: "var(--color-ink)", fontWeight: "bold" }}>Welcome Back</h3>
          <p style={{ fontSize: "14px", color: "var(--color-slate)", marginTop: "4px" }}>Access your clinical workspace dashboard</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--color-slate)" }} />
              <input
                type="email"
                className="input"
                style={{ width: "100%", paddingLeft: "42px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--color-slate)" }} />
              <input
                type="password"
                className="input"
                style={{ width: "100%", paddingLeft: "42px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", marginTop: "8px", borderRadius: "10px" }}>
            Login to Dashboard
          </button>
        </form>

        <div style={{ marginTop: "24px", borderTop: "1px solid var(--color-border)", paddingTop: "20px" }}>
          <p style={{ fontSize: "11px", textAlign: "center", marginBottom: "12px", color: "var(--color-slate)", fontWeight: "600", letterSpacing: "0.02em" }}>QUICK PRE-FILL ACCOUNTS FOR REVIEW</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            <button onClick={() => prefill("patient")} className="btn" style={{ padding: "8px", fontSize: "11px", background: "var(--color-sky-tint)", color: "var(--color-surgical-blue)" }}>
              Patient
            </button>
            <button onClick={() => prefill("doctor")} className="btn" style={{ padding: "8px", fontSize: "11px", background: "var(--color-sky-tint)", color: "var(--color-surgical-blue)" }}>
              Doctor
            </button>
            <button onClick={() => prefill("admin")} className="btn" style={{ padding: "8px", fontSize: "11px", background: "var(--color-sky-tint)", color: "var(--color-surgical-blue)" }}>
              Admin
            </button>
          </div>
        </div>

        <p style={{ fontSize: "13px", textAlign: "center", marginTop: "24px", color: "var(--color-slate)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--color-surgical-blue)", fontWeight: 600, textDecoration: "none" }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
