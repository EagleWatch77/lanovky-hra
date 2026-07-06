"use client";

import {
  ZVYSENIE_PLATU_PERCENTO,
  EFEKTIVITA_PRI_ODMIETNUTI,
  EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI,
} from "../lib/katalog";
import { cardStyle, buttonStyle } from "../lib/styles";

export default function VyjednavanieModal({ ukaz, onVyjednat }) {
  if (!ukaz) return null;

  return (
    <div style={{ ...cardStyle, border: "2px solid #f2994a", background: "#241c14" }}>
      <h3 style={{ marginTop: 0 }}>👷 Zamestnanci žiadajú vyššiu mzdu</h3>
      <p style={{ color: "#e8edf2" }}>
        Je čas na ročné vyjednávanie. Zamestnanci chcú zvýšenie platu o <strong>{ZVYSENIE_PLATU_PERCENTO}%</strong>. Ako sa rozhodneš?
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        <button onClick={() => onVyjednat("prijat")} style={buttonStyle}>
          ✅ Prijať celé (+{ZVYSENIE_PLATU_PERCENTO}% k platu, 100% výkon)
        </button>
        <button onClick={() => onVyjednat("ciastocne")} style={{ ...buttonStyle, background: "#c9822e" }}>
          🤝 Ponúknuť polovicu ({Math.round(EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI * 100)}% výkon)
        </button>
        <button onClick={() => onVyjednat("odmietnut")} style={{ ...buttonStyle, background: "#3a4753" }}>
          ❌ Odmietnuť ({Math.round(EFEKTIVITA_PRI_ODMIETNUTI * 100)}% výkon)
        </button>
      </div>
    </div>
  );
}
