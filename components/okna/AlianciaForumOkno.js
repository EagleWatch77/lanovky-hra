"use client";

import { useState } from "react";
import { buttonStyle, inputStyle } from "../../lib/styles";

export default function AlianciaForumOkno({ stanica, aliancneSpravy, poslatAliancnuSpravu }) {
  const [text, setText] = useState("");

  function odoslat() {
    if (!text.trim()) return;
    poslatAliancnuSpravu(text);
    setText("");
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
          return (
            <div
              key={s.id}
              style={{
                alignSelf: jeMoja ? "flex-end" : "flex-start",
                maxWidth: "80%",
                background: jeMoja ? "rgba(47,158,110,0.2)" : "rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "8px 12px",
              }}
            >
              <div style={{ fontSize: 11, color: "#9fb0bf", marginBottom: 3 }}>
                {s.odosielatel?.meno_hraca || s.odosielatel?.nazov || "Neznámy"}
                {" · "}
                {new Date(s.created_at).toLocaleString("sk-SK", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
              <div style={{ fontSize: 14, color: "#e8edf2", whiteSpace: "pre-wrap" }}>{s.text}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12, borderTop: "1px solid #223040", paddingTop: 12 }}>
        <input
          type="text"
          placeholder="Napíš správu pre konzorcium..."
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
