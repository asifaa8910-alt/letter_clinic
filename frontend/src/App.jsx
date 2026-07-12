import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./features/landing/LandingPage";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import PatientDashboard from "./features/patient/PatientDashboard";
import DoctorDashboard from "./features/doctor/DoctorDashboard";
import AdminDashboard from "./features/admin/AdminDashboard";
import { initMockDatabase, mockService } from "./services/mockService";
import { MessageSquare, Send, X, Sparkles } from "lucide-react";

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am Letters AI Medical Assistant. How can I help you today?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    initMockDatabase();
    const user = mockService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleSendChat = (textToSend) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = mockService.getChatbotResponse(text);
      const aiMsg = {
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleProfileUpdate = () => {
    const user = mockService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <>
      <Header user={currentUser} onLogout={handleLogout} />
      <main style={{ minHeight: "calc(100vh - 72px)" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />
          
          {/* Patient Routes */}
          <Route 
            path="/patient/*" 
            element={
              currentUser && currentUser.role === "patient" ? (
                <PatientDashboard user={currentUser} onProfileUpdate={handleProfileUpdate} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Doctor Routes */}
          <Route 
            path="/doctor/*" 
            element={
              currentUser && currentUser.role === "doctor" ? (
                <DoctorDashboard user={currentUser} onProfileUpdate={handleProfileUpdate} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              currentUser && currentUser.role === "admin" ? (
                <AdminDashboard user={currentUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <footer style={{ borderTop: "1px solid var(--color-border)", padding: "32px 0", background: "transparent", textAlign: "center", fontSize: "13px", color: "var(--color-slate)" }}>
        <div className="container">
          <p>© 2026 Letters Clinic. Localhost MERN System Demonstration.</p>
        </div>
      </footer>

      {/* Floating AI Chatbot Widget */}
      <div>
        {/* Toggle Bubble */}
        <button 
          onClick={() => setShowChat(!showChat)} 
          className="chatbot-bubble"
          title="AI Medical Assistant"
        >
          {showChat ? <X size={28} /> : <MessageSquare size={28} />}
        </button>

        {/* Chat Widget Panel */}
        {showChat && (
          <div className="chatbot-panel">
            {/* Header */}
            <div className="chat-header">
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} fill="white" style={{ color: "white" }} />
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>Letters AI Assistant</span>
              </div>
              <button 
                onClick={() => setShowChat(false)} 
                style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={msg.sender === "ai" ? "chat-bubble-ai" : "chat-bubble-user"}
                >
                  <p style={{ margin: 0, color: "inherit" }}>{msg.text}</p>
                  <span style={{ display: "block", fontSize: "9px", opacity: 0.6, marginTop: "4px", textAlign: "right" }}>{msg.timestamp}</span>
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble-ai" style={{ fontStyle: "italic", opacity: 0.7 }}>
                  Letters AI is typing...
                </div>
              )}
            </div>

            {/* Suggestion Chips */}
            <div className="chat-suggestions">
              {["AI Triage Rules", "Licensing Policy", "ABHA health key", "Reviews & Stars"].map((chip) => (
                <button 
                  key={chip} 
                  onClick={() => handleSendChat(chip)} 
                  className="chat-suggestion-btn"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message Input Area */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} 
              className="chat-input-area"
            >
              <input 
                type="text" 
                className="input" 
                placeholder="Ask clinical queries..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                style={{ flex: 1, padding: "10px 14px", fontSize: "13px", height: "auto" }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: "10px", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
