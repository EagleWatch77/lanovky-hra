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
  upravitPopisKonzorcia,
  poziadatOVstup,
  mojeZiadosti,
  prijateZiadosti,
  schvalitZiadost,
  zamietnutZiadost,
  prijatePozvanky,
  prijatPozvanku,
  odmietnutPozvanku,
}) {
  const [zalozka, setZalozka] = useState("konzorcium");
  const [novyNazov, setNovyNazov] = useState("");
  const [hladat, setHladat] = useState("");
  const [clenovia, setClenovia] = useState([]);
  const [popisText, setPopisText] = useState("");
  const [popisUlozeny, setPopisUlozeny] = useState(false);
  const [rozbaleneId, setRozbaleneId] = useState(null);

  const mojeKonzorcium = aliancie.find((a) => a.id === stanica.aliancia_id);
  const somZakladatel = mojeKonzorcium && mojeKonzorcium.zakladatel_stanica_id === stanica.id;
  const filtrovaneKonzorcia = aliancie.filter((a) => a.nazov.toLowerCase().includes(hladat.toLowerCase()));

  useEffect(() => {
    if (mojeKonzorcium) {
      nacitajClenov();
      setPopisText(mojeKonzorcium.popis || "");
    }
  }, [mojeKonzorcium?.id]);

  async function nacitajClenov() {
    const { data } = await supabase
      .from("stanice")
      .select("id, nazov, meno_hraca, prestiz")
      .eq("aliancia_id", mojeKonzorcium.id)
      .order("prestiz", { ascending: false });
    setClenovia(data || []);
  }

  async function odoslatPopis() {
    await upravitPopisKonzorcia(mojeKonzorcium.id, popisText.trim());
    setPopisUlozeny(true);
    setTimeout(() => setPopisUlozeny(false), 2000);
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
        {mojeKonzorcium && (
          <button
            onClick={() => setZalozka("opustit")}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: zalozka === "opustit" ? "rgba(242,73,73,0.2)" : "transparent",
              color: zalozka === "opustit" ? "#f28b8b" : "#9fb0bf", fontSize: 13, cursor: "pointer",
            }}
          >
            🚪 Opustiť
          </button>
        )}
      </div>

      {zalozka === "opustit" && mojeKonzorcium && (
        <div style={{ ...cardStyle, marginTop: 0, textAlign: "center" }}>
          <p style={{ color: "#9fb0bf", fontSize: 13 }}>
            Naozaj chceš opustiť konzorcium <strong>{mojeKonzorcium.nazov}</strong>?
          </p>
          <button onClick={opustitAllianciu} style={{ ...buttonStyle, background: "#c0392b" }}>
            Opustiť Ski konzorcium
          </button>
        </div>
      )}

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
            <p style={{ color: "#9fb0bf", fontSize: 13, marginBottom: 0 }}>
              {somZakladatel ? "Si zakladateľ tohto Ski konzorcia." : "Si členom tohto Ski konzorcia."}
            </p>
          </div>

          <div style={{ ...cardStyle, marginTop: 0 }}>
            <h3 style={{ marginTop: 0 }}>O konzorciu</h3>
            {somZakladatel ? (
              <>
                <textarea
                  placeholder="Napíš niečo o vašom konzorciu (napr. čo hľadáte, ciele, trofeje...)"
                  value={popisText}
                  onChange={(e) => setPopisText(e.target.value)}
                  maxLength={500}
                  rows={4}
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                />
                <button onClick={odoslatPopis} style={{ ...buttonStyle, marginTop: 8 }}>
                  {popisUlozeny ? "Uložené ✅" : "Uložiť popis"}
                </button>
              </>
            ) : (
              <p style={{ color: "#9fb0bf", fontSize: 13, whiteSpace: "pre-wrap" }}>
                {mojeKonzorcium.popis || "Zakladateľ zatiaľ nenapísal žiadny popis."}
              </p>
            )}
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
              {filtrovaneKonzorcia.map((a) => {
                const rozbalene = rozbaleneId === a.id;
                return (
                  <div key={a.id} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, overflow: "hidden" }}>
                    <div
                      onClick={() => setRozbaleneId(rozbalene ? null : a.id)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", cursor: "pointer" }}
                    >
                      <span>🤝 {a.nazov}</span>
                      {jeUzPoziadany(a.id) ? (
                        <span style={{ color: "#9fb0bf", fontSize: 12 }}>Žiadosť odoslaná ⏳</span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            poziadatOVstup(a.id);
                          }}
                          style={{ ...buttonStyle, padding: "4px 12px", fontSize: 13 }}
                        >
                          Požiadať o vstup
                        </button>
                      )}
                    </div>
                    {rozbalene && (
                      <p style={{ padding: "0 12px 12px 12px", margin: 0, color: "#9fb0bf", fontSize: 13, whiteSpace: "pre-wrap" }}>
                        {a.popis || "Toto konzorcium zatiaľ nemá žiadny popis."}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
