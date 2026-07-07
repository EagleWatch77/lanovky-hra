"use client";

import { useGameState } from "../../lib/useGameState";
import AuthForm from "../../components/AuthForm";

const ZONY = [
  { nazov: "🌾 Lúka", popis: "Štartovacia zóna — odomknutá od začiatku", tmavost: 0.35 },
  { nazov: "🌲 Hory", popis: "Odomkne sa peniazmi + prestížou", tmavost: 0.45 },
  { nazov: "⛰️ Vysoké hory", popis: "Odomkne sa peniazmi + prestížou (vyššie prahy)", tmavost: 0.55 },
  { nazov: "🧊 Ľadovec", popis: "Vyžaduje alianciu — príde neskôr", tmavost: 0.65 },
];

// Ukážkové sloty na test — súradnice v % (left, top), zatiaľ nefunkčné, len vizuálne
const UKAZKOVE_SLOTY = [
  { left: "30%", top: "45%" },
  { left: "55%", top: "60%" },
  { left: "70%", top: "35%" },
];

export default function MapaPage() {
  const { session } = useGameState();

  if (!session) return <AuthForm />;

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {ZONY.map((zona, i) => {
        const offsetVh = (ZONY.length - 1 - i) * 100;
        return (
          <div
            key={zona.nazov}
            style={{
              height: "100vh",
              scrollSnapAlign: "start",
              position: "relative",
              backgroundImage: `url("/mapa-hory.png")`,
              backgroundSize: "100% 400vh",
              backgroundPosition: `center -${offsetVh}vh`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: `rgba(5,9,13,${zona.tmavost})` }} />

            <div style={{ position: "relative", padding: 24, color: "#e8edf2" }}>
              <h2 style={{ margin: 0, fontSize: 24 }}>{zona.nazov}</h2>
              <p style={{ color: "#9fb0bf", marginTop: 4 }}>{zona.popis}</p>
              <p style={{ color: "#4a5866", fontSize: 12, marginTop: 8 }}>
                Zóna {i + 1} / {ZONY.length} — skroluj myšou hore/dole medzi zónami
              </p>
            </div>

            {UKAZKOVE_SLOTY.map((s, si) => (
              <div
                key={si}
                style={{
                  position: "absolute",
                  left: s.left,
                  top: s.top,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "2px dashed #9fb0bf",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  color: "#e8edf2",
                  cursor: "pointer",
                }}
                onClick={() => alert(`Tu by sa otvoril výber budovy pre zónu "${zona.nazov}", slot ${si + 1}`)}
              >
                +
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
