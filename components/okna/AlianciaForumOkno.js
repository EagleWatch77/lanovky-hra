"use client";

import { useState } from "react";
import { buttonStyle, inputStyle } from "../../lib/styles";

export default function AlianciaForumOkno({ stanica, aliancneSpravy, poslatAliancnuSpravu }) {
  const [text, setText] = useState("");
  const [odpovedNa, setOdpovedNa] = useState(null);

  const spravaPodlaId = Object.fromEntries(aliancneSpravy.map((s) => [s.id, s]));

  function odoslat() {
    if (!text.trim()) return;
    poslatAliancnuSpravu(text, odpovedNa?.id || null);
    setText("");
    setOdpovedNa(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "60vh", maxHeight: 500 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
        {aliancneSpravy.length === 0 && (
          <p style={{ color: "#657685", fontSize: 13, textAlign: "center", marginTop: 20 }}>
            Zatiaľ tu nie sú žiadne príspevky. Napíš prvý!
          </p>
        )}
        {aliancneSpravy.map((s) => {
          const jeMoja = s.od_stanica_id === stanica.id;
          const rodic = s.reply_to ? spravaPodlaId[s.reply_to] : null;
          const jeOdpovedNaMna = rodic && rodic.od_stanica_id === stanica.id;
          return (
            <div
              key={s.id}
              style={{
                alignSelf: jeMoja ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: jeOdpovedNaMna ? "rgba(242,153,74,0.18)" : jeMoja ? "rgba(47,158,110,0.2)" : "rgba(255,255,255,0.05)",
                border: jeOdpovedNaMna ? "1px solid rgba(242,153,74,0.5)" : "none",
                borderRadius: 10,
                padding: "8px 12px",
              }}
            >
              {jeOdpovedNaMna && (
                <div style={{ fontSize: 10, color: "#f2994a", fontWeight: 700, marginBottom: 4 }}>
                  💬 Odpovedali ti
                </div>
              )}
              {rodic && (
                <div style={{ fontSize: 11, color: "#9fb0bf", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "4px 8px", marginBottom: 6, borderLeft: "2px solid #3a4753" }}>
                  ↳ {rodic.odosielatel?.meno_hraca || rodic.odosielatel?.nazov || "Neznámy"}: {rodic.text.length > 60 ? rodic.text.slice(0, 60) + "…" : rodic.text}
                </div>
              )}
              <div style={{ fontSize: 11, color: "#9fb0bf", marginBottom: 3 }}>
                {s.odosielatel?.meno_hraca || s.odosielatel?.nazov || "Neznámy"}
                {" · "}
                {new Date(s.created_at).toLocaleString("sk-SK", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
              <div style={{ fontSize: 14, color: "#e8edf2", whiteSpace: "pre-wrap" }}>{s.text}</div>
              <button
                onClick={() => setOdpovedNa(s)}
                style={{ background: "none", border: "none", color: "#4ade80", fontSize: 11, cursor: "pointer", marginTop: 6, padding: 0 }}
              >
                ↩ Odpovedať
              </button>
            </div>
          );
        })}
      </div>

      {odpovedNa && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "6px 10px", marginTop: 10, fontSize: 12, color: "#9fb0bf" }}>
          <span>
            Odpovedáš na: <strong>{odpovedNa.odosielatel?.meno_hraca || odpovedNa.odosielatel?.nazov}</strong> – {odpovedNa.text.length > 40 ? odpovedNa.text.slice(0, 40) + "…" : odpovedNa.text}
          </span>
          <button onClick={() => setOdpovedNa(null)} style={{ background: "none", border: "none", color: "#f28b8b", cursor: "pointer", fontSize: 14 }}>
            ✕
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12, borderTop: "1px solid #223040", paddingTop: 12 }}>
        <input
          type="text"
          placeholder={odpovedNa ? "Napíš odpoveď..." : "Napíš správu pre konzorcium..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") odoslat();
          }}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button onClick={odoslat} style={buttonStyle}>
          Odoslať
        </button>
      </div>
    </div>
  );
}
