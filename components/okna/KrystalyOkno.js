"use client";

import { useState } from "react";
import {
  OBRAZOK_KRYSTAL,
  OBRAZOK_KRYSTALY,
  BALICKY_KRYSTALOV,
  AUTO_CENY_SEZONA_KRYSTALOV,
  AUTO_CENY_ROK_KRYSTALOV,
  CENY_V_KRYSTALOCH,
  KATEGORIE,
  POZVANKA_ODMENA_POZYVAJUCI,
  POZVANKA_ODMENA_POZVANY,
  POZVANKA_PODMIENKA_PRESTIZ_BUDOVY,
  POZVANKA_PODMIENKA_DNI,
} from "../../lib/katalog";
import { ShoppingCart, Sparkles, UserPlus, Wand2, Building2, Copy, Check } from "lucide-react";

// Farebné odlíšenie balíčkov
const VZHLAD = {
  5:   { pozadie: "linear-gradient(180deg,#eaf4fd,#d4e9f8)", ramik: "rgba(120,160,205,0.35)", text: "#1b2c42", stitok: null },
  10:  { pozadie: "linear-gradient(180deg,#dceefb,#bfdff5)", ramik: "rgba(90,145,200,0.42)", text: "#1b2c42", stitok: null },
  20:  { pozadie: "linear-gradient(180deg,#cbe6fa,#a3d0f0)", ramik: "rgba(60,130,195,0.5)", text: "#12283e", stitok: null },
  50:  { pozadie: "linear-gradient(180deg,#a9d8f7,#6fb8e8)", ramik: "rgba(40,115,185,0.6)", text: "#0d2438", stitok: "NAJPREDÁVANEJŠÍ" },
  100: { pozadie: "linear-gradient(180deg,#f7e3a8,#eec455)", ramik: "rgba(190,145,25,0.6)", text: "#4a3608", stitok: "NAJLEPŠIA HODNOTA" },
};

const KATEGORIE_S_PREMIOM = ["lanovka", "hotel", "parkovisko", "ratrak", "zasnezovanie"];

const karta = {
  background: "#ffffff",
  border: "1px solid rgba(120,160,205,0.22)",
  borderRadius: 14,
  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
  padding: 14,
  marginBottom: 12,
};

const nadpisKarty = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  margin: "0 0 4px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

export default function KrystalyOkno({ stanica, kupitAutoCeny }) {
  const [zalozka, setZalozka] = useState("kupit");
  const krystaly = stanica.krystaly ?? 0;

  const autoDo = stanica.auto_ceny_do ? new Date(stanica.auto_ceny_do) : null;
  const autoAktivne = autoDo && autoDo > new Date();

  // Prémiové budovy z katalógu
  const premiove = [];
  for (const kat of KATEGORIE_S_PREMIOM) {
    const katalog = KATEGORIE[kat]?.katalog || {};
    for (const typ of Object.keys(katalog)) {
      if (!katalog[typ].premiova) continue;
      premiove.push({ typ, nazov: katalog[typ].nazov, popis: katalog[typ].popis, cena: CENY_V_KRYSTALOCH[typ] || 0 });
    }
  }
  premiove.sort((a, b) => a.cena - b.cena);

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

  return (
    <div>
      {/* Zostatok */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: "linear-gradient(180deg,#ffffff,#f2f8fd)",
          border: "1px solid rgba(120,160,205,0.26)",
          borderRadius: 14,
          boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
          padding: 14,
          marginBottom: 14,
        }}
      >
        <img src={OBRAZOK_KRYSTALY} alt="" style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 11.5, color: "#8a94a3", marginBottom: 2 }}>Tvoj zostatok</div>
          <div
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: "#1b2c42",
              lineHeight: 1.1,
            }}
          >
            {krystaly.toLocaleString("sk-SK")}
          </div>
        </div>
      </div>

      {/* Záložky */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setZalozka("kupit")} style={zalozkaStyl("kupit")}>
          <ShoppingCart size={14} strokeWidth={2.2} /> Kúpiť kryštály
        </button>
        <button onClick={() => setZalozka("vyhody")} style={zalozkaStyl("vyhody")}>
          <Sparkles size={14} strokeWidth={2.2} /> Výhody
        </button>
        <button onClick={() => setZalozka("kamarat")} style={zalozkaStyl("kamarat")}>
          <UserPlus size={14} strokeWidth={2.2} /> Pozvi kamaráta
        </button>
      </div>

      {/* --- KÚPIŤ KRYŠTÁLY --- */}
      {zalozka === "kupit" && (
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
            {BALICKY_KRYSTALOV.map((b) => {
              const v = VZHLAD[b.eur] || VZHLAD[5];
              return (
                <div
                  key={b.eur}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 9,
                    padding: v.stitok ? "24px 8px 12px" : "16px 8px 12px",
                    borderRadius: 14,
                    background: v.pozadie,
                    border: `1px solid ${v.ramik}`,
                    boxShadow: "0 5px 16px rgba(50,95,145,0.14)",
                  }}
                >
                  {v.stitok && (
                    <span
                      style={{
                        position: "absolute",
                        top: 7,
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 8,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        color: b.eur === 100 ? "#4a3608" : "#0d2438",
                        background: "rgba(255,255,255,0.75)",
                        padding: "2px 7px",
                        borderRadius: 6,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {v.stitok}
                    </span>
                  )}

                  <img
                    src={b.bonus >= 20 ? OBRAZOK_KRYSTALY : OBRAZOK_KRYSTAL}
                    alt=""
                    style={{ width: 44, height: 44, objectFit: "contain" }}
                  />

                  <div
                    style={{
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: 16,
                      color: v.text,
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.krystalov.toLocaleString("sk-SK")}
                  </div>

                  <div style={{ height: 15, display: "flex", alignItems: "center" }}>
                    {b.bonus > 0 && (
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: "#1f8a49",
                          background: "rgba(255,255,255,0.8)",
                          padding: "2px 7px",
                          borderRadius: 6,
                          whiteSpace: "nowrap",
                        }}
                      >
                        +{b.bonus} %
                      </span>
                    )}
                  </div>

                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "9px 6px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "not-allowed",
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 800,
                      fontSize: 14,
                      color: "#fff",
                      background: "rgba(70,105,145,0.55)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.eur} €
                  </button>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: 11, color: "#aebccd", marginTop: 14, marginBottom: 0, lineHeight: 1.5, textAlign: "center" }}>
            Nákup kryštálov zatiaľ nie je spustený. Pripravujeme ho.
          </p>
        </div>
      )}

      {/* --- VÝHODY --- */}
      {zalozka === "vyhody" && (
        <div>
          {/* Automatické ceny */}
          <div style={karta}>
            <h3 style={nadpisKarty}>
              <Wand2 size={15} color="#2f8ae0" strokeWidth={2.3} />
              Automatické ceny
            </h3>
            <p style={{ fontSize: 11.5, color: "#5a6f88", lineHeight: 1.5, marginTop: 0, marginBottom: 11 }}>
              Nastavovanie cien je automatické. Kedykoľvek môžeš zasiahnuť ručne.
            </p>

            {autoAktivne ? (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 11,
                  background: "#e3f6ea",
                  border: "1px solid rgba(51,189,99,0.3)",
                  fontSize: 12,
                  color: "#1f8a49",
                  fontWeight: 600,
                }}
              >
                Zapnuté do{" "}
                {autoDo.toLocaleDateString("sk-SK", { day: "numeric", month: "numeric", year: "numeric" })}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { obdobie: "sezona", cena: AUTO_CENY_SEZONA_KRYSTALOV, popis: "Sezóna" },
                  { obdobie: "rok", cena: AUTO_CENY_ROK_KRYSTALOV, popis: "Herný rok" },
                ].map((v) => {
                  const maNa = krystaly >= v.cena;
                  return (
                    <button
                      key={v.obdobie}
                      onClick={() => maNa && kupitAutoCeny?.(v.obdobie)}
                      disabled={!maNa}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        padding: "10px 12px",
                        borderRadius: 11,
                        border: "none",
                        cursor: maNa ? "pointer" : "not-allowed",
                        fontFamily: "var(--font-sora), system-ui, sans-serif",
                        fontWeight: 700,
                        fontSize: 12.5,
                        color: "#fff",
                        background: maNa ? "linear-gradient(180deg,#4aa3ee,#2f92e6)" : "#c5d2e0",
                        boxShadow: maNa ? "0 6px 14px rgba(47,146,230,0.26)" : "none",
                      }}
                    >
                      {v.popis}
                      <span style={{ display: "flex", alignItems: "center", gap: 4, opacity: 0.95 }}>
                        <img src={OBRAZOK_KRYSTAL} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />
                        {v.cena}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Prémiové budovy */}
          <div style={karta}>
            <h3 style={nadpisKarty}>
              <Building2 size={15} color="#c9930f" strokeWidth={2.3} />
              Prémiové budovy
            </h3>
            <p style={{ fontSize: 11.5, color: "#5a6f88", lineHeight: 1.5, marginTop: 0, marginBottom: 11 }}>
              Stavajú sa v okne Budovy — v zozname ich spoznáš podľa ceny v kryštáloch.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {premiove.map((p) => {
                const maNa = krystaly >= p.cena;
                return (
                  <div
                    key={p.typ}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "9px 11px",
                      borderRadius: 10,
                      background: "rgba(120,160,205,0.06)",
                      border: "1px solid rgba(120,160,205,0.14)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-sora), system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 12.5,
                          color: "#1b2c42",
                        }}
                      >
                        {p.nazov}
                      </div>
                      {p.popis && (
                        <div style={{ fontSize: 10.5, color: "#aebccd", marginTop: 2, lineHeight: 1.35 }}>{p.popis}</div>
                      )}
                    </div>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontFamily: "var(--font-sora), system-ui, sans-serif",
                        fontWeight: 700,
                        fontSize: 12.5,
                        color: maNa ? "#2ca24e" : "#8a94a3",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      <img src={OBRAZOK_KRYSTAL} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />
                      {p.cena}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

   {/* --- POZVI KAMARÁTA --- */}
      {zalozka === "kamarat" && (
        <div>
          <div style={karta}>
            <h3 style={nadpisKarty}>
              <UserPlus size={15} color="#2ca24e" strokeWidth={2.3} />
              Tvoj odkaz na pozvanie
            </h3>
            <p style={{ fontSize: 11.5, color: "#5a6f88", lineHeight: 1.5, marginTop: 0, marginBottom: 11 }}>
              Pošli ho kamarátovi. Keď si založí stredisko a bude ho hrať aspoň {POZVANKA_PODMIENKA_DNI} dní, dostanete
              obaja kryštály.
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                readOnly
                value={odkaz}
                onFocus={(e) => e.target.select()}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "10px 12px",
                  borderRadius: 11,
                  border: "1px solid rgba(120,160,205,0.28)",
                  background: "rgba(120,160,205,0.06)",
                  color: "#5a6f88",
                  fontSize: 12,
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  outline: "none",
                }}
              />
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(odkaz);
                  setSkopirovane(true);
                  setTimeout(() => setSkopirovane(false), 2000);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 15px",
                  borderRadius: 11,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#fff",
                  background: skopirovane
                    ? "linear-gradient(180deg,#42d675,#33bd63)"
                    : "linear-gradient(180deg,#4aa3ee,#2f92e6)",
                  boxShadow: "0 6px 14px rgba(47,146,230,0.26)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {skopirovane ? (
                  <>
                    <Check size={14} strokeWidth={2.6} />
                    Skopírované
                  </>
                ) : (
                  <>
                    <Copy size={14} strokeWidth={2.4} />
                    Kopírovať
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={karta}>
            <h3 style={nadpisKarty}>
              <Sparkles size={15} color="#c9930f" strokeWidth={2.3} />
              Čo z toho máte
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {[
                { text: "Ty za každého pozvaného", odmena: POZVANKA_ODMENA_POZYVAJUCI },
                { text: "Tvoj kamarát na štart", odmena: POZVANKA_ODMENA_POZVANY },
              ].map((r) => (
                <div
                  key={r.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "9px 11px",
                    borderRadius: 10,
                    background: "rgba(120,160,205,0.06)",
                    fontSize: 12,
                    color: "#5a6f88",
                  }}
                >
                  <span>{r.text}</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 700,
                      color: "#2ca24e",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <img src={OBRAZOK_KRYSTAL} alt="" style={{ width: 13, height: 13, objectFit: "contain" }} />+
                    {r.odmena}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 10.5, color: "#aebccd", marginTop: 10, marginBottom: 0, lineHeight: 1.45 }}>
              Odmena sa vyplatí, keď má pozvaný aspoň {POZVANKA_PODMIENKA_PRESTIZ_BUDOVY} prestíže z budov a hrá aspoň{" "}
              {POZVANKA_PODMIENKA_DNI} dní.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
