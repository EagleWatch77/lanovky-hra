"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { buttonStyle, inputStyle } from "../../lib/styles";

export default function RebricekOkno({ stanica, poslatSpravu }) {
  const [rebricek, setRebricek] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);
  const [otvorenyId, setOtvorenyId] = useState(null);
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
    poslatSpravu(komuId, textSpravy);
    setTextSpravy("");
    setOtvorenyId(null);
    setOdoslane(komuId);
    setTimeout(() => setOdoslane(null), 3000);
  }

  if (nacitavaSa) return <p style={{ color: "#9fb0bf" }}>Načítavam...</p>;

  return (
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
              <div style={{ padding: "0 12px 12px 12px" }}>
                {odoslane === r.id ? (
                  <p style={{ color: "#4ade80", fontSize: 13 }}>Správa odoslaná ✅</p>
                ) : (
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
                )}
              </div>
            )}
          </div>
        );
      })}
      {rebricek.length === 0 && <p style={{ color: "#657685" }}>Zatiaľ žiadni hráči v rebríčku.</p>}
    </div>
  );
}
