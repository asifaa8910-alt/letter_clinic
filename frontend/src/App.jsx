import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./features/landing/LandingPage";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import PatientDashboard from "./features/patient/PatientDashboard";
import DoctorDashboard from "./features/doctor/DoctorDashboard";
import AdminDashboard from "./features/admin/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import { apiService } from "./services/apiService";
import { MessageSquare, Send, X, Sparkles } from "lucide-react";

function AppContent() {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am Letters AI Medical Assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendChat = (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = apiService.getChatbotResponse(text);
      const aiMsg = {
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      <Header />
      <main style={{ minHeight: "calc(100vh - 140px)" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={`/${user.role}`} replace /> : <Register />}
          />

          {/* Protected Patient Routes */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-top py-4 bg-light text-center text-secondary small">
        <div className="container">
          <p className="mb-0">© 2026 Letters Clinic. Production MERN Architecture with MongoDB Atlas.</p>
        </div>
      </footer>

      {/* Floating AI Chatbot Widget */}
      <div>
        {/* Toggle Bubble */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="chatbot-bubble shadow-lg"
          title="Letters AI Clinical Assistant"
          aria-label="Open AI Assistant"
        >
          {showChat ? <X size={26} /> : <MessageSquare size={26} />}
        </button>

        {/* Chat Widget Panel */}
        {showChat && (
          <div className="chatbot-panel shadow-lg rounded-4 overflow-hidden border">
            {/* Header */}
            <div className="chat-header d-flex justify-content-between align-items-center p-3 text-white">
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={16} />
                <span className="fw-bold small">Letters AI Assistant</span>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="btn btn-sm btn-link text-white p-0"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages p-3 d-flex flex-column gap-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {chatMessages.map((msg, index) => (
                <div key={index} className={msg.sender === "ai" ? "chat-bubble-ai" : "chat-bubble-user"}>
                  <p className="m-0" style={{ fontSize: "13px" }}>{msg.text}</p>
                  <span style={{ display: "block", fontSize: "9px", opacity: 0.6, marginTop: "4px", textAlign: "right" }}>
                    {msg.timestamp}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble-ai fst-italic opacity-75 small">
                  Letters AI is analyzing...
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="chat-suggestions p-2 d-flex gap-1 overflow-x-auto border-top bg-light">
              {["AI Triage Rules", "Licensing Policy", "Book Appointment", "Consultation Fees"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendChat(chip)}
                  className="btn btn-outline-secondary btn-sm py-0 px-2 rounded-pill"
                  style={{ fontSize: "11px", whiteSpace: "nowrap" }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="chat-input-area p-2 d-flex gap-2 border-top bg-white"
            >
              <input
                type="text"
                className="form-control form-control-sm rounded-pill"
                placeholder="Ask clinical queries..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
