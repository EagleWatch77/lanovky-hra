"use client";

import { useState } from "react";
import { KATEGORIE, KONKURENCIA_ZONY_KONFIG, ZONY, OBRAZKY_KONKURENCIE } from "../../lib/katalog";
import { HardHat, CircleSlash, Building2 } from "lucide-react";

const NAZVY_JEDNOTNE = {
  penzion: "Penzión",
  parkovisko: "Parkovisko",
  bufet: "Bufet",
  bar: "Apréski bar",
  hotel: "Hotel",
  servis: "Ski servis",
};

// Ako sa konkurenčná budova volá podľa svojej úrovne
const NAZVY_PODLA_UROVNE = {
  hotel: { 1: "Hotel ★★★", 2: "Hotel ★★★★", 3: "Hotel ★★★★★" },
  parkovisko: { 1: "Štrkové parkovisko", 2: "Asfaltové parkovisko", 3: "Parkovací dom" },
  bufet: { 1: "Malý bufet", 2: "Bufet s terasou", 3: "Veľký bufet" },
};

function nazovKonkurencie(kategoria, uroven) {
  return NAZVY_PODLA_UROVNE[kategoria]?.[uroven || 1] || NAZVY_JEDNOTNE[kategoria] || KATEGORIE[kategoria]?.nazov;
}

function obrazokKonkurencie(kategoria, uroven) {
  const sada = OBRAZKY_KONKURENCIE[kategoria];
  if (!sada) return null;
  return sada[uroven || 1] || sada[1] || null;
}

function zostavaCasu(datum) {
  const zostava = new Date(datum) - new Date();
  if (zostava <= 0) return "Dokončuje sa…";
  const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
  return `${dni} ${dni === 1 ? "deň" : dni < 5 ? "dni" : "dní"}`;
}

export default function KonkurenciaOkno({ konkurenciaJednotky }) {
  const [aktivnaZona, setAktivnaZona] = useState("luka");
  const zonaConfig = KONKURENCIA_ZONY_KONFIG[aktivnaZona];

  function zalozkaStyl(kluc) {
    const aktivna = aktivnaZona === kluc;
    return {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: 11,
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      fontWeight: 600,
      fontSize: 12.5,
      background: aktivna ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "rgba(120,160,205,0.10)",
      color: aktivna ? "#fff" : "#5a6f88",
      boxShadow: aktivna ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
    };
  }

  const riadok = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    marginBottom: 7,
  };

  const obrazokBox = {
    width: 52,
    height: 52,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  };

  const nazovStyl = {
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "#1b2c42",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.keys(KONKURENCIA_ZONY_KONFIG).map((zk) => (
          <button key={zk} onClick={() => setAktivnaZona(zk)} style={zalozkaStyl(zk)}>
            {ZONY[zk].nazov}
          </button>
        ))}
      </div>

      <p style={{ color: "#8a94a3", fontSize: 12, marginTop: 0, marginBottom: 14, lineHeight: 1.5 }}>
        Konkurenčné prevádzky v zóne {ZONY[aktivnaZona].nazov}. Časom rastú spolu so strediskom.
      </p>

      {Object.keys(zonaConfig).map((kat) => {
        const jednotky = konkurenciaJednotky.filter((k) => k.kategoria === kat && k.zona === aktivnaZona);
        const cfg = zonaConfig[kat];
        const sloty = Array.from({ length: cfg.max }, (_, i) => jednotky[i] || null);

        return (
          <div key={kat}>
            {sloty.map((k, i) => {
              // --- Hotová budova ---
              if (k?.stav === "hotovo" && !k.prestavba_koniec) {
                const obrazok = obrazokKonkurencie(kat, k.uroven);
                return (
                  <div
                    key={k.id}
                    style={{
                      ...riadok,
                      background: "#ffffff",
                      border: "1px solid rgba(120,160,205,0.22)",
                      boxShadow: "0 2px 8px rgba(60,110,160,0.07)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                      {obrazok ? (
                        <span style={obrazokBox}>
                          <img src={obrazok} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </span>
                      ) : (
                        <span style={{ ...obrazokBox, background: "rgba(120,160,205,0.10)", color: "#8a94a3" }}>
                          <Building2 size={20} strokeWidth={2} />
                        </span>
                      )}
                      <span style={nazovStyl}>{nazovKonkurencie(kat, k.uroven)}</span>
                    </div>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d64545", flexShrink: 0 }} />
                  </div>
                );
              }

              // --- Prestavuje sa na vyššiu úroveň ---
              if (k?.prestavba_koniec) {
                return (
                  <div
                    key={k.id}
                    style={{
                      ...riadok,
                      background: "#fff7ea",
                      border: "1px solid rgba(239,154,61,0.3)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                      <span style={{ ...obrazokBox, background: "rgba(239,154,61,0.16)", color: "#c9830f" }}>
                        <HardHat size={20} strokeWidth={2.2} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={nazovStyl}>{nazovKonkurencie(kat, (k.uroven || 1) + 1)}</div>
                        <div style={{ fontSize: 11, color: "#c9830f", marginTop: 2 }}>Prestavuje sa</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#c9830f", whiteSpace: "nowrap" }}>
                      {zostavaCasu(k.prestavba_koniec)}
                    </span>
                  </div>
                );
              }

              // --- Vo výstavbe (prvýkrát) ---
              if (k?.stav === "vo_vystavbe") {
                return (
                  <div
                    key={k.id}
                    style={{
                      ...riadok,
                      background: "#fff7ea",
                      border: "1px solid rgba(239,154,61,0.3)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                      <span style={{ ...obrazokBox, background: "rgba(239,154,61,0.16)", color: "#c9830f" }}>
                        <HardHat size={20} strokeWidth={2.2} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={nazovStyl}>{nazovKonkurencie(kat, 1)}</div>
                        <div style={{ fontSize: 11, color: "#c9830f", marginTop: 2 }}>Stavia sa</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#c9830f", whiteSpace: "nowrap" }}>
                      {zostavaCasu(k.koniec_vystavby)}
                    </span>
                  </div>
                );
              }

              // --- Zatiaľ nič ---
              return (
                <div
                  key={i}
                  style={{
                    ...riadok,
                    background: "rgba(120,160,205,0.05)",
                    border: "1px dashed rgba(120,160,205,0.24)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                    <span style={{ ...obrazokBox, background: "rgba(120,160,205,0.10)", color: "#c5d2e0" }}>
                      <CircleSlash size={20} strokeWidth={2} />
                    </span>
                    <span style={{ ...nazovStyl, color: "#8a94a3" }}>{NAZVY_JEDNOTNE[kat] || KATEGORIE[kat]?.nazov}</span>
                  </div>
                  <span style={{ fontSize: 11.5, color: "#aebccd", whiteSpace: "nowrap" }}>Ešte sa neobjavila</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
