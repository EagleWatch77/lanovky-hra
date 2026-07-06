"use client";

import { turistiZaHodinu } from "../lib/katalog";
import { linkStyle } from "../lib/styles";

function vypocitajSezonu(datum) {
  const mesiac = datum.getMonth(); // 0 = január
  const zimneMesiace = [10, 11, 0, 1, 2, 3]; // nov-apr
  return zimneMesiace.includes(mesiac) ? "ZIMA" : "LETO";
}

function Stat({ label, value }) {
  return (
    <div style={{ padding: "8px 14px", background: "rgba(19,28,36,0.85)", backdropFilter: "blur(6px)", borderRadius: 8, border: "1px solid #223040", minWidth: 90, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
      <div style={{ fontSize: 11, color: "#657685" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export default function TopBar({ email, onLogout, stanica, budovy, efektivitaBudovy }) {
  const teraz = new Date();
  const hotove = budovy.filter((b) => b.stav === "hotovo");

  // Odhad turistov za deň — nie presné meranie, len výpočet z aktuálnych cien/kapacít
  let turistiDnesOdhad = 0;
  let sucetEfektivit = 0;
  for (const b of hotove) {
    const ef = efektivitaBudovy(b);
    sucetEfektivit += ef;
    if (b.cena) turistiDnesOdhad += turistiZaHodinu(b.kategoria, b.typ, b.cena) * ef * 24;
  }
  const priemernaEfektivita = hotove.length > 0 ? Math.round((sucetEfektivit / hotove.length) * 100) : 100;
  const sezona = vypocitajSezonu(teraz);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Stat label="⭐ Prestíž" value={stanica.prestiz.toLocaleString("sk-SK")} />
        <Stat label="💰 Peniaze" value={Math.round(stanica.peniaze).toLocaleString("sk-SK") + " €"} />
        <Stat label="🧑‍🤝‍🧑 Turisti (odhad/deň)" value={Math.round(turistiDnesOdhad).toLocaleString("sk-SK")} />
        <Stat label="😊 Efektivita" value={priemernaEfektivita + " %"} />
        <Stat label="📅 Dátum" value={teraz.toLocaleDateString("sk-SK")} />
        <Stat label={sezona === "ZIMA" ? "❄️ Sezóna" : "☀️ Sezóna"} value={sezona} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#9fb0bf", fontSize: 13 }}>{email}</span>
        <button onClick={onLogout} style={linkStyle}>Odhlásiť sa</button>
      </div>
    </div>
  );
}
