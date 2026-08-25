"use client";
import { Users, CableCar, Building2 } from "lucide-react";

const nadpisSkupiny = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontSize: 10,
  fontWeight: 700,
  color: "#8a94a3",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 6,
};

function Riadok({ r }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, fontSize: 12.5 }}>
      <span style={{ color: "#1b2c42", minWidth: 0 }}>{r.nazov}</span>
      <span
        style={{
          fontFamily: "var(--font-sora), system-ui, sans-serif",
          fontWeight: 700,
          color: "#5a6f88",
          whiteSpace: "nowrap",
        }}
      >
        {r.kapacita}/h
      </span>
    </div>
  );
}

export default function TuristiRozpis({ dennyPocetTuristov, rozpisTuristovPodBudov }) {
  const rozpis = rozpisTuristovPodBudov || [];
  const lanovky = rozpis.filter((r) => LANOVKOVE_NAZVY.includes(r.nazov));
  const sluzby = rozpis.filter((r) => !LANOVKOVE_NAZVY.includes(r.nazov));

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(120,160,205,0.26)",
        borderRadius: 16,
        padding: 14,
        width: 290,
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
        <Users size={15} color="#2ca24e" strokeWidth={2.3} />
        Turisti
      </h3>

      {rozpis.length === 0 && (
        <div style={{ fontSize: 12, color: "#8a94a3", marginBottom: 10, lineHeight: 1.45 }}>
          Zatiaľ nemáš postavenú žiadnu budovu s kapacitou.
        </div>
      )}

      {lanovky.length > 0 && (
        <div style={{ marginBottom: 11 }}>
          <div style={nadpisSkupiny}>
            <CableCar size={12} color="#2f8ae0" strokeWidth={2.4} />
            Lanovky
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {lanovky.map((r, i) => (
              <Riadok key={i} r={r} />
            ))}
          </div>
        </div>
      )}

      {sluzby.length > 0 && (
        <div style={{ marginBottom: 11 }}>
          <div style={nadpisSkupiny}>
            <Building2 size={12} color="#8a5fd6" strokeWidth={2.4} />
            Služby
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sluzby.map((r, i) => (
              <Riadok key={i} r={r} />
            ))}
          </div>
        </div>
      )}

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
        <span style={{ fontSize: 12.5, color: "#5a6f88", fontWeight: 600 }}>Dnes spolu</span>
        <span
          style={{
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 15,
            color: "#2ca24e",
          }}
        >
          {Math.round(dennyPocetTuristov || 0).toLocaleString("sk-SK")}
        </span>
      </div>
    </div>
  );
}
