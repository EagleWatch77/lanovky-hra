"use client";

import { turistiZaHodinu, konkurencnyMultiplikator } from "../lib/katalog";
import { hernyDatum } from "../lib/hernyCas";
import { lanovkovyMultiplikatorDna, parkoviskovyMultiplikatorDna } from "../lib/pocasie";
import { LogOut, Bell } from "lucide-react";

function vypocitajSezonu(datum) {
  const mesiac = datum.getMonth(); // 0 = január
  const zimneMesiace = [10, 11, 0, 1, 2, 3]; // nov-apr
  return zimneMesiace.includes(mesiac) ? "ZIMA" : "LETO";
}

function Stat({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, whiteSpace: "nowrap" }}>
      <span style={{ opacity: 0.8 }}>{label.split(" ")[0]}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export default function TopBar({ onLogout, stanica, budovy, efektivitaBudovy, pocetKonkurencie, notifikacie = [] }) {
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22 }}>{stanica.logo || "🏔️"}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 1 }}>{stanica.nazov.toUpperCase()}</div>
          <div style={{ fontSize: 8, color: "#9fb0bf", letterSpacing: 2 }}>RESORT</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Stat label="⭐ Prestíž" value={stanica.prestiz.toLocaleString("sk-SK")} />
        <Stat label="💰 Peniaze" value={Math.round(stanica.peniaze).toLocaleString("sk-SK") + " €"} />
        <Stat label="😊 Efekt." value={priemernaEfektivita + " %"} />
        <Stat label="📅 Dátum" value={hDatum.toLocaleDateString("sk-SK")} />
        <Stat label={sezona === "ZIMA" ? "❄️ Sezóna" : "☀️ Sezóna"} value={sezona} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {notifikacie.length > 0 && (
          <div style={{ position: "relative" }} title={notifikacie.map((n) => n.text).join("\n")}>
            <Bell size={18} color="#f2994a" strokeWidth={1.8} />
            <span style={{
              position: "absolute", top: -4, right: -6, background: "#f2994a", color: "#0d141b",
              fontSize: 9, fontWeight: 700, borderRadius: 8, minWidth: 14, height: 14,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
            }}>
              {notifikacie.length}
            </span>
          </div>
        )}
        <div
          onClick={onLogout}
          title="Odhlásiť sa"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32,
            borderRadius: 8, color: "rgba(232,237,242,0.65)", cursor: "pointer",
          }}
        >
          <LogOut size={16} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  );
}
