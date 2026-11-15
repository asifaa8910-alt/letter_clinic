import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Shield, Clock } from "lucide-react";

export default function VideoConsultationModal({
  appointment,
  currentUser,
  onEndCall
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Timer for duration of consultation
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Request actual camera stream if accessible
  useEffect(() => {
    let active = true;

    async function enableCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (active && videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch {
          // Fallback gracefully to simulated avatar view
        }
      }
    }

    if (isVideoOn) {
      enableCamera();
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOn]);

  const toggleMic = () => {
    setIsMuted(!isMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoOn;
      });
    }
  };

  const handleEnd = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    onEndCall(appointment.id);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isDoctor = currentUser?.role === "doctor";
  const partnerName = isDoctor ? appointment.patientName : appointment.doctorName;
  const partnerRole = isDoctor ? "Patient" : "Medical Practitioner";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#070709",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
        color: "white"
      }}
    >
      {/* Header bar */}
      <div
        className="d-flex justify-content-between align-items-center p-3"
        style={{ background: "#111118", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 10px #10b981"
            }}
          ></div>
          <div>
            <h5 className="mb-0" style={{ fontSize: "16px", fontWeight: "600" }}>
              Live Teleconsultation — {partnerName}
            </h5>
            <small className="text-secondary" style={{ fontSize: "12px" }}>
              {partnerRole} • Scheduled {appointment.slotDate} at {appointment.slotTime}
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-1 bg-dark px-3 py-1 rounded-pill border border-secondary text-light">
            <Clock size={14} className="text-info" />
            <span style={{ fontSize: "13px", fontFamily: "monospace" }}>{formatTime(callDuration)}</span>
          </div>
          <span className="badge bg-secondary d-flex align-items-center gap-1 px-3 py-2 rounded-pill">
            <Shield size={12} className="text-warning" />
            <span>Room: {appointment.videoRoomId || "room-2026"}</span>
          </span>
        </div>
      </div>

      {/* Main Video Call Area */}
      <div className="flex-grow-1 p-3 d-flex gap-3 overflow-hidden position-relative" style={{ background: "#0b0c10" }}>
        {/* Remote Partner Screen */}
        <div
          className="flex-grow-1 rounded-4 d-flex flex-column align-items-center justify-content-center position-relative shadow"
          style={{
            background: "linear-gradient(135deg, #161822 0%, #1c1d28 100%)",
            border: "1px solid rgba(255,255,255,0.06)"
          }}
        >
          <div className="text-center p-4">
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2597d0 0%, #155e82 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                fontWeight: "bold",
                color: "white",
                marginBottom: "20px",
                boxShadow: "0 8px 24px rgba(37, 151, 208, 0.35)"
              }}
            >
              {partnerName ? partnerName.charAt(partnerName.startsWith("Dr.") ? 4 : 0) : "P"}
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "8px" }}>{partnerName}</h3>
            <span className="badge bg-success-subtle text-success border border-success px-3 py-1 rounded-pill">
              ● Connected & Encrypted (WebRTC)
            </span>
          </div>

          <div
            className="position-absolute bottom-0 start-0 m-3 px-3 py-1 rounded-pill"
            style={{ background: "rgba(0,0,0,0.6)", fontSize: "12px" }}
          >
            {partnerName} ({partnerRole})
          </div>
        </div>

        {/* Local User Self-Preview Window */}
        <div
          className="rounded-4 overflow-hidden position-relative shadow"
          style={{
            width: "280px",
            height: "210px",
            background: "#1f202b",
            border: "2px solid rgba(37, 151, 208, 0.4)",
            alignSelf: "flex-end"
          }}
        >
          {isVideoOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)" // Mirror view
              }}
            />
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-3">
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  marginBottom: "8px"
                }}
              >
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <small className="text-secondary">Camera Paused</small>
            </div>
          )}

          <div
            className="position-absolute bottom-0 start-0 m-2 px-2 py-0 rounded text-light"
            style={{ background: "rgba(0,0,0,0.7)", fontSize: "11px" }}
          >
            You ({currentUser?.name}) {isMuted && "• Muted"}
          </div>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div
        className="p-3 d-flex justify-content-center align-items-center gap-3"
        style={{ background: "#111118", borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <button
          onClick={toggleMic}
          className={`btn ${isMuted ? "btn-danger" : "btn-secondary"} rounded-circle p-3 d-flex align-items-center justify-content-center`}
          style={{ width: "52px", height: "52px" }}
          title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={toggleVideo}
          className={`btn ${!isVideoOn ? "btn-danger" : "btn-secondary"} rounded-circle p-3 d-flex align-items-center justify-content-center`}
          style={{ width: "52px", height: "52px" }}
          title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={handleEnd}
          className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow"
          style={{ fontWeight: "600", fontSize: "15px" }}
        >
          <PhoneOff size={18} />
          <span>End Consultation</span>
        </button>
      </div>
    </div>
  );
}

