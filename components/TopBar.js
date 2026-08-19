"use client";
import { hernyDatum } from "../lib/hernyCas";
import { vypocitajDenoePocasie } from "../lib/pocasie";
import { jeZimnyMesiac, jeMedzisezona } from "../lib/katalog";import { Star, Coins, Smile, Users, Calendar, Snowflake, Sun, CalendarOff } from "lucide-react";

// ⚙️ PREPÍNAČ VZHĽADU IKON:
//   "farebne"      = každá ikona má farbu svojej kategórie (zlatá minca, modrá hviezda...)
//   "jednofarebne" = všetky ikony v jednej tmavomodrej (striedmejšie)
const VZHLAD_IKON = "farebne";


function Stat({ Ikona, farbaIkony, iconBg, nazov, value, onClick, aktivny }) {
  const chip = {
    display: "flex",
    alignItems: "center",
    gap: 7,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    height: 34,
    padding: "4px 10px 4px 5px",
    borderRadius: 12,
    background: aktivny ? "#eaf4fd" : "#ffffff",
    border: aktivny ? "1px solid #2f92e6" : "1px solid rgba(120,160,205,0.22)",
    boxShadow: "0 4px 14px rgba(60,110,160,0.12)",
    cursor: onClick ? "pointer" : "default",
  };

  const ikonaBox = {
    width: 22,
    height: 22,
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: iconBg,
    flexShrink: 0,
  };

  const cislo = {
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontWeight: 700,
    fontSize: 13.5,
    color: "#1b2c42",
    lineHeight: 1,
  };

  const obsah = (
    <>
      <span style={ikonaBox}>
        <Ikona size={14} strokeWidth={2.2} color={farbaIkony} />
      </span>
      <span style={cislo}>{value}</span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} title={nazov} style={chip}>
        {obsah}
      </button>
    );
  }
  return (
    <div title={nazov} style={chip}>
      {obsah}
    </div>
  );
}

export default function TopBar({ stanica, budovy, efektivitaBudovy, onKliknutePrestiz, prestizRozbalena, dennyPocetTuristov, spokojnostCelkova, onKliknuteSpokojnost, spokojnostRozbalena, onKliknuteDatum, datumRozbaleny, onKliknuteTuristi, turistiRozbaleni, onKliknutePocasie, pocasieRozbalene, onKliknutePeniaze, peniazeRozbalene }) {
  const hDatum = hernyDatum(new Date());
  const hotove = budovy.filter((b) => b.stav === "hotovo");
  const sucetEfektivit = hotove.reduce((s, b) => s + efektivitaBudovy(b), 0);
  const priemernaEfektivita = hotove.length > 0 ? Math.round((sucetEfektivit / hotove.length) * 100) : 100;
  const jeMedzi = jeMedzisezona(hDatum);
  const jeZima = jeZimnyMesiac(hDatum.getMonth());
  const sezona = jeMedzi ? "MEDZISEZÓNA" : jeZima ? "ZIMA" : "LETO";

  // Aktuálne počasie (rovnaký výber úseku ako v PocasiePanel)
  const pocasieVsetko = vypocitajDenoePocasie(hDatum);
  const aktualnaHodina = new Date().getHours();
  let indexUseku = 2;
  if (aktualnaHodina < 10) indexUseku = 0;
  else if (aktualnaHodina < 14) indexUseku = 1;
  const pocasieTeraz = pocasieVsetko[indexUseku];
  const jedna = "#1b2c42"; // tmavomodrá pre jednofarebný režim
  const f = (farebna) => (VZHLAD_IKON === "farebne" ? farebna : jedna);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "nowrap" }}>
      <Stat
        Ikona={Star}
        farbaIkony={f("#2f8ae0")}
        iconBg="rgba(78,168,240,0.18)"
        nazov="Prestíž"
        value={stanica.prestiz.toLocaleString("sk-SK")}
        onClick={onKliknutePrestiz}
        aktivny={prestizRozbalena}
      />
     <Stat
        Ikona={Coins}
        farbaIkony="#c9930f"
        iconBg="rgba(244,194,75,0.22)"
        nazov="Peniaze"
        value={Math.round(stanica.peniaze).toLocaleString("sk-SK") + " €"}
        onClick={onKliknutePeniaze}
        aktivny={peniazeRozbalene}
      />
      <Stat
        Ikona={Smile}
        farbaIkony={f("#8a5fd6")}
        iconBg="rgba(167,128,240,0.18)"
        nazov="Spokojnosť"
        value={Math.round((spokojnostCelkova ?? 1) * 100) + " %"}
        onClick={onKliknuteSpokojnost}
        aktivny={spokojnostRozbalena}
      />
      <Stat
        Ikona={Users}
        farbaIkony={f("#2ca24e")}
        iconBg="rgba(79,203,113,0.18)"
        nazov="Turisti"
        value={Math.round(dennyPocetTuristov ?? 0).toLocaleString("sk-SK")}
        onClick={onKliknuteTuristi}
        aktivny={turistiRozbaleni}
      />
      <Stat
        Ikona={Calendar}
        farbaIkony={f("#5a6f88")}
        iconBg="rgba(120,160,205,0.16)"
        nazov="Dátum"
        value={`${hDatum.toLocaleDateString("sk-SK")} ${String(hDatum.getHours()).padStart(2, "0")}:${String(hDatum.getMinutes()).padStart(2, "0")}`}
        onClick={onKliknuteDatum}
        aktivny={datumRozbaleny}
      />
<Stat
        Ikona={jeMedzi ? CalendarOff : jeZima ? Snowflake : Sun}
        farbaIkony={
          pocasieTeraz?.lanovkyZatvorene
            ? "#d64545"
            : jeMedzi
            ? "#8a94a3"
            : jeZima
            ? "#2a9fd6"
            : "#e0a021"
        }
        iconBg={jeMedzi ? "rgba(120,160,205,0.16)" : jeZima ? "rgba(78,197,245,0.18)" : "rgba(240,169,78,0.18)"}
        nazov={`${sezona} — ${pocasieTeraz?.nazov ?? ""}`}
        value={
          jeMedzi
            ? "MEDZISEZÓNA"
            : `${jeZima ? "Zima" : "Leto"} · ${pocasieTeraz?.teplota ?? "–"}° · ${pocasieTeraz?.vietor ?? "–"} m/s`
        }
        onClick={onKliknutePocasie}
        aktivny={pocasieRozbalene}
      />
    </div>
  );
}
