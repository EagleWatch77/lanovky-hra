"use client";

import { useState } from "react";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

const NA_STRANKU = 10;

export default function SpravyOkno({ spravy, oznacitPrecitane, poslatSpravu, vymazatSpravy }) {
  const [otvorenaId, setOtvorenaId] = useState(null);
  const [textOdpovede, setTextOdpovede] = useState("");
  const [odoslane, setOdoslane] = useState(false);
  const [vybrane, setVybrane] = useState([]);
  const [strana, setStrana] = useState(1);

  const otvorena = spravy.find((s) => s.id === otvorenaId);
  const pocetStran = Math.max(1, Math.ceil(spravy.length / NA_STRANKU));
  const spravyNaStranke = spravy.slice((strana - 1) * NA_STRANKU, strana * NA_STRANKU);
  const vsetkyNaStrankeVybrane = spravyNaStranke.length > 0 && spravyNaStranke.every((s) => vybrane.includes(s.id));

  function otvorSpravu(s) {
    if (!s.precitana) oznacitPrecitane(s.id);
    setOtvorenaId(s.id);
    setTextOdpovede("");
    setOdoslane(false);
  }

  function prepnutVyber(id, e) {
    e.stopPropagation();
    setVybrane((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
  }

  function prepnutVsetkyNaStranke() {
    const idNaStranke = spravyNaStranke.map((s) => s.id);
    if (vsetkyNaStrankeVybrane) {
      setVybrane((v) => v.filter((id) => !idNaStranke.includes(id)));
    } else {
      setVybrane((v) => [...new Set([...v, ...idNaStranke])]);
    }
  }

  function vymazatOznacene() {
    if (vybrane.length === 0) return;
    if (!confirm(`Naozaj vymazať ${vybrane.length} vybraných správ?`)) return;
    vymazatSpravy(vybrane);
    if (vybrane.includes(otvorenaId)) setOtvorenaId(null);
    setVybrane([]);
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
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 8px 4px", borderBottom: "1px solid #223040", marginBottom: 8, fontSize: 11, color: "#657685", textTransform: "uppercase", letterSpacing: 0.5 }}>
        <input type="checkbox" checked={vsetkyNaStrankeVybrane} onChange={prepnutVsetkyNaStranke} style={{ flexShrink: 0 }} />
        <div style={{ flex: "2 1 0", minWidth: 0 }}>Predmet</div>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>Od</div>
        <div style={{ width: 70, textAlign: "right", flexShrink: 0 }}>Dátum</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {spravyNaStranke.map((s) => (
          <div
            key={s.id}
            onClick={() => otvorSpravu(s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 4px",
              background: s.precitana ? "rgba(255,255,255,0.03)" : "rgba(47,158,110,0.12)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={vybrane.includes(s.id)}
              onChange={(e) => prepnutVyber(s.id, e)}
              onClick={(e) => e.stopPropagation()}
              style={{ flexShrink: 0 }}
            />
            <div style={{ flex: "2 1 0", minWidth: 0, fontSize: 13, color: "#e8edf2", fontWeight: s.precitana ? 400 : 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {!s.precitana && <span style={{ color: "#4ade80" }}>● </span>}
              {s.predmet || "(bez predmetu)"}
            </div>
            <div style={{ flex: "1 1 0", minWidth: 0, fontSize: 12, color: "#9fb0bf", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {s.odosielatel?.meno_hraca || s.odosielatel?.nazov || "Neznámy"}
            </div>
            <div style={{ width: 70, textAlign: "right", flexShrink: 0, fontSize: 11, color: "#657685" }}>
              {new Date(s.created_at).toLocaleDateString("sk-SK", { day: "2-digit", month: "2-digit" })}
            </div>
          </div>
        ))}
      </div>

      {pocetStran > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 12 }}>
          {Array.from({ length: pocetStran }, (_, i) => i + 1).map((cislo) => (
            <button
              key={cislo}
              onClick={() => setStrana(cislo)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "none",
                background: strana === cislo ? "rgba(47,158,110,0.3)" : "rgba(255,255,255,0.05)",
                color: strana === cislo ? "#4ade80" : "#9fb0bf",
                fontSize: 12,
                fontWeight: strana === cislo ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {cislo}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #223040" }}>
        <button
          onClick={vymazatOznacene}
          disabled={vybrane.length === 0}
          style={{ ...buttonStyle, background: vybrane.length > 0 ? "#c0392b" : "#3a4753", opacity: vybrane.length > 0 ? 1 : 0.6 }}
        >
          🗑 Vymazať vybrané {vybrane.length > 0 && `(${vybrane.length})`}
        </button>
      </div>
    </div>
  );
}
