"use client";

import { useState } from "react";
import { KATEGORIE, KONKURENCIA_ZONY_KONFIG, ZONY } from "../../lib/katalog";

const NAZVY_JEDNOTNE = {
  penzion: "Penzión",
  parkovisko: "Parkovisko",
  bar: "Bufet",
  hotel: "Hotel",
  servis: "Ski servis",
};

function zostavaCasu(koniecVystavby) {
  const zostava = new Date(koniecVystavby) - new Date();
  if (zostava <= 0) return "Dokončuje sa...";
  const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
  return `${dni} ${dni === 1 ? "deň" : dni < 5 ? "dni" : "dní"}`;
}

export default function KonkurenciaOkno({ konkurenciaJednotky }) {
  const [aktivnaZona, setAktivnaZona] = useState("luka");
  const zonaConfig = KONKURENCIA_ZONY_KONFIG[aktivnaZona];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        {Object.keys(KONKURENCIA_ZONY_KONFIG).map((zk) => (
          <button
            key={zk}
            onClick={() => setAktivnaZona(zk)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: aktivnaZona === zk ? "rgba(47,158,110,0.25)" : "transparent",
              color: aktivnaZona === zk ? "#4ade80" : "#9fb0bf",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {ZONY[zk].ikona} {ZONY[zk].nazov}
          </button>
        ))}
      </div>

      <p style={{ color: "#657685", fontSize: 13, marginTop: 0 }}>
        Zoznam konkurencie v tvojom stredisku.
      </p>

      {Object.keys(zonaConfig).map((kat) => {
        const jednotky = konkurenciaJednotky.filter((k) => k.kategoria === kat && k.zona === aktivnaZona);
        const cfg = zonaConfig[kat];
        const sloty = Array.from({ length: cfg.max }, (_, i) => jednotky[i] || null);
        const nazov = NAZVY_JEDNOTNE[kat] || KATEGORIE[kat].nazov;
        const ikona = KATEGORIE[kat].ikona;

        return (
          <div key={kat} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
            {sloty.map((k, i) => {
              if (k?.stav === "hotovo") {
                return (
                  <div key={k.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(242,73,73,0.15)", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{ikona}</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{nazov}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#f29494" }}>
                      Aktívna · -{Math.round(cfg.stratapenazi * 100)}% dopytu
                    </span>
                  </div>
                );
              }
              if (k?.stav === "vo_vystavbe") {
                return (
                  <div key={k.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(242,153,74,0.15)", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🚧</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{nazov}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#f2994a" }}>Stavia sa · {zostavaCasu(k.koniec_vystavby)}</span>
                  </div>
                );
              }
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, opacity: 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{ikona}</span>
                    <span style={{ fontSize: 14 }}>{nazov}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#657685" }}>Ešte sa neobjavila</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
