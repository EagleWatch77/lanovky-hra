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
  vyrobcoviaPreSlot,
  jeLanovkovySlot,
  LANOVKY_TYPY,
  OBRAZKY_LANOVIEK,
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
  CableCar,
  Car,
  BedDouble,
  Beer,
  Wrench,
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

// Rozdelenie slotov do sekcií
const SEKCIE = [
  {
    kluc: "doprava",
    nazov: "Lanovky a vleky",
    Ikona: CableCar,
    farba: "#2f8ae0",
    sloty: ["vlek", "lanovka", "spojnica_udolie", "spojnica_hory", "spojnica_ladovec"],
  },
  { kluc: "parkovanie", nazov: "Parkovanie", Ikona: Car, farba: "#8a5fd6", sloty: ["parkovisko"] },
  { kluc: "ubytovanie", nazov: "Ubytovanie", Ikona: BedDouble, farba: "#2ca24e", sloty: ["penzion", "hotel"] },
  { kluc: "sluzby", nazov: "Služby", Ikona: Beer, farba: "#c9930f", sloty: ["bar", "servis", "pokladna"] },
  { kluc: "technika", nazov: "Technika", Ikona: Wrench, farba: "#5a6f88", sloty: ["ratrak", "zasnezovanie"] },
];

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

  // Vykreslí jeden slot (hotová budova / vo výstavbe / zamknuté / voľné)
  function vykresliSlot(slot, poradie) {
    const riadokKluc = `${slot}-${poradie}`;
    const budova = budovaVSlote(aktivnaZona, slot, poradie);
    const jeLanovka = jeLanovkovySlot(slot);
    const kategoria = jeLanovka ? "lanovka" : slot;
    const nazovSlotu = zona.popisky?.[slot] || NAZVY_JEDNOTNE[slot] || KATEGORIE[kategoria]?.nazov || slot;

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
            boxShadow: "0 2px 8px rgba(60,110,160,0.07)",
            borderRadius: 11,
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
              padding: "9px 11px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#33bd63", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#1b2c42",
                }}
              >
                {info?.nazov || b.typ}
              </span>
              {znackaNazov && <span style={{ fontSize: 10.5, color: "#aebccd" }}>{znackaNazov}</span>}
              {konkurenciaMult < 1 && <AlertTriangle size={12} color="#ef9a3d" strokeWidth={2.4} />}
            </div>
            <span style={{ color: "#c5d2e0", display: "flex", flexShrink: 0 }}>
              {rozbalene ? <ChevronUp size={15} strokeWidth={2.4} /> : <ChevronDown size={15} strokeWidth={2.4} />}
            </span>
          </div>

          {rozbalene && (
            <div style={{ padding: "0 11px 11px", borderTop: "1px solid rgba(120,160,205,0.16)" }}>
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
                    ~{odhadPrijem} €/h <span style={{ color: "#8a94a3", fontWeight: 500 }}>({odhadTuristov} os./h)</span>
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
      const zostava = Math.max(0, Math.ceil((new Date(budova.koniec_vystavby) - new Date()) / (1000 * 60 * 60 * 24)));
      const infoV = KATEGORIE[budova.kategoria]?.katalog[budova.typ];
      return (
        <div
          key={riadokKluc}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "9px 11px",
            background: "#fff7ea",
            border: "1px solid rgba(239,154,61,0.3)",
            borderRadius: 11,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <HardHat size={15} color="#c9830f" strokeWidth={2.3} />
            <span
              style={{
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 12.5,
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
            padding: "9px 11px",
            background: "rgba(120,160,205,0.05)",
            borderRadius: 11,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <Lock size={14} color="#c5d2e0" strokeWidth={2.3} />
            <span style={{ fontSize: 12.5, color: "#aebccd", fontWeight: 600 }}>{nazovSlotu}</span>
          </div>
          <span style={{ fontSize: 10.5, color: "#c5d2e0", whiteSpace: "nowrap" }}>{text}</span>
        </div>
      );
    }

    // --- VOĽNÝ SLOT ---
    const otvorenaStavba = stavbaPreKluc === riadokKluc;
    return (
      <div
        key={riadokKluc}
        style={{
          background: otvorenaStavba ? "#fff" : "transparent",
          border: otvorenaStavba ? "1px solid rgba(120,160,205,0.28)" : "1px dashed rgba(120,160,205,0.30)",
          borderRadius: 11,
          overflow: "hidden",
          boxShadow: otvorenaStavba ? "0 4px 14px rgba(60,110,160,0.10)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "8px 11px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
            <Plus size={14} color="#aebccd" strokeWidth={2.4} />
            <span style={{ fontSize: 12.5, color: "#8a94a3", fontWeight: 600 }}>{nazovSlotu}</span>
          </div>
          <button
            onClick={() => setStavbaPreKluc(otvorenaStavba ? null : riadokKluc)}
            style={{
              ...btnModry,
              padding: "6px 12px",
              fontSize: 11.5,
              flexShrink: 0,
              background: otvorenaStavba ? "#fff" : btnModry.background,
              color: otvorenaStavba ? "#5a6f88" : "#fff",
              border: otvorenaStavba ? "1px solid rgba(120,160,205,0.28)" : "none",
              boxShadow: otvorenaStavba ? "none" : btnModry.boxShadow,
            }}
          >
            {otvorenaStavba ? "Zavrieť" : "Postaviť"}
          </button>
        </div>

        {otvorenaStavba && (
          <StavbaFormular
            slot={slot}
            kategoria={kategoria}
            peniaze={stanica.peniaze}
            onPostavit={(typ, znacka, sBobovouDrahou) => {
              postavitBudovu(kategoria, typ, znacka, aktivnaZona, sBobovouDrahou, slot);
              setStavbaPreKluc(null);
            }}
          />
        )}
      </div>
    );
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SEKCIE.map((sekcia) => {
            // Sloty tejto sekcie, ktoré v zóne existujú
            const sloty = sekcia.sloty.filter((s) => zona.limity[s]);
            if (sloty.length === 0) return null;

            return (
              <div key={sekcia.kluc}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 8,
                    paddingBottom: 6,
                    borderBottom: "1px solid rgba(120,160,205,0.18)",
                  }}
                >
                  <sekcia.Ikona size={14} color={sekcia.farba} strokeWidth={2.4} />
                  <span
                    style={{
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#8a94a3",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {sekcia.nazov}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sloty.map((slot) =>
                    Array.from({ length: zona.limity[slot] }).map((_, poradie) => vykresliSlot(slot, poradie))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StavbaFormular({ slot, kategoria, onPostavit, peniaze = 0 }) {
  const jeLanovka = jeLanovkovySlot(slot);

  // Pri lanovkách: najprv výrobca, potom jeho ponuka
  const vyrobcovia = jeLanovka ? vyrobcoviaPreSlot(slot) : {};
  const klucVyrobcov = Object.keys(vyrobcovia);
  const [vyberVyrobca, setVyberVyrobca] = useState(jeLanovka ? klucVyrobcov[0] : null);

  const ponuka = jeLanovka ? vyrobcovia[vyberVyrobca]?.ponuka || [] : Object.keys(KATEGORIE[kategoria].katalog);
  const [vyberTyp, setVyberTyp] = useState(ponuka[0]);
  const [sBobovouDrahou, setSBobovouDrahou] = useState(false);

  function zmenVyrobcu(kluc) {
    setVyberVyrobca(kluc);
    const novaPonuka = vyrobcovia[kluc]?.ponuka || [];
    if (!novaPonuka.includes(vyberTyp)) setVyberTyp(novaPonuka[0]);
  }

  const info = KATEGORIE[kategoria].katalog[vyberTyp];
  const jeVlek = jeLanovka && vyberTyp === "vlek";
  const znackaInfo = jeLanovka ? vyrobcovia[vyberVyrobca] : null;
  const jePremiova = znackaInfo?.premiova;
  const znackaKluc = jeLanovka ? vyberVyrobca : null;

  const cenaSpolu = cenaBudovy(kategoria, vyberTyp, znackaKluc) + (jeVlek && sBobovouDrahou ? 200000 : 0);

  const parameter = { display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#5a6f88" };

  const nadpisSekcie = {
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontSize: 10,
    fontWeight: 700,
    color: "#8a94a3",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: 7,
  };

  return (
    <div style={{ padding: "12px 12px", borderTop: "1px solid rgba(120,160,205,0.18)" }}>
      {/* KROK 1 — výrobca */}
      {jeLanovka && (
        <div style={{ marginBottom: 14 }}>
          <div style={nadpisSekcie}>1 · Vyber výrobcu</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {klucVyrobcov.map((kluc) => {
              const v = vyrobcovia[kluc];
              const vybraty = vyberVyrobca === kluc;
              const zamknuty = v.premiova;
              return (
                <button
                  key={kluc}
                  onClick={() => !zamknuty && zmenVyrobcu(kluc)}
                  disabled={zamknuty}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 13px",
                    borderRadius: 11,
                    cursor: zamknuty ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-sora), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 12.5,
                    background: zamknuty
                      ? "rgba(120,160,205,0.08)"
                      : vybraty
                      ? "linear-gradient(160deg,#4aa3ee,#2f92e6)"
                      : "#fff",
                    color: zamknuty ? "#aebccd" : vybraty ? "#fff" : "#5a6f88",
                    border: vybraty ? "none" : "1px solid rgba(120,160,205,0.24)",
                    boxShadow: vybraty ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
                  }}
                >
                
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {v.logo ? (
                      <img src={v.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <CableCar size={13} strokeWidth={2.3} color={vybraty ? "#fff" : "#8a94a3"} />
                    )}
                  </span>
                  {v.nazov}
                  {zamknuty && <Lock size={11} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>

          {znackaInfo && (
            <div
              style={{
                marginTop: 9,
                padding: "10px 12px",
                borderRadius: 11,
                background: jePremiova ? "#fdf4e0" : "rgba(120,160,205,0.07)",
                border: jePremiova ? "1px solid rgba(201,147,15,0.28)" : "1px solid rgba(120,160,205,0.16)",
              }}
            >
              <div style={{ fontSize: 11.5, color: "#5a6f88", lineHeight: 1.45 }}>{znackaInfo.popis}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10.5, color: "#8a94a3" }}>
                  cena{" "}
                  <strong style={{ color: znackaInfo.cenaMod > 1 ? "#c9830f" : znackaInfo.cenaMod < 1 ? "#2ca24e" : "#5a6f88" }}>
                    {znackaInfo.cenaMod > 1 ? "+" : ""}
                    {Math.round((znackaInfo.cenaMod - 1) * 100)} %
                  </strong>
                </span>
                <span style={{ fontSize: 10.5, color: "#8a94a3" }}>
                  kapacita{" "}
                  <strong style={{ color: znackaInfo.kapacitaMod > 1 ? "#2ca24e" : znackaInfo.kapacitaMod < 1 ? "#c9830f" : "#5a6f88" }}>
                    {znackaInfo.kapacitaMod > 1 ? "+" : ""}
                    {Math.round((znackaInfo.kapacitaMod - 1) * 100)} %
                  </strong>
                </span>
                <span style={{ fontSize: 10.5, color: "#8a94a3" }}>
                  údržba{" "}
                  <strong style={{ color: znackaInfo.udrzbaMod > 1 ? "#c9830f" : znackaInfo.udrzbaMod < 1 ? "#2ca24e" : "#5a6f88" }}>
                    {znackaInfo.udrzbaMod > 1 ? "+" : ""}
                    {Math.round((znackaInfo.udrzbaMod - 1) * 100)} %
                  </strong>
                </span>
              </div>
              {jePremiova && (
                <div style={{ fontSize: 10.5, color: "#c9930f", fontWeight: 600, marginTop: 7 }}>
                  Tento výrobca bude dostupný neskôr.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* KROK 2 — model */}
      {ponuka.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {jeLanovka && <div style={nadpisSekcie}>2 · Vyber model</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {ponuka.map((typ) => {
              const t = KATEGORIE[kategoria].katalog[typ];
              if (!t) return null;
              const vybraty = vyberTyp === typ;
              return (
                <button
                  key={typ}
                  onClick={() => setVyberTyp(typ)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 11,
                    cursor: "pointer",
                    textAlign: "left",
                    background: vybraty ? "#eaf4fd" : "#fff",
                    border: vybraty ? "1px solid #2f92e6" : "1px solid rgba(120,160,205,0.22)",
                    boxShadow: vybraty ? "0 4px 12px rgba(47,146,230,0.18)" : "none",
                  }}
                >
                 <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                    {OBRAZKY_LANOVIEK[typ] && (
                      <span
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 10,
                          background: "transparent",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={OBRAZKY_LANOVIEK[typ]}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </span>
                    )}
                    <div style={{ minWidth: 0 }}>
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
                    </div>
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-sora), system-ui, sans-serif",
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#1b2c42",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cenaBudovy(kategoria, typ, znackaKluc).toLocaleString("sk-SK")} €
                    </div>
                    <div style={{ fontSize: 10.5, color: "#2ca24e", fontWeight: 600, marginTop: 2, whiteSpace: "nowrap" }}>
                      {kapacitaBudovy(kategoria, typ, znackaKluc)} os./h
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

      {info && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            marginBottom: 10,
            paddingTop: 10,
            borderTop: "1px solid rgba(120,160,205,0.18)",
          }}
        >
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
            {prestizBudovy(kategoria, vyberTyp, znackaKluc)}
          </span>
          <span style={parameter}>
            <Users size={13} color="#2ca24e" strokeWidth={2.3} />
            {kapacitaBudovy(kategoria, vyberTyp, znackaKluc)}/h
          </span>
        </div>
      )}

   {(() => {
        const chybaPenazi = peniaze < cenaSpolu;
        const nedostupne = jePremiova || !vyberTyp || chybaPenazi;
        return (
          <>
            <button
              onClick={() => !nedostupne && onPostavit(vyberTyp, znackaKluc, sBobovouDrahou)}
              disabled={nedostupne}
              style={{
                ...btnZeleny,
                width: "100%",
                padding: "11px 14px",
                fontSize: 12.5,
                background: nedostupne ? "#c5d2e0" : btnZeleny.background,
                boxShadow: nedostupne ? "none" : btnZeleny.boxShadow,
                cursor: nedostupne ? "not-allowed" : "pointer",
              }}
            >
              {chybaPenazi && !jePremiova ? (
                <>
                  <Coins size={14} strokeWidth={2.5} />
                  Chýba ti {(cenaSpolu - peniaze).toLocaleString("sk-SK")} €
                </>
              ) : (
                <>
                  <Check size={15} strokeWidth={2.6} />
                  Postaviť za {cenaSpolu.toLocaleString("sk-SK")} €
                </>
              )}
            </button>
          </>
        );
      })()}
    </div>
  );
}
