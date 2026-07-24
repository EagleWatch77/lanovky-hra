"use client";

import { hernyDatum } from "../lib/hernyCas";

function vypocitajSezonu(datum) {
  const mesiac = datum.getMonth();
  const zimneMesiace = [10, 11, 0, 1, 2, 3];
  return zimneMesiace.includes(mesiac) ? "ZIMA" : "LETO";
}

function Stat({ label, value, onClick, aktivny }) {
  const obsah = (
    <>
      <span style={{ opacity: 0.7 }}>{label.split(" ")[0]}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        style={{
          display: "flex", alignItems: "center", gap: 4, fontSize: 13, whiteSpace: "nowrap", color: "#1e293b",
          background: aktivny ? "rgba(255,255,255,0.4)" : "transparent",
          border: "none", borderRadius: 6, padding: "2px 6px", margin: "-2px -6px", cursor: "pointer",
        }}
      >
        {obsah}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, whiteSpace: "nowrap", color: "#1e293b" }}>
      {obsah}
    </div>
  );
}

export default function TopBar({ stanica, budovy, efektivitaBudovy, onKliknutePrestiz, prestizRozbalena }) {
  const hDatum = hernyDatum(new Date());
  const hotove = budovy.filter((b) => b.stav === "hotovo");
  const sucetEfektivit = hotove.reduce((s, b) => s + efektivitaBudovy(b), 0);
  const priemernaEfektivita = hotove.length > 0 ? Math.round((sucetEfektivit / hotove.length) * 100) : 100;
  const sezona = vypocitajSezonu(hDatum);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <Stat label="⭐ Prestíž" value={stanica.prestiz.toLocaleString("sk-SK")} onClick={onKliknutePrestiz} aktivny={prestizRozbalena} />
      <Stat label="💰 Peniaze" value={Math.round(stanica.peniaze).toLocaleString("sk-SK") + " €"} />
      <Stat label="😊 Efekt." value={priemernaEfektivita + " %"} />
      <Stat label="📅 Dátum" value={hDatum.toLocaleDateString("sk-SK")} />
      <Stat label={sezona === "ZIMA" ? "❄️ Sezóna" : "☀️ Sezóna"} value={sezona} />
    </div>
  );
}
