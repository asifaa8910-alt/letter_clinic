import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, User, Mail, Lock, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, authError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!["patient", "doctor"].includes(role)) {
      errors.role = "Please select a valid role";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const newUser = await register(name.trim(), email.trim(), password, role);
      if (newUser.role === "patient") navigate("/patient");
      else if (newUser.role === "doctor") navigate("/doctor");
      else navigate("/");
    } catch {
      // Error surfaced via authError
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: "520px", width: "100%" }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3"
            style={{ background: "rgba(37, 151, 208, 0.12)", color: "var(--color-surgical-blue)" }}
          >
            <Activity size={32} />
          </div>
          <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.02em" }}>Create Your Account</h2>
          <p className="text-secondary small">Join Letters clinical telemedicine ecosystem</p>
        </div>

        {authError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 small mb-4" role="alert">
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleRegister} noValidate>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Full Name</label>
            <div className="position-relative">
              <User size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
              <input
                type="text"
                className={`form-control ps-5 py-2 ${validationErrors.name ? "is-invalid" : ""}`}
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (validationErrors.name) setValidationErrors((prev) => ({ ...prev, name: "" }));
                }}
                required
              />
              {validationErrors.name && (
                <div className="invalid-feedback small">{validationErrors.name}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Email Address</label>
            <div className="position-relative">
              <Mail size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
              <input
                type="email"
                className={`form-control ps-5 py-2 ${validationErrors.email ? "is-invalid" : ""}`}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors((prev) => ({ ...prev, email: "" }));
                }}
                required
              />
              {validationErrors.email && (
                <div className="invalid-feedback small">{validationErrors.email}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Password (min 6 characters)</label>
            <div className="position-relative">
              <Lock size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
              <input
                type="password"
                className={`form-control ps-5 py-2 ${validationErrors.password ? "is-invalid" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors((prev) => ({ ...prev, password: "" }));
                }}
                required
              />
              {validationErrors.password && (
                <div className="invalid-feedback small">{validationErrors.password}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-dark">Role Selection</label>
            <div className="position-relative">
              <ShieldCheck size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
              <select
                className="form-select ps-5 py-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="patient">Patient (Assess Symptoms & Book Consultations)</option>
                <option value="doctor">Medical Doctor (Consult & Issue Prescriptions)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Creating profile...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 border-top pt-3">
          <small className="text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="fw-semibold text-primary text-decoration-none">
              Sign In
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
