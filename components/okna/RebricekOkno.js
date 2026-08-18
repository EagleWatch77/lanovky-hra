"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Trophy } from "lucide-react";

// Koľko hráčov ukázať nad a pod tebou
const OKOLO = 2;

export default function RebricekPanel({ stanica, onOtvorRebricek }) {
  const [rebricek, setRebricek] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);

  useEffect(() => {
    let zrusene = false;
    async function nacitaj() {
      const { data } = await supabase.from("rebricek").select("*").order("prestiz", { ascending: false });
      if (!zrusene) {
        setRebricek(data || []);
        setNacitavaSa(false);
      }
    }
    nacitaj();
    return () => {
      zrusene = true;
    };
  }, []);

  const karta = {
    background: "rgba(255,255,255,0.74)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(120,160,205,0.22)",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(52,100,150,0.16)",
    padding: 12,
  };

  const hlavicka = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  };

  const nadpis = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    color: "#1b2c42",
  };

  if (nacitavaSa) {
    return (
      <div style={karta}>
        <div style={nadpis}>
          <Trophy size={15} color="#efb23c" strokeWidth={2.2} />
          Rebríček
        </div>
        <div style={{ fontSize: 11.5, color: "#8a94a3", padding: "6px 0" }}>Načítavam…</div>
      </div>
    );
  }

  const mojIndex = rebricek.findIndex((r) => stanica && r.id === stanica.id);
  const mojePoradie = mojIndex >= 0 ? mojIndex + 1 : null;

  // Výsek okolo teba (ak nie si v rebríčku, ukáž prvých pár)
  let od = 0;
  if (mojIndex >= 0) {
    od = Math.max(0, mojIndex - OKOLO);
    // ak si blízko konca, posuň okno hore nech je vždy rovnako veľké
    const maxOd = Math.max(0, rebricek.length - (OKOLO * 2 + 1));
    od = Math.min(od, maxOd);
  }
  const vysek = rebricek.slice(od, od + OKOLO * 2 + 1);

  return (
    <div style={karta}>
      <div style={hlavicka}>
        <div style={nadpis}>
          <Trophy size={15} color="#efb23c" strokeWidth={2.2} />
          Rebríček
        </div>
        {mojePoradie && (
          <span
            style={{
              fontFamily: "var(--font-sora), system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 15,
              color: "#2ca24e",
            }}
          >
            #{mojePoradie}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {vysek.map((r, i) => {
          const poradie = od + i + 1;
          const jaSom = stanica && r.id === stanica.id;
          return (
            <div
              key={r.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 8px",
                borderRadius: 9,
                background: jaSom ? "linear-gradient(90deg,#e9f8ee,#dff4e8)" : "transparent",
                border: jaSom ? "1px solid rgba(51,189,99,0.3)" : "1px solid transparent",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 10.5,
                  color: jaSom ? "#1f8a49" : "#aebccd",
                  width: 26,
                  flexShrink: 0,
                }}
              >
                #{poradie}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: jaSom ? "#1f8a49" : "#1b2c42",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={r.meno_hraca ? `${r.nazov} (${r.meno_hraca})` : r.nazov}
              >
                {r.nazov}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                  color: jaSom ? "#1f8a49" : "#5a6f88",
                  flexShrink: 0,
                }}
              >
                {r.prestiz.toLocaleString("sk-SK")}
              </span>
            </div>
          );
        })}
        {vysek.length === 0 && (
          <div style={{ fontSize: 11.5, color: "#8a94a3", padding: "6px 0" }}>Zatiaľ žiadni hráči.</div>
        )}
      </div>

      {onOtvorRebricek && (
        <button
          onClick={onOtvorRebricek}
          style={{
            width: "100%",
            marginTop: 9,
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid rgba(120,160,205,0.22)",
            background: "#ffffff",
            color: "#1c6fc4",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 11.5,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
          }}
        >
          Celý rebríček
        </button>
      )}
    </div>
  );
}
