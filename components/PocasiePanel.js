"use client";

import { useState } from "react";
import { vypocitajDenoePocasie } from "../lib/pocasie";
import { hernyDatum } from "../lib/hernyCas";
import { cardStyle, linkStyle } from "../lib/styles";

const MAX_DNI = 7;

export default function PocasiePanel() {
  const [offsetDni, setOffsetDni] = useState(0);

  const zobrazovanyDatum = hernyDatum(new Date());
  zobrazovanyDatum.setDate(zobrazovanyDatum.getDate() + offsetDni);
  const pocasie = vypocitajDenoePocasie(zobrazovanyDatum);

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button
          onClick={() => setOffsetDni((d) => Math.max(-MAX_DNI, d - 1))}
          disabled={offsetDni <= -MAX_DNI}
          style={{ ...linkStyle, fontSize: 18, opacity: offsetDni <= -MAX_DNI ? 0.3 : 1 }}
        >
          «
        </button>
        <h3 style={{ margin: 0, fontSize: 14, color: "#9fb0bf", fontWeight: 600, textAlign: "center", flex: 1 }}>
          {offsetDni === 0 && "Dnes — "}
          {zobrazovanyDatum.toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" })}
        </h3>
        <button
          onClick={() => setOffsetDni((d) => Math.min(MAX_DNI, d + 1))}
          disabled={offsetDni >= MAX_DNI}
          style={{ ...linkStyle, fontSize: 18, opacity: offsetDni >= MAX_DNI ? 0.3 : 1 }}
        >
          »
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        {pocasie.map((p) => (
          <div key={p.cas} style={{ flex: 1, textAlign: "center", padding: "12px 4px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 12, color: "#657685" }}>{p.cas}</div>
            <div style={{ fontSize: 32, margin: "6px 0" }}>{p.ikona}</div>
            <div style={{ fontSize: 13, color: "#9fb0bf" }}>{p.nazov}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{p.teplota}°C</div>
            <div style={{ fontSize: 11, color: p.lanovkyZatvorene ? "#f2994a" : "#657685", marginTop: 2 }}>
              💨 {p.vietor} m/s{p.lanovkyZatvorene && " ⚠️"}
            </div>
          </div>
        ))}
      </div>
      {pocasie.some((p) => p.lanovkyZatvorene) && (
        <p style={{ color: "#f2994a", fontSize: 12, marginTop: 10, marginBottom: 0 }}>
          ⚠️ Pri takomto vetre lanovky nepremávajú{offsetDni === 0 ? " — dnes to ovplyvní tvoj príjem z lanoviek." : "."}
        </p>
      )}
      {offsetDni !== 0 && (
        <p style={{ color: "#4a5866", fontSize: 11, marginTop: 8, marginBottom: 0 }}>
          Iba dnešné počasie ovplyvňuje tvoj príjem — toto je len náhľad.
        </p>
      )}
    </div>
  );
}
