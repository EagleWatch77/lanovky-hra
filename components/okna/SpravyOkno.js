"use client";

import { useState } from "react";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

export default function SpravyOkno({ spravy, oznacitPrecitane, poslatSpravu }) {
  const [otvorenaId, setOtvorenaId] = useState(null);
  const [textOdpovede, setTextOdpovede] = useState("");
  const [odoslane, setOdoslane] = useState(false);

  const otvorena = spravy.find((s) => s.id === otvorenaId);

  function otvorSpravu(s) {
    if (!s.precitana) oznacitPrecitane(s.id);
    setOtvorenaId(s.id);
    setTextOdpovede("");
    setOdoslane(false);
  }

  function odoslatOdpoved() {
    if (!textOdpovede.trim() || !otvorena) return;
    const predmetOdpovede = otvorena.predmet?.startsWith("Re: ") ? otvorena.predmet : `Re: ${otvorena.predmet || ""}`;
    poslatSpravu(otvorena.od_stanica_id, textOdpovede, predmetOdpovede);
    setTextOdpovede("");
    setOdoslane(true);
    setTimeout(() => setOdoslane(false), 3000);
  }

  if (spravy.length === 0) {
    return <p style={{ color: "#657685" }}>Zatiaľ nemáš žiadne správy.</p>;
  }

  if (otvorena) {
    return (
      <div>
        <button
          onClick={() => setOtvorenaId(null)}
          style={{ background: "none", border: "none", color: "#9fb0bf", cursor: "pointer", fontSize: 13, marginBottom: 12, padding: 0 }}
        >
          ← Späť na zoznam
        </button>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 8 }}>{otvorena.predmet || "(bez predmetu)"}</h3>
          <div style={{ fontSize: 12, color: "#9fb0bf", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #223040" }}>
            Od: <strong style={{ color: "#e8edf2" }}>{otvorena.odosielatel?.meno_hraca || otvorena.odosielatel?.nazov || "Neznámy"}</strong>
            {" · "}
            {new Date(otvorena.created_at).toLocaleString("sk-SK", { day: "numeric", month: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
          <p style={{ fontSize: 14, color: "#e8edf2", whiteSpace: "pre-wrap" }}>{otvorena.text}</p>

          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #223040" }}>
            {odoslane ? (
              <p style={{ color: "#4ade80", fontSize: 13 }}>Odpoveď odoslaná ✅</p>
            ) : (
              <>
                <textarea
                  placeholder="Napíš odpoveď..."
                  value={textOdpovede}
                  onChange={(e) => setTextOdpovede(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                />
                <button onClick={odoslatOdpoved} style={{ ...buttonStyle, marginTop: 8 }}>
                  Odoslať odpoveď
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {spravy.map((s) => (
        <div
          key={s.id}
          onClick={() => otvorSpravu(s)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            background: s.precitana ? "rgba(255,255,255,0.03)" : "rgba(47,158,110,0.12)",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, color: "#9fb0bf", display: "flex", alignItems: "center", gap: 6 }}>
              {!s.precitana && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }} />}
              {s.odosielatel?.meno_hraca || s.odosielatel?.nazov || "Neznámy"}
            </div>
            <div style={{ fontSize: 14, color: "#e8edf2", fontWeight: s.precitana ? 400 : 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.predmet || "(bez predmetu)"}
            </div>
          </div>
          <span style={{ fontSize: 11, color: "#657685", whiteSpace: "nowrap", marginLeft: 12 }}>
            {new Date(s.created_at).toLocaleDateString("sk-SK")}
          </span>
        </div>
      ))}
    </div>
  );
}
