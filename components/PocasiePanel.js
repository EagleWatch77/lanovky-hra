"use client";
import { useState } from "react";
import { vypocitajDenoePocasie } from "../lib/pocasie";
import { hernyDatum } from "../lib/hernyCas";

const MAX_DNI = 7;

const kartaStyl = {
  background: "rgba(255,255,255,0.74)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(120,160,205,0.22)",
  borderRadius: 18,
  boxShadow: "0 10px 30px rgba(52,100,150,0.16)",
  padding: 12,
};

const sipkaStyl = (disabled) => ({
  background: "transparent",
  border: "none",
  fontSize: 18,
  color: "#5a6f88",
  cursor: disabled ? "default" : "pointer",
  opacity: disabled ? 0.3 : 1,
  padding: "0 4px",
  lineHeight: 1,
});

export default function PocasiePanel({ kompaktne = false }) {
  const [offsetDni, setOffsetDni] = useState(0);
  const efektivnyOffset = kompaktne ? 0 : offsetDni;
  const zobrazovanyDatum = hernyDatum(new Date());
  zobrazovanyDatum.setDate(zobrazovanyDatum.getDate() + efektivnyOffset);
  const pocasieVsetko = vypocitajDenoePocasie(zobrazovanyDatum);
  const aktualnaHodina = new Date().getHours();
  let indexUseku = 2;
  if (aktualnaHodina < 10) indexUseku = 0;
  else if (aktualnaHodina < 14) indexUseku = 1;
  const pocasie = kompaktne ? [pocasieVsetko[indexUseku]] : pocasieVsetko;

  return (
    <div style={kartaStyl}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        {!kompaktne && (
          <button onClick={() => setOffsetDni((d) => Math.max(-MAX_DNI, d - 1))} disabled={offsetDni <= -MAX_DNI} style={sipkaStyl(offsetDni <= -MAX_DNI)}>
            «
          </button>
        )}
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            color: "#1b2c42",
            fontWeight: 700,
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            textAlign: "center",
            flex: 1,
          }}
        >
          {efektivnyOffset === 0 && "Dnes — "}
          {zobrazovanyDatum.toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" })}
        </h3>
        {!kompaktne && (
          <button onClick={() => setOffsetDni((d) => Math.min(MAX_DNI, d + 1))} disabled={offsetDni >= MAX_DNI} style={sipkaStyl(offsetDni >= MAX_DNI)}>
            »
          </button>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 0 }}>
        {pocasie.map((p, i) => (
          <div
            key={p.cas}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "12px 6px",
              borderLeft: i > 0 ? "1px solid rgba(120,160,205,0.25)" : "none",
            }}
          >
            <div style={{ fontSize: 12, color: "#5a6f88", fontWeight: 600 }}>{p.cas}</div>
            <div style={{ fontSize: 32, margin: "6px 0" }}>{p.ikona}</div>
            <div style={{ fontSize: 13, color: "#1b2c42", fontWeight: 600 }}>{p.nazov}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: "#1b2c42", fontFamily: "var(--font-sora), system-ui, sans-serif" }}>
              {p.teplota}°C
            </div>
            <div style={{ fontSize: 11, color: p.lanovkyZatvorene ? "#d64545" : "#5a6f88", fontWeight: 600, marginTop: 2 }}>
              💨 {p.vietor} m/s{p.lanovkyZatvorene && " ⚠️"}
            </div>
          </div>
        ))}
      </div>

      {(pocasieVsetko[0]?.jeBurka || pocasieVsetko[0]?.jeSilnyVietor) && (
        <p
          style={{
            color: "#c0392b",
            fontSize: 12,
            fontWeight: 600,
            marginTop: 10,
            marginBottom: 0,
            background: "rgba(214,69,69,0.10)",
            border: "1px solid rgba(214,69,69,0.25)",
            borderRadius: 10,
            padding: "8px 10px",
          }}
        >
          {pocasieVsetko[0].jeBurka
            ? "⛈️ Búrka — lanovky dnes zarobia o 25 % menej."
            : "💨 Silný vietor — lanovky dnes zarobia o 66 % menej."}
        </p>
      )}

      {!kompaktne && offsetDni !== 0 && (
        <p style={{ color: "#5a6f88", fontSize: 11, marginTop: 8, marginBottom: 0 }}>
          Iba dnešné počasie ovplyvňuje tvoj príjem — toto je len náhľad.
        </p>
      )}
    </div>
  );
}
