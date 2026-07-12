import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, User, Mail, Lock } from "lucide-react";
import { mockService } from "../../services/mockService";

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const newUser = await mockService.register(name, email, password, role);
      onRegisterSuccess(newUser);
      if (role === "patient") navigate("/patient");
      else if (role === "doctor") navigate("/doctor");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Decorative blurred glow spheres */}
      <div className="auth-page-glow-1"></div>
      <div className="auth-page-glow-2"></div>

      {/* Redesigned Glass Card */}
      <div className="glass-auth-card">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", padding: "12px", background: "var(--color-sky-tint)", borderRadius: "50%", marginBottom: "16px" }}>
            <Activity size={28} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
          </div>
          <h3 style={{ fontSize: "26px", letterSpacing: "-0.02em", color: "var(--color-ink)", fontWeight: "bold" }}>Create Account</h3>
          <p style={{ fontSize: "14px", color: "var(--color-slate)", marginTop: "4px" }}>Start using Letters minimal clinical portal</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Full Name</label>
            <div style={{ position: "relative" }}>
              <User size={16} style={{ position: "absolute", left: "14px", top: "14px", color: "var(--color-slate)" }} />
              <input
                type="text"
                className="input"
                style={{ width: "100%", paddingLeft: "42px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

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
                placeholder="e.g. name@example.com"
              />
            </div>
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">Secure Password</label>
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

          <div className="input-group" style={{ margin: 0 }}>
            <label className="label">I am registering as a:</label>
            <select
              className="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="patient">Patient (Consult & assess)</option>
              <option value="doctor">Medical Doctor (Consult & prescribe)</option>
            </select>
            {role === "doctor" && (
              <p style={{ fontSize: "11px", color: "var(--color-slate)", marginTop: "6px", lineHeight: "1.4" }}>
                * Doctor profiles undergo administrative credentials review before public search listing.
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px", marginTop: "8px", borderRadius: "10px" }}>
            Register Account
          </button>
        </form>

        <p style={{ fontSize: "13px", textAlign: "center", marginTop: "24px", color: "var(--color-slate)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--color-surgical-blue)", fontWeight: 600, textDecoration: "none" }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
}
