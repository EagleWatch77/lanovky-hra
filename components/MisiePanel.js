"use client";
import { useState } from "react";
import { Target, Gift } from "lucide-react";

// ZATIAĽ ZÁSTUPNÉ ÚDAJE — neskôr napojíme na reálny postup zo Supabase
const MISIE = [
  { nazov: "Získaj návštevníkov", teraz: 12540, ciel: 15000, format: "cislo" },
  { nazov: "Zarob na príjmoch", teraz: 72300, ciel: 100000, format: "euro" },
  { nazov: "Postav budovy", teraz: 1, ciel: 2, format: "cislo" },
];

const ODMENA = { prestiz: 500, peniaze: 2000 };

function formatuj(hodnota, format) {
  const cislo = hodnota.toLocaleString("sk-SK");
  return format === "euro" ? `${cislo} €` : cislo;
}

export default function MisiePanel() {
  const karta = {
    background: "rgba(255,255,255,0.74)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(120,160,205,0.22)",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(52,100,150,0.16)",
    padding: 12,
  };

  const nadpis = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "#1b2c42",
    marginBottom: 4,
  };

  const splnene = MISIE.filter((m) => m.teraz >= m.ciel).length;

  return (
    <div style={karta}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={nadpis}>
          <Target size={15} color="#2f92e6" strokeWidth={2.2} />
          Týždenné misie
        </div>
        <span
          style={{
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            color: "#5a6f88",
          }}
        >
          {splnene} / {MISIE.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MISIE.map((m) => {
          const podiel = Math.min(1, m.teraz / m.ciel);
          const hotova = m.teraz >= m.ciel;
          return (
            <div key={m.nazov}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
                <span style={{ fontSize: 11.5, color: "#5a6f88", fontWeight: 500 }}>{m.nazov}</span>
                <span
                  style={{
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: 10.5,
                    color: hotova ? "#2ca24e" : "#1b2c42",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatuj(m.teraz, m.format)} / {formatuj(m.ciel, m.format)}
                </span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: "#e4eef7", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${podiel * 100}%`,
                    borderRadius: 4,
                    background: hotova
                      ? "linear-gradient(90deg,#42d675,#33bd63)"
                      : "linear-gradient(90deg,#5fb0f0,#2f92e6)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 11,
          paddingTop: 9,
          borderTop: "1px solid rgba(120,160,205,0.18)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#8a94a3", fontWeight: 600 }}>
          <Gift size={12} color="#8a94a3" /> Odmena
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "var(--font-sora), system-ui, sans-serif", fontWeight: 700, fontSize: 11.5 }}>
          <span style={{ color: "#2f8ae0" }}>★ {ODMENA.prestiz}</span>
          <span style={{ color: "#c9930f" }}>{ODMENA.peniaze.toLocaleString("sk-SK")} €</span>
        </span>
      </div>

      <div style={{ marginTop: 8, fontSize: 9.5, color: "#aebccd", lineHeight: 1.35 }}>
        Postup misií zatiaľ nie je napojený na reálne dáta.
      </div>
    </div>
  );
}
