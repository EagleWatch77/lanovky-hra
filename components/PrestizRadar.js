"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { prestizBudovy, KATEGORIE } from "../lib/katalog";
import { cardStyle } from "../lib/styles";

export default function PrestizRadar({ budovy, efektivitaBudovy }) {
  const hotove = budovy.filter((b) => b.stav === "hotovo");

  // Infraštruktúra: súčet základnej prestíže budov (bez vplyvu efektivity), škálované na 0-100
  const zakladnaPrestiz = hotove.reduce((s, b) => s + prestizBudovy(b.kategoria, b.typ, b.znacka), 0);
  const infrastruktura = Math.min(100, Math.round((zakladnaPrestiz / 2000) * 100));

  // Efektivita: priemerná efektivita naprieč budovami (najatí zamestnanci, vyjednávanie o plat)
  const priemernaEfektivita = hotove.length > 0
    ? Math.round((hotove.reduce((s, b) => s + efektivitaBudovy(b), 0) / hotove.length) * 100)
    : 100;

  // Rozmanitosť: koľko z 9 kategórií budov máš aspoň raz postavených
  const unikatneKategorie = new Set(hotove.map((b) => b.kategoria)).size;
  const rozmanitost = Math.round((unikatneKategorie / Object.keys(KATEGORIE).length) * 100);

  // Cenová stratégia: priemerný pomer tvojej ceny k "referenčnej" trhovej cene (100% = trhová cena)
  const sCenou = hotove.filter((b) => b.cena && KATEGORIE[b.kategoria].maCenu);
  const priemernyPomerCeny = sCenou.length > 0
    ? sCenou.reduce((s, b) => {
        const ref = KATEGORIE[b.kategoria].katalog[b.typ].referencnaCena || 1;
        return s + (b.cena / ref) * 100;
      }, 0) / sCenou.length
    : 100;
  const cenovaStrategia = Math.min(100, Math.round(priemernyPomerCeny / 2));

  const data = [
    { zlozka: "Infraštruktúra", hodnota: infrastruktura },
    { zlozka: "Efektivita", hodnota: priemernaEfektivita },
    { zlozka: "Rozmanitosť", hodnota: rozmanitost },
    { zlozka: "Cenová stratégia", hodnota: cenovaStrategia },
  ];

  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, fontSize: 14, color: "#9fb0bf", fontWeight: 600 }}>⭐ Rozklad prestíže</h3>
      <div style={{ width: "100%", height: 150 }}>
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid stroke="#2a3744" />
            <PolarAngleAxis dataKey="zlozka" tick={{ fill: "#9fb0bf", fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#4a5866", fontSize: 9 }} />
            <Radar dataKey="hodnota" stroke="#2f9e6e" fill="#2f9e6e" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p style={{ color: "#657685", fontSize: 9, marginTop: 4, marginBottom: 0 }}>
        Odhad na základe tvojich postavených budov, efektivity a nastavených cien — nie presné meranie spokojnosti turistov (to pridáme neskôr).
      </p>
    </div>
  );
}
