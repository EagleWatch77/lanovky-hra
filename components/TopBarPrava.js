"use client";

import { Bell, Wrench, Hammer, Power } from "lucide-react";

const tienIkonky = "drop-shadow(0 1px 3px rgba(0,0,0,0.6))";

export default function TopBarPrava({ notifikacie = [], onOtvorNastavenia, onLogout }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      {notifikacie.length > 0 && (
        <div style={{ position: "relative", padding: 4 }} title={notifikacie.map((n) => n.text).join("\n")}>
          <Bell size={17} color="#f2994a" strokeWidth={1.8} style={{ filter: tienIkonky }} />
          <span style={{
            position: "absolute", top: 0, right: 0, background: "#f2994a", color: "#0d141b",
            fontSize: 9, fontWeight: 700, borderRadius: 8, minWidth: 14, height: 14,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
          }}>
            {notifikacie.length}
          </span>
        </div>
      )}
      <button
        onClick={onOtvorNastavenia}
        title="Nastavenia"
        style={{
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
          borderRadius: 8, background: "transparent", border: "none", color: "#ffffff", cursor: "pointer",
          filter: tienIkonky,
        }}
      >
        <Wrench size={16} strokeWidth={2} style={{ position: "absolute", transform: "rotate(-45deg) translate(-2px, 2px)" }} />
        <Hammer size={16} strokeWidth={2} style={{ position: "absolute", transform: "rotate(45deg) translate(2px, 2px)" }} />
      </button>
      <button
        onClick={onLogout}
        title="Odhlásiť sa"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
          borderRadius: 8, background: "transparent", border: "none", color: "#ffffff", cursor: "pointer",
          filter: tienIkonky,
        }}
      >
        <Power size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
}
