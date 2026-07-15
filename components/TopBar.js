"use client";

import { hernyDatum } from "../lib/hernyCas";

function vypocitajSezonu(datum) {
  const mesiac = datum.getMonth();
  const zimneMesiace = [10, 11, 0, 1, 2, 3];
  return zimneMesiace.includes(mesiac) ? "ZIMA" : "LETO";
}

function Stat({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, whiteSpace: "nowrap", color: "#1e293b" }}>
      <span style={{ opacity: 0.7 }}>{label.split(" ")[0]}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function TopBar({ stanica, budovy, efektivitaBudovy }) {
  const hDatum = hernyDatum(new Date());
  const hotove = budovy.filter((b) => b.stav === "hotovo");
  const sucetEfektivit = hotove.reduce((s, b) => s + efektivitaBudovy(b), 0);
  const priemernaEfektivita = hotove.length > 0 ? Math.round((sucetEfektivit / hotove.length) * 100) : 100;
  const sezona = vypocitajSezonu(hDatum);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>{stanica.logo || "🏔️"}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 1, color: "#1e293b" }}>{stanica.nazov.toUpperCase()}</div>
          <div style={{ fontSize: 8, color: "#475569", letterSpacing: 2 }}>RESORT</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Stat label="⭐ Prestíž" value={stanica.prestiz.toLocaleString("sk-SK")} />
        <Stat label="💰 Peniaze" value={Math.round(stanica.peniaze).toLocaleString("sk-SK") + " €"} />
        <Stat label="😊 Efekt." value={priemernaEfektivita + " %"} />
        <Stat label="📅 Dátum" value={hDatum.toLocaleDateString("sk-SK")} />
        <Stat label={sezona === "ZIMA" ? "❄️ Sezóna" : "☀️ Sezóna"} value={sezona} />
      </div>
    </div>
  );
}
