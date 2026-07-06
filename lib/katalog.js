// Katalóg typov lanoviek — podľa GDD.md sekcia 6.1
// vystavbaHernychMesiacov sa prepočíta na reálne dni cez pomer 2:1 (herný čas beží 2x rýchlejšie)
export const LANOVKY_TYPY = {
  vlek: { nazov: "Vlek", zakladnaCena: 150000, vystavbaHernychMesiacov: 1, kapacita: 15, prestiz: 20, referencnaCena: 15 },
  sedacka_pevna: { nazov: "Pevná sedačková lanovka", zakladnaCena: 400000, vystavbaHernychMesiacov: 2, kapacita: 25, prestiz: 40, referencnaCena: 20 },
  sedacka_4: { nazov: "Odpojiteľná 4-sedačka", zakladnaCena: 900000, vystavbaHernychMesiacov: 3, kapacita: 45, prestiz: 70, referencnaCena: 25 },
  sedacka_6: { nazov: "Odpojiteľná 6-sedačka", zakladnaCena: 1300000, vystavbaHernychMesiacov: 3.5, kapacita: 65, prestiz: 90, referencnaCena: 28 },
  sedacka_8: { nazov: "Odpojiteľná 8-sedačka", zakladnaCena: 1800000, vystavbaHernychMesiacov: 4, kapacita: 90, prestiz: 110, referencnaCena: 30 },
  kabinka_8: { nazov: "Kabínková 8-miestna", zakladnaCena: 2500000, vystavbaHernychMesiacov: 5, kapacita: 110, prestiz: 140, referencnaCena: 35 },
  kabinka_10: { nazov: "Kabínková 10-miestna", zakladnaCena: 3200000, vystavbaHernychMesiacov: 5.5, kapacita: 140, prestiz: 160, referencnaCena: 38 },
  kabinka_15: { nazov: "Kabínková 15-miestna", zakladnaCena: 4200000, vystavbaHernychMesiacov: 6, kapacita: 190, prestiz: 190, referencnaCena: 42 },
  funitel: { nazov: "Funitel", zakladnaCena: 5500000, vystavbaHernychMesiacov: 7, kapacita: 220, prestiz: 220, referencnaCena: 45 },
  s3: { nazov: "3S systém", zakladnaCena: 8000000, vystavbaHernychMesiacov: 9, kapacita: 280, prestiz: 280, referencnaCena: 50 },
};

// Značky — modifikátory nad základné hodnoty typu (GDD sekcia 6.2)
export const ZNACKY = {
  alpinor: { nazov: "Alpinor", popis: "Prémiová, najspoľahlivejšia", cenaMod: 1.2, prestizMod: 1.25 },
  montera: { nazov: "Montera", popis: "Vyvážená, bezpečná voľba", cenaMod: 1.0, prestizMod: 1.0 },
  nordtech: { nazov: "Nordtech", popis: "Lacnejšia, riskantnejšia", cenaMod: 0.85, prestizMod: 0.9 },
};

// Herný čas beží 2x rýchlejšie => reálne dni = herné mesiace * 30 / 2
export function vystavbaVRealnychDnoch(hernychMesiacov) {
  return (hernychMesiacov * 30) / 2;
}

export function cenaLanovky(typ, znacka) {
  return Math.round(LANOVKY_TYPY[typ].zakladnaCena * ZNACKY[znacka].cenaMod);
}

export function prestizLanovky(typ, znacka) {
  return Math.round(LANOVKY_TYPY[typ].prestiz * ZNACKY[znacka].prestizMod);
}

// Jednoduchý model dopytu — rovnaký princíp ako pri budovách predtým
export function turistiZaHodinu(typ, cena) {
  const info = LANOVKY_TYPY[typ];
  const bezpecnaCena = Math.max(cena, 1);
  const dopyt = (info.kapacita * info.referencnaCena) / bezpecnaCena;
  return Math.min(dopyt, info.kapacita);
}

export function prijemZaHodinu(typ, cena) {
  return turistiZaHodinu(typ, cena) * cena;
}
