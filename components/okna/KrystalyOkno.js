"use client";

import { OBRAZOK_KRYSTAL, OBRAZOK_KRYSTALY, BALICKY_KRYSTALOV } from "../../lib/katalog";

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
          background: "#ffffff",
          border: "1px solid rgba(120,160,205,0.22)",
          borderRadius: 14,
          boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
          padding: 14,
          marginBottom: 16,
        }}
      >
        <img src={OBRAZOK_KRYSTALY} alt="" style={{ width: 56, height: 56, objectFit: "contain", flexShrink: 0 }} />
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

      {/* Balíčky vedľa seba */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 10,
        }}
      >
        {BALICKY_KRYSTALOV.map((b) => (
          <div
            key={b.eur}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "18px 12px 14px",
              borderRadius: 14,
              background: "#ffffff",
              border: b.bonus >= 30 ? "1px solid rgba(47,146,230,0.4)" : "1px solid rgba(120,160,205,0.22)",
              boxShadow: b.bonus >= 30 ? "0 6px 18px rgba(47,146,230,0.16)" : "0 4px 14px rgba(60,110,160,0.10)",
            }}
          >
            {b.bonus > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -9,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "#fff",
                  background: "linear-gradient(180deg,#42d675,#33bd63)",
                  padding: "3px 9px",
                  borderRadius: 7,
                  whiteSpace: "nowrap",
                  boxShadow: "0 3px 8px rgba(51,189,99,0.32)",
                }}
              >
                +{b.bonus} % navyše
              </span>
            )}

            <img
              src={b.bonus >= 20 ? OBRAZOK_KRYSTALY : OBRAZOK_KRYSTAL}
              alt=""
              style={{ width: b.bonus >= 20 ? 52 : 40, height: 52, objectFit: "contain" }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: "#1b2c42",
              }}
            >
              {b.krystalov.toLocaleString("sk-SK")}
            </div>

            <button
              disabled
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "not-allowed",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#fff",
                background: "#c5d2e0",
              }}
            >
              {b.eur} €
            </button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#aebccd", marginTop: 14, marginBottom: 0, lineHeight: 1.5, textAlign: "center" }}>
        Nákup kryštálov zatiaľ nie je spustený. Pripravujeme ho.
      </p>
    </div>
  );
}
