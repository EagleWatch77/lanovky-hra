"use client";

import { useState } from "react";
import { KATEGORIE, KONKURENCIA_ZONY_KONFIG, ZONY, KONKURENCIA_UROVNE } from "../../lib/katalog";
import { Building2, HardHat, CircleSlash, TrendingDown } from "lucide-react";

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

function zostavaCasu(koniecVystavby) {
  const zostava = new Date(koniecVystavby) - new Date();
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
    padding: "11px 12px",
    borderRadius: 12,
    marginBottom: 7,
  };

  const ikonaBox = (pozadie, farba) => ({
    width: 28,
    height: 28,
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: pozadie,
    color: farba,
    flexShrink: 0,
  });

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
        Konkurenčné prevádzky v zóne {ZONY[aktivnaZona].nazov}. Každá aktívna ti uberá časť dopytu.
      </p>

      {Object.keys(zonaConfig).map((kat) => {
        const jednotky = konkurenciaJednotky.filter((k) => k.kategoria === kat && k.zona === aktivnaZona);
        const cfg = zonaConfig[kat];
        const sloty = Array.from({ length: cfg.max }, (_, i) => jednotky[i] || null);
        const nazov = NAZVY_JEDNOTNE[kat] || KATEGORIE[kat].nazov;

        return (
          <div key={kat}>
            {sloty.map((k, i) => {
              if (k?.stav === "hotovo") {
                return (
                  <div
                    key={k.id}
                    style={{
                      ...riadok,
                      background: "#fdeeee",
                      border: "1px solid rgba(214,69,69,0.25)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={ikonaBox("rgba(214,69,69,0.14)", "#d64545")}>
                        <Building2 size={15} strokeWidth={2.2} />
                      </span>
                    <span style={nazovStyl}>{nazovKonkurencie(kat, k.uroven)}</span>
                    </div>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: "#c0392b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TrendingDown size={13} strokeWidth={2.4} />
                      −{Math.round((KONKURENCIA_UROVNE[k.uroven || 1]?.stratapenazi ?? cfg.stratapenazi) * 100)} % dopytu
                    </span>
                  </div>
                );
              }

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
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span style={ikonaBox("rgba(239,154,61,0.16)", "#c9830f")}>
                        <HardHat size={15} strokeWidth={2.2} />
                      </span>
                      <span style={nazovStyl}>{nazov}</span>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#c9830f", whiteSpace: "nowrap" }}>
                      Stavia sa · {zostavaCasu(k.koniec_vystavby)}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  style={{
                    ...riadok,
                    background: "rgba(120,160,205,0.06)",
                    border: "1px solid rgba(120,160,205,0.16)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span style={ikonaBox("rgba(120,160,205,0.12)", "#aebccd")}>
                      <CircleSlash size={15} strokeWidth={2.2} />
                    </span>
                    <span style={{ ...nazovStyl, color: "#8a94a3" }}>{nazov}</span>
                  </div>
                  <span style={{ fontSize: 11.5, color: "#aebccd", whiteSpace: "nowrap" }}>
                    Ešte sa neobjavila
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
