import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`alert ${isSuccess ? "alert-success" : "alert-danger"} d-flex align-items-center justify-content-between shadow-lg`}
      style={{
        position: "fixed",
        top: "84px",
        right: "24px",
        zIndex: 9999,
        minWidth: "320px",
        maxWidth: "480px",
        borderRadius: "12px",
        border: "none",
        animation: "slideIn 0.3s ease-out"
      }}
      role="alert"
    >
      <div className="d-flex align-items-center gap-2">
        {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        <span style={{ fontSize: "14px", fontWeight: "500" }}>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close ms-2"
          onClick={onClose}
          aria-label="Close"
          style={{ fontSize: "10px" }}
        ></button>
      )}
    </div>
  );
}
