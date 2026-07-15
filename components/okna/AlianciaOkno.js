"use client";

import { useState } from "react";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

export default function AlianciaOkno({ stanica, aliancie, vytvoritAlianciu, pripojitSaKAlliancii, opustitAllianciu }) {
  const [novyNazov, setNovyNazov] = useState("");
  const [hladat, setHladat] = useState("");

  const mojaAliancia = aliancie.find((a) => a.id === stanica.aliancia_id);
  const filtrovaneAliancie = aliancie.filter((a) => a.nazov.toLowerCase().includes(hladat.toLowerCase()));

  if (mojaAliancia) {
    return (
      <div>
        <div style={{ ...cardStyle, marginTop: 0, textAlign: "center" }}>
          <div style={{ fontSize: 28 }}>🤝</div>
          <h3 style={{ margin: "8px 0 4px" }}>{mojaAliancia.nazov}</h3>
          <p style={{ color: "#9fb0bf", fontSize: 13 }}>Si členom tejto aliancie.</p>
          <button onClick={opustitAllianciu} style={{ ...buttonStyle, background: "#3a4753" }}>
            Opustiť alianciu
          </button>
        </div>
        <p style={{ color: "#657685", fontSize: 12 }}>
          Zoznam členov a spoločné projekty aliancie pridáme neskôr.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Vytvoriť novú alianciu</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Názov aliancie"
            value={novyNazov}
            onChange={(e) => setNovyNazov(e.target.value)}
            maxLength={40}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={() => {
              if (novyNazov.trim()) {
                vytvoritAlianciu(novyNazov.trim());
                setNovyNazov("");
              }
            }}
            style={buttonStyle}
          >
            Vytvoriť
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 0 }}>
        <h3 style={{ marginTop: 0 }}>Existujúce aliancie</h3>
        <input
          type="text"
          placeholder="🔍 Hľadať podľa názvu..."
          value={hladat}
          onChange={(e) => setHladat(e.target.value)}
          style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }}
        />
        {aliancie.length === 0 && <p style={{ color: "#657685", fontSize: 13 }}>Zatiaľ žiadne aliancie. Buď prvý!</p>}
        {aliancie.length > 0 && filtrovaneAliancie.length === 0 && (
          <p style={{ color: "#657685", fontSize: 13 }}>Žiadna aliancia nezodpovedá hľadaniu.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtrovaneAliancie.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
              <span>🤝 {a.nazov}</span>
              <button onClick={() => pripojitSaKAlliancii(a.id)} style={{ ...buttonStyle, padding: "4px 12px", fontSize: 13 }}>
                Pripojiť sa
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
