"use client";

import { Bell, Wrench, Hammer, Power, Mail, MessageCircle } from "lucide-react";

export default function TopBarPrava({
  notifikacie = [],
  onOtvorNastavenia,
  onOtvorSpravy,
  pocetNeprecitanych = 0,
  onLogout,
  maKonzorcium = false,
  onOtvorForum,
  pocetNeprecitanychVoFore = 0,
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
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
      {maKonzorcium && (
        <button
          onClick={onOtvorForum}
          title="Nástenka konzorcia"
          style={{
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
            borderRadius: 8, background: "transparent", border: "none", color: "#1e293b", cursor: "pointer",
          }}
        >
          <MessageCircle size={17} strokeWidth={1.8} />
          {pocetNeprecitanychVoFore > 0 && (
            <span style={{
              position: "absolute", top: 2, right: 2, background: "#e03131", color: "#fff",
              fontSize: 9, fontWeight: 700, borderRadius: 8, minWidth: 14, height: 14,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
            }}>
              {pocetNeprecitanychVoFore}
            </span>
          )}
        </button>
      )}
      <button
        onClick={onOtvorSpravy}
        title="Správy"
        style={{
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
          borderRadius: 8, background: "transparent", border: "none", color: "#1e293b", cursor: "pointer",
        }}
      >
        <Mail size={17} strokeWidth={1.8} />
        {pocetNeprecitanych > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2, background: "#f2994a", color: "#0d141b",
            fontSize: 9, fontWeight: 700, borderRadius: 8, minWidth: 14, height: 14,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
          }}>
            {pocetNeprecitanych}
          </span>
        )}
      </button>
      <button
        onClick={onOtvorNastavenia}
        title="Nastavenia"
        style={{
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34,
          borderRadius: 8, background: "transparent", border: "none", color: "#1e293b", cursor: "pointer",
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
          borderRadius: 8, background: "transparent", border: "none", color: "#1e293b", cursor: "pointer",
        }}
      >
        <Power size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
}
