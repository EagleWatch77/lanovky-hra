"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Coins, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const VYDAVKOVE_TYPY = ["stavba", "naklady_platy", "naklady_najatie", "zamestnanec", "naklady_udrzba", "naklady_elektrina", "naklady_palivo"];
const PREVADZKOVE_VYDAVKY = ["naklady_platy", "naklady_udrzba", "naklady_elektrina"];

// Herný deň = 12 reálnych hodín (herný čas beží 2× rýchlejšie)
const REALNYCH_HODIN_V_HERNOM_DNI = 12;

export default function FinancieRozpis({ stanica }) {
  const [transakcie, setTransakcie] = useState([]);
  const [nacitavaSa, setNacitavaSa] = useState(true);

  useEffect(() => {
    let zrusene = false;
    async function nacitaj() {
      const od = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { data } = await supabase
        .from("transakcie")
        .select("suma, typ, created_at")
        .eq("stanica_id", stanica.id)
        .gte("created_at", od.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000);
      if (!zrusene) {
        setTransakcie(data || []);
        setNacitavaSa(false);
      }
    }
    if (stanica) nacitaj();
    return () => {
      zrusene = true;
    };
  }, [stanica?.id]);

  const karta = {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(120,160,205,0.26)",
    borderRadius: 16,
    padding: 14,
    width: 290,
    boxSizing: "border-box",
    boxShadow: "0 14px 36px rgba(40,90,145,0.22)",
  };

  const nadpis = (
    <h3
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        margin: "0 0 11px 0",
        fontFamily: "var(--font-sora), system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 13.5,
        color: "#1b2c42",
      }}
    >
      <Coins size={15} color="#c9930f" strokeWidth={2.3} />
      Peňažný tok
    </h3>
  );

  if (nacitavaSa) {
    return (
      <div style={karta}>
        {nadpis}
        <div style={{ fontSize: 12, color: "#8a94a3" }}>Načítavam…</div>
      </div>
    );
  }

  // Posledných 24 reálnych hodín = 2 herné dni
  const od24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const poslednych24 = transakcie.filter((t) => new Date(t.created_at) >= od24h);

  const prijem24 = poslednych24.filter((t) => t.typ === "prijem").reduce((s, t) => s + Number(t.suma), 0);
  const naklady24 = poslednych24
    .filter((t) => PREVADZKOVE_VYDAVKY.includes(t.typ))
    .reduce((s, t) => s + Math.abs(Number(t.suma)), 0);

  // Prepočet na 1 herný deň (24 reálnych hodín = 2 herné dni)
  const prijemDen = Math.round(prijem24 / 2);
  const nakladyDen = Math.round(naklady24 / 2);
  const cistyDen = prijemDen - nakladyDen;

  // Priemer za týždeň (7 reálnych dní = 14 herných dní)
  const prijemTyzden = transakcie.filter((t) => t.typ === "prijem").reduce((s, t) => s + Number(t.suma), 0);
  const nakladyTyzden = transakcie
    .filter((t) => PREVADZKOVE_VYDAVKY.includes(t.typ))
    .reduce((s, t) => s + Math.abs(Number(t.suma)), 0);
  const priemerDen = Math.round((prijemTyzden - nakladyTyzden) / 14);

  // Ako dlho vydržíš, ak si v mínuse
  const dniDoNuly = cistyDen < 0 ? Math.floor(stanica.peniaze / Math.abs(cistyDen)) : null;

  const riadok = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "8px 0",
    borderBottom: "1px solid rgba(120,160,205,0.18)",
  };

  const hodnota = {
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 13,
    whiteSpace: "nowrap",
  };

  return (
    <div style={karta}>
      {nadpis}

      <div style={riadok}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#5a6f88" }}>
          <TrendingUp size={13} color="#2ca24e" strokeWidth={2.4} />
          Príjem
        </span>
        <span style={{ ...hodnota, color: "#2ca24e" }}>+{prijemDen.toLocaleString("sk-SK")} €</span>
      </div>

      <div style={riadok}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#5a6f88" }}>
          <TrendingDown size={13} color="#d64545" strokeWidth={2.4} />
          Prevádzka
        </span>
        <span style={{ ...hodnota, color: "#d64545" }}>−{nakladyDen.toLocaleString("sk-SK")} €</span>
      </div>

      <div style={{ ...riadok, borderBottom: "none", paddingTop: 10 }}>
        <span style={{ fontSize: 12.5, color: "#1b2c42", fontWeight: 700 }}>Čistý tok za deň</span>
        <span
          style={{
            ...hodnota,
            fontSize: 15,
            fontWeight: 800,
            color: cistyDen > 0 ? "#2ca24e" : cistyDen < 0 ? "#d64545" : "#8a94a3",
          }}
        >
          {cistyDen > 0 ? "+" : ""}
          {cistyDen.toLocaleString("sk-SK")} €
        </span>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(120,160,205,0.22)",
          marginTop: 4,
          paddingTop: 9,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11.5, color: "#8a94a3" }}>Priemer za týždeň</span>
        <span
          style={{
            fontFamily: "var(--font-sora), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 12,
            color: priemerDen >= 0 ? "#2ca24e" : "#d64545",
          }}
        >
          {priemerDen > 0 ? "+" : ""}
          {priemerDen.toLocaleString("sk-SK")} € / deň
        </span>
      </div>

      {dniDoNuly !== null && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            marginTop: 11,
            padding: "9px 11px",
            borderRadius: 11,
            background: dniDoNuly < 14 ? "#fdeeee" : "#fff7ea",
            border: dniDoNuly < 14 ? "1px solid rgba(214,69,69,0.28)" : "1px solid rgba(239,154,61,0.3)",
            fontSize: 11.5,
            fontWeight: 600,
            color: dniDoNuly < 14 ? "#c0392b" : "#c9830f",
            lineHeight: 1.45,
          }}
        >
          <AlertTriangle size={14} strokeWidth={2.3} style={{ flexShrink: 0, marginTop: 1 }} />
          Si v strate. Pri tomto tempe ti peniaze vydržia asi {dniDoNuly} {dniDoNuly === 1 ? "deň" : dniDoNuly < 5 ? "dni" : "dní"}.
        </div>
      )}

      <p style={{ fontSize: 10, color: "#aebccd", marginTop: 10, marginBottom: 0, lineHeight: 1.4 }}>
        Prevádzka = mzdy, údržba a elektrina. Stavby sa nepočítajú.
      </p>
    </div>
  );
}
