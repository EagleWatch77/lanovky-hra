"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { ikonaPodlaKluca } from "../../lib/loga";
import { obrazokRiaditela } from "../../lib/katalog";
import { Handshake, Send, Check, Trophy, Medal, Mountain, Flame, Snowflake, Lock, CalendarDays, User, Award, LayoutDashboard } from "lucide-react";

const TROFEJE = [
  { Ikona: Trophy, nazov: "Víťaz ligy", popis: "Vyhrať ligu na konci herného roka", farba: "#efb23c" },
  { Ikona: Medal, nazov: "Top 10", popis: "Dostať sa do prvej desiatky rebríčka", farba: "#2f8ae0" },
  { Ikona: Mountain, nazov: "Dobyvateľ hôr", popis: "Odomknúť zónu Hory", farba: "#2ca24e" },
  { Ikona: Snowflake, nazov: "Zimný kráľ", popis: "Prekonať 50 000 návštevníkov za sezónu", farba: "#2a9fd6" },
  { Ikona: Flame, nazov: "Vytrvalec", popis: "Hrať nepretržite celý herný rok", farba: "#ef9a3d" },
];

// Ľadová modrá — jednotná farebnosť profilu
const karta = (odtien = "svetla") => {
  const odtiene = {
    svetla: { pozadie: "linear-gradient(180deg,#f4fafe,#e8f3fb)", ramik: "rgba(120,160,205,0.28)" },
    stredna: { pozadie: "linear-gradient(180deg,#eaf4fd,#d9ecf9)", ramik: "rgba(90,150,205,0.34)" },
    biela: { pozadie: "rgba(255,255,255,0.92)", ramik: "rgba(120,160,205,0.24)" },
  };
  const o = odtiene[odtien] || odtiene.svetla;
  return {
    background: o.pozadie,
    border: `1px solid ${o.ramik}`,
    borderRadius: 14,
    boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
    padding: 14,
    marginBottom: 12,
  };
};

const nadpisKarty = {
  display: "flex",
  alignItems: "center",
  gap: 7,
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
  borderRadius: 11,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 12.5,
  cursor: "pointer",
  padding: "10px 15px",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  background: "linear-gradient(180deg,#4aa3ee,#2f92e6)",
  boxShadow: "0 6px 14px rgba(47,146,230,0.26)",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

function vekTextu(createdAt) {
  if (!createdAt) return null;
  const dni = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  if (dni < 1) return "dnes založené";
  if (dni === 1) return "hrá 1 deň";
  if (dni < 31) return `hrá ${dni} dní`;
  const mesiace = Math.floor(dni / 30);
  if (mesiace === 1) return "hrá 1 mesiac";
  if (mesiace < 5) return `hrá ${mesiace} mesiace`;
  if (mesiace < 12) return `hrá ${mesiace} mesiacov`;
  const roky = Math.floor(mesiace / 12);
  return roky === 1 ? "hrá vyše roka" : `hrá vyše ${roky} rokov`;
}

export default function HracProfilOkno({ hracId, poradie, vlastnaStanica, poslatSpravu }) {
  const [zalozka, setZalozka] = useState("prehlad");
  const [profil, setProfil] = useState(null);
  const [nacitavaSa, setNacitavaSa] = useState(true);
  const [predmetSpravy, setPredmetSpravy] = useState("");
  const [textSpravy, setTextSpravy] = useState("");
  const [odoslane, setOdoslane] = useState(false);

  useEffect(() => {
    let zrusene = false;
    async function nacitaj() {
      const { data } = await supabase
        .from("stanice")
        .select(
          "id, nazov, meno_hraca, logo, prestiz, popis, created_at, aliancia_id, pohlavie, udolie_odomknute, hory_odomknute, ladovec_odomknuty"
        )
        .eq("id", hracId)
        .single();

      let alianciaNazov = null;
      if (data?.aliancia_id) {
        const { data: al } = await supabase.from("aliancie").select("nazov").eq("id", data.aliancia_id).single();
        alianciaNazov = al?.nazov || null;
      }

      if (!zrusene) {
        setProfil(data ? { ...data, alianciaNazov } : null);
        setNacitavaSa(false);
      }
    }
    nacitaj();
    return () => {
      zrusene = true;
    };
  }, [hracId]);

  function odoslat() {
    if (!textSpravy.trim()) return;
    poslatSpravu(hracId, textSpravy, predmetSpravy);
    setPredmetSpravy("");
    setTextSpravy("");
    setOdoslane(true);
    setTimeout(() => setOdoslane(false), 3000);
  }

  if (nacitavaSa) return <p style={{ color: "#8a94a3", fontSize: 13 }}>Načítavam…</p>;
  if (!profil) return <p style={{ color: "#8a94a3", fontSize: 13 }}>Profil sa nepodarilo načítať.</p>;

  const LogoIkona = ikonaPodlaKluca(profil.logo);
  const jaSam = vlastnaStanica && profil.id === vlastnaStanica.id;
  const vek = vekTextu(profil.created_at);
  const postava = obrazokRiaditela(profil);

  const najvyssiaZona = profil.ladovec_odomknuty
    ? { nazov: "Ľadovec", farba: "#2a9fd6" }
    : profil.hory_odomknute
    ? { nazov: "Hory", farba: "#2ca24e" }
    : profil.udolie_odomknute
    ? { nazov: "Údolie", farba: "#c9930f" }
    : { nazov: "Lúka", farba: "#8a94a3" };

  function zalozkaStyl(kluc) {
    const aktivna = zalozka === kluc;
    return {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: 11,
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      fontWeight: 600,
      fontSize: 12.5,
      background: aktivna ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "rgba(120,160,205,0.14)",
      color: aktivna ? "#fff" : "#5a6f88",
      boxShadow: aktivna ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
    };
  }

  return (
        <div style={{ position: "relative", height: "calc(70vh - 92px)", overflow: "hidden" }}>
    {/* Postava riaditeľa na pozadí */}
      <img
        src={postava}
        alt=""
        style={{
          position: "absolute",
          right: 0,
                   top: 100,
          bottom: 0,
          width: "50%",
          height: "calc(100% - 100px)",
          objectFit: "contain",
          objectPosition: "bottom right",
          opacity: 0.95,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hlavička — farebná */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
            background: "linear-gradient(135deg,#4aa3ee,#2f92e6)",
            borderRadius: 14,
            boxShadow: "0 8px 22px rgba(47,146,230,0.30)",
            padding: 14,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.22)",
              flexShrink: 0,
            }}
          >
            <LogoIkona size={25} strokeWidth={2} color="#ffffff" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: "#fff",
                lineHeight: 1.2,
              }}
            >
              {profil.nazov}
            </div>
            {profil.alianciaNazov && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "rgba(255,255,255,0.88)", marginTop: 4 }}>
                <Handshake size={12} strokeWidth={2.3} />
                {profil.alianciaNazov}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <div
              style={{
                textAlign: "center",
                padding: "6px 12px",
                borderRadius: 11,
                background: "rgba(255,255,255,0.22)",
              }}
            >
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", fontWeight: 700, letterSpacing: "0.06em" }}>
                PRESTÍŽ
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {profil.prestiz.toLocaleString("sk-SK")}
              </div>
            </div>

            {poradie && (
              <div
                style={{
                  textAlign: "center",
                  padding: "6px 12px",
                  borderRadius: 11,
                  background: "rgba(255,255,255,0.22)",
                }}
              >
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", fontWeight: 700, letterSpacing: "0.06em" }}>
                  PORADIE
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 17,
                    color: "#fff",
                  }}
                >
                  #{poradie}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Záložky */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          <button onClick={() => setZalozka("prehlad")} style={zalozkaStyl("prehlad")}>
            <LayoutDashboard size={14} strokeWidth={2.2} /> Prehľad
          </button>
          <button onClick={() => setZalozka("trofeje")} style={zalozkaStyl("trofeje")}>
            <Award size={14} strokeWidth={2.2} /> Trofeje
          </button>
          {!jaSam && (
            <button onClick={() => setZalozka("sprava")} style={zalozkaStyl("sprava")}>
              <Send size={14} strokeWidth={2.2} /> Správa
            </button>
          )}
        </div>

        {/* --- PREHĽAD --- */}
        {zalozka === "prehlad" && (
          <div style={{ maxWidth: "76%" }}>
            {/* O hráčovi — bez kartičky */}
            <div style={{ marginBottom: 14, paddingLeft: 2 }}>
              <h3 style={{ ...nadpisKarty, marginBottom: 6 }}>
                <User size={15} color="#2f8ae0" strokeWidth={2.3} />
                O hráčovi
              </h3>
              <p
                style={{
                  color: profil.popis ? "#5a6f88" : "#aebccd",
                  fontSize: 12.5,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.55,
                  margin: "0 0 10px 0",
                }}
              >
                {profil.popis || "Hráč zatiaľ nenapísal nič o sebe."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {profil.meno_hraca && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#5a6f88" }}>
                    <User size={13} color="#8a94a3" strokeWidth={2.2} />
                    {profil.meno_hraca}
                  </div>
                )}
                {vek && (
                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#5a6f88" }}>
                    <CalendarDays size={13} color="#8a94a3" strokeWidth={2.2} />
                    {vek}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#5a6f88" }}>
                  <Mountain size={13} color="#8a94a3" strokeWidth={2.2} />
                  Zóna: <strong style={{ color: najvyssiaZona.farba, fontWeight: 700 }}>{najvyssiaZona.nazov}</strong>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- SPRÁVA --- */}
        {zalozka === "sprava" && !jaSam && (
          <div style={{ maxWidth: "76%" }}>
            <div style={karta("biela")}>
              <h3 style={nadpisKarty}>
                <Send size={15} color="#2ca24e" strokeWidth={2.3} />
                Poslať správu
              </h3>
              {odoslane ? (
                <p style={{ display: "flex", alignItems: "center", gap: 6, color: "#1f8a49", fontSize: 12.5, margin: 0 }}>
                  <Check size={14} strokeWidth={2.6} />
                  Správa odoslaná
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <input
                    type="text"
                    placeholder="Predmet…"
                    value={predmetSpravy}
                    onChange={(e) => setPredmetSpravy(e.target.value)}
                    style={{ ...vstup, width: "100%", boxSizing: "border-box" }}
                  />
                  <textarea
                    placeholder="Napíš správu…"
                    value={textSpravy}
                    onChange={(e) => setTextSpravy(e.target.value)}
                    rows={4}
                    style={{ ...vstup, width: "100%", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
                  />
                  <button onClick={odoslat} style={{ ...btn, alignSelf: "flex-start" }}>
                    <Send size={14} strokeWidth={2.4} />
                    Odoslať
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TROFEJE --- */}
        {zalozka === "trofeje" && (
          <div style={{ maxWidth: "76%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {TROFEJE.map((t) => (
                <div
                  key={t.nazov}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "11px 12px",
                    borderRadius: 12,
                    background: "linear-gradient(180deg,#f4fafe,#e8f3fb)",
                    border: "1px solid rgba(120,160,205,0.26)",
                    boxShadow: "0 3px 10px rgba(60,110,160,0.08)",
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(120,160,205,0.16)",
                      color: "#c5d2e0",
                      flexShrink: 0,
                    }}
                  >
                    <t.Ikona size={18} strokeWidth={2.2} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-sora), system-ui, sans-serif",
                        fontWeight: 700,
                        fontSize: 12.5,
                        color: "#5a6f88",
                      }}
                    >
                      {t.nazov}
                    </div>
                    <div style={{ fontSize: 11, color: "#aebccd", marginTop: 1, lineHeight: 1.35 }}>{t.popis}</div>
                  </div>
                  <Lock size={14} color="#c5d2e0" strokeWidth={2.3} style={{ flexShrink: 0 }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10.5, color: "#aebccd", marginTop: 12, marginBottom: 0, lineHeight: 1.45 }}>
              Trofeje zatiaľ nie sú napojené na reálne dáta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
