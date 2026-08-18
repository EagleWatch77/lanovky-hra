"use client";
import { Bell, Users, Trophy, Snowflake, Megaphone } from "lucide-react";

// ZATIAĽ ZÁSTUPNÉ UDALOSTI — neskôr napojíme na reálne herné eventy.
// typ určuje farbu a ikonu: "odbory" | "milnik" | "sezona" | "novinka"
const UDALOSTI = [
  {
    typ: "odbory",
    nadpis: "Odbory žiadajú zvýšenie",
    text: "Zamestnanci požadujú +5 % k platom pred koncom roka.",
    cas: "2 d",
  },
];

const STYLY = {
  odbory: { Ikona: Users, farba: "#c9830f", pozadie: "#fff4e0" },
  milnik: { Ikona: Trophy, farba: "#2ca24e", pozadie: "#e3f6ea" },
  sezona: { Ikona: Snowflake, farba: "#1c6fc4", pozadie: "#eaf4fd" },
  novinka: { Ikona: Megaphone, farba: "#8a5fd6", pozadie: "#f1ebfd" },
};

const VYSKA_PANELA = 210;

// Obrázky podľa typu udalosti — doplň ďalšie, keď ich vytvoríš
const OBRAZKY = {
  odbory: "/udalosti-odbory.png",
  milnik: null,
  sezona: null,
  novinka: null,
};

export default function UdalostiPanel({ onOtvorZamestnanci }) {
  const karta = {
    background: "rgba(255,255,255,0.74)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(120,160,205,0.22)",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(52,100,150,0.16)",
    padding: 12,
    height: VYSKA_PANELA,
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
  };

  const prvaUdalost = UDALOSTI[0];
  const obrazok = prvaUdalost ? OBRAZKY[prvaUdalost.typ] : null;

  return (
    <div style={karta}>
      {obrazok && (
        <img
          src={obrazok}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center right",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 13,
            color: "#1b2c42",
          }}
        >
          <Bell size={15} color="#ef9a3d" strokeWidth={2.2} />
          Udalosti
        </div>
        <span
          style={{
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 11,
            color: "#5a6f88",
          }}
        >
          {UDALOSTI.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {UDALOSTI.map((u, i) => {
          const s = STYLY[u.typ] || STYLY.novinka;
          const Ikona = s.Ikona;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 9,
         padding: "2px 0",
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: s.pozadie,
                  color: s.farba,
                  flexShrink: 0,
                }}
              >
                <Ikona size={14} strokeWidth={2.2} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      lineHeight: 1.25,
                      color: "#1b2c42",
                    }}
                  >
                    {u.nadpis}
                  </span>
                  
                  <span
                    style={{
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: 9.5,
                      color: "#aebccd",
                      flexShrink: 0,
                    }}
                  >
                    {u.cas}
                  </span>
                </div>
                    <div style={{ fontSize: 12, color: "#5a6f88", lineHeight: 1.45, marginTop: 5 }}>
                  {u.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
<button
          onClick={onOtvorZamestnanci}
          style={{
            alignSelf: "flex-start",
            marginTop: 44,
            padding: "9px 12px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: "#fff",
            background: "linear-gradient(180deg,#4aa3ee,#2f92e6)",
            boxShadow: "0 8px 16px rgba(47,146,230,0.32)",
          }}
        >
          Prejsť na odbory
        </button>
      </div>
    </div>
  );
}
