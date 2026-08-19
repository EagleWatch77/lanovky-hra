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
  vystavbaVRealnychDnoch,
  zamestnanciPotrebni,
  turistiZaHodinu,
  prijemZaHodinu,
  konkurencnyMultiplikator,
  skutocnaReferencnaCena,
  globalnyCenovyMultiplikator,
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
};

const LANOVKOVE_SLOTY = ["vlek", "vlek_bobova", "lanovka_luka", "lanovka_do_hor", "lanovka_udolie", "lanovka_na_vrchol", "lanovka_ladovec", "lanovka_ladovec_lokalna"];

function realnaKategoria(kat) {
  return LANOVKOVE_SLOTY.includes(kat) ? "lanovka" : kat;
}

function typFilterPreSlot(zonaKluc, kat) {
  return LANOVKOVE_SLOTY.includes(kat) ? [kat] : null;
}

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

  function pocetVZone(zonaKluc, kat, poradie) {
    const typFilter = typFilterPreSlot(zonaKluc, kat);
    const realna = realnaKategoria(kat);
    return budovy
      .filter((b) => b.zona === zonaKluc && b.kategoria === realna && (!typFilter || typFilter.includes(b.typ)))
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
          Ľadovec vyžaduje konzorcium — príde neskôr.
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
                  <PodmienkaRiadok splnene={podm.konkurencia} text="Konkurencia sa objavila v parkovisku alebo apréski" />
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
          {Object.keys(zona.limity).map((kat) =>
            Array.from({ length: zona.limity[kat] }).map((_, poradie) => {
              const riadokKluc = `${kat}-${poradie}`;
              const budova = pocetVZone(aktivnaZona, kat, poradie);
              const realna = realnaKategoria(kat);
              const nazov =
                zona.popisky?.[kat] || KATEGORIE[realna].katalog[kat]?.nazov || NAZVY_JEDNOTNE[kat] || KATEGORIE[realna].nazov;

              const potrebnaZonaPreLanovku = aktivnaZona === "luka" ? ODOMKNUTIE_LANOVIEK_LUKA[kat] : null;
              const zamknutySlot =
                potrebnaZonaPreLanovku &&
                !budova &&
                ((potrebnaZonaPreLanovku === "udolie" && !stanica.udolie_odomknute) ||
                  (potrebnaZonaPreLanovku === "hory" && !stanica.hory_odomknute));

              // --- HOTOVÁ BUDOVA ---
              if (budova?.stav === "hotovo") {
                const b = budova;
                const info = KATEGORIE[b.kategoria].katalog[b.typ];
                const maCenu = KATEGORIE[b.kategoria].maCenu;
                const efektivitaB = efektivitaBudovy(b);
                const konkurenciaMult = konkurencnyMultiplikator(b.kategoria, b.zona, pocetKonkurencie);
                const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
                const refCenaDnes = maCenu
                  ? skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult, maZasnezovanie)
                  : 0;
                const odhadTuristov = maCenu
                  ? Math.round(turistiZaHodinu(b.kategoria, b.typ, b.cena, refCenaDnes) * efektivitaB * konkurenciaMult)
                  : null;
                const odhadPrijem = maCenu
                  ? Math.round(prijemZaHodinu(b.kategoria, b.typ, b.cena, refCenaDnes) * efektivitaB * konkurenciaMult)
                  : null;
                const rozbalene = rozbaleny === riadokKluc;

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
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#33bd63",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "var(--font-sora), system-ui, sans-serif",
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#1b2c42",
                          }}
                        >
                          {info.nazov}
                        </span>
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
                          <span style={detailHodnota}>{info.kapacita} / h</span>
                        </div>
                        <div style={detailRiadok}>
                          <span>Zamestnanci</span>
                          <span style={detailHodnota}>{potrebnyB} (plný stav)</span>
                        </div>
                        {maCenu && (
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
                        {nazov}
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
                      <span style={{ fontSize: 13, color: "#8a94a3", fontWeight: 600 }}>{nazov}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "#aebccd", whiteSpace: "nowrap" }}>
                      Odomkne sa s {potrebnaZonaPreLanovku === "udolie" ? "Údolím" : "Horami"}
                    </span>
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
                      <span style={{ fontSize: 13, color: "#8a94a3", fontWeight: 600 }}>{nazov}</span>
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
                      zonaKluc={aktivnaZona}
                      kat={kat}
                      onPostavit={(typ, znacka, sBobovouDrahou) => {
                        postavitBudovu(realnaKategoria(kat), typ, znacka, aktivnaZona, sBobovouDrahou);
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
  const katalog = typFilter
    ? Object.fromEntries(Object.entries(katalogPlny).filter(([t]) => typFilter.includes(t)))
    : katalogPlny;
  const [vyberTyp, setVyberTyp] = useState(Object.keys(katalog)[0]);
  const znackyKatalog = KATEGORIE[realna].znackyKatalog;
  const [vyberZnacka, setVyberZnacka] = useState(znackyKatalog ? Object.keys(znackyKatalog)[0] : null);
  const [sBobovouDrahou, setSBobovouDrahou] = useState(false);
  const jeVlek = realna === "lanovka" && vyberTyp === "vlek";
  const cenaSpolu = cenaBudovy(realna, vyberTyp, vyberZnacka) + (jeVlek && sBobovouDrahou ? 200000 : 0);

  const parameter = {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11.5,
    color: "#5a6f88",
  };

  return (
    <div style={{ padding: "0 12px 12px", borderTop: "1px solid rgba(120,160,205,0.18)" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0" }}>
        {Object.keys(katalog).map((typ) => {
          const vybraty = vyberTyp === typ;
          return (
            <button
              key={typ}
              onClick={() => setVyberTyp(typ)}
              style={{
                padding: "8px 10px",
                borderRadius: 11,
                cursor: "pointer",
                textAlign: "left",
                background: vybraty ? "#eaf4fd" : "#fff",
                border: vybraty ? "1px solid #2f92e6" : "1px solid rgba(120,160,205,0.24)",
                boxShadow: vybraty ? "0 4px 12px rgba(47,146,230,0.18)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#1b2c42",
                }}
              >
                {katalog[typ].nazov}
              </div>
              <div style={{ fontSize: 11, color: vybraty ? "#1c6fc4" : "#8a94a3", marginTop: 1 }}>
                {cenaBudovy(realna, typ, vyberZnacka).toLocaleString("sk-SK")} €
              </div>
            </button>
          );
        })}
      </div>

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
          {Math.round(vystavbaVRealnychDnoch(katalog[vyberTyp].vystavbaHernychMesiacov))} dní
        </span>
        <span style={parameter}>
          <Star size={13} color="#2f8ae0" strokeWidth={2.3} />
          {prestizBudovy(realna, vyberTyp, vyberZnacka)}
        </span>
        <span style={parameter}>
          <Users size={13} color="#2ca24e" strokeWidth={2.3} />
          {katalog[vyberTyp].kapacita}/h
        </span>
      </div>

      <button onClick={() => onPostavit(vyberTyp, vyberZnacka, sBobovouDrahou)} style={{ ...btnZeleny, width: "100%", padding: "11px 14px", fontSize: 12.5 }}>
        <Check size={15} strokeWidth={2.6} />
        Postaviť za {cenaSpolu.toLocaleString("sk-SK")} €
      </button>
    </div>
  );
}
