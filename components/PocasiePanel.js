"use client";

import { vypocitajDenoePocasie } from "../lib/pocasie";
import { cardStyle } from "../lib/styles";

export default function PocasiePanel() {
  const teraz = new Date();
  const pocasie = vypocitajDenoePocasie(teraz);

  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, fontSize: 14, color: "#9fb0bf", fontWeight: 600 }}>
        {teraz.toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" })}
      </h3>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        {pocasie.map((p) => (
          <div key={p.cas} style={{ flex: 1, textAlign: "center", padding: "12px 4px", borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ fontSize: 12, color: "#657685" }}>{p.cas}</div>
            <div style={{ fontSize: 32, margin: "6px 0" }}>{p.ikona}</div>
            <div style={{ fontSize: 13, color: "#9fb0bf" }}>{p.nazov}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{p.teplota}°C</div>
            <div style={{ fontSize: 11, color: "#657685", marginTop: 2 }}>💨 {p.vietor} km/h</div>
          </div>
        ))}
      </div>
    </div>
  );
}
