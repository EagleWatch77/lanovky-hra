// Katalóg typov lanoviek — podľa GDD.md sekcia 6.1
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

// Parkoviská — GDD sekcia 6.4 (bez značiek; vzdialenosť od lanovky riešime neskôr)
export const PARKOVISKA_TYPY = {
  strkove: { nazov: "Štrkové parkovisko", zakladnaCena: 80000, vystavbaHernychMesiacov: 0.5, kapacita: 40, prestiz: 5, referencnaCena: 3 },
  asfaltove: { nazov: "Asfaltové parkovisko", zakladnaCena: 250000, vystavbaHernychMesiacov: 1, kapacita: 60, prestiz: 15, referencnaCena: 5 },
  luxusne: { nazov: "Luxusné asfaltové", zakladnaCena: 500000, vystavbaHernychMesiacov: 1.5, kapacita: 80, prestiz: 35, referencnaCena: 8 },
  parkovaci_dom: { nazov: "Parkovací dom", zakladnaCena: 1400000, vystavbaHernychMesiacov: 4, kapacita: 200, prestiz: 70, referencnaCena: 6 },
};

// Pokladne — GDD sekcia 6.5 (bez značiek, negenerujú vlastný príjem — len podporujú prevádzku)
export const POKLADNE_TYPY = {
  mala: { nazov: "Malá pokladňa", zakladnaCena: 40000, vystavbaHernychMesiacov: 0.5, kapacita: 30, prestiz: 5, referencnaCena: 0 },
  velka: { nazov: "Veľká pokladňa", zakladnaCena: 150000, vystavbaHernychMesiacov: 1, kapacita: 80, prestiz: 15, referencnaCena: 0 },
};

// Značky — len pre lanovky zatiaľ (GDD sekcia 6.2)
export const ZNACKY = {
  alpinor: { nazov: "Alpinor", popis: "Prémiová, najspoľahlivejšia", cenaMod: 1.2, prestizMod: 1.25 },
  montera: { nazov: "Montera", popis: "Vyvážená, bezpečná voľba", cenaMod: 1.0, prestizMod: 1.0 },
  nordtech: { nazov: "Nordtech", popis: "Lacnejšia, riskantnejšia", cenaMod: 0.85, prestizMod: 0.9 },
};

// Zoznam kategórií — kód pracuje s hociktorou rovnakým spôsobom
export const KATEGORIE = {
  lanovka: { nazov: "Lanovky", katalog: LANOVKY_TYPY, maZnacky: true, maCenu: true },
  parkovisko: { nazov: "Parkoviská", katalog: PARKOVISKA_TYPY, maZnacky: false, maCenu: true },
  pokladna: { nazov: "Pokladne", katalog: POKLADNE_TYPY, maZnacky: false, maCenu: false },
};

// Herný čas beží 2x rýchlejšie => reálne dni = herné mesiace * 30 / 2
export function vystavbaVRealnychDnoch(hernychMesiacov) {
  return (hernychMesiacov * 30) / 2;
}

function ziskajInfo(kategoria, typ) {
  return KATEGORIE[kategoria].katalog[typ];
}

// znacka je nepovinná — ak kategória značky nepoužíva, počíta sa bez modifikátora
export function cenaBudovy(kategoria, typ, znacka) {
  const info = ziskajInfo(kategoria, typ);
  const mod = znacka && ZNACKY[znacka] ? ZNACKY[znacka].cenaMod : 1;
  return Math.round(info.zakladnaCena * mod);
}

export function prestizBudovy(kategoria, typ, znacka) {
  const info = ziskajInfo(kategoria, typ);
  const mod = znacka && ZNACKY[znacka] ? ZNACKY[znacka].prestizMod : 1;
  return Math.round(info.prestiz * mod);
}

// Jednoduchý model dopytu — platí pre kategórie, ktoré majú vlastnú cenu (lanovky, parkoviská)
export function turistiZaHodinu(kategoria, typ, cena) {
  const info = ziskajInfo(kategoria, typ);
  if (!info.referencnaCena) return 0;
  const bezpecnaCena = Math.max(cena, 1);
  const dopyt = (info.kapacita * info.referencnaCena) / bezpecnaCena;
  return Math.min(dopyt, info.kapacita);
}

export function prijemZaHodinu(kategoria, typ, cena) {
  return turistiZaHodinu(kategoria, typ, cena) * cena;
}
