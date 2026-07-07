"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGameState } from "../../../lib/useGameState";
import { supabase } from "../../../lib/supabaseClient";
import AuthForm from "../../../components/AuthForm";
import AppLayout from "../../../components/AppLayout";
import { KATEGORIE } from "../../../lib/katalog";
import { cardStyle, linkStyle } from "../../../lib/styles";

export default function ProfilPage() {
  const { id } = useParams();
  const { session, stanica, budovy, handleLogout, efektivitaBudovy, pocetKonkurencie } = useGameState();
  const [profil, setProfil] = useState(null);
  const [profilBudovy, setProfilBudovy] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);

  useEffect(() => {
    if (id) nacitaj();
  }, [id]);

  async function nacitaj() {
    setNacitavaSa(true);
    const { data: p } = await supabase.from("verejny_profil").select("*").eq("id", id).maybeSingle();
    const { data: b } = await supabase.from("verejne_budovy").select("*").eq("stanica_id", id).eq("stav", "hotovo");
    setProfil(p);
    setProfilBudovy(b || []);
    setNacitavaSa(false);
  }

  if (!session) return <AuthForm />;

  const suhrnKategorii = {};
  for (const b of profilBudovy) {
    suhrnKategorii[b.kategoria] = (suhrnKategorii[b.kategoria] || 0) + 1;
  }

  const jeToJaSam = stanica && stanica.id === id;

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      <Link href="/rebricek" style={{ ...linkStyle, display: "inline-block", marginBottom: 8 }}>← Späť na rebríček</Link>

      {nacitavaSa && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}
      {!nacitavaSa && !profil && <p style={{ color: "#9fb0bf" }}>Tento hráč neexistuje.</p>}

      {!nacitavaSa && profil && (
        <>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>🏔️ {profil.nazov} {jeToJaSam && <span style={{ color: "#4ade80", fontSize: 14 }}>(ty)</span>}</h2>
            <p style={{ color: "#9fb0bf", fontSize: 16 }}>
              ⭐ Prestíž: <strong style={{ color: "#f2c94c" }}>{profil.prestiz.toLocaleString("sk-SK")}</strong>
            </p>
            <p style={{ color: "#657685", fontSize: 13 }}>
              Založené: {new Date(profil.created_at).toLocaleDateString("sk-SK")}
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>🏗️ Budovy ({profilBudovy.length})</h3>
            {Object.keys(suhrnKategorii).length === 0 && (
              <p style={{ color: "#4a5866", fontSize: 13 }}>Zatiaľ žiadne dokončené budovy.</p>
            )}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              {Object.keys(suhrnKategorii).map((kat) => (
                <div key={kat} style={{ fontSize: 14, color: "#9fb0bf" }}>
                  {KATEGORIE[kat].ikona} {KATEGORIE[kat].nazov}: <strong style={{ color: "#e8edf2" }}>{suhrnKategorii[kat]}</strong>
                </div>
              ))}
            </div>

            {profilBudovy.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {profilBudovy.map((b) => {
                  const info = KATEGORIE[b.kategoria]?.katalog[b.typ];
                  return (
                    <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "#0f1720", borderRadius: 6, fontSize: 13 }}>
                      <span>
                        {KATEGORIE[b.kategoria]?.ikona} {info?.nazov || b.typ}
                        {b.znacka && <span style={{ color: "#657685" }}> ({KATEGORIE[b.kategoria].znackyKatalog?.[b.znacka]?.nazov})</span>}
                      </span>
                      <span style={{ color: "#657685" }}>{KATEGORIE[b.kategoria]?.nazov}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}
