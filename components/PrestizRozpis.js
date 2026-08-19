"use client";
import { Building2, Users, ShieldAlert, Star } from "lucide-react";

export default function PrestizRozpis({ prestizRozpis }) {
  const r = prestizRozpis || { budovy: 0, turisti: 0, konkurencia: 0, spolu: 0 };
  const riadky = [
    {
      nazov: "Budovy",
      Ikona: Building2,
      farba: "#2f8ae0",
      hodnota: r.budovy,
      popis: "pevná prestíž z katalógu × efektivita",
    },
    {
      nazov: "Turisti",
      Ikona: Users,
      farba: "#2ca24e",
      hodnota: r.turisti,
      popis: "počet turistov × spokojnosť (2–8 na turistu)",
    },
    {
      nazov: "Konkurencia",
      Ikona: ShieldAlert,
      farba: "#8a5fd6",
      hodnota: r.konkurencia,
      popis: "bonus za aktívnu konkurenciu v okolí",
    },
  ];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(120,160,205,0.26)",
        borderRadius: 16,
        padding: 14,
        width: 280,
        boxSizing: "border-box",
        boxShadow: "0 14px 36px rgba(40,90,145,0.22)",
      }}
    >
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          margin: "0 0 11px 0",
          fontFamily: "var(--font-sora), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 13.5,
          color: "#1b2c42",
        }}
      >
        <Star size={15} color="#2f8ae0" strokeWidth={2.3} />
        Rozklad prestíže
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {riadky.map((riadok) => (
          <div key={riadok.nazov} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${riadok.farba}1a`,
                color: riadok.farba,
                flexShrink: 0,
              }}
            >
              <riadok.Ikona size={14} strokeWidth={2.2} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 12.5, color: "#1b2c42", fontWeight: 600 }}>{riadok.nazov}</span>
                <span
                  style={{
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 12.5,
                    color: riadok.hodnota >= 0 ? "#2ca24e" : "#d64545",
                    whiteSpace: "nowrap",
                  }}
                >
                  {riadok.hodnota >= 0 ? "+" : ""}
                  {riadok.hodnota.toLocaleString("sk-SK")}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#aebccd", marginTop: 2, lineHeight: 1.35 }}>{riadok.popis}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(120,160,205,0.22)",
          marginTop: 11,
          paddingTop: 9,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12.5, color: "#5a6f88", fontWeight: 600 }}>Spolu</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 15,
            color: "#1b2c42",
          }}
        >
          <Star size={14} color="#2f8ae0" strokeWidth={2.4} />
          {r.spolu.toLocaleString("sk-SK")}
        </span>
      </div>
    </div>
  );
}
