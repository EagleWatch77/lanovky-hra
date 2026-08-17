"use client";
import { useState } from "react";
import { ZONY, PORADIE_ZON, LANOVKY_TYPY, KATEGORIE } from "../lib/katalog";
import { CableCar, Building2, Users, Coins, Wrench, Star, Lock, ChevronRight } from "lucide-react";

const POPISY_ZON = {
  luka: "Vstupná zóna strediska. Mierne svahy, parkovisko a bufet — tu začína cesta každého návštevníka.",
  udolie: "Srdce strediska s hotelmi, servisom a zázemím pre úpravu zjazdoviek.",
  hory: "Vyššie položená zóna s prístupom na vrchol. Náročnejší terén, vyššia prestíž.",
  ladovec: "Ľadovcová zóna s celoročným snehom. Prémiové prostredie pre náročných.",
};

export default function ZonaPanel({ stanica, budovy, efektivitaBudovy }) {
  const [aktivnaZona, setAktivnaZona] = useState("luka");

  function jeOdomknuta(kluc) {
    if (kluc === "luka") return true;
    if (kluc === "udolie") return !!stanica.udolie_odomknute;
    if (kluc === "hory") return !!stanica.hory_odomknute;
    return false; // ľadovec zatiaľ nedostupný
  }

  const zona = ZONY[aktivnaZona];
  const odomknuta = jeOdomknuta(aktivnaZona);
  const limity = zona.limity || {};

  // --- REÁLNE čísla z budov ---
  const vZone = budovy.filter((b) => b.zona === aktivnaZona && b.stav !== "zrusene");
  const hotove = vZone.filter((b) => b.stav === "hotovo");
  const voVystavbe = vZone.filter((b) => b.stav === "vo_vystavbe");

  // Lanovky: koľko postavených vs. koľko slotov na lanovky v zóne
  const lanovkoveKluce = Object.keys(limity).filter((k) => LANOVKY_TYPY[k]);
  const lanovkySloty = lanovkoveKluce.reduce((s, k) => s + limity[k], 0);
  const lanovkyPostavene = vZone.filter((b) => b.kategoria === "lanovka").length;

  // Budovy celkovo: obsadené sloty vs. všetky sloty zóny
  const vsetkySloty = Object.values(limity).reduce((a, b) => a + b, 0);

  // Kapacita lanoviek (osôb/h) — z hotových
  const kapacita = hotove
    .filter((b) => b.kategoria === "lanovka")
    .reduce((s, b) => s + (LANOVKY_TYPY[b.typ]?.kapacita || 0), 0);

  // Priemerná efektivita (obsadenosť personálom) v zóne
  const priemEfekt = hotove.length
    ? Math.round((hotove.reduce((s, b) => s + efektivitaBudovy(b), 0) / hotove.length) * 100)
    : 0;

  // Hviezdičky podľa efektivity (zatiaľ zástupné za "spokojnosť zóny")
  const hviezdy = Math.max(0, Math.min(5, Math.round(priemEfekt / 20)));

  const karta = {
    background: "rgba(255,255,255,0.74)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(120,160,205,0.22)",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(52,100,150,0.16)",
    padding: 12,
  };

  const riadok = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 2px",
    borderBottom: "1px solid rgba(120,160,205,0.18)",
  };

  const ikonaBox = {
    width: 26,
    height: 26,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eaf4fd",
    color: "#1c6fc4",
    flexShrink: 0,
  };

  const hodnota = {
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "#1b2c42",
  };

  return (
    <div style={karta}>
      {/* Prepínač zón */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {PORADIE_ZON.map((kluc) => {
          const z = ZONY[kluc];
          const aktivna = kluc === aktivnaZona;
          const dostupna = jeOdomknuta(kluc);
          return (
            <button
              key={kluc}
              onClick={() => setAktivnaZona(kluc)}
              title={dostupna ? z.nazov : `${z.nazov} — zatiaľ zamknuté`}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "7px 2px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: aktivna ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "rgba(120,160,205,0.10)",
                color: aktivna ? "#fff" : dostupna ? "#5a6f88" : "#aebccd",
                boxShadow: aktivna ? "0 6px 14px rgba(47,146,230,0.3)" : "none",
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1, opacity: dostupna ? 1 : 0.5 }}>{z.ikona}</span>
              <span style={{ fontSize: 9.5, fontWeight: 600 }}>{z.nazov}</span>
            </button>
          );
        })}
      </div>

      {/* Hlavička zóny */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-sora), system-ui, sans-serif", fontWeight: 800, fontSize: 17, color: "#1b2c42" }}>
          {zona.nazov}
        </div>
        {odomknuta ? (
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#1f8a49", background: "#e3f6ea", border: "1px solid rgba(51,189,99,0.3)", padding: "4px 8px", borderRadius: 8 }}>
            AKTÍVNA
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#8a94a3", background: "rgba(120,160,205,0.12)", padding: "4px 8px", borderRadius: 8 }}>
            <Lock size={10} /> ZAMKNUTÁ
          </span>
        )}
      </div>

      <div style={{ fontSize: 11.5, color: "#5a6f88", lineHeight: 1.45, marginBottom: 6 }}>
        {POPISY_ZON[aktivnaZona]}
      </div>

      {odomknuta ? (
        <>
          <div style={riadok}>
            <span style={ikonaBox}><CableCar size={14} /></span>
            <span style={{ flex: 1, fontSize: 12.5, color: "#5a6f88" }}>Lanovky a vleky</span>
            <span style={hodnota}>{lanovkyPostavene} / {lanovkySloty}</span>
          </div>

          <div style={riadok}>
            <span style={ikonaBox}><Building2 size={14} /></span>
            <span style={{ flex: 1, fontSize: 12.5, color: "#5a6f88" }}>Obsadené sloty</span>
            <span style={hodnota}>{vZone.length} / {vsetkySloty}</span>
          </div>

          <div style={riadok}>
            <span style={ikonaBox}><Users size={14} /></span>
            <span style={{ flex: 1, fontSize: 12.5, color: "#5a6f88" }}>Kapacita prepravy</span>
            <span style={hodnota}>{kapacita} os./h</span>
          </div>

          <div style={riadok}>
            <span style={ikonaBox}><Wrench size={14} /></span>
            <span style={{ flex: 1, fontSize: 12.5, color: "#5a6f88" }}>Obsadenosť personálom</span>
            <span style={{ ...hodnota, color: priemEfekt >= 100 ? "#2ca24e" : priemEfekt >= 60 ? "#c9930f" : "#d64545" }}>
              {priemEfekt} %
            </span>
          </div>

          {voVystavbe.length > 0 && (
            <div style={riadok}>
              <span style={{ ...ikonaBox, background: "#fff4e0", color: "#c9830f" }}><Building2 size={14} /></span>
              <span style={{ flex: 1, fontSize: 12.5, color: "#5a6f88" }}>Vo výstavbe</span>
              <span style={{ ...hodnota, color: "#c9830f" }}>{voVystavbe.length}</span>
            </div>
          )}

          <div style={{ ...riadok, borderBottom: "none" }}>
            <span style={ikonaBox}><Star size={14} /></span>
            <span style={{ flex: 1, fontSize: 12.5, color: "#5a6f88" }}>Hodnotenie zóny</span>
            <span style={{ fontSize: 13, letterSpacing: 1 }}>
              <span style={{ color: "#efb23c" }}>{"★".repeat(hviezdy)}</span>
              <span style={{ color: "#d3ddea" }}>{"★".repeat(5 - hviezdy)}</span>
            </span>
          </div>

          {/* Zatiaľ bez prepočtu — pripravené na napojenie */}
          <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 10, background: "rgba(120,160,205,0.08)", fontSize: 10.5, color: "#8a94a3", lineHeight: 1.4 }}>
            Denný príjem a spokojnosť za zónu zatiaľ nie sú prepočítané samostatne — doplníme neskôr.
          </div>
        </>
      ) : (
        <div style={{ padding: "18px 10px", textAlign: "center", fontSize: 12, color: "#8a94a3" }}>
          Táto zóna sa zatiaľ neodomkla.
        </div>
      )}
    </div>
  );
}
