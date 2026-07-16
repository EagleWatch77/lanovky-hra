"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

export default function AlianciaOkno({
  stanica,
  aliancie,
  vytvoritAlianciu,
  pripojitSaKAlliancii,
  opustitAllianciu,
  poziadatOVstup,
  mojeZiadosti,
  prijateZiadosti,
  schvalitZiadost,
  zamietnutZiadost,
  prijatePozvanky,
  prijatPozvanku,
  odmietnutPozvanku,
  pozvatHraca,
}) {
  const [zalozka, setZalozka] = useState("konzorcium");
  const [novyNazov, setNovyNazov] = useState("");
  const [hladat, setHladat] = useState("");
  const [clenovia, setClenovia] = useState([]);
  const [hladatHraca, setHladatHraca] = useState("");
  const [vysledkyHraca, setVysledkyHraca] = useState([]);
  const [pozvanyId, setPozvanyId] = useState(null);

  const mojeKonzorcium = aliancie.find((a) => a.id === stanica.aliancia_id);
  const somZakladatel = mojeKonzorcium && mojeKonzorcium.zakladatel_stanica_id === stanica.id;
  const filtrovaneKonzorcia = aliancie.filter((a) => a.nazov.toLowerCase().includes(hladat.toLowerCase()));

  useEffect(() => {
    if (mojeKonzorcium) nacitajClenov();
  }, [mojeKonzorcium?.id]);

  async function nacitajClenov() {
    const { data } = await supabase
      .from("stanice")
      .select("id, nazov, meno_hraca, prestiz")
      .eq("aliancia_id", mojeKonzorcium.id)
      .order("prestiz", { ascending: false });
    setClenovia(data || []);
  }

  async function hladatHracaVRebricku(text) {
    setHladatHraca(text);
    if (!text.trim()) {
      setVysledkyHraca([]);
      return;
    }
    const { data } = await supabase
      .from("rebricek")
      .select("id, nazov, meno_hraca, aliancia_nazov")
      .ilike("nazov", `%${text}%`)
      .limit(10);
    setVysledkyHraca((data || []).filter((r) => r.id !== stanica.id && !r.aliancia_nazov));
  }

  async function odoslatPozvanku(cieloveId) {
    await pozvatHraca(mojeKonzorcium.id, cieloveId);
    setPozvanyId(cieloveId);
  }

  const jeUzPoziadany = (alianciaId) => mojeZiadosti.some((z) => z.aliancia_id === alianciaId && z.typ !== "pozvanka");

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        <button
          onClick={() => setZalozka("konzorcium")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "konzorcium" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "konzorcium" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          {mojeKonzorcium ? "🤝 Moje konzorcium" : "🔍 Hľadať / Vytvoriť"}
        </button>
        <button
          onClick={() => setZalozka("pozvanky")}
          style={{
            position: "relative",
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "pozvanky" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "pozvanky" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          📨 Pozvánky {prijatePozvanky.length > 0 && `(${prijatePozvanky.length})`}
        </button>
      </div>

      {zalozka === "pozvanky" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {prijatePozvanky.length === 0 && <p style={{ color: "#657685", fontSize: 13 }}>Nemáš žiadne čakajúce pozvánky.</p>}
          {prijatePozvanky.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#0f1720", border: "1px solid #2a3744", borderRadius: 8 }}>
              <span>🤝 Pozvánka do <strong>{p.aliancia?.nazov}</strong></span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => prijatPozvanku(p.id, p.aliancia_id)} style={{ ...buttonStyle, padding: "4px 12px", fontSize: 13 }}>Prijať</button>
                <button onClick={() => odmietnutPozvanku(p.id)} style={{ ...buttonStyle, padding: "4px 12px", fontSize: 13, background: "#3a4753" }}>Odmietnuť</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {zalozka === "konzorcium" && mojeKonzorcium && (
        <div>
          <div style={{ ...cardStyle, marginTop: 0, textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>🤝</div>
            <h3 style={{ margin: "8px 0 4px" }}>{mojeKonzorcium.nazov}</h3>
            <p style={{ color: "#9fb0bf", fontSize: 13 }}>
              {somZakladatel ? "Si zakladateľ tohto Ski konzorcia." : "Si členom tohto Ski konzorcia."}
            </p>
            <button onClick={opustitAllianciu} style={{ ...buttonStyle, background: "#3a4753" }}>
              Opustiť Ski konzorcium
            </button>
          </div>

          <div style={{ ...cardStyle, marginTop: 0 }}>
            <h3 style={{ marginTop: 0 }}>Členovia ({clenovia.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {clenovia.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6, fontSize: 13 }}>
                  <span>{c.nazov}{c.meno_hraca && ` (${c.meno_hraca})`}{c.id === mojeKonzorcium.zakladatel_stanica_id && " 👑"}</span>
                  <span style={{ color: "#f2c94c" }}>⭐ {c.prestiz}</span>
                </div>
              ))}
            </div>
          </div>

          {somZakladatel && prijateZiadosti.length > 0 && (
            <div style={{ ...cardStyle, marginTop: 0 }}>
              <h3 style={{ marginTop: 0 }}>Čakajúce žiadosti o vstup</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {prijateZiadosti.map((z) => (
                  <div key={z.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>
                    <span style={{ fontSize: 13 }}>{z.ziadatel?.nazov}{z.ziadatel?.meno_hraca && ` (${z.ziadatel.meno_hraca})`}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => schvalitZiadost(z.id, z.stanica_id, z.aliancia_id)} style={{ ...buttonStyle, padding: "3px 10px", fontSize: 12 }}>Prijať</button>
                      <button onClick={() => zamietnutZiadost(z.id)} style={{ ...buttonStyle, padding: "3px 10px", fontSize: 12, background: "#3a4753" }}>Zamietnuť</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {somZakladatel && (
            <div style={{ ...cardStyle, marginTop: 0 }}>
              <h3 style={{ marginTop: 0 }}>Pozvať hráča</h3>
              <input
                type="text"
                placeholder="🔍 Hľadať podľa názvu strediska..."
                value={hladatHraca}
                onChange={(e) => hladatHracaVRebricku(e.target.value)}
                style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {vysledkyHraca.map((r) => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6, fontSize: 13 }}>
                    <span>{r.nazov}{r.meno_hraca && ` (${r.meno_hraca})`}</span>
                    {pozvanyId === r.id ? (
                      <span style={{ color: "#4ade80", fontSize: 12 }}>Pozvánka odoslaná ✅</span>
                    ) : (
                      <button onClick={() => odoslatPozvanku(r.id)} style={{ ...buttonStyle, padding: "3px 10px", fontSize: 12 }}>Pozvať</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {zalozka === "konzorcium" && !mojeKonzorcium && (
        <div>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>Vytvoriť nové Ski konzorcium</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Názov Ski konzorcia"
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
            <h3 style={{ marginTop: 0 }}>Existujúce Ski konzorciá</h3>
            <input
              type="text"
              placeholder="🔍 Hľadať podľa názvu..."
              value={hladat}
              onChange={(e) => setHladat(e.target.value)}
              style={{ ...inputStyle, width: "100%", marginBottom: 10, boxSizing: "border-box" }}
            />
            {aliancie.length === 0 && <p style={{ color: "#657685", fontSize: 13 }}>Zatiaľ žiadne Ski konzorciá. Buď prvý!</p>}
            {aliancie.length > 0 && filtrovaneKonzorcia.length === 0 && (
              <p style={{ color: "#657685", fontSize: 13 }}>Žiadne Ski konzorcium nezodpovedá hľadaniu.</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtrovaneKonzorcia.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                  <span>🤝 {a.nazov}</span>
                  {jeUzPoziadany(a.id) ? (
                    <span style={{ color: "#9fb0bf", fontSize: 12 }}>Žiadosť odoslaná ⏳</span>
                  ) : (
                    <button onClick={() => poziadatOVstup(a.id)} style={{ ...buttonStyle, padding: "4px 12px", fontSize: 13 }}>
                      Požiadať o vstup
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
