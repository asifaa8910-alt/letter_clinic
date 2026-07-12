import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, LogOut, Sun, Moon, Bell } from "lucide-react";
import { mockService } from "../services/mockService";

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      const fetchNotifs = () => {
        mockService.getNotifications(user.id)
          .then(data => setNotifications(data))
          .catch(err => console.error(err));
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 3000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    await mockService.logout();
    onLogout();
    navigate("/");
  };

  const handleMarkAsRead = async (id) => {
    await mockService.markNotificationAsRead(id);
    const data = await mockService.getNotifications(user.id);
    setNotifications(data);
  };

  const handleMarkAllAsRead = async () => {
    await mockService.markAllNotificationsAsRead(user.id);
    const data = await mockService.getNotifications(user.id);
    setNotifications(data);
  };

  const handleClearAll = async () => {
    await mockService.clearNotifications(user.id);
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="app-header">
      <div className="container header-container">
        <Link to="/" className="logo-container">
          <Activity size={22} className="text-surgical-blue" style={{ color: "var(--color-surgical-blue)" }} />
          <span>Letters Clinic</span>
          <span className="logo-dot"></span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {user && user.role === "patient" && (
            <>
              <Link to="/patient" className="nav-link">Patient Dashboard</Link>
              <Link to="/patient/triage" className="nav-link">AI Symptom Triage</Link>
              <Link to="/patient/marketplace" className="nav-link">Find Doctors</Link>
            </>
          )}
          {user && user.role === "doctor" && (
            <>
              <Link to="/doctor" className="nav-link">Doctor Portal</Link>
              <Link to="/doctor/slots" className="nav-link">Availability Slots</Link>
            </>
          )}
          {user && user.role === "admin" && (
            <>
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            </>
          )}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {user ? (
            <>
              {/* Notifications bell dropdown */}
              <div style={{ position: "relative" }}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="theme-toggle-btn"
                  style={{ position: "relative", color: "var(--color-obsidian)" }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{ 
                      position: "absolute", 
                      top: "-2px", 
                      right: "-2px", 
                      background: "#ef4444", 
                      color: "white", 
                      borderRadius: "50%", 
                      width: "16px", 
                      height: "16px", 
                      fontSize: "10px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontWeight: "bold"
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div style={{ 
                    position: "absolute", 
                    top: "40px", 
                    right: 0, 
                    width: "320px", 
                    background: "var(--color-paper-white)", 
                    border: "1px solid var(--color-border)", 
                    borderRadius: "12px", 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
                    zIndex: 1000, 
                    padding: "16px" 
                  }}>
                    <div className="flex-between" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "10px", marginBottom: "10px" }}>
                      <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--color-obsidian)" }}>Notifications</span>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={handleMarkAllAsRead} className="btn-text" style={{ fontSize: "11px", color: "var(--color-surgical-blue)", border: "none", background: "none", cursor: "pointer", padding: 0 }}>Read All</button>
                        <button onClick={handleClearAll} className="btn-text" style={{ fontSize: "11px", color: "#ef4444", border: "none", background: "none", cursor: "pointer", padding: 0 }}>Clear</button>
                      </div>
                    </div>

                    <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: "12px", color: "var(--color-slate)", textAlign: "center", padding: "16px 0", fontStyle: "italic" }}>No notifications.</p>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => { handleMarkAsRead(notif.id); setShowDropdown(false); }}
                            style={{ 
                              padding: "10px", 
                              borderRadius: "8px", 
                              background: notif.read ? "transparent" : "rgba(37, 151, 208, 0.05)", 
                              border: "1px solid var(--color-border)",
                              cursor: "pointer",
                              transition: "background 0.2s"
                            }}
                          >
                            <div className="flex-between mb-4">
                              <span style={{ fontSize: "12px", fontWeight: "bold", color: "var(--color-obsidian)" }}>{notif.title}</span>
                              {!notif.read && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-surgical-blue)" }}></span>}
                            </div>
                            <p style={{ fontSize: "11px", color: "var(--color-charcoal)", margin: "4px 0" }}>{notif.message}</p>
                            <span style={{ fontSize: "9px", color: "var(--color-slate)" }}>{notif.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="badge" style={{ textTransform: "none", border: "1px solid var(--color-border)" }}>
                <span style={{ fontWeight: 600, color: "var(--color-obsidian)" }}>{user.name}</span>
                <span style={{ fontSize: "10px", color: "var(--color-slate)", marginLeft: "4px" }}>({user.role})</span>
              </div>
              <button onClick={handleLogout} className="btn btn-text" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "6px" }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ padding: "8px 20px" }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "8px 20px" }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
