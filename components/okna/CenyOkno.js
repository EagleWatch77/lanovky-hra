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
  hodinyNaCas,
} from "../../lib/katalog";
import { hernyDatum } from "../../lib/hernyCas";
import { inputStyle, buttonStyle } from "../../lib/styles";

const NAZVY_JEDNOTNE = {
  penzion: "Penzión",
  parkovisko: "Parkovisko",
  bar: "Apréski",
  hotel: "Hotel",
  servis: "Ski servis",
};

const NAZVY_MESIACOV = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];

export default function CenyOkno({ stanica, budovy, zmenitCenu, zmenitPrevadzkovuDobu }) {
  const [zalozka, setZalozka] = useState("ceny");
  const [zaciatok, setZaciatok] = useState(stanica.prevadzka_zaciatok || "08:30");
  const [koniec, setKoniec] = useState(stanica.prevadzka_koniec || "16:00");
  const hDatum = hernyDatum(new Date());
  const globalnyMult = globalnyCenovyMultiplikator(stanica, budovy.filter((b) => b.stav === "hotovo"));
  const sezIndex = sezonaIndex(hDatum);

  const idealDoba = idealnaPrevadzkaHodin(hDatum.getMonth(), stanica.hory_odomknute);

  function pocetVZone(zonaKluc, kat, poradie) {
    return budovy
      .filter((b) => b.zona === zonaKluc && b.kategoria === (kat === "vlek" || kat.startsWith("lanovka") ? "lanovka" : kat) && (kat === "vlek" || kat.startsWith("lanovka") ? b.typ === kat : true))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[poradie];
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        <button
          onClick={() => setZalozka("ceny")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "ceny" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "ceny" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          💶 Ceny
        </button>
        <button
          onClick={() => setZalozka("prevadzka")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "prevadzka" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "prevadzka" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          🕐 Prevádzková doba
        </button>
      </div>

      {zalozka === "ceny" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {PORADIE_ZON.filter((zk) => zk !== "ladovec").map((zonaKluc) => {
            const zona = ZONY[zonaKluc];
            const zonaOdomknuta = zonaKluc === "luka" || (zonaKluc === "udolie" && stanica.udolie_odomknute) || (zonaKluc === "hory" && stanica.hory_odomknute);
            const slotySCenou = Object.keys(zona.limity).filter((kat) => {
              const realna = kat === "vlek" || kat.startsWith("lanovka") ? "lanovka" : kat;
              return KATEGORIE[realna]?.maCenu;
            });
            if (slotySCenou.length === 0) return null;

            return (
              <div key={zonaKluc}>
                <h3 style={{ fontSize: 13, color: "#9fb0bf", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {zona.ikona} {zona.nazov}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {slotySCenou.map((kat) =>
                    Array.from({ length: zona.limity[kat] }).map((_, poradie) => {
                      const riadokKluc = `${zonaKluc}-${kat}-${poradie}`;
                      const realna = kat === "vlek" || kat.startsWith("lanovka") ? "lanovka" : kat;
                      const budova = zonaOdomknuta ? pocetVZone(zonaKluc, kat, poradie) : null;
                      const nazov = zona.popisky?.[kat] || KATEGORIE[realna]?.katalog[kat]?.nazov || NAZVY_JEDNOTNE[kat] || KATEGORIE[realna]?.nazov;
                      const ikona = KATEGORIE[realna]?.ikona;
                      const jeHotovo = budova?.stav === "hotovo";

                      let odhad = null;
                      if (jeHotovo) {
                        const refCenaDnes = skutocnaReferencnaCena(budova.kategoria, budova.typ, hDatum, globalnyMult);
                        odhad = odhadovanaCena(stanica.id, budova.kategoria, budova.typ, sezIndex, refCenaDnes);
                      }
                      const jeDrahsie = odhad && jeHotovo && budova.cena > odhad;

                      return (
                        <div
                          key={riadokKluc}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "10px 12px", borderRadius: 8,
                            background: jeHotovo ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
                            opacity: jeHotovo ? 1 : 0.45,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 14, color: "#e8edf2" }}>{ikona} {nazov}</div>
                            {jeHotovo ? (
                              <div style={{ fontSize: 11, color: jeDrahsie ? "#f2994a" : "#4ade80" }}>odhadovaná cena: ~{odhad} €</div>
                            ) : (
                              <div style={{ fontSize: 11, color: "#657685" }}>
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
                            style={{ ...inputStyle, width: 80, textAlign: "right", opacity: jeHotovo ? 1 : 0.5, cursor: jeHotovo ? "text" : "not-allowed" }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {zalozka === "prevadzka" && (
        <div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#657685", marginBottom: 4 }}>{NAZVY_MESIACOV[hDatum.getMonth()]} — tvoja prevádzková doba</div>
            <div style={{ fontSize: 18, color: "#4ade80", fontWeight: 700 }}>{zaciatok} – {koniec}</div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "#9fb0bf", display: "block", marginBottom: 4 }}>Otvorenie</label>
              <input
                type="time"
                value={zaciatok}
                onChange={(e) => setZaciatok(e.target.value)}
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: "#9fb0bf", display: "block", marginBottom: 4 }}>Zatvorenie</label>
              <input
                type="time"
                value={koniec}
                onChange={(e) => setKoniec(e.target.value)}
                style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button onClick={() => zmenitPrevadzkovuDobu(zaciatok, koniec)} style={{ ...buttonStyle, width: "100%" }}>
            Uložiť prevádzkovú dobu
          </button>
        </div>
      )}
    </div>
  );
}
