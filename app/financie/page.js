"use client";

import { useEffect, useState } from "react";
import { useGameState } from "../../lib/useGameState";
import { supabase } from "../../lib/supabaseClient";
import AuthForm from "../../components/AuthForm";
import AppLayout from "../../components/AppLayout";
import { zaciatokAktualnejSezony } from "../../lib/katalog";
import { cardStyle } from "../../lib/styles";

function sucetOd(transakcie, odDatumu) {
  return transakcie.filter((t) => new Date(t.created_at) >= odDatumu).reduce((s, t) => s + Number(t.suma), 0);
}

function Riadok({ label, hodnota }) {
  const farba = hodnota > 0 ? "#4ade80" : hodnota < 0 ? "#f2994a" : "#9fb0bf";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #223040" }}>
      <span style={{ color: "#9fb0bf" }}>{label}</span>
      <span style={{ color: farba, fontWeight: 700 }}>
        {hodnota > 0 ? "+" : ""}{Math.round(hodnota).toLocaleString("sk-SK")} €
      </span>
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
      .limit(2000);
    setTransakcie(data || []);
    setNacitavaSa(false);
  }

  if (!session) return <AuthForm />;

  const teraz = new Date();
  const zaciatokDna = new Date(teraz.getFullYear(), teraz.getMonth(), teraz.getDate());
  const zaciatokTyzdna = new Date(teraz.getTime() - 7 * 24 * 60 * 60 * 1000);
  const zaciatokMesiaca = new Date(teraz.getFullYear(), teraz.getMonth(), 1);
  const zaciatokSezony = stanica ? zaciatokAktualnejSezony(teraz) : teraz;

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      <h2 style={{ fontSize: 20 }}>💰 Financie</h2>

      {nacitavaSa && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      {!nacitavaSa && stanica && (
        <>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 15 }}>Prehľad zárobku/výdavkov</h3>
            <Riadok label="Dnes" hodnota={sucetOd(transakcie, zaciatokDna)} />
            <Riadok label="Posledných 7 dní" hodnota={sucetOd(transakcie, zaciatokTyzdna)} />
            <Riadok label="Tento mesiac" hodnota={sucetOd(transakcie, zaciatokMesiaca)} />
            <Riadok label="Táto sezóna" hodnota={sucetOd(transakcie, zaciatokSezony)} />
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 15 }}>Posledné transakcie</h3>
            {transakcie.length === 0 && <p style={{ color: "#4a5866", fontSize: 13 }}>Zatiaľ žiadne transakcie.</p>}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {transakcie.slice(0, 20).map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1a2632", fontSize: 13 }}>
                  <span style={{ color: "#657685" }}>
                    {new Date(t.created_at).toLocaleString("sk-SK")} — {t.typ === "prevadzka" ? "Prevádzka" : t.typ === "stavba" ? "Stavba" : "Zamestnanec"}
                  </span>
                  <span style={{ color: t.suma >= 0 ? "#4ade80" : "#f2994a" }}>
                    {t.suma >= 0 ? "+" : ""}{Math.round(t.suma).toLocaleString("sk-SK")} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
