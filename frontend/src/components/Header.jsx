import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, LogOut, Sun, Moon, Bell, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/apiService";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      const fetchNotifs = () => {
        apiService
          .getNotifications()
          .then((data) => setNotifications(data || []))
          .catch((err) => console.error("Notification sync error:", err.message));
      };

      fetchNotifs();
      // Sensible polling interval: 20 seconds
      const interval = setInterval(fetchNotifs, 20000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleMarkAsRead = async (id) => {
    await apiService.markNotificationAsRead(id);
    const data = await apiService.getNotifications();
    setNotifications(data || []);
  };

  const handleMarkAllAsRead = async () => {
    await apiService.markAllNotificationsAsRead();
    const data = await apiService.getNotifications();
    setNotifications(data || []);
  };

  const handleClearAll = async () => {
    await apiService.clearNotifications();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="app-header sticky-top bg-white border-bottom shadow-sm">
      <div className="container header-container d-flex justify-content-between align-items-center py-2">
        {/* Brand / Logo */}
        <Link to="/" className="logo-container text-decoration-none d-flex align-items-center gap-2">
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              background: "var(--color-surgical-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
          >
            <Activity size={20} />
          </div>
          <span className="fw-bold fs-5 text-dark">Letters Clinic</span>
          <span className="logo-dot"></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links d-none d-md-flex align-items-center gap-3">
          <Link to="/" className="nav-link text-decoration-none">
            Home
          </Link>
          {user && user.role === "patient" && (
            <>
              <Link to="/patient" className="nav-link text-decoration-none">
                Dashboard
              </Link>
              <Link to="/patient/triage" className="nav-link text-decoration-none">
                AI Triage
              </Link>
              <Link to="/patient/marketplace" className="nav-link text-decoration-none">
                Find Doctors
              </Link>
            </>
          )}
          {user && user.role === "doctor" && (
            <>
              <Link to="/doctor" className="nav-link text-decoration-none">
                Doctor Portal
              </Link>
              <Link to="/doctor/slots" className="nav-link text-decoration-none">
                Slots Management
              </Link>
            </>
          )}
          {user && user.role === "admin" && (
            <>
              <Link to="/admin" className="nav-link text-decoration-none">
                Admin Panel
              </Link>
            </>
          )}
        </nav>

        {/* Right side controls */}
        <div className="d-flex align-items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {user ? (
            <>
              {/* Notifications Dropdown */}
              <div className="position-relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="btn btn-outline-secondary btn-sm rounded-circle p-2 position-relative"
                  title="Notifications"
                >
                  <Bell size={16} />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "10px" }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-3"
                    style={{ width: "320px", zIndex: 1050 }}
                  >
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                      <span className="fw-bold small text-dark">Notifications ({notifications.length})</span>
                      <div className="d-flex gap-2">
                        <button
                          onClick={handleMarkAllAsRead}
                          className="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                          style={{ fontSize: "11px" }}
                        >
                          Mark all read
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="btn btn-link btn-sm p-0 text-danger text-decoration-none"
                          style={{ fontSize: "11px" }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div style={{ maxHeight: "240px", overflowY: "auto" }} className="d-flex flex-column gap-2">
                      {notifications.length === 0 ? (
                        <p className="small text-muted text-center py-3 mb-0">No notifications.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              handleMarkAsRead(notif.id);
                              setShowDropdown(false);
                            }}
                            className={`p-2 rounded border small ${notif.read ? "bg-white" : "bg-light border-primary-subtle"}`}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <strong className="text-dark" style={{ fontSize: "12px" }}>
                                {notif.title}
                              </strong>
                              {!notif.read && (
                                <span className="badge bg-primary" style={{ width: "6px", height: "6px", padding: 0 }}></span>
                              )}
                            </div>
                            <p className="text-secondary mb-1" style={{ fontSize: "11px" }}>
                              {notif.message}
                            </p>
                            <span className="text-muted" style={{ fontSize: "10px" }}>
                              {notif.timestamp}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User badge */}
              <div className="d-none d-sm-flex align-items-center gap-1 bg-light px-3 py-1 rounded-pill border">
                <span className="fw-semibold small text-dark">{user.name}</span>
                <span className="badge bg-secondary-subtle text-secondary text-capitalize" style={{ fontSize: "10px" }}>
                  {user.role}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm rounded-pill d-flex align-items-center gap-1 px-3"
              >
                <LogOut size={14} />
                <span className="d-none d-sm-inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm rounded-pill px-3">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline-secondary btn-sm d-md-none p-2"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="d-md-none bg-white border-top px-3 py-3">
          <nav className="d-flex flex-column gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-decoration-none text-dark fw-medium"
            >
              Home
            </Link>
            {user && user.role === "patient" && (
              <>
                <Link
                  to="/patient"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-decoration-none text-dark fw-medium"
                >
                  Patient Dashboard
                </Link>
                <Link
                  to="/patient/triage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-decoration-none text-dark fw-medium"
                >
                  AI Symptom Triage
                </Link>
                <Link
                  to="/patient/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-decoration-none text-dark fw-medium"
                >
                  Find Doctors
                </Link>
              </>
            )}
            {user && user.role === "doctor" && (
              <>
                <Link
                  to="/doctor"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-decoration-none text-dark fw-medium"
                >
                  Doctor Portal
                </Link>
                <Link
                  to="/doctor/slots"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-decoration-none text-dark fw-medium"
                >
                  Availability Slots
                </Link>
              </>
            )}
            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-decoration-none text-dark fw-medium"
                >
                  Admin Panel
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
