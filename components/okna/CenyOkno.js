"use client";

import { useState } from "react";
import { KATEGORIE, odhadovanaCena, skutocnaReferencnaCena, globalnyCenovyMultiplikator, sezonaIndex } from "../../lib/katalog";
import { hernyDatum } from "../../lib/hernyCas";
import { inputStyle } from "../../lib/styles";

export default function CenyOkno({ stanica, budovy, zmenitCenu }) {
  const [zalozka, setZalozka] = useState("ceny");
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo" && KATEGORIE[b.kategoria]?.maCenu);
  const hDatum = hernyDatum(new Date());
  const globalnyMult = globalnyCenovyMultiplikator(stanica, budovy.filter((b) => b.stav === "hotovo"));
  const sezIndex = sezonaIndex(hDatum);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        <button
          onClick={() => setZalozka("ceny")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "ceny" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "ceny" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          💶 Ceny
        </button>
        <button
          onClick={() => setZalozka("prevadzka")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "prevadzka" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "prevadzka" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          🕐 Prevádzková doba
        </button>
      </div>

      {zalozka === "ceny" && (
        <div>
          <p style={{ color: "#657685", fontSize: 12, marginTop: 0, marginBottom: 14 }}>
            Odhadovaná cena je len orientačná (nie je presná). Cenu môžeš meniť raz za herný týždeň.
          </p>
          {hotoveBudovy.length === 0 && <p style={{ color: "#657685", fontSize: 13 }}>Zatiaľ nemáš žiadnu dokončenú budovu s vlastnou cenou.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {hotoveBudovy.map((b) => {
              const info = KATEGORIE[b.kategoria].katalog[b.typ];
              const refCenaDnes = skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult);
              const odhad = odhadovanaCena(stanica.id, b.kategoria, b.typ, sezIndex, refCenaDnes);
              const jeDrahsie = odhad && b.cena > odhad;
              return (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, color: "#e8edf2" }}>{KATEGORIE[b.kategoria].ikona} {info.nazov}</div>
                    <div style={{ fontSize: 11, color: jeDrahsie ? "#f2994a" : "#4ade80" }}>
                      odhadovaná cena: ~{odhad} €
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    defaultValue={b.cena}
                    onBlur={(e) => zmenitCenu(b, Number(e.target.value))}
                    style={{ ...inputStyle, width: 80, textAlign: "right" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {zalozka === "prevadzka" && (
        <p style={{ color: "#657685", fontSize: 13 }}>🚧 Nastavovanie prevádzkovej doby pripravujeme.</p>
      )}
    </div>
  );
}
