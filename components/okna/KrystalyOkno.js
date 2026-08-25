"use client";

import { OBRAZOK_KRYSTAL, OBRAZOK_KRYSTALY, BALICKY_KRYSTALOV } from "../../lib/katalog";

// Farebné odlíšenie balíčkov — od chladnej modrej po sýtu, najväčší je zlatý
const VZHLAD = {
  5:   { pozadie: "linear-gradient(180deg,#eaf4fd,#d4e9f8)", ramik: "rgba(120,160,205,0.35)", text: "#1b2c42", stitok: null },
  10:  { pozadie: "linear-gradient(180deg,#dceefb,#bfdff5)", ramik: "rgba(90,145,200,0.42)", text: "#1b2c42", stitok: null },
  20:  { pozadie: "linear-gradient(180deg,#cbe6fa,#a3d0f0)", ramik: "rgba(60,130,195,0.5)", text: "#12283e", stitok: null },
  50:  { pozadie: "linear-gradient(180deg,#a9d8f7,#6fb8e8)", ramik: "rgba(40,115,185,0.6)", text: "#0d2438", stitok: "NAJPREDÁVANEJŠÍ" },
  100: { pozadie: "linear-gradient(180deg,#f7e3a8,#eec455)", ramik: "rgba(190,145,25,0.6)", text: "#4a3608", stitok: "NAJLEPŠIA HODNOTA" },
};

export default function KrystalyOkno({ stanica }) {
  const krystaly = stanica.krystaly ?? 0;

  return (
    <div>
      {/* Zostatok */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "linear-gradient(180deg,#ffffff,#f2f8fd)",
          border: "1px solid rgba(120,160,205,0.26)",
          borderRadius: 14,
          boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
          padding: 14,
          marginBottom: 20,
        }}
      >
        <img src={OBRAZOK_KRYSTALY} alt="" style={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 11.5, color: "#8a94a3", marginBottom: 2 }}>Tvoj zostatok</div>
          <div
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: "#1b2c42",
              lineHeight: 1.1,
            }}
          >
            {krystaly.toLocaleString("sk-SK")}
          </div>
        </div>
      </div>

      {/* Balíčky — všetky v jednom riadku */}
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        {BALICKY_KRYSTALOV.map((b) => {
          const v = VZHLAD[b.eur] || VZHLAD[5];
          return (
            <div
              key={b.eur}
              style={{
                flex: 1,
                minWidth: 0,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 9,
                padding: v.stitok ? "24px 8px 12px" : "16px 8px 12px",
                borderRadius: 14,
                background: v.pozadie,
                border: `1px solid ${v.ramik}`,
                boxShadow: "0 5px 16px rgba(50,95,145,0.14)",
              }}
            >
              {v.stitok && (
                <span
                  style={{
                    position: "absolute",
                    top: 7,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 8,
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                    color: b.eur === 100 ? "#4a3608" : "#0d2438",
                    background: "rgba(255,255,255,0.75)",
                    padding: "2px 7px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {v.stitok}
                </span>
              )}

              <img
                src={b.bonus >= 20 ? OBRAZOK_KRYSTALY : OBRAZOK_KRYSTAL}
                alt=""
                style={{ width: 46, height: 46, objectFit: "contain" }}
              />

              <div
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: v.text,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {b.krystalov.toLocaleString("sk-SK")}
              </div>

              <div style={{ height: 15, display: "flex", alignItems: "center" }}>
                {b.bonus > 0 && (
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: "#1f8a49",
                      background: "rgba(255,255,255,0.8)",
                      padding: "2px 7px",
                      borderRadius: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    +{b.bonus} %
                  </span>
                )}
              </div>

              <button
                disabled
                style={{
                  width: "100%",
                  padding: "9px 6px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "not-allowed",
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#fff",
                  background: "rgba(70,105,145,0.55)",
                  whiteSpace: "nowrap",
                }}
              >
                {b.eur} €
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 11, color: "#aebccd", marginTop: 16, marginBottom: 0, lineHeight: 1.5, textAlign: "center" }}>
        Nákup kryštálov zatiaľ nie je spustený. Pripravujeme ho.
      </p>
    </div>
  );
}
