"use client";

import { KATEGORIE, turistiZaHodinu } from "../lib/katalog";
import { cardStyle } from "../lib/styles";

export default function LanovkyPanel({ budovy, efektivitaBudovy }) {
  const lanovky = budovy.filter((b) => b.kategoria === "lanovka" && b.stav === "hotovo");

  if (lanovky.length === 0) return null;

  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, fontSize: 14, color: "#9fb0bf", fontWeight: 600 }}>🚡 Lanovky</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lanovky.map((b) => {
          const info = KATEGORIE.lanovka.katalog[b.typ];
          const efektivitaB = efektivitaBudovy(b);
          const turisti = turistiZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB;
          const vytazenost = Math.round((turisti / info.kapacita) * 100);

          return (
            <div key={b.id}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span>{info.nazov}</span>
                <span style={{ color: "#9fb0bf" }}>{info.kapacita}/h</span>
              </div>
              <div style={{ height: 6, background: "#1c2833", borderRadius: 4, marginTop: 4, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(100, vytazenost)}%`,
                    height: "100%",
                    background: vytazenost > 85 ? "#4ade80" : vytazenost > 50 ? "#f2c94c" : "#7fb8e0",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: "#657685", marginTop: 2 }}>{vytazenost}% vyťaženosť</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
