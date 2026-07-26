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
  PREVADZKA_HODIN_MIN,
  PREVADZKA_HODIN_MAX,
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

function hodinyNaText(hodiny) {
  const celeHodiny = Math.floor(hodiny);
  const minuty = Math.round((hodiny - celeHodiny) * 60);
  return minuty === 0 ? `${celeHodiny}:00` : `${celeHodiny}:${minuty}`;
}

export default function CenyOkno({ stanica, budovy, zmenitCenu, zmenitPrevadzkovuDobu }) {
  const [zalozka, setZalozka] = useState("ceny");
  const [novaDoba, setNovaDoba] = useState(stanica.prevadzka_hodin ?? 7.5);
  const hDatum = hernyDatum(new Date());
  const globalnyMult = globalnyCenovyMultiplikator(stanica, budovy.filter((b) => b.stav === "hotovo"));
  const sezIndex = sezonaIndex(hDatum);

  const idealDoba = idealnaPrevadzkaHodin(hDatum.getMonth(), stanica.hory_odomknute);
  const aktualnaDoba = stanica.prevadzka_hodin ?? 7.5;
  const rozdiel = aktualnaDoba - idealDoba;

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
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: "#657685", marginBottom: 4 }}>{NAZVY_MESIACOV[hDatum.getMonth()]} — ideálna prevádzka</div>
            <div style={{ fontSize: 18, color: "#4ade80", fontWeight: 700 }}>8:30 – {hodinyNaText(8.5 + idealDoba)} ({idealDoba} h)</div>
          </div>

          <label style={{ fontSize: 13, color: "#9fb0bf", display: "block", marginBottom: 6 }}>
            Tvoja nastavená prevádzková doba: <strong style={{ color: "#e8edf2" }}>{novaDoba} h</strong>
          </label>
          <input
            type="range"
            min={PREVADZKA_HODIN_MIN}
            max={PREVADZKA_HODIN_MAX}
            step={0.5}
            value={novaDoba}
            onChange={(e) => setNovaDoba(Number(e.target.value))}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#657685", marginBottom: 14 }}>
            <span>{PREVADZKA_HODIN_MIN} h</span>
            <span>{PREVADZKA_HODIN_MAX} h</span>
          </div>

          <button onClick={() => zmenitPrevadzkovuDobu(novaDoba)} style={{ ...buttonStyle, width: "100%", marginBottom: 14 }}>
            Uložiť prevádzkovú dobu
          </button>

          {rozdiel > 0 && (
            <p style={{ color: "#f2994a", fontSize: 13 }}>
              ⚠️ Aktuálne máš nastavené o {rozdiel.toFixed(1)} h viac ako je ideál pre tento mesiac — tie hodiny navyše stoja plat, ale nezarobia nič (je tma).
            </p>
          )}
          {rozdiel < 0 && (
            <p style={{ color: "#f2994a", fontSize: 13 }}>
              ⚠️ Aktuálne máš nastavené o {Math.abs(rozdiel).toFixed(1)} h menej ako je ideál pre tento mesiac — prichádzaš o príjem aj o prestíž (turisti si to nestihnú užiť).
            </p>
          )}
          {rozdiel === 0 && (
            <p style={{ color: "#4ade80", fontSize: 13 }}>✅ Presne na ideáli pre tento mesiac.</p>
          )}

          <p style={{ color: "#657685", fontSize: 12, marginTop: 14 }}>
            Platí pre lanovky, vleky, apréski, ski servis a parkoviská. Ubytovanie (penzióny, hotely) beží nezávisle 24 hodín denne.
          </p>
        </div>
      )}
    </div>
  );
}
