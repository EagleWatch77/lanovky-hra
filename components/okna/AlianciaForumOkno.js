"use client";

import { useState } from "react";
import { CornerDownLeft, X, Send, MessageCircle } from "lucide-react";

const vstup = {
  padding: "10px 12px",
  borderRadius: 11,
  border: "1px solid rgba(120,160,205,0.28)",
  background: "#fff",
  color: "#1b2c42",
  fontSize: 13,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  outline: "none",
};

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
    <div style={{ display: "flex", flexDirection: "column", height: "56vh", maxHeight: 500 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 9, paddingRight: 4 }}>
        {aliancneSpravy.length === 0 && (
          <p style={{ color: "#8a94a3", fontSize: 12.5, textAlign: "center", marginTop: 24, lineHeight: 1.5 }}>
            Zatiaľ tu nie sú žiadne príspevky.
            <br />
            Napíš prvý!
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
                background: jeOdpovedNaMna ? "#fff7ea" : jeMoja ? "#e9f8ee" : "#ffffff",
                border: jeOdpovedNaMna
                  ? "1px solid rgba(239,154,61,0.4)"
                  : jeMoja
                  ? "1px solid rgba(51,189,99,0.28)"
                  : "1px solid rgba(120,160,205,0.22)",
                boxShadow: "0 3px 10px rgba(60,110,160,0.07)",
                borderRadius: 13,
                padding: "9px 12px",
              }}
            >
              {jeOdpovedNaMna && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 10,
                    color: "#c9830f",
                    fontWeight: 700,
                    marginBottom: 5,
                  }}
                >
                  <MessageCircle size={11} strokeWidth={2.6} />
                  Odpovedali ti
                </div>
              )}

              {rodic && (
                <div
                  style={{
                    fontSize: 11,
                    color: "#8a94a3",
                    background: "rgba(120,160,205,0.08)",
                    borderRadius: 8,
                    padding: "5px 8px",
                    marginBottom: 6,
                    borderLeft: "2px solid rgba(120,160,205,0.4)",
                    lineHeight: 1.4,
                  }}
                >
                  {rodic.odosielatel?.meno_hraca || rodic.odosielatel?.nazov || "Neznámy"}:{" "}
                  {rodic.text.length > 60 ? rodic.text.slice(0, 60) + "…" : rodic.text}
                </div>
              )}

              <div style={{ fontSize: 10.5, color: "#aebccd", marginBottom: 4, fontWeight: 600 }}>
                {s.odosielatel?.meno_hraca || s.odosielatel?.nazov || "Neznámy"}
                {" · "}
                {new Date(s.created_at).toLocaleString("sk-SK", {
                  day: "numeric",
                  month: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              <div style={{ fontSize: 13, color: "#1b2c42", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{s.text}</div>

              <button
                onClick={() => setOdpovedNa(s)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "none",
                  border: "none",
                  color: "#2f8ae0",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 6,
                  padding: 0,
                }}
              >
                <CornerDownLeft size={12} strokeWidth={2.4} />
                Odpovedať
              </button>
            </div>
          );
        })}
      </div>

      {odpovedNa && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            background: "rgba(120,160,205,0.10)",
            border: "1px solid rgba(120,160,205,0.22)",
            borderRadius: 11,
            padding: "8px 10px",
            marginTop: 10,
            fontSize: 11.5,
            color: "#5a6f88",
          }}
        >
          <span style={{ minWidth: 0, lineHeight: 1.4 }}>
            Odpovedáš na:{" "}
            <strong style={{ color: "#1b2c42" }}>
              {odpovedNa.odosielatel?.meno_hraca || odpovedNa.odosielatel?.nazov}
            </strong>{" "}
            – {odpovedNa.text.length > 40 ? odpovedNa.text.slice(0, 40) + "…" : odpovedNa.text}
          </span>
          <button
            onClick={() => setOdpovedNa(null)}
            title="Zrušiť odpoveď"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              color: "#8a94a3",
              cursor: "pointer",
              flexShrink: 0,
              padding: 2,
            }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          borderTop: "1px solid rgba(120,160,205,0.20)",
          paddingTop: 12,
        }}
      >
        <input
          type="text"
          placeholder={odpovedNa ? "Napíš odpoveď…" : "Napíš správu pre konzorcium…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") odoslat();
          }}
          style={{ ...vstup, flex: 1, minWidth: 0 }}
        />
        <button
          onClick={odoslat}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "10px 16px",
            borderRadius: 11,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 12.5,
            color: "#fff",
            background: "linear-gradient(180deg,#4aa3ee,#2f92e6)",
            boxShadow: "0 6px 14px rgba(47,146,230,0.28)",
            flexShrink: 0,
          }}
        >
          <Send size={14} strokeWidth={2.4} />
          Odoslať
        </button>
      </div>
    </div>
  );
}
