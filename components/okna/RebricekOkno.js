"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { buttonStyle, inputStyle } from "../../lib/styles";

export default function RebricekOkno({ stanica, poslatSpravu }) {
  const [zalozka, setZalozka] = useState("hraci");
  const [rebricek, setRebricek] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);
  const [otvorenyId, setOtvorenyId] = useState(null);
  const [predmetSpravy, setPredmetSpravy] = useState("");
  const [textSpravy, setTextSpravy] = useState("");
  const [odoslane, setOdoslane] = useState(null);

  useEffect(() => {
    nacitaj();
  }, []);

  async function nacitaj() {
    setNacitavaSa(true);
    const { data } = await supabase.from("rebricek").select("*").order("prestiz", { ascending: false });
    setRebricek(data || []);
    setNacitavaSa(false);
  }

  function odoslatSpravu(komuId) {
    if (!textSpravy.trim()) return;
    poslatSpravu(komuId, textSpravy, predmetSpravy);
    setPredmetSpravy("");
    setTextSpravy("");
    setOtvorenyId(null);
    setOdoslane(komuId);
    setTimeout(() => setOdoslane(null), 3000);
  }

  if (nacitavaSa) return <p style={{ color: "#9fb0bf" }}>Načítavam...</p>;

  const konzorciaMapa = {};
  for (const r of rebricek) {
    if (!r.aliancia_nazov) continue;
    if (!konzorciaMapa[r.aliancia_nazov]) konzorciaMapa[r.aliancia_nazov] = { nazov: r.aliancia_nazov, prestiz: 0, pocetClenov: 0 };
    konzorciaMapa[r.aliancia_nazov].prestiz += r.prestiz;
    konzorciaMapa[r.aliancia_nazov].pocetClenov += 1;
  }
  const konzorciaZoznam = Object.values(konzorciaMapa).sort((a, b) => b.prestiz - a.prestiz);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        <button
          onClick={() => setZalozka("hraci")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "hraci" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "hraci" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          👤 Hráči
        </button>
        <button
          onClick={() => setZalozka("konzorcia")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "konzorcia" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "konzorcia" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          🤝 Ski konzorciá
        </button>
      </div>

      {zalozka === "hraci" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rebricek.map((r, i) => {
            const jeToJa = stanica && r.id === stanica.id;
            const rozbaleny = otvorenyId === r.id;
            return (
              <div
                key={r.id}
                style={{
                  borderRadius: 8,
                  background: jeToJa ? "#16241d" : "#0f1720",
                  border: jeToJa ? "1px solid #2f9e6e" : "1px solid #2a3744",
                  overflow: "hidden",
                }}
              >
                <div
                  onClick={() => !jeToJa && setOtvorenyId(rozbaleny ? null : r.id)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", cursor: jeToJa ? "default" : "pointer" }}
                >
                  <div>
                    <div style={{ color: "#e8edf2" }}>
                      #{i + 1} {r.nazov}
                    </div>
                    <div style={{ fontSize: 12, color: "#657685", marginTop: 2 }}>
                      {r.meno_hraca && <>👤 {r.meno_hraca} </>}
                      {r.aliancia_nazov && <>🤝 {r.aliancia_nazov}</>}
                    </div>
                  </div>
                  <span style={{ color: "#f2c94c", fontWeight: 600 }}>⭐ {r.prestiz}</span>
                </div>

                {rozbaleny && !jeToJa && (
                  <div style={{ padding: "0 12px 12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {odoslane === r.id ? (
                      <p style={{ color: "#4ade80", fontSize: 13 }}>Správa odoslaná ✅</p>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Predmet..."
                          value={predmetSpravy}
                          onChange={(e) => setPredmetSpravy(e.target.value)}
                          style={{ ...inputStyle, padding: "6px 10px", fontSize: 13 }}
                        />
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            type="text"
                            placeholder="Napíš správu..."
                            value={textSpravy}
                            onChange={(e) => setTextSpravy(e.target.value)}
                            style={{ ...inputStyle, flex: 1, padding: "6px 10px", fontSize: 13 }}
                          />
                          <button onClick={() => odoslatSpravu(r.id)} style={{ ...buttonStyle, padding: "6px 12px", fontSize: 13 }}>
                            Odoslať
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {rebricek.length === 0 && <p style={{ color: "#657685" }}>Zatiaľ žiadni hráči v rebríčku.</p>}
        </div>
      )}

      {zalozka === "konzorcia" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {konzorciaZoznam.map((k, i) => (
            <div key={k.nazov} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#0f1720", border: "1px solid #2a3744", borderRadius: 8 }}>
              <div>
                <div style={{ color: "#e8edf2" }}>#{i + 1} 🤝 {k.nazov}</div>
                <div style={{ fontSize: 12, color: "#657685", marginTop: 2 }}>{k.pocetClenov} {k.pocetClenov === 1 ? "člen" : k.pocetClenov < 5 ? "členovia" : "členov"}</div>
              </div>
              <span style={{ color: "#f2c94c", fontWeight: 600 }}>⭐ {k.prestiz}</span>
            </div>
          ))}
          {konzorciaZoznam.length === 0 && <p style={{ color: "#657685" }}>Zatiaľ žiadne Ski konzorciá.</p>}
        </div>
      )}
    </div>
  );
}
