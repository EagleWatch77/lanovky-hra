"use client";
import { HardHat, Euro, CloudSun, Smile, Users } from "lucide-react";

export default function SpokojnostRozpis({ spokojnostRozpis }) {
  const r = spokojnostRozpis || { infrastruktura: 0, sluzby: 0, ceny: 0, pocasie: 0, spolu: 100 };
  const riadky = [
    { nazov: "Infraštruktúra", Ikona: HardHat, farba: "#2f8ae0", hodnota: r.infrastruktura },
    { nazov: "Služby", Ikona: Users, farba: "#2ca24e", hodnota: r.sluzby ?? 0 },
    { nazov: "Ceny", Ikona: Euro, farba: "#c9930f", hodnota: r.ceny },
    { nazov: "Počasie", Ikona: CloudSun, farba: "#8a5fd6", hodnota: r.pocasie },
  ];

  const farbaSpolu = r.spolu >= 80 ? "#2ca24e" : r.spolu >= 50 ? "#c9830f" : "#d64545";

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
        <Smile size={15} color="#8a5fd6" strokeWidth={2.3} />
        Rozklad spokojnosti
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {riadky.map((riadok) => {
          const hodnotaZo100 = Math.max(0, 100 + riadok.hodnota);
          const vPoriadku = hodnotaZo100 === 100;
          return (
            <div key={riadok.nazov}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
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
                <span style={{ flex: 1, fontSize: 12.5, color: "#1b2c42", fontWeight: 600 }}>{riadok.nazov}</span>
                <span
                  style={{
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 12.5,
                    color: vPoriadku ? "#2ca24e" : "#c9830f",
                  }}
                >
                  {hodnotaZo100} %
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "#e4eef7", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, hodnotaZo100)}%`,
                    borderRadius: 3,
                    background: vPoriadku
                      ? "linear-gradient(90deg,#42d675,#33bd63)"
                      : "linear-gradient(90deg,#f0b45a,#e09527)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(120,160,205,0.22)",
          marginTop: 12,
          paddingTop: 9,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 12.5, color: "#5a6f88", fontWeight: 600 }}>Celková spokojnosť</span>
        <span
          style={{
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color: farbaSpolu,
          }}
        >
          {r.spolu} %
        </span>
      </div>
    </div>
  );
}
