"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function RebricekOkno({ stanica }) {
  const [rebricek, setRebricek] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);

  useEffect(() => {
    nacitaj();
  }, []);

  async function nacitaj() {
    setNacitavaSa(true);
    const { data } = await supabase.from("rebricek").select("*").order("prestiz", { ascending: false });
    setRebricek(data || []);
    setNacitavaSa(false);
  }

  if (nacitavaSa) return <p style={{ color: "#9fb0bf" }}>Načítavam...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {rebricek.map((r, i) => (
        <Link
          key={r.id}
          href={`/profil/${r.id}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: 8,
            background: stanica && r.id === stanica.id ? "#16241d" : "#0f1720",
            border: stanica && r.id === stanica.id ? "1px solid #2f9e6e" : "1px solid #2a3744",
            textDecoration: "none",
            color: "#e8edf2",
          }}
        >
          <span>#{i + 1} {r.nazov}{stanica && r.id === stanica.id && " (ty)"}</span>
          <span style={{ color: "#f2c94c", fontWeight: 600 }}>⭐ {r.prestiz}</span>
        </Link>
      ))}
      {rebricek.length === 0 && <p style={{ color: "#657685" }}>Zatiaľ žiadni hráči v rebríčku.</p>}
    </div>
  );
}
