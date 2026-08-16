"use client";

const NAZVY_MESIACOV = ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra"];

function formatDatum(d) {
  return `${d.getDate()}. ${NAZVY_MESIACOV[d.getMonth()]} ${d.getFullYear()}`;
}

export default function SezonaInfo({ hranicaAktualnej, dalsiaSezona, jeMedzisezona }) {
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
      <h3 style={{ margin: "0 0 10px 0", fontSize: 14, color: "#e8edf2" }}>📅 Sezóna</h3>

      {jeMedzisezona && (
        <div style={{ background: "rgba(242,153,74,0.15)", borderRadius: 8, padding: "8px 10px", marginBottom: 10, fontSize: 12, color: "#f2994a" }}>
          🚧 Momentálne je medzisezóna — stredisko je zatvorené, žiadny príjem.
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: "#9fb0bf" }}>
          {hranicaAktualnej.typ === "zima" ? "❄️ Aktuálna zimná sezóna" : "☀️ Aktuálna letná sezóna"}
        </div>
        <div style={{ fontSize: 14, color: "#e8edf2", fontWeight: 600 }}>
          {formatDatum(hranicaAktualnej.zaciatok)} – {formatDatum(hranicaAktualnej.koniec)}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #223040", paddingTop: 10 }}>
        <div style={{ fontSize: 12, color: "#9fb0bf" }}>
          {dalsiaSezona.typ === "zima" ? "❄️ Ďalšia sezóna (zima) začína" : "☀️ Ďalšia sezóna (leto) začína"}
        </div>
        <div style={{ fontSize: 14, color: "#4ade80", fontWeight: 600 }}>{formatDatum(dalsiaSezona.zaciatok)}</div>
      </div>
    </div>
  );
}
