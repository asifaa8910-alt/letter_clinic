import React from "react";

export default function LoadingSpinner({ message = "Loading clinical workspace...", size = "normal" }) {
  const isSmall = size === "small";

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4" style={{ minHeight: isSmall ? "auto" : "200px" }}>
      <div
        className="spinner-border text-primary"
        role="status"
        style={{ width: isSmall ? "1.5rem" : "2.5rem", height: isSmall ? "1.5rem" : "2.5rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && (
        <p className="text-muted mt-3 mb-0" style={{ fontSize: isSmall ? "12px" : "14px" }}>
          {message}
        </p>
      )}
    </div>
  );
}

