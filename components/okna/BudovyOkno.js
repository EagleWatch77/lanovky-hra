"use client";

import { useState } from "react";
import {
  KATEGORIE,
  ZONY,
  PORADIE_ZON,
  ODOMKNUTIE_UDOLIA,
  ODOMKNUTIE_HOR,
  ODOMKNUTIE_LANOVIEK_LUKA,
  cenaBudovy,
  prestizBudovy,
  kapacitaBudovy,
  vystavbaVRealnychDnoch,
  zamestnanciPotrebni,
  turistiZaHodinu,
  prijemZaHodinu,
  konkurencnyMultiplikator,
  skutocnaReferencnaCena,
  globalnyCenovyMultiplikator,
  znackyPreTyp,
  typyPreSlot,
  jeLanovkovySlot,
  LANOVKY_TYPY,
} from "../../lib/katalog";
import { hernyDatum } from "../../lib/hernyCas";
import {
  Lock,
  Unlock,
  HardHat,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Square,
  CheckSquare,
  AlertTriangle,
  Snowflake,
  Coins,
  Clock,
  Star,
  Users,
} from "lucide-react";

const NAZVY_JEDNOTNE = {
  penzion: "Penzión",
  parkovisko: "Parkovisko",
  bar: "Apréski",
  hotel: "Hotel",
  servis: "Ski servis",
  pokladna: "Pokladňa",
  ratrak: "Ratrak",
  zasnezovanie: "Zasnežovanie",
  vlek: "Vlek",
  lanovka: "Lanovka",
};

const vstup = {
  padding: "6px 9px",
  borderRadius: 9,
  border: "1px solid rgba(120,160,205,0.28)",
  background: "#fff",
  color: "#1b2c42",
  fontSize: 12,
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 600,
  outline: "none",
};

const btnZeleny = {
  border: "none",
  borderRadius: 10,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 12,
  cursor: "pointer",
  padding: "9px 12px",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  background: "linear-gradient(180deg,#42d675,#33bd63)",
  boxShadow: "0 6px 14px rgba(51,189,99,0.28)",
};

const btnModry = {
  ...btnZeleny,
  background: "linear-gradient(180deg,#4aa3ee,#2f92e6)",
  boxShadow: "0 6px 14px rgba(47,146,230,0.28)",
};

const detailRiadok = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  fontSize: 12,
  color: "#5a6f88",
  padding: "5px 0",
};

const detailHodnota = {
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  color: "#1b2c42",
};

function PodmienkaRiadok({ splnene, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: splnene ? "#1f8a49" : "#8a94a3",
        fontSize: 12.5,
        padding: "5px 0",
      }}
    >
      {splnene ? <CheckSquare size={15} strokeWidth={2.3} /> : <Square size={15} strokeWidth={2.3} />}
      {text}
    </div>
  );
}

export default function BudovyOkno({
  stanica,
  budovy,
  postavitBudovu,
  zmenitCenu,
  efektivitaBudovy,
  pocetKonkurencie,
  podmienkyOdomknutiaUdolia,
  odomknutUdolie,
  podmienkyOdomknutiaHor,
  odomknutHory,
  pridatBobovuDrahu,
  prepnutZasnezovanie,
}) {
  const [aktivnaZona, setAktivnaZona] = useState("luka");
  const [rozbaleny, setRozbaleny] = useState(null);
  const [stavbaPreKluc, setStavbaPreKluc] = useState(null);
  const hDatum = hernyDatum(new Date());
  const hotoveVsetky = budovy.filter((b) => b.stav === "hotovo");
  const maZasnezovanie = hotoveVsetky.some((b) => b.kategoria === "zasnezovanie");
  const globalnyMult = globalnyCenovyMultiplikator(stanica, hotoveVsetky);

  function budovaVSlote(zonaKluc, slot, poradie) {
    return budovy
      .filter((b) => b.zona === zonaKluc && b.stav !== "zrusene" && (b.slot || b.kategoria) === slot)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[poradie];
  }

  const zona = ZONY[aktivnaZona];
  const odomknute =
    aktivnaZona === "luka" ||
    (aktivnaZona === "udolie" && stanica.udolie_odomknute) ||
    (aktivnaZona === "hory" && stanica.hory_odomknute);

  const podmUdolie = podmienkyOdomknutiaUdolia();
  const podmHory = podmienkyOdomknutiaHor();

  function zalozkaStyl(aktivna) {
    return {
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "8px 13px",
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
      {/* Záložky zón */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {PORADIE_ZON.map((zk) => {
          const z = ZONY[zk];
          const jeOdomknuta =
            zk === "luka" || (zk === "udolie" && stanica.udolie_odomknute) || (zk === "hory" && stanica.hory_odomknute);
          const aktivna = aktivnaZona === zk;
          return (
            <button
              key={zk}
              onClick={() => {
                setAktivnaZona(zk);
                setRozbaleny(null);
                setStavbaPreKluc(null);
              }}
              style={zalozkaStyl(aktivna)}
            >
              {z.nazov}
              {!jeOdomknuta && <Lock size={11} strokeWidth={2.4} />}
            </button>
          );
        })}
      </div>

      {aktivnaZona === "ladovec" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 14px",
            borderRadius: 12,
            background: "rgba(120,160,205,0.08)",
            border: "1px solid rgba(120,160,205,0.18)",
            fontSize: 12.5,
            color: "#5a6f88",
          }}
        >
          <Lock size={16} strokeWidth={2.2} color="#8a94a3" />
          Ľadovec sa odomkne až po postavení 3S lanovky v Horách.
        </div>
      )}

      {aktivnaZona !== "ladovec" && !odomknute && (
        <div>
          {(() => {
            const podm = aktivnaZona === "udolie" ? podmUdolie : podmHory;
            const cena = aktivnaZona === "udolie" ? ODOMKNUTIE_UDOLIA.cena : ODOMKNUTIE_HOR.cena;
            const onOdomknut = aktivnaZona === "udolie" ? odomknutUdolie : odomknutHory;
            if (!podm) return null;
            return (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(120,160,205,0.22)",
                  borderRadius: 14,
                  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
                  padding: 14,
                }}
              >
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 13.5,
                    color: "#1b2c42",
                  }}
                >
                  Podmienky odomknutia
                </h3>
                {"vek" in podm && <PodmienkaRiadok splnene={podm.vek} text="Stredisko dostatočne staré" />}
                {"prestiz" in podm && <PodmienkaRiadok splnene={podm.prestiz} text="Dostatočná prestíž" />}
                {"konkurencia" in podm && (
                  <PodmienkaRiadok splnene={podm.konkurencia} text="Konkurencia sa objavila v parkovisku alebo bufete" />
                )}
                {"udolie" in podm && <PodmienkaRiadok splnene={podm.udolie} text="Údolie odomknuté" />}
                <PodmienkaRiadok splnene={podm.peniaze} text={`Máš aspoň ${cena.toLocaleString("sk-SK")} €`} />
                <button
                  onClick={onOdomknut}
                  disabled={!podm.vsetkoSplnene}
                  style={{
                    ...btnZeleny,
                    width: "100%",
                    marginTop: 12,
                    padding: "12px 14px",
                    fontSize: 13,
                    opacity: podm.vsetkoSplnene ? 1 : 0.45,
                    cursor: podm.vsetkoSplnene ? "pointer" : "not-allowed",
                  }}
                >
                  {podm.vsetkoSplnene ? (
                    <>
                      <Unlock size={15} strokeWidth={2.4} />
                      Odomknúť za {cena.toLocaleString("sk-SK")} €
                    </>
                  ) : (
                    "Podmienky zatiaľ nesplnené"
                  )}
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {aktivnaZona !== "ladovec" && odomknute && (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {Object.keys(zona.limity).map((slot) =>
            Array.from({ length: zona.limity[slot] }).map((_, poradie) => {
              const riadokKluc = `${slot}-${poradie}`;
              const budova = budovaVSlote(aktivnaZona, slot, poradie);
              const jeLanovka = jeLanovkovySlot(slot);
              const kategoria = jeLanovka ? "lanovka" : slot;
              const nazovSlotu = zona.popisky?.[slot] || NAZVY_JEDNOTNE[slot] || KATEGORIE[kategoria]?.nazov || slot;

              // Spojnice v Lúke sa odomykajú s cieľovou zónou
              const potrebnaZona = aktivnaZona === "luka" ? ODOMKNUTIE_LANOVIEK_LUKA[slot] : null;
              const zamknutySlot =
                (potrebnaZona &&
                  !budova &&
                  ((potrebnaZona === "udolie" && !stanica.udolie_odomknute) ||
                    (potrebnaZona === "hory" && !stanica.hory_odomknute))) ||
                (slot === "spojnica_ladovec" && !budova);

              // --- HOTOVÁ BUDOVA ---
              if (budova?.stav === "hotovo") {
                const b = budova;
                const info = KATEGORIE[b.kategoria].katalog[b.typ];
                const maCenu = KATEGORIE[b.kategoria].maCenu;
                const jeLanovkaB = b.kategoria === "lanovka";
                const efektivitaB = efektivitaBudovy(b);
                const konkurenciaMult = konkurencnyMultiplikator(b.kategoria, b.zona, pocetKonkurencie);
                const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
                const cenaB = jeLanovkaB ? (stanica.cena_skipasu ?? 15) : b.cena;
                const refCenaDnes = maCenu
                  ? skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult, maZasnezovanie)
                  : 0;
                const odhadTuristov = maCenu
                  ? Math.round(turistiZaHodinu(b.kategoria, b.typ, cenaB, refCenaDnes, b.znacka) * efektivitaB * konkurenciaMult)
                  : null;
                const odhadPrijem = maCenu
                  ? Math.round(prijemZaHodinu(b.kategoria, b.typ, cenaB, refCenaDnes, b.znacka) * efektivitaB * konkurenciaMult)
                  : null;
                const rozbalene = rozbaleny === riadokKluc;
                const znackaNazov = jeLanovkaB && b.znacka ? znackyPreTyp(b.typ)[b.znacka]?.nazov : null;

                return (
                  <div
                    key={riadokKluc}
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(120,160,205,0.22)",
                      boxShadow: "0 3px 10px rgba(60,110,160,0.08)",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => setRozbaleny(rozbalene ? null : riadokKluc)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        padding: "11px 12px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#33bd63", flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontFamily: "var(--font-sora), system-ui, sans-serif",
                              fontWeight: 700,
                              fontSize: 13,
                              color: "#1b2c42",
                            }}
                          >
                            {info?.nazov || b.typ}
                          </div>
                          {znackaNazov && (
                            <div style={{ fontSize: 10.5, color: "#aebccd", marginTop: 1 }}>{znackaNazov}</div>
                          )}
                        </div>
                        {konkurenciaMult < 1 && <AlertTriangle size={13} color="#ef9a3d" strokeWidth={2.4} />}
                      </div>
                      <span style={{ color: "#aebccd", display: "flex", flexShrink: 0 }}>
                        {rozbalene ? <ChevronUp size={16} strokeWidth={2.4} /> : <ChevronDown size={16} strokeWidth={2.4} />}
                      </span>
                    </div>

                    {rozbalene && (
                      <div style={{ padding: "0 12px 12px", borderTop: "1px solid rgba(120,160,205,0.16)" }}>
                        <div style={{ ...detailRiadok, paddingTop: 9 }}>
                          <span>Kapacita</span>
                          <span style={detailHodnota}>{kapacitaBudovy(b.kategoria, b.typ, b.znacka)} / h</span>
                        </div>
                        <div style={detailRiadok}>
                          <span>Zamestnanci</span>
                          <span style={detailHodnota}>{potrebnyB} (plný stav)</span>
                        </div>
                        {maCenu && !jeLanovkaB && (
                          <div style={detailRiadok}>
                            <span>Cena</span>
                            <input
                              type="number"
                              min="1"
                              defaultValue={b.cena}
                              onBlur={(e) => zmenitCenu(b, Number(e.target.value))}
                              style={{ ...vstup, width: 74, textAlign: "right" }}
                            />
                          </div>
                        )}
                        {jeLanovkaB && (
                          <div style={detailRiadok}>
                            <span>Skipas</span>
                            <span style={detailHodnota}>{cenaB} € (spoločná cena)</span>
                          </div>
                        )}
                        {maCenu && (
                          <div style={detailRiadok}>
                            <span>Odhad príjmu</span>
                            <span style={detailHodnota}>
                              ~{odhadPrijem} €/h{" "}
                              <span style={{ color: "#8a94a3", fontWeight: 500 }}>({odhadTuristov} os./h)</span>
                            </span>
                          </div>
                        )}
                        <div style={detailRiadok}>
                          <span>Efektivita</span>
                          <span style={{ ...detailHodnota, color: efektivitaB < 1 ? "#c9830f" : "#2ca24e" }}>
                            {Math.round(efektivitaB * 100)} %
                          </span>
                        </div>

                        {b.kategoria === "lanovka" && b.typ === "vlek" && !b.bobova_draha && (
                          <button onClick={() => pridatBobovuDrahu(b)} style={{ ...btnModry, marginTop: 8, width: "100%" }}>
                            <Plus size={14} strokeWidth={2.6} />
                            Pridať bobovú dráhu (200 000 €)
                          </button>
                        )}
                        {b.kategoria === "lanovka" && b.typ === "vlek" && b.bobova_draha && (
                          <div
                            style={{
                              marginTop: 8,
                              fontSize: 11.5,
                              color: "#1f8a49",
                              background: "#e3f6ea",
                              border: "1px solid rgba(51,189,99,0.28)",
                              borderRadius: 10,
                              padding: "8px 10px",
                            }}
                          >
                            Má bobovú dráhu — funguje celoročne
                          </div>
                        )}
                        {b.kategoria === "zasnezovanie" && (
                          <button
                            onClick={() => prepnutZasnezovanie(b)}
                            style={{
                              ...btnZeleny,
                              marginTop: 8,
                              width: "100%",
                              background: b.zasnezovanie_zapnute ? "#fff" : "linear-gradient(180deg,#4aa3ee,#2f92e6)",
                              color: b.zasnezovanie_zapnute ? "#d64545" : "#fff",
                              border: b.zasnezovanie_zapnute ? "1px solid rgba(214,69,69,0.35)" : "none",
                              boxShadow: b.zasnezovanie_zapnute ? "none" : "0 6px 14px rgba(47,146,230,0.28)",
                            }}
                          >
                            <Snowflake size={14} strokeWidth={2.4} />
                            {b.zasnezovanie_zapnute ? "Vypnúť zasnežovanie" : "Zapnúť zasnežovanie"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // --- VO VÝSTAVBE ---
              if (budova?.stav === "vo_vystavbe") {
                const zostava = Math.max(
                  0,
                  Math.ceil((new Date(budova.koniec_vystavby) - new Date()) / (1000 * 60 * 60 * 24))
                );
                const infoV = KATEGORIE[budova.kategoria]?.katalog[budova.typ];
                return (
                  <div
                    key={riadokKluc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "11px 12px",
                      background: "#fff7ea",
                      border: "1px solid rgba(239,154,61,0.3)",
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <HardHat size={16} color="#c9830f" strokeWidth={2.3} />
                      <span
                        style={{
                          fontFamily: "var(--font-sora), system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#1b2c42",
                        }}
                      >
                        {infoV?.nazov || nazovSlotu}
                      </span>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#c9830f", whiteSpace: "nowrap" }}>
                      {zostava} {zostava === 1 ? "deň" : zostava < 5 ? "dni" : "dní"}
                    </span>
                  </div>
                );
              }

              // --- ZAMKNUTÝ SLOT ---
              if (zamknutySlot) {
                const text =
                  slot === "spojnica_ladovec"
                    ? "Zatiaľ nedostupné"
                    : `Odomkne sa s ${potrebnaZona === "udolie" ? "Údolím" : "Horami"}`;
                return (
                  <div
                    key={riadokKluc}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "11px 12px",
                      background: "rgba(120,160,205,0.06)",
                      border: "1px solid rgba(120,160,205,0.16)",
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <Lock size={15} color="#aebccd" strokeWidth={2.3} />
                      <span style={{ fontSize: 13, color: "#8a94a3", fontWeight: 600 }}>{nazovSlotu}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#aebccd", whiteSpace: "nowrap" }}>{text}</span>
                  </div>
                );
              }

              // --- VOĽNÝ SLOT ---
              const otvorenaStavba = stavbaPreKluc === riadokKluc;
              return (
                <div
                  key={riadokKluc}
                  style={{
                    background: "rgba(120,160,205,0.05)",
                    border: "1px dashed rgba(120,160,205,0.32)",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <Plus size={15} color="#aebccd" strokeWidth={2.4} />
                      <span style={{ fontSize: 13, color: "#8a94a3", fontWeight: 600 }}>{nazovSlotu}</span>
                    </div>
                    <button
                      onClick={() => setStavbaPreKluc(otvorenaStavba ? null : riadokKluc)}
                      style={{ ...btnModry, padding: "7px 13px", flexShrink: 0 }}
                    >
                      {otvorenaStavba ? "Zavrieť" : "Postaviť"}
                    </button>
                  </div>

                  {otvorenaStavba && (
                    <StavbaFormular
                      slot={slot}
                      kategoria={kategoria}
                      onPostavit={(typ, znacka, sBobovouDrahou) => {
                        postavitBudovu(kategoria, typ, znacka, aktivnaZona, sBobovouDrahou, slot);
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

function StavbaFormular({ slot, kategoria, onPostavit }) {
  const jeLanovka = jeLanovkovySlot(slot);
  const dostupneTypy = jeLanovka ? typyPreSlot(slot) : Object.keys(KATEGORIE[kategoria].katalog);

  const [vyberTyp, setVyberTyp] = useState(dostupneTypy[0]);
  const dostupneZnacky = jeLanovka ? znackyPreTyp(vyberTyp) : {};
  const [vyberZnacka, setVyberZnacka] = useState(jeLanovka ? Object.keys(dostupneZnacky)[0] : null);
  const [sBobovouDrahou, setSBobovouDrahou] = useState(false);

  // Pri zmene typu prepni značku na prvú dostupnú
  function zmenTyp(typ) {
    setVyberTyp(typ);
    const nove = znackyPreTyp(typ);
    if (jeLanovka && !nove[vyberZnacka]) setVyberZnacka(Object.keys(nove)[0]);
  }

  const info = KATEGORIE[kategoria].katalog[vyberTyp];
  const jeVlek = jeLanovka && vyberTyp === "vlek";
  const znackaInfo = jeLanovka ? dostupneZnacky[vyberZnacka] : null;
  const jePremiova = znackaInfo?.premiova;

  const cenaSpolu = cenaBudovy(kategoria, vyberTyp, vyberZnacka) + (jeVlek && sBobovouDrahou ? 200000 : 0);

  const parameter = { display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#5a6f88" };

  return (
    <div style={{ padding: "0 12px 12px", borderTop: "1px solid rgba(120,160,205,0.18)" }}>
      {/* Výber typu zariadenia */}
      {dostupneTypy.length > 1 && (
        <>
          <div
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#8a94a3",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "10px 0 7px",
            }}
          >
            Typ zariadenia
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
            {dostupneTypy.map((typ) => {
              const t = LANOVKY_TYPY[typ] || KATEGORIE[kategoria].katalog[typ];
              const vybraty = vyberTyp === typ;
              return (
                <button
                  key={typ}
                  onClick={() => zmenTyp(typ)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 11px",
                    borderRadius: 11,
                    cursor: "pointer",
                    textAlign: "left",
                    background: vybraty ? "#eaf4fd" : "#fff",
                    border: vybraty ? "1px solid #2f92e6" : "1px solid rgba(120,160,205,0.22)",
                    boxShadow: vybraty ? "0 4px 12px rgba(47,146,230,0.18)" : "none",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sora), system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 12.5,
                          color: "#1b2c42",
                        }}
                      >
                        {t.nazov}
                      </span>
                      {t.celorocne && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: "#1f8a49",
                            background: "#e3f6ea",
                            border: "1px solid rgba(51,189,99,0.28)",
                            padding: "2px 6px",
                            borderRadius: 6,
                          }}
                        >
                          CELOROČNE
                        </span>
                      )}
                    </div>
                    {t.popis && (
                      <div style={{ fontSize: 10.5, color: "#aebccd", marginTop: 2, lineHeight: 1.35 }}>{t.popis}</div>
                    )}
                    <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: "#8a94a3" }}>
                        {cenaBudovy(kategoria, typ, vyberZnacka).toLocaleString("sk-SK")} €
                      </span>
                      <span style={{ fontSize: 10, color: "#8a94a3" }}>{t.kapacita} os./h</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Výber značky */}
      {jeLanovka && (
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#8a94a3",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 7,
            }}
          >
            Výrobca
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {Object.keys(dostupneZnacky).map((kluc) => {
              const z = dostupneZnacky[kluc];
              const vybrata = vyberZnacka === kluc;
              const zamknuta = z.premiova;

              return (
                <button
                  key={kluc}
                  onClick={() => !zamknuta && setVyberZnacka(kluc)}
                  disabled={zamknuta}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 11px",
                    borderRadius: 11,
                    cursor: zamknuta ? "not-allowed" : "pointer",
                    textAlign: "left",
                    background: zamknuta ? "rgba(120,160,205,0.06)" : vybrata ? "#eaf4fd" : "#fff",
                    border: vybrata ? "1px solid #2f92e6" : "1px solid rgba(120,160,205,0.22)",
                    boxShadow: vybrata ? "0 4px 12px rgba(47,146,230,0.18)" : "none",
                    opacity: zamknuta ? 0.7 : 1,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-sora), system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 12.5,
                          color: zamknuta ? "#8a94a3" : "#1b2c42",
                        }}
                      >
                        {z.nazov}
                      </span>
                      {zamknuta && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: "#c9930f",
                            background: "#fdf4e0",
                            border: "1px solid rgba(201,147,15,0.3)",
                            padding: "2px 7px",
                            borderRadius: 7,
                          }}
                        >
                          <Lock size={9} strokeWidth={2.6} />
                          ČOSKORO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#aebccd", marginTop: 2, lineHeight: 1.35 }}>{z.popis}</div>
                    <div style={{ display: "flex", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, color: "#8a94a3" }}>
                        cena{" "}
                        <strong style={{ color: z.cenaMod > 1 ? "#c9830f" : z.cenaMod < 1 ? "#2ca24e" : "#5a6f88" }}>
                          {z.cenaMod > 1 ? "+" : ""}
                          {Math.round((z.cenaMod - 1) * 100)} %
                        </strong>
                      </span>
                      <span style={{ fontSize: 10, color: "#8a94a3" }}>
                        kapacita{" "}
                        <strong style={{ color: z.kapacitaMod > 1 ? "#2ca24e" : z.kapacitaMod < 1 ? "#c9830f" : "#5a6f88" }}>
                          {z.kapacitaMod > 1 ? "+" : ""}
                          {Math.round((z.kapacitaMod - 1) * 100)} %
                        </strong>
                      </span>
                      <span style={{ fontSize: 10, color: "#8a94a3" }}>
                        údržba{" "}
                        <strong style={{ color: z.udrzbaMod > 1 ? "#c9830f" : z.udrzbaMod < 1 ? "#2ca24e" : "#5a6f88" }}>
                          {z.udrzbaMod > 1 ? "+" : ""}
                          {Math.round((z.udrzbaMod - 1) * 100)} %
                        </strong>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {jeVlek && (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12,
            color: "#1b2c42",
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={sBobovouDrahou}
            onChange={(e) => setSBobovouDrahou(e.target.checked)}
            style={{ width: 15, height: 15, cursor: "pointer" }}
          />
          Aj s bobovou dráhou (+200 000 €) — bude fungovať aj v lete
        </label>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 10 }}>
        <span style={parameter}>
          <Coins size={13} color="#c9930f" strokeWidth={2.3} />
          {cenaSpolu.toLocaleString("sk-SK")} €
        </span>
        <span style={parameter}>
          <Clock size={13} color="#5a6f88" strokeWidth={2.3} />
          {Math.round(vystavbaVRealnychDnoch(info.vystavbaHernychMesiacov))} dní
        </span>
        <span style={parameter}>
          <Star size={13} color="#2f8ae0" strokeWidth={2.3} />
          {prestizBudovy(kategoria, vyberTyp, vyberZnacka)}
        </span>
        <span style={parameter}>
          <Users size={13} color="#2ca24e" strokeWidth={2.3} />
          {kapacitaBudovy(kategoria, vyberTyp, vyberZnacka)}/h
        </span>
      </div>

      <button
        onClick={() => onPostavit(vyberTyp, vyberZnacka, sBobovouDrahou)}
        disabled={jePremiova}
        style={{
          ...btnZeleny,
          width: "100%",
          padding: "11px 14px",
          fontSize: 12.5,
          opacity: jePremiova ? 0.5 : 1,
          cursor: jePremiova ? "not-allowed" : "pointer",
        }}
      >
        <Check size={15} strokeWidth={2.6} />
        Postaviť za {cenaSpolu.toLocaleString("sk-SK")} €
      </button>
    </div>
  );
}
