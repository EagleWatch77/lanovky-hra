"use client";

import Link from "next/link";
import { turistiZaHodinu, konkurencnyMultiplikator } from "../lib/katalog";
import { hernyDatum } from "../lib/hernyCas";
import { lanovkovyMultiplikatorDna, parkoviskovyMultiplikatorDna } from "../lib/pocasie";

function vypocitajSezonu(datum) {
  const mesiac = datum.getMonth(); // 0 = január
  const zimneMesiace = [10, 11, 0, 1, 2, 3]; // nov-apr
  return zimneMesiace.includes(mesiac) ? "ZIMA" : "LETO";
}

function Stat({ label, value }) {
  return (
    <div style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 8, border: "1px solid #223040", minWidth: 90 }}>
      <div style={{ fontSize: 11, color: "#657685" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function IconBtn({ children, href, onClick, disabled }) {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    borderRadius: 10,
    background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
    border: "1px solid #223040",
    color: disabled ? "#3a4753" : "#e8edf2",
    fontSize: 16,
    cursor: disabled ? "default" : "pointer",
    textDecoration: "none",
  };
  if (href && !disabled) return <Link href={href} style={style}>{children}</Link>;
  return <div style={style} onClick={!disabled ? onClick : undefined}>{children}</div>;
}

export default function TopBar({ onLogout, stanica, budovy, efektivitaBudovy, pocetKonkurencie }) {
  const teraz = new Date();
  const hotove = budovy.filter((b) => b.stav === "hotovo");

  const hDatum = hernyDatum(teraz);
  const lanovkovyMult = lanovkovyMultiplikatorDna(hDatum);
  const parkoviskovyMult = parkoviskovyMultiplikatorDna(hDatum);

  let turistiDnesOdhad = 0;
  let sucetEfektivit = 0;
  for (const b of hotove) {
    const ef = efektivitaBudovy(b);
    sucetEfektivit += ef;
    const pocasieMult = b.kategoria === "lanovka" ? lanovkovyMult : b.kategoria === "parkovisko" ? parkoviskovyMult : 1;
    if (b.cena) turistiDnesOdhad += turistiZaHodinu(b.kategoria, b.typ, b.cena) * ef * konkurencnyMultiplikator(b.kategoria, pocetKonkurencie) * pocasieMult * 24;
  }
  const priemernaEfektivita = hotove.length > 0 ? Math.round((sucetEfektivit / hotove.length) * 100) : 100;
  const sezona = vypocitajSezonu(hDatum);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>🏔️</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>SNOWPEAK</div>
          <div style={{ fontSize: 9, color: "#9fb0bf", letterSpacing: 2 }}>RESORT</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Stat label="⭐ Prestíž" value={stanica.prestiz.toLocaleString("sk-SK")} />
        <Stat label="💰 Peniaze" value={Math.round(stanica.peniaze).toLocaleString("sk-SK") + " €"} />
        <Stat label="🧑‍🤝‍🧑 Turisti (odhad/deň)" value={Math.round(turistiDnesOdhad).toLocaleString("sk-SK")} />
        <Stat label="😊 Efektivita" value={priemernaEfektivita + " %"} />
        <Stat label="📅 Herný dátum" value={hDatum.toLocaleDateString("sk-SK")} />
        <Stat label={sezona === "ZIMA" ? "❄️ Sezóna" : "☀️ Sezóna"} value={sezona} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <IconBtn disabled>✉️</IconBtn>
        <IconBtn href="/rebricek">🏆</IconBtn>
        <IconBtn disabled>👥</IconBtn>
        <IconBtn href="/nastavenia">⚙️</IconBtn>
        <IconBtn onClick={onLogout}>🚪</IconBtn>
      </div>
    </div>
  );
}
