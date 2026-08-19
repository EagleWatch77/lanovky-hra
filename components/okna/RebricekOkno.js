"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { User, Handshake, Star, Send, Check, Mail } from "lucide-react";

const vstup = {
  padding: "8px 11px",
  borderRadius: 10,
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
  flexShrink: 0,
};

function farbaPoradia(poradie) {
  if (poradie === 1) return { farba: "#c9930f", pozadie: "#fdf4e0" };
  if (poradie === 2) return { farba: "#7d8b9c", pozadie: "#f1f4f8" };
  if (poradie === 3) return { farba: "#b0703c", pozadie: "#fbf0e7" };
  return { farba: "#aebccd", pozadie: "rgba(120,160,205,0.10)" };
}

export default function RebricekOkno({ stanica, poslatSpravu, onOtvorProfil }) {
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
      background: aktivna ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "rgba(120,160,205,0.10)",
      color: aktivna ? "#fff" : "#5a6f88",
      boxShadow: aktivna ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
    };
  }

  if (nacitavaSa) return <p style={{ color: "#8a94a3", fontSize: 13 }}>Načítavam…</p>;

  const konzorciaMapa = {};
  for (const r of rebricek) {
    if (!r.aliancia_nazov) continue;
    if (!konzorciaMapa[r.aliancia_nazov])
      konzorciaMapa[r.aliancia_nazov] = { nazov: r.aliancia_nazov, prestiz: 0, pocetClenov: 0 };
    konzorciaMapa[r.aliancia_nazov].prestiz += r.prestiz;
    konzorciaMapa[r.aliancia_nazov].pocetClenov += 1;
  }
  const konzorciaZoznam = Object.values(konzorciaMapa).sort((a, b) => b.prestiz - a.prestiz);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button onClick={() => setZalozka("hraci")} style={zalozkaStyl("hraci")}>
          <User size={14} strokeWidth={2.2} /> Hráči
        </button>
        <button onClick={() => setZalozka("konzorcia")} style={zalozkaStyl("konzorcia")}>
          <Handshake size={14} strokeWidth={2.2} /> Ski konzorciá
        </button>
      </div>

      {zalozka === "hraci" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {rebricek.map((r, i) => {
            const poradie = i + 1;
            const jeToJa = stanica && r.id === stanica.id;
            const rozbaleny = otvorenyId === r.id;
            const p = farbaPoradia(poradie);

            return (
              <div
                key={r.id}
                style={{
                  borderRadius: 12,
                  background: jeToJa ? "#e9f8ee" : "#ffffff",
                  border: jeToJa ? "1px solid rgba(51,189,99,0.30)" : "1px solid rgba(120,160,205,0.22)",
                  boxShadow: "0 3px 10px rgba(60,110,160,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                 onClick={() => onOtvorProfil && onOtvorProfil(r.id, poradie)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    cursor: jeToJa ? "default" : "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <span
                      style={{
                        minWidth: 28,
                        height: 24,
                        padding: "0 6px",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: p.pozadie,
                        color: p.farba,
                        fontFamily: "var(--font-sora), system-ui, sans-serif",
                        fontWeight: 800,
                        fontSize: 11.5,
                        flexShrink: 0,
                      }}
                    >
                      {poradie}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-sora), system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 13,
                          color: jeToJa ? "#1f8a49" : "#1b2c42",
                        }}
                      >
                        {r.nazov}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                          fontSize: 11,
                          color: "#aebccd",
                          marginTop: 2,
                        }}
                      >
                        {r.meno_hraca && (
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <User size={11} strokeWidth={2.3} />
                            {r.meno_hraca}
                          </span>
                        )}
                        {r.aliancia_nazov && (
                          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <Handshake size={11} strokeWidth={2.3} />
                            {r.aliancia_nazov}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "#1b2c42",
                      flexShrink: 0,
                    }}
                  >
                    <Star size={13} color="#2f8ae0" strokeWidth={2.4} />
                    {r.prestiz.toLocaleString("sk-SK")}
                  </span>
                </div>

                {rozbaleny && !jeToJa && (
                  <div
                    style={{
                      padding: "10px 12px 12px",
                      borderTop: "1px solid rgba(120,160,205,0.16)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {odoslane === r.id ? (
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          color: "#1f8a49",
                          fontSize: 12.5,
                          margin: 0,
                        }}
                      >
                        <Check size={14} strokeWidth={2.6} />
                        Správa odoslaná
                      </p>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#8a94a3" }}>
                          <Mail size={13} strokeWidth={2.3} />
                          Poslať správu hráčovi
                        </div>
                        <input
                          type="text"
                          placeholder="Predmet…"
                          value={predmetSpravy}
                          onChange={(e) => setPredmetSpravy(e.target.value)}
                          style={vstup}
                        />
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            type="text"
                            placeholder="Napíš správu…"
                            value={textSpravy}
                            onChange={(e) => setTextSpravy(e.target.value)}
                            style={{ ...vstup, flex: 1, minWidth: 0 }}
                          />
                          <button onClick={() => odoslatSpravu(r.id)} style={btn}>
                            <Send size={13} strokeWidth={2.4} />
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
          {rebricek.length === 0 && (
            <p style={{ color: "#8a94a3", fontSize: 12.5 }}>Zatiaľ žiadni hráči v rebríčku.</p>
          )}
        </div>
      )}

      {zalozka === "konzorcia" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {konzorciaZoznam.map((k, i) => {
            const poradie = i + 1;
            const p = farbaPoradia(poradie);
            const jeMoje = stanica && k.nazov === rebricek.find((r) => r.id === stanica.id)?.aliancia_nazov;

            return (
              <div
                key={k.nazov}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: jeMoje ? "#e9f8ee" : "#ffffff",
                  border: jeMoje ? "1px solid rgba(51,189,99,0.30)" : "1px solid rgba(120,160,205,0.22)",
                  boxShadow: "0 3px 10px rgba(60,110,160,0.07)",
                  borderRadius: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <span
                    style={{
                      minWidth: 28,
                      height: 24,
                      padding: "0 6px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: p.pozadie,
                      color: p.farba,
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: 11.5,
                      flexShrink: 0,
                    }}
                  >
                    {poradie}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "var(--font-sora), system-ui, sans-serif",
                        fontWeight: 700,
                        fontSize: 13,
                        color: jeMoje ? "#1f8a49" : "#1b2c42",
                      }}
                    >
                      <Handshake size={13} color={jeMoje ? "#1f8a49" : "#2f8ae0"} strokeWidth={2.3} />
                      {k.nazov}
                    </div>
                    <div style={{ fontSize: 11, color: "#aebccd", marginTop: 2 }}>
                      {k.pocetClenov} {k.pocetClenov === 1 ? "člen" : k.pocetClenov < 5 ? "členovia" : "členov"}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#1b2c42",
                    flexShrink: 0,
                  }}
                >
                  <Star size={13} color="#2f8ae0" strokeWidth={2.4} />
                  {k.prestiz.toLocaleString("sk-SK")}
                </span>
              </div>
            );
          })}
          {konzorciaZoznam.length === 0 && (
            <p style={{ color: "#8a94a3", fontSize: 12.5 }}>Zatiaľ žiadne Ski konzorciá.</p>
          )}
        </div>
      )}
    </div>
  );
}
