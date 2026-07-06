"use client";

import { useEffect, useState } from "react";
import { useGameState } from "../../lib/useGameState";
import { supabase } from "../../lib/supabaseClient";
import AuthForm from "../../components/AuthForm";
import Nav from "../../components/Nav";
import VyjednavanieModal from "../../components/VyjednavanieModal";
import { cardStyle } from "../../lib/styles";

export default function RebricekPage() {
  const { session, stanica, loading, ukazVyjednavanie, vyjednatPlat, handleLogout } = useGameState();
  const [rebricek, setRebricek] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);

  useEffect(() => {
    if (session) nacitaj();
  }, [session]);

  async function nacitaj() {
    setNacitavaSa(true);
    const { data } = await supabase.from("rebricek").select("*").order("prestiz", { ascending: false });
    setRebricek(data || []);
    setNacitavaSa(false);
  }

  if (!session) return <AuthForm />;

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <Nav email={session.user.email} onLogout={handleLogout} />

      <VyjednavanieModal ukaz={!loading && ukazVyjednavanie} onVyjednat={vyjednatPlat} />

      <div style={{ ...cardStyle, marginTop: 0 }}>
        <h3 style={{ marginTop: 0 }}>🏆 Rebríček podľa prestíže</h3>
        {nacitavaSa && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}
        {!nacitavaSa && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rebricek.map((r, i) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: stanica && r.id === stanica.id ? "#16241d" : "#0f1720",
                  border: stanica && r.id === stanica.id ? "1px solid #2f9e6e" : "1px solid #2a3744",
                }}
              >
                <span>#{i + 1} {r.nazov}{stanica && r.id === stanica.id && " (ty)"}</span>
                <span style={{ color: "#f2c94c", fontWeight: 600 }}>⭐ {r.prestiz}</span>
              </div>
            ))}
            {rebricek.length === 0 && <p style={{ color: "#657685" }}>Zatiaľ žiadni hráči v rebríčku.</p>}
          </div>
        )}
      </div>
    </main>
  );
}
