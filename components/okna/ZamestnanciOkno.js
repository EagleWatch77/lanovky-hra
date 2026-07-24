"use client";

import { useState } from "react";
import { KATEGORIE, zamestnanciPotrebni, PLAT_ZA_HODINU } from "../../lib/katalog";
import { cardStyle } from "../../lib/styles";

export default function ZamestnanciOkno({ stanica, budovy }) {
  const [zalozka, setZalozka] = useState("prehlad");

  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");
  const platMultiplikator = stanica.plat_multiplikator ?? 1;
  const efektivnyBonusAktivny = new Date(stanica.efektivita_bonus_do) >= new Date();
  const efektivitaBonus = efektivnyBonusAktivny ? (stanica.efektivita_bonus ?? 1) : 1;

  const riadky = hotoveBudovy.map((b) => {
    const info = KATEGORIE[b.kategoria]?.katalog[b.typ];
    const pocetZamestnancov = zamestnanciPotrebni(b.kategoria, b.typ);
    const nakladyHod = pocetZamestnancov * PLAT_ZA_HODINU * platMultiplikator;
    return {
      id: b.id,
      nazov: info?.nazov || b.typ,
      ikona: KATEGORIE[b.kategoria]?.ikona || "🏢",
      zona: b.zona,
      pocetZamestnancov,
      nakladyHod,
    };
  });

  const celkomZamestnancov = riadky.reduce((s, r) => s + r.pocetZamestnancov, 0);
  const celkomNakladyHod = riadky.reduce((s, r) => s + r.nakladyHod, 0);

  const NAZOV_ZONY = { luka: "Lúka", udolie: "Údolie", hory: "Hory", ladovec: "Ľadovec" };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        <button
          onClick={() => setZalozka("prehlad")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "prehlad" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "prehlad" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          👷 Prehľad
        </button>
        <button
          onClick={() => setZalozka("odbory")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "odbory" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "odbory" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          🪧 Odbory
        </button>
      </div>

      {zalozka === "prehlad" && (
        <div>
          <div style={{ ...cardStyle, marginTop: 0, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e8edf2" }}>{celkomZamestnancov}</div>
              <div style={{ fontSize: 12, color: "#9fb0bf" }}>zamestnancov</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e8edf2" }}>{Math.round(celkomNakladyHod)} €/h</div>
              <div style={{ fontSize: 12, color: "#9fb0bf" }}>náklady na platy</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: efektivitaBonus < 1 ? "#f2994a" : "#4ade80" }}>
                {Math.round(efektivitaBonus * 100)} %
              </div>
              <div style={{ fontSize: 12, color: "#9fb0bf" }}>efektivita</div>
            </div>
          </div>

          {riadky.length === 0 && (
            <p style={{ color: "#657685", fontSize: 13 }}>Zatiaľ nemáš žiadnu dokončenú budovu, takže nikoho nezamestnávaš.</p>
          )}

          {riadky.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Podľa budov</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {riadky.map((r) => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6, fontSize: 13 }}>
                    <span>{r.ikona} {r.nazov} <span style={{ color: "#657685", fontSize: 11 }}>({NAZOV_ZONY[r.zona] || r.zona})</span></span>
                    <span style={{ color: "#9fb0bf" }}>
                      👤 {r.pocetZamestnancov} · <strong style={{ color: "#e8edf2" }}>{Math.round(r.nakladyHod)} €/h</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {zalozka === "odbory" && (
        <div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Aktuálny stav miezd</h3>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #223040" }}>
              <span style={{ color: "#9fb0bf" }}>Základná sadzba</span>
              <span style={{ color: "#e8edf2" }}>{PLAT_ZA_HODINU} €/h na zamestnanca</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #223040" }}>
              <span style={{ color: "#9fb0bf" }}>Aktuálny násobiteľ (po vyjednávaniach)</span>
              <span style={{ color: "#e8edf2" }}>+{Math.round((platMultiplikator - 1) * 100)} %</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: "#9fb0bf" }}>Efektivita zamestnancov</span>
              <span style={{ color: efektivitaBonus < 1 ? "#f2994a" : "#4ade80", fontWeight: 600 }}>
                {Math.round(efektivitaBonus * 100)} %
                {efektivitaBonus < 1 && " (znížená pre odmietnutie zvýšenia platu)"}
              </span>
            </div>
          </div>

          <div style={{ ...cardStyle, marginTop: 0 }}>
            <h3 style={{ marginTop: 0 }}>Ako to funguje</h3>
            <p style={{ color: "#9fb0bf", fontSize: 13 }}>
              Každý herný december (23.–31.) prídu odbory za tebou s návrhom na zvýšenie platov. Máš na výber:
            </p>
            <ul style={{ color: "#9fb0bf", fontSize: 13, lineHeight: 1.8, paddingLeft: 20 }}>
              <li><strong style={{ color: "#4ade80" }}>Prijať</strong> – plná dohodnutá sadzba, efektivita zostáva 100 %</li>
              <li><strong style={{ color: "#f2c94c" }}>Čiastočne prijať</strong> – polovičné zvýšenie, efektivita klesne na 90 % do konca januára</li>
              <li><strong style={{ color: "#f28b8b" }}>Odmietnuť</strong> – žiadne zvýšenie, ale efektivita klesne na 80 % do konca januára</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
