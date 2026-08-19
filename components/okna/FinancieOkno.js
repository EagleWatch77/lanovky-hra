"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { KATEGORIE, zaciatokAktualnejSezony } from "../../lib/katalog";
import { hernyDatum, realDatumZHerneho } from "../../lib/hernyCas";
import { Scale, CalendarRange, TrendingUp, TrendingDown, Snowflake, Sun, LayoutDashboard } from "lucide-react";

const VYDAVKOVE_TYPY = ["stavba", "naklady_platy", "naklady_najatie", "zamestnanec"];

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
  margin: "0 0 10px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

const cisloStyl = {
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
};

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

function sucetVRozsahu(transakcie, typy, od, doPred) {
  return transakcie
    .filter((t) => {
      const cas = new Date(t.created_at);
      return typy.includes(t.typ) && cas >= od && (!doPred || cas < doPred);
    })
    .reduce((s, t) => s + Number(t.suma), 0);
}

function zaciatokRocnikaHerny(hDatum) {
  const mesiac = hDatum.getMonth();
  const rok = hDatum.getFullYear();
  const zimaRok = mesiac < 10 ? rok - 1 : rok;
  const zimaZaciatok = new Date(zimaRok, 10, 1);
  const letoZaciatok = new Date(zimaRok + 1, 4, 1);
  return { zimaZaciatok, letoZaciatok };
}

function Tabulka({ nadpis, Ikona, farbaIkony, riadky, obdobia, transakcie, typy, farba }) {
  return (
    <div style={karta}>
      <h3 style={nadpisKarty}>
        <Ikona size={15} color={farbaIkony} strokeWidth={2.3} />
        {nadpis}
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(120,160,205,0.24)" }}>
              <th style={{ textAlign: "left", padding: "7px 8px", color: "#8a94a3", fontWeight: 600, fontSize: 11 }}>
                Kategória
              </th>
              {obdobia.map((o) => (
                <th
                  key={o.label}
                  style={{ textAlign: "right", padding: "7px 8px", color: "#8a94a3", fontWeight: 600, fontSize: 11 }}
                >
                  {o.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riadky.map((kat) => (
              <tr key={kat} style={{ borderBottom: "1px solid rgba(120,160,205,0.14)" }}>
                <td style={{ padding: "7px 8px", color: "#1b2c42" }}>{KATEGORIE[kat].nazov}</td>
                {obdobia.map((o) => {
                  const hodnota = Math.abs(Math.round(sucet(transakcie, kat, typy, o.od)));
                  return (
                    <td
                      key={o.label}
                      style={{
                        textAlign: "right",
                        padding: "7px 8px",
                        ...cisloStyl,
                        fontWeight: 600,
                        color: hodnota > 0 ? farba : "#c5d2e0",
                      }}
                    >
                      {hodnota.toLocaleString("sk-SK")} €
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td style={{ padding: "9px 8px", fontWeight: 700, color: "#1b2c42", fontSize: 12.5 }}>Spolu</td>
              {obdobia.map((o) => {
                const hodnota = Math.abs(Math.round(sucetVsetkychTypov(transakcie, typy, o.od)));
                return (
                  <td key={o.label} style={{ textAlign: "right", padding: "9px 8px", ...cisloStyl, color: farba }}>
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
    <div style={karta}>
      <h3 style={nadpisKarty}>
        <Scale size={15} color="#2f8ae0" strokeWidth={2.3} />
        Čistý výsledok
      </h3>
      <div style={{ display: "flex", gap: 8 }}>
        {obdobia.map((o) => {
          const hodnota = Math.round(sucetVsetkychTypov(transakcie, ["prijem", ...VYDAVKOVE_TYPY], o.od));
          const farba = hodnota > 0 ? "#2ca24e" : hodnota < 0 ? "#d64545" : "#8a94a3";
          const pozadie = hodnota > 0 ? "#e9f8ee" : hodnota < 0 ? "#fdeeee" : "rgba(120,160,205,0.08)";
          return (
            <div
              key={o.label}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "10px 6px",
                borderRadius: 11,
                background: pozadie,
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: 10.5, color: "#8a94a3", fontWeight: 600, marginBottom: 4 }}>{o.label}</div>
              <div style={{ ...cisloStyl, fontSize: 13.5, color: farba, whiteSpace: "nowrap" }}>
                {hodnota > 0 ? "+" : ""}
                {hodnota.toLocaleString("sk-SK")} €
              </div>
            </div>
          );
        })}
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
    { label: "Zimná sezóna", hodnota: zimnaSuma, Ikona: Snowflake, farbaIkony: "#2a9fd6" },
    { label: "Letná sezóna", hodnota: letnaSuma, Ikona: Sun, farbaIkony: "#e0a021" },
    { label: "Spolu za ročník", hodnota: spolu, tucne: true },
  ];

  return (
    <div style={karta}>
      <h3 style={nadpisKarty}>
        <CalendarRange size={15} color="#8a5fd6" strokeWidth={2.3} />
        Ročník (zima + leto)
      </h3>
      {riadky.map((r, i) => {
        const farba = r.hodnota > 0 ? "#2ca24e" : r.hodnota < 0 ? "#d64545" : "#8a94a3";
        return (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              padding: "9px 0",
              borderBottom: i < riadky.length - 1 ? "1px solid rgba(120,160,205,0.16)" : "none",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 12.5,
                color: r.tucne ? "#1b2c42" : "#5a6f88",
                fontWeight: r.tucne ? 700 : 500,
              }}
            >
              {r.Ikona && <r.Ikona size={14} color={r.farbaIkony} strokeWidth={2.2} />}
              {r.label}
            </span>
            <span style={{ ...cisloStyl, fontSize: 13, color: farba }}>
              {r.hodnota > 0 ? "+" : ""}
              {r.hodnota.toLocaleString("sk-SK")} €
            </span>
          </div>
        );
      })}
      <p style={{ color: "#aebccd", fontSize: 10.5, marginTop: 9, marginBottom: 0, lineHeight: 1.4 }}>
        Ročník = jedna zimná + jedna letná sezóna dokopy (spolu 6 reálnych mesiacov).
      </p>
    </div>
  );
}

export default function FinancieOkno({ stanica }) {
  const [transakcie, setTransakcie] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);
  const [zalozka, setZalozka] = useState("prehlad");

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

  if (nacitavaSa) return <p style={{ color: "#8a94a3", fontSize: 13 }}>Načítavam…</p>;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setZalozka("prehlad")} style={zalozkaStyl("prehlad")}>
          <LayoutDashboard size={14} strokeWidth={2.2} /> Prehľad
        </button>
        <button onClick={() => setZalozka("prijmy")} style={zalozkaStyl("prijmy")}>
          <TrendingUp size={14} strokeWidth={2.2} /> Príjmy
        </button>
        <button onClick={() => setZalozka("vydavky")} style={zalozkaStyl("vydavky")}>
          <TrendingDown size={14} strokeWidth={2.2} /> Výdavky
        </button>
      </div>

      {zalozka === "prehlad" && (
        <div>
          <CistyVysledok obdobia={obdobia} transakcie={transakcie} />
          <RocnikKarta transakcie={transakcie} hDatum={hDatum} />
        </div>
      )}

      {zalozka === "prijmy" && (
        <Tabulka
          nadpis="Príjmy podľa kategórie"
          Ikona={TrendingUp}
          farbaIkony="#2ca24e"
          riadky={prijmoveKategorie}
          obdobia={obdobia}
          transakcie={transakcie}
          typy={["prijem"]}
          farba="#2ca24e"
        />
      )}

      {zalozka === "vydavky" && (
        <div>
          <Tabulka
            nadpis="Výdavky podľa kategórie"
            Ikona={TrendingDown}
            farbaIkony="#d64545"
            riadky={vsetkyKategorie}
            obdobia={obdobia}
            transakcie={transakcie}
            typy={VYDAVKOVE_TYPY}
            farba="#d64545"
          />
          <p style={{ color: "#aebccd", fontSize: 10.5, marginTop: -4, lineHeight: 1.45 }}>
            Výdavky zahŕňajú stavbu a náklady na priebežný plat. „Sezóna" je počítaná podľa herného kalendára.
          </p>
        </div>
      )}
    </div>
  );
}
