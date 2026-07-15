"use client";

import { Bell, Settings, LogOut } from "lucide-react";

export default function TopBarPrava({ notifikacie = [], onOtvorNastavenia, onLogout }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {notifikacie.length > 0 && (
        <div style={{ position: "relative", padding: 6 }} title={notifikacie.map((n) => n.text).join("\n")}>
          <Bell size={17} color="#f2994a" strokeWidth={1.8} />
          <span style={{
            position: "absolute", top: 2, right: 2, background: "#f2994a", color: "#0d141b",
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
          display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32,
          borderRadius: 8, background: "transparent", border: "none", color: "rgba(232,237,242,0.65)", cursor: "pointer",
        }}
      >
        <Settings size={16} strokeWidth={1.8} />
      </button>
      <button
        onClick={onLogout}
        title="Odhlásiť sa"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32,
          borderRadius: 8, background: "transparent", border: "none", color: "rgba(232,237,242,0.65)", cursor: "pointer",
        }}
      >
        <LogOut size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
