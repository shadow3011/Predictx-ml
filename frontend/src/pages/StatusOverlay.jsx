import React from "react";

export default function StatusOverlay({ type, title, message, onConfirm }) {
  const isSuccess = type === "success";
  
  return (
    <div className="fade-in" style={{
      position: "absolute",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(6, 11, 24, 0.95)",
      backdropFilter: "blur(10px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 10,
      borderRadius: "16px",
      textAlign: "center",
      padding: "40px 24px"
    }}>
      {/* Icon */}
      <div style={{
        width: 100, height: 100,
        borderRadius: "50%",
        border: `4px solid ${isSuccess ? "#10b981" : "#ef4444"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
        fontSize: 48,
        color: isSuccess ? "#10b981" : "#ef4444",
        boxShadow: `0 0 30px ${isSuccess ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`
      }}>
        {isSuccess ? "✓" : "✕"}
      </div>

      <h2 style={{
        fontFamily: "Space Grotesk, sans-serif",
        fontSize: "2rem", fontWeight: 800, marginBottom: 12,
        color: "#fff"
      }}>{title}</h2>
      
      <p style={{
        color: "#8B9EC7", fontSize: 16, marginBottom: 32,
        lineHeight: 1.6, maxWidth: 280
      }}>{message}</p>

      <button
        onClick={onConfirm}
        className={isSuccess ? "btn-gold" : "btn-ghost"}
        style={{
          padding: "14px 48px",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: 700,
          background: isSuccess ? "#10b981" : "transparent",
          border: isSuccess ? "none" : "1px solid #ef4444",
          color: "#fff",
          cursor: "pointer",
          transition: "transform 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {isSuccess ? "continue" : "try again"}
      </button>
    </div>
  );
}
