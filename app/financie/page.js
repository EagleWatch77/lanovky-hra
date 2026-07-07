"use client";

import { useEffect, useState } from "react";
import { useGameState } from "../../lib/useGameState";
import { supabase } from "../../lib/supabaseClient";
import AuthForm from "../../components/AuthForm";
import AppLayout from "../../components/AppLayout";
import { KATEGORIE, zaciatokAktualnejSezony } from "../../lib/katalog";
import { hernyDatum, realDatumZHerneho } from "../../lib/hernyCas";
import { cardStyle } from "../../lib/styles";

const VYDAVKOVE_TYPY = ["stavba", "naklady_platy", "naklady_najatie", "zamestnanec"];

function sucet(transakcie, kategoria, typy, odDatumu) {
  return transakcie
    .filter((t) => t.kategoria === kategoria && typy.includes(t.typ) && new Date(t.created_at) >= odDatumu)
    .reduce((s, t) => s + Number(t.suma), 0);
}

function sucetVsetkychTypov(transakcie, typy, odDatumu) {
  return transakcie
    .filter((t) => typy.includes(t.typ) && new Date(t.created_at) >= odDatumu)
    .reduce((s, t) => s + Number(t.suma), 0);
}

// Súčet v konkrétnom rozsahu (od-doPred) — použité na oddelenie zimnej a letnej sezóny v rámci ročníka
function sucetVRozsahu(transakcie, typy, od, doPred) {
  return transakcie
    .filter((t) => {
      const cas = new Date(t.created_at);
      return typy.includes(t.typ) && cas >= od && (!doPred || cas < doPred);
    })
    .reduce((s, t) => s + Number(t.suma), 0);
}

// Nájde herný začiatok zimy a leta aktuálneho ročníka (zima vždy 1.11, leto 1.5. nasledujúceho roka)
function zaciatokRocnikaHerny(hDatum) {
  const mesiac = hDatum.getMonth();
  const rok = hDatum.getFullYear();
  const zimaRok = mesiac < 10 ? rok - 1 : rok; // Jan-Okt patrí k zime, čo začala minulý november
  const zimaZaciatok = new Date(zimaRok, 10, 1);
  const letoZaciatok = new Date(zimaRok + 1, 4, 1);
  return { zimaZaciatok, letoZaciatok };
}

function Tabulka({ nadpis, riadky, obdobia, transakcie, typy, farba }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, fontSize: 15 }}>{nadpis}</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #223040" }}>
              <th style={{ textAlign: "left", padding: "6px 8px", color: "#9fb0bf" }}>Kategória</th>
              {obdobia.map((o) => (
                <th key={o.label} style={{ textAlign: "right", padding: "6px 8px", color: "#9fb0bf" }}>{o.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riadky.map((kat) => (
              <tr key={kat} style={{ borderBottom: "1px solid #1a2632" }}>
                <td style={{ padding: "6px 8px" }}>{KATEGORIE[kat].ikona} {KATEGORIE[kat].nazov}</td>
                {obdobia.map((o) => {
                  const hodnota = Math.abs(Math.round(sucet(transakcie, kat, typy, o.od)));
                  return (
                    <td key={o.label} style={{ textAlign: "right", padding: "6px 8px", color: hodnota > 0 ? farba : "#4a5866" }}>
                      {hodnota.toLocaleString("sk-SK")} €
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td style={{ padding: "8px", fontWeight: 700 }}>Spolu</td>
              {obdobia.map((o) => {
                const hodnota = Math.abs(Math.round(sucetVsetkychTypov(transakcie, typy, o.od)));
                return (
                  <td key={o.label} style={{ textAlign: "right", padding: "8px", fontWeight: 700, color: farba }}>
                    {hodnota.toLocaleString("sk-SK")} €
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CistyVysledok({ obdobia, transakcie }) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, fontSize: 15 }}>⚖️ Čistý výsledok (príjmy − výdavky)</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #223040" }}>
              {obdobia.map((o) => (
                <th key={o.label} style={{ textAlign: "right", padding: "6px 8px", color: "#9fb0bf" }}>{o.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {obdobia.map((o) => {
                const hodnota = Math.round(sucetVsetkychTypov(transakcie, ["prijem", ...VYDAVKOVE_TYPY], o.od));
                const farba = hodnota > 0 ? "#4ade80" : hodnota < 0 ? "#f2994a" : "#9fb0bf";
                return (
                  <td key={o.label} style={{ textAlign: "right", padding: "8px", fontWeight: 700, color: farba }}>
                    {hodnota > 0 ? "+" : ""}{hodnota.toLocaleString("sk-SK")} €
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RocnikKarta({ transakcie, hDatum }) {
  const { zimaZaciatok, letoZaciatok } = zaciatokRocnikaHerny(hDatum);
  const zimaOd = realDatumZHerneho(zimaZaciatok);
  const letoOd = realDatumZHerneho(letoZaciatok);

  const vsetkyTypy = ["prijem", ...VYDAVKOVE_TYPY];
  const zimnaSuma = Math.round(sucetVRozsahu(transakcie, vsetkyTypy, zimaOd, letoOd));
  const letnaSuma = Math.round(sucetVRozsahu(transakcie, vsetkyTypy, letoOd, null));
  const spolu = zimnaSuma + letnaSuma;

  const riadky = [
    { label: "❄️ Zimná sezóna", hodnota: zimnaSuma },
    { label: "☀️ Letná sezóna", hodnota: letnaSuma },
    { label: "Spolu za ročník", hodnota: spolu, tucne: true },
  ];

  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, fontSize: 15 }}>📅 Ročník (zima + leto)</h3>
      {riadky.map((r) => {
        const farba = r.hodnota > 0 ? "#4ade80" : r.hodnota < 0 ? "#f2994a" : "#9fb0bf";
        return (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #223040" }}>
            <span style={{ color: "#9fb0bf", fontWeight: r.tucne ? 700 : 400 }}>{r.label}</span>
            <span style={{ color: farba, fontWeight: 700 }}>
              {r.hodnota > 0 ? "+" : ""}{r.hodnota.toLocaleString("sk-SK")} €
            </span>
          </div>
        );
      })}
      <p style={{ color: "#657685", fontSize: 11, marginTop: 8, marginBottom: 0 }}>
        Ročník = jedna zimná + jedna letná sezóna dokopy (herný kalendár, spolu 6 reálnych mesiacov).
      </p>
    </div>
  );
}

export default function FinanciePage() {
  const { session, stanica, budovy, handleLogout, efektivitaBudovy, pocetKonkurencie } = useGameState();
  const [transakcie, setTransakcie] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);

  useEffect(() => {
    if (stanica) nacitaj();
  }, [stanica?.id]);

  async function nacitaj() {
    setNacitavaSa(true);
    const { data } = await supabase
      .from("transakcie")
      .select("*")
      .eq("stanica_id", stanica.id)
      .order("created_at", { ascending: false })
      .limit(5000);
    setTransakcie(data || []);
    setNacitavaSa(false);
  }

  if (!session) return <AuthForm />;

  const teraz = new Date();
  const hDatum = hernyDatum(teraz);
  const zaciatokSezonyHerny = zaciatokAktualnejSezony(hDatum);
  const zaciatokSezonyRealny = realDatumZHerneho(zaciatokSezonyHerny);

  const obdobia = [
    { label: "Dnes", od: new Date(teraz.getFullYear(), teraz.getMonth(), teraz.getDate()) },
    { label: "Týždeň", od: new Date(teraz.getTime() - 7 * 24 * 60 * 60 * 1000) },
    { label: "Mesiac", od: new Date(teraz.getFullYear(), teraz.getMonth(), 1) },
    { label: "Sezóna", od: zaciatokSezonyRealny },
  ];

  const prijmoveKategorie = Object.keys(KATEGORIE).filter((k) => KATEGORIE[k].maCenu);
  const vsetkyKategorie = Object.keys(KATEGORIE);

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      <h2 style={{ fontSize: 20 }}>💰 Financie</h2>

      {nacitavaSa && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      {!nacitavaSa && stanica && (
        <>
          <CistyVysledok obdobia={obdobia} transakcie={transakcie} />
          <RocnikKarta transakcie={transakcie} hDatum={hDatum} />
          <Tabulka
            nadpis="📈 Príjmy podľa kategórie"
            riadky={prijmoveKategorie}
            obdobia={obdobia}
            transakcie={transakcie}
            typy={["prijem"]}
            farba="#4ade80"
          />
          <Tabulka
            nadpis="📉 Výdavky podľa kategórie"
            riadky={vsetkyKategorie}
            obdobia={obdobia}
            transakcie={transakcie}
            typy={VYDAVKOVE_TYPY}
            farba="#f2994a"
          />
          <p style={{ color: "#657685", fontSize: 11, marginTop: -8 }}>
            Výdavky zahŕňajú stavbu, náklady na najatie zamestnancov aj ich priebežný plat. "Sezóna" je počítaná podľa herného kalendára (3 reálne mesiace).
          </p>
        </>
      )}
    </AppLayout>
  );
}
