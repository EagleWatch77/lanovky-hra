"use client";

import { useState } from "react";
import { vypocitajDenoePocasie } from "../lib/pocasie";
import { hernyDatum } from "../lib/hernyCas";
import { cardStyle, linkStyle } from "../lib/styles";

const MAX_DNI = 7;

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
    <div style={{ ...cardStyle, background: "transparent", backdropFilter: "none", border: "none" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        {!kompaktne && (
          <button
            onClick={() => setOffsetDni((d) => Math.max(-MAX_DNI, d - 1))}
            disabled={offsetDni <= -MAX_DNI}
            style={{ ...linkStyle, fontSize: 18, color: "#000", opacity: offsetDni <= -MAX_DNI ? 0.3 : 1 }}
          >
            «
          </button>
        )}
        <h3 style={{ margin: 0, fontSize: 14, color: "#000", fontWeight: 700, textAlign: "center", flex: 1 }}>
          {efektivnyOffset === 0 && "Dnes — "}
          {zobrazovanyDatum.toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" })}
        </h3>
        {!kompaktne && (
          <button
            onClick={() => setOffsetDni((d) => Math.min(MAX_DNI, d + 1))}
            disabled={offsetDni >= MAX_DNI}
            style={{ ...linkStyle, fontSize: 18, color: "#000", opacity: offsetDni >= MAX_DNI ? 0.3 : 1 }}
          >
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
              borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.6)" : "none",
            }}
          >
            <div style={{ fontSize: 12, color: "#000", fontWeight: 600 }}>{p.cas}</div>
            <div style={{ fontSize: 32, margin: "6px 0" }}>{p.ikona}</div>
            <div style={{ fontSize: 13, color: "#000", fontWeight: 600 }}>{p.nazov}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, color: "#000" }}>{p.teplota}°C</div>
            <div style={{ fontSize: 11, color: p.lanovkyZatvorene ? "#c0392b" : "#000", fontWeight: 600, marginTop: 2 }}>
              💨 {p.vietor} m/s{p.lanovkyZatvorene && " ⚠️"}
            </div>
          </div>
        ))}
      </div>
      {(pocasieVsetko[0]?.jeBurka || pocasieVsetko[0]?.jeSilnyVietor) && (
        <p style={{ color: "#c0392b", fontSize: 12, fontWeight: 600, marginTop: 10, marginBottom: 0 }}>
          {pocasieVsetko[0].jeBurka
            ? "⛈️ Búrka — lanovky dnes zarobia o 25 % menej."
            : "💨 Silný vietor — lanovky dnes zarobia o 66 % menej."}
        </p>
      )}
      {!kompaktne && offsetDni !== 0 && (
        <p style={{ color: "#000", fontSize: 11, marginTop: 8, marginBottom: 0 }}>
          Iba dnešné počasie ovplyvňuje tvoj príjem — toto je len náhľad.
        </p>
      )}
    </div>
  );
}
