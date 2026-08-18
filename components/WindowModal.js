"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function WindowModal({ title, onClose, children, width = 480 }) {
  const [hoverZavriet, setHoverZavriet] = useState(false);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,60,95,0.35)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: "100%",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: 20,
          border: "1px solid rgba(120,160,205,0.28)",
          boxShadow: "0 24px 60px rgba(30,70,120,0.30)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            borderBottom: "1px solid rgba(120,160,205,0.20)",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#1b2c42",
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoverZavriet(true)}
            onMouseLeave={() => setHoverZavriet(false)}
            title="Zavrieť"
            style={{
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 9,
              border: "none",
              background: hoverZavriet ? "rgba(120,175,235,0.18)" : "transparent",
              color: "#5a6f88",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            <X size={17} strokeWidth={2.3} />
          </button>
        </div>

        <div style={{ padding: "14px 16px 16px", overflowY: "auto", color: "#1b2c42" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
