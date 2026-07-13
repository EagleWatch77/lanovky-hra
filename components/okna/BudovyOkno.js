"use client";

import { useState } from "react";
import {
  KATEGORIE,
  ZONY,
  PORADIE_ZON,
  ODOMKNUTIE_UDOLIA,
  ODOMKNUTIE_HOR,
  LANOVKY_TYPY,
  cenaBudovy,
  prestizBudovy,
  vystavbaVRealnychDnoch,
  zamestnanciPotrebni,
  turistiZaHodinu,
  prijemZaHodinu,
  konkurencnyMultiplikator,
} from "../../lib/katalog";
import { buttonStyle, inputStyle, tileStyle, tileStyleActive } from "../../lib/styles";

const NELANOVKOVE_TYPY = Object.keys(LANOVKY_TYPY).filter((t) => t !== "vlek");

function realnaKategoria(kat) {
  return kat === "vlek" ? "lanovka" : kat;
}

function typFilterPreSlot(zonaKluc, kat) {
  if (zonaKluc === "luka" && kat === "vlek") return ["vlek"];
  if (zonaKluc === "luka" && kat === "lanovka") return NELANOVKOVE_TYPY;
  return null;
}

function PodmienkaRiadok({ splnene, text }) {
  return (
    <div style={{ color: splnene ? "#4ade80" : "#9fb0bf", fontSize: 13, padding: "3px 0" }}>
      {splnene ? "✅" : "⬜"} {text}
    </div>
  );
}

export default function BudovyOkno({
  stanica,
  budovy,
  postavitBudovu,
  najatPreBudovu,
  prepustitPreBudovu,
  zmenitCenu,
  efektivitaBudovy,
  pocetKonkurencie,
  podmienkyOdomknutiaUdolia,
  odomknutUdolie,
  podmienkyOdomknutiaHor,
  odomknutHory,
}) {
  const [aktivnaZona, setAktivnaZona] = useState("luka");
  const [rozbaleny, setRozbaleny] = useState(null);
  const [stavbaPreKluc, setStavbaPreKluc] = useState(null);

  function pocetVZone(zonaKluc, kat, poradie) {
    const typFilter = typFilterPreSlot(zonaKluc, kat);
    const realna = realnaKategoria(kat);
    return budovy.filter(
      (b) => b.zona === zonaKluc && b.kategoria === realna && (!typFilter || typFilter.includes(b.typ))
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[poradie];
  }

  const zona = ZONY[aktivnaZona];
  const odomknute =
    aktivnaZona === "luka" ||
    (aktivnaZona === "udolie" && stanica.udolie_odomknute) ||
    (aktivnaZona === "hory" && stanica.hory_odomknute);

  const podmUdolie = podmienkyOdomknutiaUdolia();
  const podmHory = podmienkyOdomknutiaHor();

  return (
    <div>
      {/* Záložky zón */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10, flexWrap: "wrap" }}>
        {PORADIE_ZON.map((zk) => {
          const z = ZONY[zk];
          const jeOdomknuta = zk === "luka" || (zk === "udolie" && stanica.udolie_odomknute) || (zk === "hory" && stanica.hory_odomknute);
          const aktivna = aktivnaZona === zk;
          return (
            <button
              key={zk}
              onClick={() => {
                setAktivnaZona(zk);
                setRozbaleny(null);
                setStavbaPreKluc(null);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "none",
                background: aktivna ? "rgba(47,158,110,0.25)" : "transparent",
                color: aktivna ? "#4ade80" : "#9fb0bf",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {z.ikona} {z.nazov} {!jeOdomknuta && "🔒"}
            </button>
          );
        })}
      </div>

      {aktivnaZona === "ladovec" && (
        <p style={{ color: "#657685", fontSize: 13 }}>🧊 Vyžaduje alianciu — príde neskôr.</p>
      )}

      {aktivnaZona !== "ladovec" && !odomknute && (
        <div>
          {(() => {
            const podm = aktivnaZona === "udolie" ? podmUdolie : podmHory;
            const cena = aktivnaZona === "udolie" ? ODOMKNUTIE_UDOLIA.cena : ODOMKNUTIE_HOR.cena;
            const onOdomknut = aktivnaZona === "udolie" ? odomknutUdolie : odomknutHory;
            if (!podm) return null;
            return (
              <div>
                {"vek" in podm && <PodmienkaRiadok splnene={podm.vek} text="Stredisko dostatočne staré" />}
                {"prestiz" in podm && <PodmienkaRiadok splnene={podm.prestiz} text="Dostatočná prestíž" />}
                {"konkurencia" in podm && <PodmienkaRiadok splnene={podm.konkurencia} text="Konkurencia sa objavila v parkovisku alebo bare" />}
                {"udolie" in podm && <PodmienkaRiadok splnene={podm.udolie} text="Údolie odomknuté" />}
                <PodmienkaRiadok splnene={podm.peniaze} text={`Máš aspoň ${cena.toLocaleString("sk-SK")} €`} />
                <button onClick={onOdomknut} disabled={!podm.vsetkoSplnene} style={{ ...buttonStyle, width: "100%", marginTop: 10, opacity: podm.vsetkoSplnene ? 1 : 0.5 }}>
                  {podm.vsetkoSplnene ? `🔓 Odomknúť za ${cena.toLocaleString("sk-SK")} €` : "Podmienky zatiaľ nesplnené"}
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {aktivnaZona !== "ladovec" && odomknute && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.keys(zona.limity).map((kat) =>
            Array.from({ length: zona.limity[kat] }).map((_, poradie) => {
              const riadokKluc = `${kat}-${poradie}`;
              const budova = pocetVZone(aktivnaZona, kat, poradie);
              const nazov = zona.popisky?.[kat] || KATEGORIE[realnaKategoria(kat)].nazov;
              const ikona = KATEGORIE[realnaKategoria(kat)].ikona;
              const zamknutySlot = aktivnaZona === "luka" && kat === "lanovka" && !stanica.hory_odomknute && !budova;

              if (budova?.stav === "hotovo") {
                const b = budova;
                const info = KATEGORIE[b.kategoria].katalog[b.typ];
                const maCenu = KATEGORIE[b.kategoria].maCenu;
                const efektivitaB = efektivitaBudovy(b);
                const konkurenciaMult = konkurencnyMultiplikator(b.kategoria, pocetKonkurencie);
                const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
                const odhadTuristov = maCenu ? Math.round(turistiZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * konkurenciaMult) : null;
                const odhadPrijem = maCenu ? Math.round(prijemZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * konkurenciaMult) : null;
                const rozbalene = rozbaleny === riadokKluc;
                const znackaInfo = b.znacka ? KATEGORIE[b.kategoria].znackyKatalog?.[b.znacka] : null;

                return (
                  <div key={riadokKluc} style={{ background: "rgba(47,158,110,0.15)", borderRadius: 8, overflow: "hidden" }}>
                    <div
                      onClick={() => setRozbaleny(rozbalene ? null : riadokKluc)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{ikona}</span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{info.nazov}</span>
                        {znackaInfo && (
                          <span style={{ fontSize: 11, background: "#0f1720", padding: "2px 8px", borderRadius: 20, color: "#9fb0bf" }}>
                            {znackaInfo.ikona} {znackaInfo.nazov}
                          </span>
                        )}
                        {konkurenciaMult < 1 && <span style={{ fontSize: 11, color: "#f2994a" }}>⚠️</span>}
                      </div>
                      <span style={{ fontSize: 14, color: "#9fb0bf" }}>{rozbalene ? "▲" : "▼"}</span>
                    </div>

                    {rozbalene && (
                      <div style={{ padding: "0 12px 12px 40px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9fb0bf" }}>
                          <span>Zamestnanci</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button onClick={() => prepustitPreBudovu(b)} disabled={(b.zamestnanci_pridelenych || 0) <= 0} style={{ ...buttonStyle, padding: "1px 8px", fontSize: 11, background: "#3a4753" }}>−</button>
                            {b.zamestnanci_pridelenych || 0} / {potrebnyB}
                            <button onClick={() => najatPreBudovu(b)} disabled={(b.zamestnanci_pridelenych || 0) >= potrebnyB} style={{ ...buttonStyle, padding: "1px 8px", fontSize: 11 }}>+</button>
                          </span>
                        </div>
                        {maCenu && (
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9fb0bf" }}>
                            <span>Cena</span>
                            <input
                              type="number"
                              min="1"
                              defaultValue={b.cena}
                              onBlur={(e) => zmenitCenu(b, Number(e.target.value))}
                              style={{ ...inputStyle, width: 70, padding: "2px 6px", fontSize: 12 }}
                            />
                          </div>
                        )}
                        {maCenu && (
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9fb0bf" }}>
                            <span>Odhad príjmu</span>
                            <span style={{ color: "#e8edf2", fontWeight: 600 }}>~{odhadPrijem} €/h ({odhadTuristov} turistov/h)</span>
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9fb0bf" }}>
                          <span>Efektivita</span>
                          <span style={{ color: efektivitaB < 1 ? "#f2994a" : "#e8edf2", fontWeight: 600 }}>{Math.round(efektivitaB * 100)} %</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (budova?.stav === "vo_vystavbe") {
                const zostava = Math.max(0, Math.ceil((new Date(budova.koniec_vystavby) - new Date()) / (1000 * 60 * 60 * 24)));
                return (
                  <div key={riadokKluc} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(242,153,74,0.15)", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🚧</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{nazov}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#f2994a" }}>Vo výstavbe · {zostava} {zostava === 1 ? "deň" : zostava < 5 ? "dni" : "dní"}</span>
                  </div>
                );
              }

              if (zamknutySlot) {
                return (
                  <div key={riadokKluc} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, opacity: 0.6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🔒</span>
                      <span style={{ fontSize: 14 }}>{nazov}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#657685" }}>Odomkne sa s Horami</span>
                  </div>
                );
              }

              // Voľný slot
              const otvorenaStavba = stavbaPreKluc === riadokKluc;
              return (
                <div key={riadokKluc} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{ikona}</span>
                      <span style={{ fontSize: 14, color: "#9fb0bf" }}>{nazov}</span>
                    </div>
                    <button
                      onClick={() => setStavbaPreKluc(otvorenaStavba ? null : riadokKluc)}
                      style={{ ...buttonStyle, padding: "3px 12px", fontSize: 12 }}
                    >
                      {otvorenaStavba ? "Zavrieť" : "Postaviť"}
                    </button>
                  </div>

                  {otvorenaStavba && (
                    <StavbaFormular
                      zonaKluc={aktivnaZona}
                      kat={kat}
                      onPostavit={(typ, znacka) => {
                        postavitBudovu(realnaKategoria(kat), typ, znacka, aktivnaZona);
                        setStavbaPreKluc(null);
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function StavbaFormular({ zonaKluc, kat, onPostavit }) {
  const realna = realnaKategoria(kat);
  const typFilter = typFilterPreSlot(zonaKluc, kat);
  const katalogPlny = KATEGORIE[realna].katalog;
  const katalog = typFilter ? Object.fromEntries(Object.entries(katalogPlny).filter(([t]) => typFilter.includes(t))) : katalogPlny;
  const [vyberTyp, setVyberTyp] = useState(Object.keys(katalog)[0]);
  const znackyKatalog = KATEGORIE[realna].znackyKatalog;
  const [vyberZnacka, setVyberZnacka] = useState(znackyKatalog ? Object.keys(znackyKatalog)[0] : null);

  return (
    <div style={{ padding: "0 12px 12px 40px" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {Object.keys(katalog).map((typ) => (
          <button key={typ} onClick={() => setVyberTyp(typ)} style={{ ...(vyberTyp === typ ? tileStyleActive : tileStyle), padding: "6px 8px", fontSize: 11 }}>
            <div style={{ fontWeight: 600 }}>{katalog[typ].nazov}</div>
            <div style={{ color: "#9fb0bf" }}>{cenaBudovy(realna, typ, vyberZnacka).toLocaleString("sk-SK")} €</div>
          </button>
        ))}
      </div>
      {znackyKatalog && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {Object.keys(znackyKatalog).map((zn) => (
            <button key={zn} onClick={() => setVyberZnacka(zn)} style={{ ...(vyberZnacka === zn ? tileStyleActive : tileStyle), padding: "6px 8px", fontSize: 11 }}>
              {znackyKatalog[zn].ikona} {znackyKatalog[zn].nazov}
            </button>
          ))}
        </div>
      )}
      <div style={{ fontSize: 11, color: "#9fb0bf", marginBottom: 8 }}>
        💰 {cenaBudovy(realna, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} € · 🕐 {Math.round(vystavbaVRealnychDnoch(katalog[vyberTyp].vystavbaHernychMesiacov))} dní · ⭐ {prestizBudovy(realna, vyberTyp, vyberZnacka)}
      </div>
      <button onClick={() => onPostavit(vyberTyp, vyberZnacka)} style={{ ...buttonStyle, width: "100%" }}>
        ✅ Postaviť za {cenaBudovy(realna, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €
      </button>
    </div>
  );
}
