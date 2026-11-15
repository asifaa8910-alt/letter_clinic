import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Guard
 * @param {string[]} allowedRoles - List of authorized roles (e.g. ['patient'], ['doctor'], ['admin'])
 * @param {React.ReactNode} children - Component to render if authorized
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading clinical session...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login remembering the intended route
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is not allowed, redirect to their role's dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === "patient") return <Navigate to="/patient" replace />;
    if (user.role === "doctor") return <Navigate to="/doctor" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

