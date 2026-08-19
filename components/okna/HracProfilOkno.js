"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { ikonaPodlaKluca } from "../../lib/loga";
import { Star, Handshake, Send, Check, Trophy, Medal, Mountain, Flame, Snowflake, Lock, CalendarDays, User } from "lucide-react";

// ZATIAĽ ZÁSTUPNÉ TROFEJE HRÁČA — neskôr napojíme na reálne úspechy
const TROFEJE = [
  { Ikona: Trophy, nazov: "Víťaz ligy", popis: "Vyhrať ligu na konci herného roka", farba: "#efb23c" },
  { Ikona: Medal, nazov: "Top 10", popis: "Dostať sa do prvej desiatky rebríčka", farba: "#2f8ae0" },
  { Ikona: Mountain, nazov: "Dobyvateľ hôr", popis: "Odomknúť zónu Hory", farba: "#2ca24e" },
  { Ikona: Snowflake, nazov: "Zimný kráľ", popis: "Prekonať 50 000 návštevníkov za sezónu", farba: "#2a9fd6" },
  { Ikona: Flame, nazov: "Vytrvalec", popis: "Hrať nepretržite celý herný rok", farba: "#ef9a3d" },
];

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
        .select("id, nazov, meno_hraca, logo, prestiz, popis, created_at, aliancia_id, udolie_odomknute, hory_odomknute")
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

  return (
    <div>
      {/* Hlavička profilu */}
      <div style={{ ...karta, display: "flex", alignItems: "center", gap: 13 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg,#4aa3ee,#2f92e6)",
            boxShadow: "0 8px 18px rgba(47,146,230,0.32)",
            flexShrink: 0,
          }}
        >
          <LogoIkona size={26} strokeWidth={2} color="#ffffff" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "#1b2c42",
              lineHeight: 1.2,
            }}
          >
            {profil.nazov}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            {profil.meno_hraca && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#8a94a3" }}>
                <User size={12} strokeWidth={2.3} />
                {profil.meno_hraca}
              </span>
            )}
            {vek && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#8a94a3" }}>
                <CalendarDays size={12} strokeWidth={2.3} />
                {vek}
              </span>
            )}
          </div>
        </div>

        {poradie && (
          <div
            style={{
              textAlign: "center",
              padding: "6px 12px",
              borderRadius: 11,
              background: "rgba(120,160,205,0.10)",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 9.5, color: "#8a94a3", fontWeight: 600, letterSpacing: "0.06em" }}>PORADIE</div>
            <div
              style={{
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: "#1b2c42",
              }}
            >
              #{poradie}
            </div>
          </div>
        )}
      </div>

      {/* Štatistiky */}
      <div style={{ ...karta, display: "flex", gap: 8 }}>
        <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 17,
              color: "#1b2c42",
            }}
          >
            <Star size={15} color="#2f8ae0" strokeWidth={2.4} />
            {profil.prestiz.toLocaleString("sk-SK")}
          </div>
          <div style={{ fontSize: 10.5, color: "#8a94a3", marginTop: 3 }}>prestíž</div>
        </div>

        <div style={{ width: 1, background: "rgba(120,160,205,0.18)" }} />

        <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 17,
              color: profil.hory_odomknute ? "#2ca24e" : profil.udolie_odomknute ? "#c9930f" : "#8a94a3",
            }}
          >
            {profil.hory_odomknute ? "Hory" : profil.udolie_odomknute ? "Údolie" : "Lúka"}
          </div>
          <div style={{ fontSize: 10.5, color: "#8a94a3", marginTop: 3 }}>najvyššia zóna</div>
        </div>

        <div style={{ width: 1, background: "rgba(120,160,205,0.18)" }} />

        <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: profil.alianciaNazov ? "#1b2c42" : "#c5d2e0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={profil.alianciaNazov || "Bez konzorcia"}
          >
            <Handshake size={14} color={profil.alianciaNazov ? "#2f8ae0" : "#c5d2e0"} strokeWidth={2.3} />
            {profil.alianciaNazov || "—"}
          </div>
          <div style={{ fontSize: 10.5, color: "#8a94a3", marginTop: 3 }}>konzorcium</div>
        </div>
      </div>

      {/* O hráčovi */}
      <div style={karta}>
        <h3 style={nadpisKarty}>O hráčovi</h3>
        <p
          style={{
            color: profil.popis ? "#5a6f88" : "#aebccd",
            fontSize: 12.5,
            whiteSpace: "pre-wrap",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {profil.popis || "Hráč zatiaľ nenapísal nič o sebe."}
        </p>
      </div>

      {/* Trofeje */}
      <div style={karta}>
        <h3 style={nadpisKarty}>Trofeje</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TROFEJE.map((t) => (
            <div
              key={t.nazov}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 11,
                background: "rgba(120,160,205,0.06)",
                border: "1px solid rgba(120,160,205,0.16)",
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(120,160,205,0.12)",
                  color: "#c5d2e0",
                  flexShrink: 0,
                }}
              >
                <t.Ikona size={16} strokeWidth={2.2} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 12.5,
                    color: "#8a94a3",
                  }}
                >
                  {t.nazov}
                </div>
                <div style={{ fontSize: 11, color: "#aebccd", marginTop: 1, lineHeight: 1.35 }}>{t.popis}</div>
              </div>
              <Lock size={13} color="#c5d2e0" strokeWidth={2.3} style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
        <p style={{ color: "#aebccd", fontSize: 10.5, marginTop: 10, marginBottom: 0, lineHeight: 1.4 }}>
          Trofeje zatiaľ nie sú napojené na reálne dáta.
        </p>
      </div>

      {/* Správa */}
      {!jaSam && (
        <div style={karta}>
          <h3 style={nadpisKarty}>Poslať správu</h3>
          {odoslane ? (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#1f8a49",
                fontSize: 12.5,
                margin: 0,
              }}
            >
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
                rows={3}
                style={{ ...vstup, width: "100%", boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
              />
              <button onClick={odoslat} style={{ ...btn, alignSelf: "flex-start" }}>
                <Send size={14} strokeWidth={2.4} />
                Odoslať
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
