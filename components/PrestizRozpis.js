"use client";

import { KATEGORIE, prestizBudovy, konkurencnaPrestiz } from "../lib/katalog";
import { cardStyle } from "../lib/styles";

export default function PrestizRozpis({ stanica, budovy, pocetKonkurencie }) {
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");

  const sucetBudov = hotoveBudovy.reduce((s, b) => s + prestizBudovy(b.kategoria, b.typ, b.znacka), 0);

  const efektivnyBonusAktivny = new Date(stanica.efektivita_bonus_do) >= new Date();
  const efektivitaZamestnancov = efektivnyBonusAktivny ? (stanica.efektivita_bonus ?? 1) : 1;
  const stratyZoZamestnancov = Math.round(sucetBudov * (1 - efektivitaZamestnancov));

  const bonusZKonkurencie = Math.round(konkurencnaPrestiz(pocetKonkurencie));

  const riadky = [
    { ikona: "🏗️", nazov: "Budovy", hodnota: Math.round(sucetBudov), popis: `${hotoveBudovy.length} dokončených budov` },
    { ikona: "👷", nazov: "Spokojnosť zamestnancov", hodnota: -stratyZoZamestnancov, popis: `${Math.round(efektivitaZamestnancov * 100)} % efektivita (vyjednávanie o plat)` },
    { ikona: "🛡️", nazov: "Konkurencia", hodnota: bonusZKonkurencie, popis: "bonus za aktívnu konkurenciu v okolí" },
    { ikona: "😊", nazov: "Spokojnosť turistov", hodnota: null, popis: "pripravujeme — zatiaľ sa nezapočítava" },
  ];

  return (
    <div style={{ ...cardStyle, marginTop: 8, maxWidth: 280 }}>
      <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 14 }}>⭐ Rozklad prestíže</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {riadky.map((r) => (
          <div key={r.nazov} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#e8edf2" }}>{r.ikona} {r.nazov}</div>
              <div style={{ fontSize: 11, color: "#657685" }}>{r.popis}</div>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: r.hodnota === null ? "#657685" : r.hodnota < 0 ? "#f2994a" : "#4ade80",
                whiteSpace: "nowrap",
              }}
            >
              {r.hodnota === null ? "—" : `${r.hodnota > 0 ? "+" : ""}${r.hodnota}`}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid #223040" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e8edf2" }}>Spolu</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#f2c94c" }}>⭐ {stanica.prestiz}</span>
      </div>
    </div>
  );
}
