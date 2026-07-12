import React from "react";

export default function AdminLogs({ logs, handleClearLogs }) {
  return (
    <div className="card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--color-obsidian)", fontWeight: 600 }}>System Logs Database</h3>
        <button 
          onClick={handleClearLogs} 
          className="btn btn-ghost" 
          style={{ padding: "10px 18px", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
          disabled={logs.length === 0}
        >
          Clear Logs History
        </button>
      </div>

      <div style={{ maxHeight: "550px", overflowY: "auto", border: "1px solid var(--color-border)", borderRadius: "10px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "var(--color-cloud-gray)", borderBottom: "1px solid var(--color-border)", position: "sticky", top: 0 }}>
              <th style={{ padding: "12px 16px", color: "var(--color-obsidian)", fontWeight: "600", width: "180px" }}>Timestamp</th>
              <th style={{ padding: "12px 16px", color: "var(--color-obsidian)", fontWeight: "600", width: "160px" }}>Action Event</th>
              <th style={{ padding: "12px 16px", color: "var(--color-obsidian)", fontWeight: "600" }}>Details / System Context</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: "30px 16px", textAlign: "center", color: "var(--color-slate)", fontStyle: "italic" }}>No system log entries registered yet.</td>
              </tr>
            ) : (
              logs.map(log => {
                let bColor = "var(--color-obsidian)";
                let bBg = "rgba(0,0,0,0.03)";
                if (log.action.includes("Created")) { bColor = "#10b981"; bBg = "rgba(16,185,129,0.05)"; }
                else if (log.action.includes("Updated")) { bColor = "var(--color-surgical-blue)"; bBg = "rgba(37,151,208,0.05)"; }
                else if (log.action.includes("Deleted")) { bColor = "#ef4444"; bBg = "rgba(239,68,68,0.05)"; }
                else if (log.action.includes("Login")) { bColor = "#8b5cf6"; bBg = "rgba(139,92,246,0.05)"; }
                else if (log.action.includes("Verification")) { bColor = "#f59e0b"; bBg = "rgba(245,158,11,0.05)"; }

                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "12px 16px", color: "var(--color-slate)" }}>{log.timestamp}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="badge" style={{ borderColor: bColor, color: bColor, background: bBg, fontSize: "11px", fontWeight: "bold" }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--color-obsidian)", fontFamily: "monospace" }}>{log.details}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
