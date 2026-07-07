"use client";

import { useEffect, useState } from "react";
import { useGameState } from "../../lib/useGameState";
import { supabase } from "../../lib/supabaseClient";
import AuthForm from "../../components/AuthForm";
import AppLayout from "../../components/AppLayout";
import { KATEGORIE, zaciatokAktualnejSezony } from "../../lib/katalog";
import { cardStyle } from "../../lib/styles";

const VYDAVKOVE_TYPY = ["stavba", "naklady_platy", "naklady_najatie", "zamestnanec"];

function sucet(transakcie, kategoria, typy, odDatumu) {
  return transakcie
    .filter((t) => t.kategoria === kategoria && typy.includes(t.typ) && new Date(t.created_at) >= odDatumu)
    .reduce((s, t) => s + Number(t.suma), 0);
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
          </tbody>
        </table>
      </div>
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
  const obdobia = [
    { label: "Dnes", od: new Date(teraz.getFullYear(), teraz.getMonth(), teraz.getDate()) },
    { label: "Týždeň", od: new Date(teraz.getTime() - 7 * 24 * 60 * 60 * 1000) },
    { label: "Mesiac", od: new Date(teraz.getFullYear(), teraz.getMonth(), 1) },
    { label: "Sezóna", od: stanica ? zaciatokAktualnejSezony(teraz) : teraz },
    { label: "Rok", od: new Date(teraz.getFullYear(), 0, 1) },
  ];

  const prijmoveKategorie = Object.keys(KATEGORIE).filter((k) => KATEGORIE[k].maCenu);
  const vsetkyKategorie = Object.keys(KATEGORIE);

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      <h2 style={{ fontSize: 20 }}>💰 Financie</h2>

      {nacitavaSa && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      {!nacitavaSa && stanica && (
        <>
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
            Výdavky zahŕňajú stavbu, náklady na najatie zamestnancov aj ich priebežný plat.
          </p>
        </>
      )}
    </AppLayout>
  );
}
