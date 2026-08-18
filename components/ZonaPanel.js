"use client";
import { useState } from "react";
import { ZONY, PORADIE_ZON, LANOVKY_TYPY } from "../lib/katalog";
import { CableCar, Building2, Users, Wrench, Star, Lock, Image as ImageIcon } from "lucide-react";

// Obrázky zón — doplň ďalšie, keď ich vytvoríš
const OBRAZKY_ZON = {
  luka: "/zona-zima.png",
  udolie: "/zona-udolie.png",
  hory: null,
  ladovec: null,
};

export default function ZonaPanel({ stanica, budovy, efektivitaBudovy }) {
  const [index, setIndex] = useState(0);
  const aktivnaZona = PORADIE_ZON[index];

  function dalsiaZona() {
    setIndex((i) => (i + 1) % PORADIE_ZON.length);
  }

  function jeOdomknuta(kluc) {
    if (kluc === "luka") return true;
    if (kluc === "udolie") return !!stanica.udolie_odomknute;
    if (kluc === "hory") return !!stanica.hory_odomknute;
    return false; // ľadovec zatiaľ nedostupný
  }

  const zona = ZONY[aktivnaZona];
  const odomknuta = jeOdomknuta(aktivnaZona);
  const limity = zona.limity || {};
  const obrazok = OBRAZKY_ZON[aktivnaZona];

  // --- REÁLNE čísla z budov ---
  const vZone = budovy.filter((b) => b.zona === aktivnaZona && b.stav !== "zrusene");
  const hotove = vZone.filter((b) => b.stav === "hotovo");
  const voVystavbe = vZone.filter((b) => b.stav === "vo_vystavbe");

  const lanovkoveKluce = Object.keys(limity).filter((k) => LANOVKY_TYPY[k]);
  const lanovkySloty = lanovkoveKluce.reduce((s, k) => s + limity[k], 0);
  const lanovkyPostavene = vZone.filter((b) => b.kategoria === "lanovka").length;

  const vsetkySloty = Object.values(limity).reduce((a, b) => a + b, 0);

  const kapacita = hotove
    .filter((b) => b.kategoria === "lanovka")
    .reduce((s, b) => s + (LANOVKY_TYPY[b.typ]?.kapacita || 0), 0);

  const priemEfekt = hotove.length
    ? Math.round((hotove.reduce((s, b) => s + efektivitaBudovy(b), 0) / hotove.length) * 100)
    : 0;

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
      {/* Hlavička: názov vľavo, stav vpravo */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        <div
          style={{
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "0.02em",
            color: "#1b2c42",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          {zona.nazov}
        </div>
        {odomknuta ? (
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#1f8a49", background: "#e3f6ea", border: "1px solid rgba(51,189,99,0.3)", padding: "3px 9px", borderRadius: 8, flexShrink: 0 }}>
            AKTÍVNA
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#8a94a3", background: "rgba(120,160,205,0.12)", padding: "3px 9px", borderRadius: 8, flexShrink: 0 }}>
            <Lock size={10} /> ZAMKNUTÁ
          </span>
        )}
      </div>

      {/* Obrázok zóny so šípkou na prepínanie */}
      <div
        style={{
          height: 130,
          borderRadius: 13,
          overflow: "hidden",
          border: "1px solid rgba(120,160,205,0.22)",
          boxShadow: "0 4px 14px rgba(60,110,160,0.12)",
          marginBottom: 10,
          background: "linear-gradient(180deg,#d9ecf9,#eaf3fa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {obrazok ? (
          <img
            src={obrazok}
            alt={zona.nazov}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: odomknuta ? "none" : "grayscale(0.7) brightness(0.9)",
            }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "#aebccd" }}>
            <ImageIcon size={22} strokeWidth={1.8} />
            <span style={{ fontSize: 10 }}>Obrázok zatiaľ chýba</span>
          </div>
        )}

        {/* Šípka na ďalšiu zónu */}
        <button
          onClick={dalsiaZona}
          title="Ďalšia zóna"
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: 9,
            border: "1px solid rgba(120,160,205,0.28)",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            color: "#5a6f88",
            fontSize: 15,
            lineHeight: 1,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(60,110,160,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          »
        </button>
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
        </>
      ) : (
        <div style={{ padding: "16px 10px", textAlign: "center", fontSize: 12, color: "#8a94a3" }}>
          Táto zóna sa zatiaľ neodomkla.
        </div>
      )}
    </div>
  );
}
