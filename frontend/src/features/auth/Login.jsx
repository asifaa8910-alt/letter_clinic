import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Activity, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("patient@clinic.com");
  const [password, setPassword] = useState("password");
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errors = {};
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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(email, password);
      const destination = location.state?.from?.pathname || `/${user.role}`;
      navigate(destination, { replace: true });
    } catch {
      // Error is stored in authError via context
    } finally {
      setLoading(false);
    }
  };

  const prefill = (role) => {
    setAuthError("");
    setValidationErrors({});
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
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5" style={{ maxWidth: "480px", width: "100%" }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3"
            style={{ background: "rgba(37, 151, 208, 0.12)", color: "var(--color-surgical-blue)" }}
          >
            <Activity size={32} />
          </div>
          <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.02em" }}>Welcome Back</h2>
          <p className="text-secondary small">Access your verified clinical workspace</p>
        </div>

        {authError && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 small mb-4" role="alert">
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
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

          <div className="mb-4">
            <label className="form-label small fw-semibold text-dark">Password</label>
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Login to Workspace</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Pre-fill helper for test reviewers */}
        <div className="border-top pt-4 mt-4 text-center">
          <p className="text-uppercase text-secondary fw-bold" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
            Quick Pre-Fill for Evaluation
          </p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button type="button" onClick={() => prefill("patient")} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
              Patient Demo
            </button>
            <button type="button" onClick={() => prefill("doctor")} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
              Doctor Demo
            </button>
            <button type="button" onClick={() => prefill("admin")} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
              Admin Demo
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <small className="text-secondary">
            Don't have an account yet?{" "}
            <Link to="/register" className="fw-semibold text-primary text-decoration-none">
              Register now
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
