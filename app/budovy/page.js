"use client";

import { useState } from "react";
import { useGameState } from "../../lib/useGameState";
import AuthForm from "../../components/AuthForm";
import AppLayout from "../../components/AppLayout";
import VyjednavanieModal from "../../components/VyjednavanieModal";
import {
  KATEGORIE,
  vystavbaVRealnychDnoch,
  cenaBudovy,
  prestizBudovy,
  turistiZaHodinu,
  prijemZaHodinu,
  zamestnanciPotrebni,
  CENA_NAJATIA,
  konkurencnyMultiplikator,
  ZONY,
  PORADIE_ZON,
  ODOMKNUTIE_UDOLIA,
  ODOMKNUTIE_HOR,
} from "../../lib/katalog";
import { inputStyle, buttonStyle, linkStyle, cardStyle, rowCardStyle, tileStyle, tileStyleActive } from "../../lib/styles";

function zostavaCasu(koniecVystavby) {
  const zostava = new Date(koniecVystavby) - new Date();
  if (zostava <= 0) return "Dokončuje sa...";
  const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
  return `${dni} ${dni === 1 ? "deň" : dni < 5 ? "dni" : "dní"} do dokončenia`;
}

function PodmienkaRiadok({ splnene, text }) {
  return (
    <div style={{ color: splnene ? "#4ade80" : "#9fb0bf", fontSize: 13, padding: "3px 0" }}>
      {splnene ? "✅" : "⬜"} {text}
    </div>
  );
}

function ZamknutaZonaKarta({ zona, podmienky, cena, onOdomknut, loading }) {
  if (!podmienky) return null;
  return (
    <div style={{ ...cardStyle, opacity: 0.9 }}>
      <h3 style={{ marginTop: 0 }}>🔒 {zona.ikona} {zona.nazov}</h3>
      <div style={{ marginBottom: 12 }}>
        {"vek" in podmienky && <PodmienkaRiadok splnene={podmienky.vek} text="Stredisko dostatočne staré" />}
        {"prestiz" in podmienky && <PodmienkaRiadok splnene={podmienky.prestiz} text="Dostatočná prestíž" />}
        {"konkurencia" in podmienky && <PodmienkaRiadok splnene={podmienky.konkurencia} text="Konkurencia sa objavila v parkovisku alebo bare" />}
        {"udolie" in podmienky && <PodmienkaRiadok splnene={podmienky.udolie} text="Údolie odomknuté" />}
        <PodmienkaRiadok splnene={podmienky.peniaze} text={`Máš aspoň ${cena.toLocaleString("sk-SK")} €`} />
      </div>
      <button onClick={onOdomknut} disabled={!podmienky.vsetkoSplnene || loading} style={{ ...buttonStyle, width: "100%", opacity: podmienky.vsetkoSplnene ? 1 : 0.5 }}>
        {podmienky.vsetkoSplnene ? `🔓 Odomknúť za ${cena.toLocaleString("sk-SK")} €` : "Podmienky zatiaľ nesplnené"}
      </button>
    </div>
  );
}

export default function BudovyPage() {
  const {
    session,
    stanica,
    budovy,
    loading,
    ukazVyjednavanie,
    vyjednatPlat,
    handleLogout,
    postavitBudovu,
    zmenitCenu,
    najatPreBudovu,
    prepustitPreBudovu,
    efektivitaBudovy,
    pocetKonkurencie,
    podmienkyOdomknutiaUdolia,
    odomknutUdolie,
    podmienkyOdomknutiaHor,
    odomknutHory,
  } = useGameState();

  const [ukazStavbuVZone, setUkazStavbuVZone] = useState(null);
  const [vyberKategoria, setVyberKategoria] = useState(null);
  const [vyberTyp, setVyberTyp] = useState(null);
  const [vyberZnacka, setVyberZnacka] = useState(null);

  if (!session) return <AuthForm />;

  function otvorStavbu(zonaKluc) {
    const prvaKategoria = Object.keys(ZONY[zonaKluc].limity)[0];
    zmenitKategoriu(prvaKategoria);
    setUkazStavbuVZone(zonaKluc);
  }

  function zmenitKategoriu(novaKategoria) {
    const prvyTyp = Object.keys(KATEGORIE[novaKategoria].katalog)[0];
    const znackyKatalog = KATEGORIE[novaKategoria].znackyKatalog;
    const prvaZnacka = znackyKatalog ? Object.keys(znackyKatalog)[0] : null;
    setVyberKategoria(novaKategoria);
    setVyberTyp(prvyTyp);
    setVyberZnacka(prvaZnacka);
  }

  function pocetVZone(zonaKluc, kategoria) {
    return budovy.filter((b) => b.zona === zonaKluc && b.kategoria === kategoria && b.stav !== "zrusene").length;
  }

  const podmUdolie = podmienkyOdomknutiaUdolia();
  const podmHory = podmienkyOdomknutiaHor();
  const aktualnyKatalog = vyberKategoria ? KATEGORIE[vyberKategoria].katalog : null;

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      {loading && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      <VyjednavanieModal ukaz={!loading && ukazVyjednavanie} onVyjednat={vyjednatPlat} />

      {!loading && stanica && (
        <>
          <div style={{ ...cardStyle, marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#9fb0bf" }}>Zostatok</span>
            <span style={{ fontSize: 20, fontWeight: 700 }}>💰 {Math.round(stanica.peniaze).toLocaleString("sk-SK")} €</span>
          </div>

          {PORADIE_ZON.map((zonaKluc) => {
            const zona = ZONY[zonaKluc];

            if (zonaKluc === "ladovec") {
              return (
                <div key={zonaKluc} style={{ ...cardStyle, opacity: 0.7 }}>
                  <h3 style={{ marginTop: 0 }}>🔒 🧊 {zona.nazov}</h3>
                  <p style={{ color: "#657685", fontSize: 13 }}>Vyžaduje alianciu — príde neskôr.</p>
                </div>
              );
            }

            const odomknute = zonaKluc === "luka" || (zonaKluc === "udolie" && stanica.udolie_odomknute) || (zonaKluc === "hory" && stanica.hory_odomknute);

            if (!odomknute) {
              const podm = zonaKluc === "udolie" ? podmUdolie : podmHory;
              const cena = zonaKluc === "udolie" ? ODOMKNUTIE_UDOLIA.cena : ODOMKNUTIE_HOR.cena;
              const onOdomknut = zonaKluc === "udolie" ? odomknutUdolie : odomknutHory;
              return <ZamknutaZonaKarta key={zonaKluc} zona={zona} podmienky={podm} cena={cena} onOdomknut={onOdomknut} loading={loading} />;
            }

            const budovyVZone = budovy.filter((b) => b.zona === zonaKluc);
            const voVystavbeVZone = budovyVZone.filter((b) => b.stav === "vo_vystavbe");
            const hotoveVZone = budovyVZone.filter((b) => b.stav === "hotovo");

            return (
              <div key={zonaKluc} style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>{zona.ikona} {zona.nazov}</h3>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                  {Object.keys(zona.limity).map((kat) => {
                    const obsadene = pocetVZone(zonaKluc, kat);
                    const limit = zona.limity[kat];
                    return (
                      <span key={kat} style={{ fontSize: 12, color: obsadene >= limit ? "#657685" : "#9fb0bf" }}>
                        {KATEGORIE[kat].ikona} {KATEGORIE[kat].nazov}: {obsadene}/{limit}
                      </span>
                    );
                  })}
                </div>

                {voVystavbeVZone.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {voVystavbeVZone.map((b) => (
                      <div key={b.id} style={rowCardStyle}>
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            🚧 {KATEGORIE[b.kategoria].katalog[b.typ].nazov}
                            {b.znacka && <span style={{ color: "#9fb0bf", fontWeight: 400 }}> ({KATEGORIE[b.kategoria].znackyKatalog[b.znacka].nazov})</span>}
                          </div>
                          <div style={{ color: "#f2c94c", fontSize: 13, marginTop: 4 }}>{zostavaCasu(b.koniec_vystavby)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {hotoveVZone.length === 0 && voVystavbeVZone.length === 0 && (
                  <p style={{ color: "#657685", fontSize: 13 }}>Zatiaľ žiadna budova v tejto zóne.</p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {hotoveVZone.map((b) => {
                    const info = KATEGORIE[b.kategoria].katalog[b.typ];
                    const maCenu = KATEGORIE[b.kategoria].maCenu;
                    const efektivitaB = efektivitaBudovy(b);
                    const konkurenciaMult = konkurencnyMultiplikator(b.kategoria, pocetKonkurencie);
                    const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
                    const odhadTuristov = maCenu ? Math.round(turistiZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * konkurenciaMult) : null;
                    const odhadPrijem = maCenu ? Math.round(prijemZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * konkurenciaMult) : null;
                    const bPrestiz = Math.round(prestizBudovy(b.kategoria, b.typ, b.znacka) * efektivitaB);
                    return (
                      <div key={b.id} style={rowCardStyle}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>
                            {info.nazov}
                            {b.znacka && <span style={{ color: "#9fb0bf", fontWeight: 400 }}> ({KATEGORIE[b.kategoria].znackyKatalog[b.znacka].nazov})</span>}
                          </div>
                          <div style={{ color: "#9fb0bf", fontSize: 13, marginTop: 4 }}>
                            Kapacita: {info.kapacita}/hod
                            {maCenu && <> &nbsp;|&nbsp; Odhad: {odhadTuristov} turistov/hod &nbsp;|&nbsp; ~{odhadPrijem} €/hod</>}
                            &nbsp;|&nbsp; ⭐ {bPrestiz}
                            {konkurenciaMult < 1 && <span style={{ color: "#f2994a" }}> &nbsp;|&nbsp; ⚠️ Konkurencia</span>}
                          </div>
                          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, color: efektivitaB < 1 ? "#f2994a" : "#9fb0bf" }}>
                              👷 {b.zamestnanci_pridelenych || 0} / {potrebnyB}
                              {efektivitaB < 1 && ` — beží na ${Math.round(efektivitaB * 100)} %`}
                            </span>
                            <button onClick={() => prepustitPreBudovu(b)} style={{ ...buttonStyle, padding: "2px 10px", background: "#3a4753" }} disabled={(b.zamestnanci_pridelenych || 0) <= 0}>−</button>
                            <button onClick={() => najatPreBudovu(b)} style={{ ...buttonStyle, padding: "2px 10px" }} disabled={(b.zamestnanci_pridelenych || 0) >= potrebnyB}>+ ({CENA_NAJATIA.toLocaleString("sk-SK")} €)</button>
                          </div>
                          {maCenu && (
                            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                              <label style={{ fontSize: 13, color: "#9fb0bf" }}>Cena (€):</label>
                              <input
                                type="number"
                                min="1"
                                defaultValue={b.cena}
                                onBlur={(e) => zmenitCenu(b, Number(e.target.value))}
                                style={{ ...inputStyle, width: 80, padding: "4px 8px" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {ukazStavbuVZone !== zonaKluc ? (
                  <button onClick={() => otvorStavbu(zonaKluc)} style={{ ...buttonStyle, marginTop: 12 }}>➕ Postaviť v tejto zóne</button>
                ) : (
                  <div style={{ ...cardStyle, marginTop: 12, background: "#0f1720" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h4 style={{ margin: 0 }}>Postaviť v zóne {zona.nazov}</h4>
                      <button onClick={() => setUkazStavbuVZone(null)} style={linkStyle}>✕ Zavrieť</button>
                    </div>

                    <div style={{ color: "#657685", fontSize: 12, marginBottom: 8 }}>1. Vyber kategóriu</div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                      {Object.keys(zona.limity).map((kat) => {
                        const plne = pocetVZone(zonaKluc, kat) >= zona.limity[kat];
                        return (
                          <button
                            key={kat}
                            onClick={() => !plne && zmenitKategoriu(kat)}
                            disabled={plne}
                            style={{ ...(vyberKategoria === kat ? tileStyleActive : tileStyle), opacity: plne ? 0.4 : 1 }}
                          >
                            <div style={{ fontSize: 28 }}>{KATEGORIE[kat].ikona}</div>
                            <div style={{ fontSize: 13, marginTop: 4 }}>{KATEGORIE[kat].nazov}</div>
                            <div style={{ fontSize: 11, color: "#657685" }}>{pocetVZone(zonaKluc, kat)}/{zona.limity[kat]}</div>
                          </button>
                        );
                      })}
                    </div>

                    {vyberKategoria && aktualnyKatalog && (
                      <>
                        <div style={{ color: "#657685", fontSize: 12, marginBottom: 8 }}>2. Vyber typ</div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                          {Object.keys(aktualnyKatalog).map((typ) => (
                            <button
                              key={typ}
                              onClick={() => setVyberTyp(typ)}
                              style={vyberTyp === typ ? tileStyleActive : tileStyle}
                            >
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{aktualnyKatalog[typ].nazov}</div>
                              <div style={{ fontSize: 11, color: "#9fb0bf", marginTop: 4 }}>
                                {cenaBudovy(vyberKategoria, typ, vyberZnacka).toLocaleString("sk-SK")} €
                              </div>
                            </button>
                          ))}
                        </div>

                        {KATEGORIE[vyberKategoria].znackyKatalog && (
                          <>
                            <div style={{ color: "#657685", fontSize: 12, marginBottom: 8 }}>3. Vyber značku</div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                              {Object.keys(KATEGORIE[vyberKategoria].znackyKatalog).map((zn) => {
                                const znackyKatalog = KATEGORIE[vyberKategoria].znackyKatalog;
                                return (
                                  <button
                                    key={zn}
                                    onClick={() => setVyberZnacka(zn)}
                                    style={vyberZnacka === zn ? tileStyleActive : tileStyle}
                                  >
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{znackyKatalog[zn].nazov}</div>
                                    <div style={{ fontSize: 11, color: "#9fb0bf", marginTop: 4, maxWidth: 110 }}>{znackyKatalog[zn].popis}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}

                        <div style={{ ...cardStyle, marginTop: 0, background: "#131c24" }}>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>{aktualnyKatalog[vyberTyp]?.nazov}</div>
                          <div style={{ color: "#9fb0bf", fontSize: 13 }}>
                            💰 Cena: <strong style={{ color: "#e8edf2" }}>{cenaBudovy(vyberKategoria, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €</strong><br />
                            🕐 Výstavba: <strong style={{ color: "#e8edf2" }}>{Math.round(vystavbaVRealnychDnoch(aktualnyKatalog[vyberTyp].vystavbaHernychMesiacov))} dní</strong><br />
                            ⭐ Prestíž: <strong style={{ color: "#f2c94c" }}>{prestizBudovy(vyberKategoria, vyberTyp, vyberZnacka)}</strong><br />
                            👷 Zamestnanci po dokončení: <strong style={{ color: "#e8edf2" }}>{zamestnanciPotrebni(vyberKategoria, vyberTyp)}</strong> (automaticky najatí)
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            postavitBudovu(vyberKategoria, vyberTyp, vyberZnacka, zonaKluc);
                            setUkazStavbuVZone(null);
                          }}
                          style={{ ...buttonStyle, marginTop: 16, width: "100%" }}
                          disabled={loading}
                        >
                          ✅ Postaviť za {cenaBudovy(vyberKategoria, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <p style={{ color: "#657685", fontSize: 12, marginTop: 8 }}>
            💡 Tip: každá zóna má obmedzený počet slotov na kategóriu. Údolie a Hory treba najprv odomknúť.
          </p>
        </>
      )}
    </AppLayout>
  );
}
