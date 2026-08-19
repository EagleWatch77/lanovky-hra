"use client";

import { useState } from "react";
import {
  KATEGORIE,
  ZONY,
  PORADIE_ZON,
  odhadovanaCena,
  skutocnaReferencnaCena,
  globalnyCenovyMultiplikator,
  sezonaIndex,
  idealnaPrevadzkaHodin,
} from "../../lib/katalog";
import { hernyDatum } from "../../lib/hernyCas";
import { Euro, Clock, TrendingUp, TrendingDown } from "lucide-react";

const NAZVY_JEDNOTNE = {
  penzion: "Penzión",
  parkovisko: "Parkovisko",
  bar: "Apréski",
  hotel: "Hotel",
  servis: "Ski servis",
};

const POPIS_CENY = {
  lanovka: "cena lístka",
  bar: "priemerná útrata/osoba",
  servis: "priemerná útrata/osoba",
  parkovisko: "denné parkovné/miesto",
  penzion: "cena za osobu/noc",
  hotel: "cena za osobu/noc",
};

// Poradie skupín v okne
const PORADIE_KATEGORII = ["lanovka", "parkovisko", "bar", "servis", "penzion", "hotel"];

const NAZVY_MESIACOV = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];

const vstup = {
  padding: "9px 11px",
  borderRadius: 10,
  border: "1px solid rgba(120,160,205,0.28)",
  background: "#fff",
  color: "#1b2c42",
  fontSize: 13,
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 600,
  outline: "none",
};

export default function CenyOkno({ stanica, budovy, zmenitCenu, zmenitPrevadzkovuDobu }) {
  const [zalozka, setZalozka] = useState("ceny");
  const [zaciatok, setZaciatok] = useState(stanica.prevadzka_zaciatok || "08:30");
  const [koniec, setKoniec] = useState(stanica.prevadzka_koniec || "16:00");
  const hDatum = hernyDatum(new Date());
  const globalnyMult = globalnyCenovyMultiplikator(stanica, budovy.filter((b) => b.stav === "hotovo"));
  const sezIndex = sezonaIndex(hDatum);

  const idealDoba = idealnaPrevadzkaHodin(hDatum.getMonth(), stanica.hory_odomknute);

  function zonaOdomknuta(zonaKluc) {
    if (zonaKluc === "luka") return true;
    if (zonaKluc === "udolie") return !!stanica.udolie_odomknute;
    if (zonaKluc === "hory") return !!stanica.hory_odomknute;
    return false;
  }

  function budovaVSlote(zonaKluc, kat, poradie) {
    return budovy
      .filter(
        (b) =>
          b.zona === zonaKluc &&
          b.kategoria === (kat === "vlek" || kat.startsWith("lanovka") ? "lanovka" : kat) &&
          (kat === "vlek" || kat.startsWith("lanovka") ? b.typ === kat : true)
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[poradie];
  }

  // Poskladá zoznam všetkých slotov s cenou, zoskupených podľa reálnej kategórie
  const skupiny = {};
  for (const zonaKluc of PORADIE_ZON) {
    if (zonaKluc === "ladovec") continue;
    const zona = ZONY[zonaKluc];
    const odomknuta = zonaOdomknuta(zonaKluc);

    for (const kat of Object.keys(zona.limity)) {
      const realna = kat === "vlek" || kat.startsWith("lanovka") ? "lanovka" : kat;
      if (!KATEGORIE[realna]?.maCenu) continue;

      for (let poradie = 0; poradie < zona.limity[kat]; poradie++) {
        const budova = odomknuta ? budovaVSlote(zonaKluc, kat, poradie) : null;
        const nazov =
          zona.popisky?.[kat] || KATEGORIE[realna]?.katalog[kat]?.nazov || NAZVY_JEDNOTNE[kat] || KATEGORIE[realna]?.nazov;

        if (!skupiny[realna]) skupiny[realna] = [];
        skupiny[realna].push({
          kluc: `${zonaKluc}-${kat}-${poradie}`,
          nazov,
          zonaNazov: zona.nazov,
          budova,
          realna,
        });
      }
    }
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

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button onClick={() => setZalozka("ceny")} style={zalozkaStyl("ceny")}>
          <Euro size={14} strokeWidth={2.2} /> Ceny
        </button>
        <button onClick={() => setZalozka("prevadzka")} style={zalozkaStyl("prevadzka")}>
          <Clock size={14} strokeWidth={2.2} /> Prevádzková doba
        </button>
      </div>

      {zalozka === "ceny" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PORADIE_KATEGORII.filter((k) => skupiny[k]?.length).map((realna) => {
            const popisCeny = POPIS_CENY[realna] || "cena";
            const nazovSkupiny = KATEGORIE[realna]?.nazov || realna;

            return (
              <div key={realna}>
                <h3
                  style={{
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#8a94a3",
                    margin: "0 0 3px 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {nazovSkupiny}
                </h3>
                <div style={{ fontSize: 10.5, color: "#aebccd", marginBottom: 8 }}>{popisCeny}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {skupiny[realna].map((s) => {
                    const budova = s.budova;
                    const jeHotovo = budova?.stav === "hotovo";

                    let odhad = null;
                    if (jeHotovo) {
                      const refCenaDnes = skutocnaReferencnaCena(budova.kategoria, budova.typ, hDatum, globalnyMult);
                      odhad = odhadovanaCena(stanica.id, budova.kategoria, budova.typ, sezIndex, refCenaDnes);
                    }
                    const jeDrahsie = odhad && jeHotovo && budova.cena > odhad;

                    return (
                      <div
                        key={s.kluc}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 12px",
                          borderRadius: 12,
                          background: jeHotovo ? "#ffffff" : "rgba(120,160,205,0.05)",
                          border: jeHotovo ? "1px solid rgba(120,160,205,0.22)" : "1px solid rgba(120,160,205,0.12)",
                          boxShadow: jeHotovo ? "0 3px 10px rgba(60,110,160,0.07)" : "none",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                            <span
                              style={{
                                fontFamily: "var(--font-sora), system-ui, sans-serif",
                                fontWeight: 700,
                                fontSize: 13,
                                color: jeHotovo ? "#1b2c42" : "#aebccd",
                              }}
                            >
                              {s.nazov}
                            </span>
                            <span
                              style={{
                                fontSize: 9.5,
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                color: "#8a94a3",
                                background: "rgba(120,160,205,0.12)",
                                padding: "2px 7px",
                                borderRadius: 7,
                                textTransform: "uppercase",
                              }}
                            >
                              {s.zonaNazov}
                            </span>
                          </div>

                          {jeHotovo ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 600,
                                color: jeDrahsie ? "#c9830f" : "#2ca24e",
                                marginTop: 4,
                              }}
                            >
                              {jeDrahsie ? (
                                <TrendingUp size={12} strokeWidth={2.4} />
                              ) : (
                                <TrendingDown size={12} strokeWidth={2.4} />
                              )}
                              odhad ~{odhad} €
                            </div>
                          ) : (
                            <div style={{ fontSize: 11, color: "#aebccd", marginTop: 4 }}>
                              {budova?.stav === "vo_vystavbe" ? "vo výstavbe" : "zatiaľ nepostavené"}
                            </div>
                          )}
                        </div>

                        <input
                          type="number"
                          min="1"
                          disabled={!jeHotovo}
                          defaultValue={jeHotovo ? budova.cena : ""}
                          placeholder="—"
                          onBlur={(e) => jeHotovo && zmenitCenu(budova, Number(e.target.value))}
                          style={{
                            ...vstup,
                            width: 82,
                            textAlign: "right",
                            flexShrink: 0,
                            opacity: jeHotovo ? 1 : 0.5,
                            cursor: jeHotovo ? "text" : "not-allowed",
                            background: jeHotovo ? "#fff" : "rgba(120,160,205,0.06)",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {zalozka === "prevadzka" && (
        <div>
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(120,160,205,0.22)",
              boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 11.5, color: "#8a94a3", marginBottom: 5 }}>
              {NAZVY_MESIACOV[hDatum.getMonth()]} — tvoja prevádzková doba
            </div>
            <div
              style={{
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#1b2c42",
              }}
            >
              {zaciatok} – {koniec}
            </div>
            <div style={{ fontSize: 11.5, color: "#8a94a3", marginTop: 6 }}>
              Ideálna dĺžka pre tento mesiac: <strong style={{ color: "#2f8ae0" }}>{idealDoba} h</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11.5, color: "#5a6f88", display: "block", marginBottom: 5, fontWeight: 600 }}>
                Otvorenie
              </label>
              <input
                type="time"
                value={zaciatok}
                onChange={(e) => setZaciatok(e.target.value)}
                style={{ ...vstup, width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11.5, color: "#5a6f88", display: "block", marginBottom: 5, fontWeight: 600 }}>
                Zatvorenie
              </label>
              <input
                type="time"
                value={koniec}
                onChange={(e) => setKoniec(e.target.value)}
                style={{ ...vstup, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button
            onClick={() => zmenitPrevadzkovuDobu(zaciatok, koniec)}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#fff",
              background: "linear-gradient(180deg,#42d675,#33bd63)",
              boxShadow: "0 8px 18px rgba(51,189,99,0.30)",
            }}
          >
            Uložiť prevádzkovú dobu
          </button>
        </div>
      )}
    </div>
  );
}
