"use client";

import {
  OBRAZOK_KRYSTAL,
  OBRAZOK_KRYSTALY,
  BALICKY_KRYSTALOV,
  CENY_V_KRYSTALOCH,
  KATEGORIE,
  KRYSTALY_ZA_MILNIK,
} from "../../lib/katalog";
import { Sparkles, Lock, Gift } from "lucide-react";

const karta = {
  background: "#ffffff",
  border: "1px solid rgba(120,160,205,0.22)",
  borderRadius: 14,
  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
  padding: 14,
  marginBottom: 12,
};

const nadpisKarty = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  margin: "0 0 10px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

// Kategórie, v ktorých hľadáme prémiové budovy
const KATEGORIE_S_PREMIOM = ["lanovka", "hotel", "parkovisko", "ratrak", "zasnezovanie"];

const MILNIKY_POPIS = [
  { kluc: "prva_lanovka", text: "Postav prvú lanovku" },
  { kluc: "udolie", text: "Odomkni Údolie" },
  { kluc: "hory", text: "Odomkni Hory" },
  { kluc: "ladovec", text: "Odomkni Ľadovec" },
  { kluc: "prve_miesto", text: "Prvé miesto v rebríčku" },
];

export default function KrystalyOkno({ stanica }) {
  const krystaly = stanica.krystaly ?? 0;

  // Zoznam všetkého, čo sa dá kúpiť za kryštály
  const premiove = [];
  for (const kat of KATEGORIE_S_PREMIOM) {
    const katalog = KATEGORIE[kat]?.katalog || {};
    for (const typ of Object.keys(katalog)) {
      if (!katalog[typ].premiova) continue;
      premiove.push({
        typ,
        nazov: katalog[typ].nazov,
        popis: katalog[typ].popis,
        cena: CENY_V_KRYSTALOCH[typ] || 0,
      });
    }
  }
  premiove.sort((a, b) => a.cena - b.cena);

  return (
    <div>
      {/* Zostatok */}
      <div style={{ ...karta, display: "flex", alignItems: "center", gap: 14 }}>
        <img src={OBRAZOK_KRYSTALY} alt="" style={{ width: 56, height: 56, objectFit: "contain", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 11.5, color: "#8a94a3", marginBottom: 2 }}>Tvoj zostatok</div>
          <div
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: "#1b2c42",
              lineHeight: 1.1,
            }}
          >
            {krystaly.toLocaleString("sk-SK")}
          </div>
        </div>
      </div>

      {/* Čo sa dá kúpiť */}
      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Sparkles size={15} color="#2f8ae0" strokeWidth={2.3} />
          Čo si môžeš kúpiť
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {premiove.map((p) => {
            const maNa = krystaly >= p.cena;
            return (
              <div
                key={p.typ}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 11,
                  background: "rgba(120,160,205,0.06)",
                  border: "1px solid rgba(120,160,205,0.16)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 12.5,
                      color: "#1b2c42",
                    }}
                  >
                    {p.nazov}
                  </div>
                  {p.popis && (
                    <div style={{ fontSize: 10.5, color: "#aebccd", marginTop: 2, lineHeight: 1.35 }}>{p.popis}</div>
                  )}
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 12.5,
                    color: maNa ? "#2ca24e" : "#8a94a3",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  <img src={OBRAZOK_KRYSTAL} alt="" style={{ width: 15, height: 15, objectFit: "contain" }} />
                  {p.cena}
                </span>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 10.5, color: "#aebccd", marginTop: 10, marginBottom: 0, lineHeight: 1.45 }}>
          Prémiové budovy sa stavajú v okne Budovy — v zozname ich spoznáš podľa ceny v kryštáloch.
        </p>
      </div>

      {/* Kryštály zadarmo */}
      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Gift size={15} color="#2ca24e" strokeWidth={2.3} />
          Kryštály zadarmo
        </h3>
        <p style={{ color: "#8a94a3", fontSize: 11.5, lineHeight: 1.5, marginTop: 0, marginBottom: 10 }}>
          Za dôležité míľniky v hre dostaneš kryštály bez platenia.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {MILNIKY_POPIS.map((m) => (
            <div
              key={m.kluc}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "8px 11px",
                borderRadius: 10,
                background: "rgba(120,160,205,0.06)",
                fontSize: 12,
                color: "#5a6f88",
              }}
            >
              <span>{m.text}</span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 700,
                  color: "#2ca24e",
                  whiteSpace: "nowrap",
                }}
              >
                <img src={OBRAZOK_KRYSTAL} alt="" style={{ width: 13, height: 13, objectFit: "contain" }} />+
                {KRYSTALY_ZA_MILNIK[m.kluc]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Balíčky — zatiaľ nedostupné */}
      <div style={{ ...karta, opacity: 0.75 }}>
        <h3 style={nadpisKarty}>
          <Lock size={15} color="#8a94a3" strokeWidth={2.3} />
          Kúpiť kryštály
        </h3>
        <p style={{ color: "#8a94a3", fontSize: 11.5, lineHeight: 1.5, marginTop: 0, marginBottom: 10 }}>
          Nákup kryštálov zatiaľ nie je spustený. Pripravujeme ho.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {BALICKY_KRYSTALOV.map((b) => (
            <div
              key={b.eur}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "9px 11px",
                borderRadius: 10,
                background: "rgba(120,160,205,0.06)",
                border: "1px solid rgba(120,160,205,0.14)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#1b2c42",
                }}
              >
                <img src={OBRAZOK_KRYSTAL} alt="" style={{ width: 15, height: 15, objectFit: "contain" }} />
                {b.krystalov.toLocaleString("sk-SK")}
                {b.bonus > 0 && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#1f8a49",
                      background: "#e3f6ea",
                      border: "1px solid rgba(51,189,99,0.28)",
                      padding: "2px 6px",
                      borderRadius: 6,
                    }}
                  >
                    +{b.bonus} %
                  </span>
                )}
              </span>
              <span style={{ fontSize: 12.5, color: "#8a94a3", fontWeight: 600, whiteSpace: "nowrap" }}>{b.eur} €</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
