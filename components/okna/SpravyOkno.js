"use client";

import { useState } from "react";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

export default function SpravyOkno({ spravy, oznacitPrecitane, poslatSpravu }) {
  const [odpovedPre, setOdpovedPre] = useState(null);
  const [textOdpovede, setTextOdpovede] = useState("");

  function odoslatOdpoved(komuId) {
    if (!textOdpovede.trim()) return;
    poslatSpravu(komuId, textOdpovede);
    setTextOdpovede("");
    setOdpovedPre(null);
  }

  if (spravy.length === 0) {
    return <p style={{ color: "#657685" }}>Zatiaľ nemáš žiadne správy.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {spravy.map((s) => (
        <div
          key={s.id}
          onClick={() => !s.precitana && oznacitPrecitane(s.id)}
          style={{
            ...cardStyle,
            marginTop: 0,
            background: s.precitana ? "rgba(255,255,255,0.03)" : "rgba(47,158,110,0.12)",
            cursor: s.precitana ? "default" : "pointer",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9fb0bf", marginBottom: 6 }}>
            <span>
              {!s.precitana && "🟢 "}
              Od: <strong style={{ color: "#e8edf2" }}>{s.odosielatel?.meno_hraca || s.odosielatel?.nazov || "Neznámy"}</strong>
            </span>
            <span>{new Date(s.created_at).toLocaleDateString("sk-SK")}</span>
          </div>
          <p style={{ margin: 0, color: "#e8edf2", fontSize: 14 }}>{s.text}</p>

          {odpovedPre === s.id ? (
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <input
                type="text"
                placeholder="Napíš odpoveď..."
                value={textOdpovede}
                onChange={(e) => setTextOdpovede(e.target.value)}
                style={{ ...inputStyle, flex: 1, padding: "6px 10px", fontSize: 13 }}
              />
              <button onClick={() => odoslatOdpoved(s.od_stanica_id)} style={{ ...buttonStyle, padding: "6px 12px", fontSize: 13 }}>
                Odoslať
              </button>
            </div>
          ) : (
            <button
              onClick={() => setOdpovedPre(s.id)}
              style={{ background: "none", border: "none", color: "#4ade80", fontSize: 12, cursor: "pointer", marginTop: 8, padding: 0 }}
            >
              ↩ Odpovedať
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
