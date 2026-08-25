"use client";
import { useState } from "react";
import { Bell, Mail, MessageCircle, Settings, Power } from "lucide-react";
import { OBRAZOK_KRYSTAL } from "../lib/katalog";

function IkonaTlacidlo({ onClick, title, children, badge = 0, badgeColor = "#e5484d" }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        borderRadius: 9,
        background: hover ? "rgba(120,175,235,0.16)" : "transparent",
        border: "none",
        color: "#5a6f88",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
    >
      {children}
      {badge > 0 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: badgeColor,
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            borderRadius: 8,
            minWidth: 15,
            height: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 3px",
            border: "1.5px solid #fff",
            fontFamily: "var(--font-sora), system-ui, sans-serif",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export default function TopBarPrava({
  krystaly = 0,
  onOtvorKrystaly,
  notifikacie = [],
  onOtvorNastavenia,
  onOtvorSpravy,
  pocetNeprecitanych = 0,
  onLogout,
  maKonzorcium = false,
  onOtvorForum,
  pocetNeprecitanychVoFore = 0,
}) {
 const [hoverKrystaly, setHoverKrystaly] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
      <button
        onClick={onOtvorKrystaly}
        title="Kryštály"
        onMouseEnter={() => setHoverKrystaly(true)}
        onMouseLeave={() => setHoverKrystaly(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 11px 5px 6px",
          marginRight: 4,
          borderRadius: 10,
          border: "1px solid rgba(120,160,205,0.22)",
          background: hoverKrystaly ? "rgba(120,175,235,0.16)" : "rgba(255,255,255,0.7)",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        <img src={OBRAZOK_KRYSTAL} alt="" style={{ width: 20, height: 20, objectFit: "contain" }} />
        <span
          style={{
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: "#1b2c42",
          }}
        >
          {krystaly.toLocaleString("sk-SK")}
        </span>
      </button>

      {notifikacie.length > 0 && (
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
          }}
          title={notifikacie.map((n) => n.text).join("\n")}
        >
          <Bell size={18} color="#ef9a3d" strokeWidth={2} />
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "#ef9a3d",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 8,
              minWidth: 15,
              height: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 3px",
              border: "1.5px solid #fff",
              fontFamily: "var(--font-sora), system-ui, sans-serif",
            }}
          >
            {notifikacie.length}
          </span>
        </div>
      )}

      {maKonzorcium && (
        <IkonaTlacidlo onClick={onOtvorForum} title="Nástenka konzorcia" badge={pocetNeprecitanychVoFore}>
          <MessageCircle size={18} strokeWidth={2} />
        </IkonaTlacidlo>
      )}

      <IkonaTlacidlo onClick={onOtvorSpravy} title="Správy" badge={pocetNeprecitanych}>
        <Mail size={18} strokeWidth={2} />
      </IkonaTlacidlo>

      <IkonaTlacidlo onClick={onOtvorNastavenia} title="Nastavenia">
        <Settings size={18} strokeWidth={2} />
      </IkonaTlacidlo>

      <IkonaTlacidlo onClick={onLogout} title="Odhlásiť sa">
        <Power size={18} strokeWidth={2} />
      </IkonaTlacidlo>
    </div>
  );
}
