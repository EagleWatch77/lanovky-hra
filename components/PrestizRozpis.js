"use client";

export default function PrestizRozpis({ prestizRozpis }) {
  const r = prestizRozpis || { budovy: 0, turisti: 0, konkurencia: 0, spolu: 0 };

  const riadky = [
    { nazov: "🏢 Budovy (bez lístkov)", hodnota: r.budovy, popis: "pevná prestíž z katalógu × efektivita" },
    { nazov: "🎿 Turisti (lístky)", hodnota: r.turisti, popis: "počet turistov × spokojnosť (2-8/turistu)" },
    { nazov: "🛡️ Konkurencia", hodnota: r.konkurencia, popis: "bonus za aktívnu konkurenciu v okolí" },
  ];

  return (
    <div
      style={{
        background: "rgba(13,20,27,0.92)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 14,
        width: 280,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", fontSize: 14, color: "#e8edf2" }}>⭐ Rozklad prestíže</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {riadky.map((riadok) => (
          <div key={riadok.nazov}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#e8edf2" }}>{riadok.nazov}</span>
              <span style={{ color: riadok.hodnota >= 0 ? "#4ade80" : "#f2994a", fontWeight: 600 }}>
                {riadok.hodnota >= 0 ? "+" : ""}
                {riadok.hodnota}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "#657685" }}>{riadok.popis}</div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #223040", marginTop: 10, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#9fb0bf", fontSize: 13 }}>Spolu</span>
        <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 15 }}>⭐ {r.spolu}</span>
      </div>
    </div>
  );
}
