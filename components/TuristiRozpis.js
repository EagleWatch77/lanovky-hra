"use client";

const LANOVKOVE_NAZVY = ["Vlek", "Lanovka (Lúka)", "Lanovka do Hôr", "Lanovka (Údolie)", "Lanovka na vrchol", "Lanovka na Ľadovec", "Lanovka (Ľadovec)"];

export default function TuristiRozpis({ dennyPocetTuristov, rozpisTuristovPodBudov }) {
  const rozpis = rozpisTuristovPodBudov || [];
  const lanovky = rozpis.filter((r) => LANOVKOVE_NAZVY.includes(r.nazov));
  const sluzby = rozpis.filter((r) => !LANOVKOVE_NAZVY.includes(r.nazov));

  function Riadok({ r, i }) {
    return (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <span style={{ color: "#e8edf2" }}>{r.nazov}</span>
        <span style={{ color: "#9fb0bf" }}>{r.kapacita}/h</span>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(13,20,27,0.92)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 14,
        width: 290,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0", fontSize: 14, color: "#e8edf2" }}>🎿 Turisti</h3>

      {rozpis.length === 0 && (
        <div style={{ fontSize: 12, color: "#657685", marginBottom: 10 }}>Zatiaľ nemáš postavenú žiadnu budovu s kapacitou.</div>
      )}

      {lanovky.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "#657685", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>🚡 Lanovky</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {lanovky.map((r, i) => (
              <Riadok key={i} r={r} i={i} />
            ))}
          </div>
        </div>
      )}

      {sluzby.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: "#657685", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>🏠 Služby</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sluzby.map((r, i) => (
              <Riadok key={i} r={r} i={i} />
            ))}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid #223040", marginTop: 10, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#9fb0bf", fontSize: 13 }}>Dnes spolu</span>
        <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 15 }}>
          {Math.round(dennyPocetTuristov || 0).toLocaleString("sk-SK")} ľudí
        </span>
      </div>
    </div>
  );
}
