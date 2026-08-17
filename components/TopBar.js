"use client";
import { hernyDatum } from "../lib/hernyCas";

function vypocitajSezonu(datum) {
  const mesiac = datum.getMonth();
  const zimneMesiace = [10, 11, 0, 1, 2, 3];
  return zimneMesiace.includes(mesiac) ? "ZIMA" : "LETO";
}

function Stat({ label, value, iconBg, onClick, aktivny }) {
  const parts = label.split(" ");
  const emoji = parts[0];
  const nazov = parts.slice(1).join(" ");

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

  const ikona = {
    width: 22,
    height: 22,
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
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
      <span style={ikona}>{emoji}</span>
      <span style={cislo}>{value}</span>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} title={nazov} style={{ ...chip, margin: 0 }}>
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

export default function TopBar({ stanica, budovy, efektivitaBudovy, onKliknutePrestiz, prestizRozbalena, dennyPocetTuristov, spokojnostCelkova, onKliknuteSpokojnost, spokojnostRozbalena, onKliknuteDatum, datumRozbaleny, onKliknuteTuristi, turistiRozbaleni }) {
  const hDatum = hernyDatum(new Date());
  const hotove = budovy.filter((b) => b.stav === "hotovo");
  const sucetEfektivit = hotove.reduce((s, b) => s + efektivitaBudovy(b), 0);
  const priemernaEfektivita = hotove.length > 0 ? Math.round((sucetEfektivit / hotove.length) * 100) : 100;
  const sezona = vypocitajSezonu(hDatum);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "nowrap" }}>
      <Stat label="⭐ Prestíž" value={stanica.prestiz.toLocaleString("sk-SK")} iconBg="rgba(78,168,240,0.18)" onClick={onKliknutePrestiz} aktivny={prestizRozbalena} />
      <Stat label="💰 Peniaze" value={Math.round(stanica.peniaze).toLocaleString("sk-SK") + " €"} iconBg="rgba(244,194,75,0.22)" />
      <Stat label="😊 Spokojnosť" value={Math.round((spokojnostCelkova ?? 1) * 100) + " %"} iconBg="rgba(167,128,240,0.18)" onClick={onKliknuteSpokojnost} aktivny={spokojnostRozbalena} />
      <Stat label="🎿 Turisti" value={Math.round(dennyPocetTuristov ?? 0).toLocaleString("sk-SK")} iconBg="rgba(79,203,113,0.18)" onClick={onKliknuteTuristi} aktivny={turistiRozbaleni} />
      <Stat
        label="📅 Dátum"
        value={`${hDatum.toLocaleDateString("sk-SK")} ${String(hDatum.getHours()).padStart(2, "0")}:${String(hDatum.getMinutes()).padStart(2, "0")}`}
        iconBg="rgba(120,160,205,0.16)"
        onClick={onKliknuteDatum}
        aktivny={datumRozbaleny}
      />
      <Stat label={sezona === "ZIMA" ? "❄️ Sezóna" : "☀️ Sezóna"} value={sezona} iconBg="rgba(78,197,245,0.18)" />
    </div>
  );
}
