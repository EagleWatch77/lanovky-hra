"use client";

import { useEffect, useState } from "react";
import { Mail, Users, Search, Handshake, Crown, LogOut, Star, Check, Clock, UserPlus, Send, Trophy, Medal, Flame, Mountain, Snowflake, Lock } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const karta = {
  background: "#ffffff",
  border: "1px solid rgba(120,160,205,0.22)",
  borderRadius: 14,
  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
  padding: 14,
  marginBottom: 12,
};

const nadpisKarty = {
  margin: "0 0 10px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

const vstup = {
  padding: "9px 11px",
  borderRadius: 11,
  border: "1px solid rgba(120,160,205,0.28)",
  background: "#fff",
  color: "#1b2c42",
  fontSize: 12.5,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  outline: "none",
};

const btn = {
  border: "none",
  borderRadius: 10,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 12,
  cursor: "pointer",
  padding: "8px 13px",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  background: "linear-gradient(180deg,#4aa3ee,#2f92e6)",
  boxShadow: "0 6px 14px rgba(47,146,230,0.26)",
  whiteSpace: "nowrap",
};

const btnBiely = {
  ...btn,
  background: "#fff",
  color: "#5a6f88",
  border: "1px solid rgba(120,160,205,0.28)",
  boxShadow: "none",
};

const btnCerveny = {
  ...btn,
  background: "#fff",
  color: "#d64545",
  border: "1px solid rgba(214,69,69,0.35)",
  boxShadow: "none",
};

const riadok = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  padding: "9px 11px",
  background: "rgba(120,160,205,0.06)",
  border: "1px solid rgba(120,160,205,0.16)",
  borderRadius: 11,
  fontSize: 12.5,
  color: "#1b2c42",
};

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
  poslatSpravu,
  nacitajMojeZiadosti,
  pozvatHraca,
  vyhoditClena,
}) {
  const [zalozka, setZalozka] = useState("konzorcium");
  const [novyNazov, setNovyNazov] = useState("");
  const [hladat, setHladat] = useState("");
  const [clenovia, setClenovia] = useState([]);
  const [popisText, setPopisText] = useState("");
  const [popisUlozeny, setPopisUlozeny] = useState(false);
  const [rozbaleneId, setRozbaleneId] = useState(null);
  const [spravaPreId, setSpravaPreId] = useState(null);
  const [predmetSpravy, setPredmetSpravy] = useState("");
  const [textSpravy, setTextSpravy] = useState("");
  const [odoslaneId, setOdoslaneId] = useState(null);
  const [hladatHraca, setHladatHraca] = useState("");
  const [vysledkyHraca, setVysledkyHraca] = useState([]);
  const [pozvanyId, setPozvanyId] = useState(null);

  useEffect(() => {
    nacitajMojeZiadosti();
  }, []);

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
      .order("prestiz", { ascending: false })
      .order("id", { ascending: true });
    setClenovia(data || []);
  }

  async function odoslatPopis() {
    await upravitPopisKonzorcia(mojeKonzorcium.id, popisText.trim());
    setPopisUlozeny(true);
    setTimeout(() => setPopisUlozeny(false), 2000);
  }

  function odoslatSpravu(komuId) {
    if (!textSpravy.trim()) return;
    poslatSpravu(komuId, textSpravy, predmetSpravy);
    setPredmetSpravy("");
    setTextSpravy("");
    setSpravaPreId(null);
    setOdoslaneId(komuId);
    setTimeout(() => setOdoslaneId(null), 3000);
  }

  async function vyhoditClenaAObnovit(clenId) {
    if (!confirm("Naozaj chceš vyhodiť tohto člena z konzorcia?")) return;
    await vyhoditClena(clenId);
    await nacitajClenov();
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

  const jeUzPoziadany = (alianciaId) =>
    mojeZiadosti.some((z) => z.aliancia_id === alianciaId && z.typ !== "pozvanka" && z.stav === "cakajuca");

  function zalozkaStyl(kluc, cervena = false) {
    const aktivna = zalozka === kluc;
    return {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 13px",
      borderRadius: 11,
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      fontWeight: 600,
      fontSize: 12.5,
      background: aktivna
        ? cervena
          ? "#fdeeee"
          : "linear-gradient(160deg,#4aa3ee,#2f92e6)"
        : "rgba(120,160,205,0.10)",
      color: aktivna ? (cervena ? "#d64545" : "#fff") : "#5a6f88",
      boxShadow: aktivna && !cervena ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
    };
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setZalozka("konzorcium")} style={zalozkaStyl("konzorcium")}>
          {mojeKonzorcium ? <Handshake size={14} strokeWidth={2.2} /> : <Search size={14} strokeWidth={2.2} />}
          {mojeKonzorcium ? "Moje konzorcium" : "Hľadať / Vytvoriť"}
        </button>
        <button onClick={() => setZalozka("pozvanky")} style={zalozkaStyl("pozvanky")}>
          <Mail size={14} strokeWidth={2.2} />
          Pozvánky
          {prijatePozvanky.length > 0 && (
            <span
              style={{
                minWidth: 17,
                height: 17,
                padding: "0 4px",
                borderRadius: 9,
                background: zalozka === "pozvanky" ? "rgba(255,255,255,0.28)" : "#ef9a3d",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sora), system-ui, sans-serif",
              }}
            >
              {prijatePozvanky.length}
            </span>
          )}
        </button>
        {mojeKonzorcium && (
          <button onClick={() => setZalozka("opustit")} style={zalozkaStyl("opustit", true)}>
            <LogOut size={14} strokeWidth={2.2} />
            Opustiť
          </button>
        )}
      </div>

      {zalozka === "opustit" && mojeKonzorcium && (
        <div style={{ ...karta, textAlign: "center" }}>
          <p style={{ color: "#5a6f88", fontSize: 12.5, lineHeight: 1.5, marginTop: 0 }}>
            Naozaj chceš opustiť konzorcium <strong style={{ color: "#1b2c42" }}>{mojeKonzorcium.nazov}</strong>?
          </p>
          <button onClick={opustitAllianciu} style={{ ...btnCerveny, padding: "11px 16px", fontSize: 12.5 }}>
            <LogOut size={14} strokeWidth={2.4} />
            Opustiť Ski konzorcium
          </button>
        </div>
      )}

      {zalozka === "pozvanky" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {prijatePozvanky.length === 0 && (
            <p style={{ color: "#8a94a3", fontSize: 12.5 }}>Nemáš žiadne čakajúce pozvánky.</p>
          )}
          {prijatePozvanky.map((p) => (
            <div key={p.id} style={{ ...riadok, background: "#ffffff", boxShadow: "0 3px 10px rgba(60,110,160,0.07)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <Handshake size={15} color="#2f8ae0" strokeWidth={2.2} />
                Pozvánka do <strong>{p.aliancia?.nazov}</strong>
              </span>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button onClick={() => prijatPozvanku(p.id, p.aliancia_id)} style={btn}>
                  Prijať
                </button>
                <button onClick={() => odmietnutPozvanku(p.id)} style={btnBiely}>
                  Odmietnuť
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {zalozka === "konzorcium" && mojeKonzorcium && (
        <div>
          <div style={{ ...karta, textAlign: "center" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(160deg,#4aa3ee,#2f92e6)",
                boxShadow: "0 8px 18px rgba(47,146,230,0.32)",
              }}
            >
              <Handshake size={22} color="#fff" strokeWidth={2.2} />
            </div>
            <h3
              style={{
                margin: "10px 0 3px",
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: "#1b2c42",
              }}
            >
              {mojeKonzorcium.nazov}
            </h3>
            <p style={{ color: "#8a94a3", fontSize: 12, marginBottom: 0, marginTop: 0 }}>
              {somZakladatel ? "Si zakladateľ tohto Ski konzorcia." : "Si členom tohto Ski konzorcia."}
            </p>
          </div>

          <div style={karta}>
            <h3 style={nadpisKarty}>O konzorciu</h3>
            {somZakladatel ? (
              <>
                <textarea
                  placeholder="Napíš niečo o vašom konzorciu (napr. čo hľadáte, ciele, trofeje…)"
                  value={popisText}
                  onChange={(e) => setPopisText(e.target.value)}
                  maxLength={500}
                  rows={4}
                  style={{ ...vstup, width: "100%", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
                />
                <button onClick={odoslatPopis} style={{ ...btn, marginTop: 8 }}>
                  {popisUlozeny ? (
                    <>
                      <Check size={14} strokeWidth={2.6} />
                      Uložené
                    </>
                  ) : (
                    "Uložiť popis"
                  )}
                </button>
              </>
            ) : (
              <p style={{ color: "#5a6f88", fontSize: 12.5, whiteSpace: "pre-wrap", lineHeight: 1.55, margin: 0 }}>
                {mojeKonzorcium.popis || "Zakladateľ zatiaľ nenapísal žiadny popis."}
              </p>
            )}
          </div>

          <div style={karta}>
            <h3 style={nadpisKarty}>Členovia ({clenovia.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {clenovia.map((c) => {
                const jeToJa = c.id === stanica.id;
                const jeZakladatel = c.id === mojeKonzorcium.zakladatel_stanica_id;
                const rozbaleny = spravaPreId === c.id;
                return (
                  <div
                    key={c.id}
                    style={{
                      background: jeToJa ? "#e9f8ee" : "rgba(120,160,205,0.06)",
                      border: jeToJa ? "1px solid rgba(51,189,99,0.26)" : "1px solid rgba(120,160,205,0.16)",
                      borderRadius: 11,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 11px",
                        fontSize: 12.5,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, color: "#1b2c42" }}>
                        {c.nazov}
                        {c.meno_hraca && <span style={{ color: "#8a94a3" }}>({c.meno_hraca})</span>}
                        {jeZakladatel && <Crown size={13} color="#efb23c" strokeWidth={2.4} />}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontFamily: "var(--font-sora), system-ui, sans-serif",
                            fontWeight: 700,
                            fontSize: 12,
                            color: "#1b2c42",
                          }}
                        >
                          <Star size={12} color="#2f8ae0" strokeWidth={2.4} />
                          {c.prestiz}
                        </span>
                        {!jeToJa && (
                          <button
                            onClick={() => setSpravaPreId(rozbaleny ? null : c.id)}
                            title="Poslať správu"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              background: "transparent",
                              border: "none",
                              color: "#5a6f88",
                              cursor: "pointer",
                              padding: 2,
                            }}
                          >
                            <Mail size={15} strokeWidth={2.2} />
                          </button>
                        )}
                        {somZakladatel && !jeToJa && !jeZakladatel && (
                          <button
                            onClick={() => vyhoditClenaAObnovit(c.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#d64545",
                              cursor: "pointer",
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "2px 4px",
                            }}
                          >
                            Vyhodiť
                          </button>
                        )}
                      </div>
                    </div>

                    {rozbaleny && (
                      <div style={{ padding: "0 11px 11px" }}>
                        {odoslaneId === c.id ? (
                          <p
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              color: "#1f8a49",
                              fontSize: 12,
                              margin: 0,
                            }}
                          >
                            <Check size={13} strokeWidth={2.6} />
                            Správa odoslaná
                          </p>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <input
                              type="text"
                              placeholder="Predmet…"
                              value={predmetSpravy}
                              onChange={(e) => setPredmetSpravy(e.target.value)}
                              style={{ ...vstup, padding: "7px 10px", fontSize: 12 }}
                            />
                            <div style={{ display: "flex", gap: 6 }}>
                              <input
                                type="text"
                                placeholder="Napíš správu…"
                                value={textSpravy}
                                onChange={(e) => setTextSpravy(e.target.value)}
                                style={{ ...vstup, flex: 1, minWidth: 0, padding: "7px 10px", fontSize: 12 }}
                              />
                              <button onClick={() => odoslatSpravu(c.id)} style={btn}>
                                <Send size={13} strokeWidth={2.4} />
                                Odoslať
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {somZakladatel && prijateZiadosti.length > 0 && (
            <div style={karta}>
              <h3 style={nadpisKarty}>Čakajúce žiadosti o vstup</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {prijateZiadosti.map((z) => (
                  <div key={z.id} style={riadok}>
                    <span style={{ minWidth: 0 }}>
                      {z.ziadatel?.nazov}
                      {z.ziadatel?.meno_hraca && <span style={{ color: "#8a94a3" }}> ({z.ziadatel.meno_hraca})</span>}
                    </span>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => schvalitZiadost(z.id, z.stanica_id, z.aliancia_id)} style={btn}>
                        Prijať
                      </button>
                      <button onClick={() => zamietnutZiadost(z.id, z.stanica_id, z.aliancia_id)} style={btnBiely}>
                        Zamietnuť
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {somZakladatel && (
            <div style={karta}>
              <h3 style={nadpisKarty}>Pozvať hráča</h3>
              <input
                type="text"
                placeholder="Hľadať podľa názvu strediska…"
                value={hladatHraca}
                onChange={(e) => hladatHracaVRebricku(e.target.value)}
                style={{ ...vstup, width: "100%", marginBottom: 10, boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {vysledkyHraca.map((r) => (
                  <div key={r.id} style={riadok}>
                    <span style={{ minWidth: 0 }}>
                      {r.nazov}
                      {r.meno_hraca && <span style={{ color: "#8a94a3" }}> ({r.meno_hraca})</span>}
                    </span>
                    {pozvanyId === r.id ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          color: "#1f8a49",
                          fontSize: 11.5,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        <Check size={13} strokeWidth={2.6} />
                        Odoslaná
                      </span>
                    ) : (
                      <button onClick={() => odoslatPozvanku(r.id)} style={btn}>
                        <UserPlus size={13} strokeWidth={2.4} />
                        Pozvať
                      </button>
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
          <div style={karta}>
            <h3 style={nadpisKarty}>Vytvoriť nové Ski konzorcium</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Názov Ski konzorcia"
                value={novyNazov}
                onChange={(e) => setNovyNazov(e.target.value)}
                maxLength={40}
                style={{ ...vstup, flex: 1, minWidth: 0 }}
              />
              <button
                onClick={() => {
                  if (novyNazov.trim()) {
                    vytvoritAlianciu(novyNazov.trim());
                    setNovyNazov("");
                  }
                }}
                style={btn}
              >
                Vytvoriť
              </button>
            </div>
          </div>

          <div style={karta}>
            <h3 style={nadpisKarty}>Existujúce Ski konzorciá</h3>
            <input
              type="text"
              placeholder="Hľadať podľa názvu…"
              value={hladat}
              onChange={(e) => setHladat(e.target.value)}
              style={{ ...vstup, width: "100%", marginBottom: 10, boxSizing: "border-box" }}
            />
            {aliancie.length === 0 && (
              <p style={{ color: "#8a94a3", fontSize: 12.5 }}>Zatiaľ žiadne Ski konzorciá. Buď prvý!</p>
            )}
            {aliancie.length > 0 && filtrovaneKonzorcia.length === 0 && (
              <p style={{ color: "#8a94a3", fontSize: 12.5 }}>Žiadne Ski konzorcium nezodpovedá hľadaniu.</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {filtrovaneKonzorcia.map((a) => {
                const rozbalene = rozbaleneId === a.id;
                return (
                  <div
                    key={a.id}
                    style={{
                      background: "rgba(120,160,205,0.06)",
                      border: "1px solid rgba(120,160,205,0.16)",
                      borderRadius: 11,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => setRozbaleneId(rozbalene ? null : a.id)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 11px",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          fontFamily: "var(--font-sora), system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 12.5,
                          color: "#1b2c42",
                          minWidth: 0,
                        }}
                      >
                        <Handshake size={14} color="#2f8ae0" strokeWidth={2.2} />
                        {a.nazov}
                      </span>
                      {jeUzPoziadany(a.id) ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: "#c9830f",
                            fontSize: 11.5,
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          <Clock size={12} strokeWidth={2.4} />
                          Žiadosť odoslaná
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            poziadatOVstup(a.id);
                          }}
                          style={btn}
                        >
                          Požiadať o vstup
                        </button>
                      )}
                    </div>
                    {rozbalene && (
                      <p
                        style={{
                          padding: "0 11px 11px",
                          margin: 0,
                          color: "#5a6f88",
                          fontSize: 12,
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.5,
                        }}
                      >
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
