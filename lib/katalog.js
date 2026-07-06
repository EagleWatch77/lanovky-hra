// Katalóg typov lanoviek — GDD sekcia 6.1
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

export const ZNACKY_LANOVKY = {
  alpinor: { nazov: "Alpinor", popis: "Prémiová, najspoľahlivejšia", cenaMod: 1.2, prestizMod: 1.25 },
  montera: { nazov: "Montera", popis: "Vyvážená, bezpečná voľba", cenaMod: 1.0, prestizMod: 1.0 },
  nordtech: { nazov: "Nordtech", popis: "Lacnejšia, riskantnejšia", cenaMod: 0.85, prestizMod: 0.9 },
};

// Parkoviská — GDD sekcia 6.4 (bez značiek; vzdialenosť od lanovky riešime neskôr)
export const PARKOVISKA_TYPY = {
  strkove: { nazov: "Štrkové parkovisko", zakladnaCena: 80000, vystavbaHernychMesiacov: 0.5, kapacita: 40, prestiz: 5, referencnaCena: 3 },
  asfaltove: { nazov: "Asfaltové parkovisko", zakladnaCena: 250000, vystavbaHernychMesiacov: 1, kapacita: 60, prestiz: 15, referencnaCena: 5 },
  luxusne: { nazov: "Luxusné asfaltové", zakladnaCena: 500000, vystavbaHernychMesiacov: 1.5, kapacita: 80, prestiz: 35, referencnaCena: 8 },
  parkovaci_dom: { nazov: "Parkovací dom", zakladnaCena: 1400000, vystavbaHernychMesiacov: 4, kapacita: 200, prestiz: 70, referencnaCena: 6 },
};

// Pokladne — GDD sekcia 6.5 (bez značiek, negenerujú vlastný príjem)
export const POKLADNE_TYPY = {
  mala: { nazov: "Malá pokladňa", zakladnaCena: 40000, vystavbaHernychMesiacov: 0.5, kapacita: 30, prestiz: 5, referencnaCena: 0 },
  velka: { nazov: "Veľká pokladňa", zakladnaCena: 150000, vystavbaHernychMesiacov: 1, kapacita: 80, prestiz: 15, referencnaCena: 0 },
};

// Hotely — GDD sekcia 6.6 (bez značiek; cena = cena za noc, ktorú si hráč nastaví)
export const HOTELY_TYPY = {
  penzion: { nazov: "Penzión", zakladnaCena: 300000, vystavbaHernychMesiacov: 4, kapacita: 10, prestiz: 30, referencnaCena: 25 },
  maly_hotel: { nazov: "Malý hotel", zakladnaCena: 900000, vystavbaHernychMesiacov: 8, kapacita: 25, prestiz: 70, referencnaCena: 45 },
  hotel: { nazov: "Hotel", zakladnaCena: 2000000, vystavbaHernychMesiacov: 14, kapacita: 50, prestiz: 130, referencnaCena: 70 },
  grand_hotel: { nazov: "Grand hotel", zakladnaCena: 4500000, vystavbaHernychMesiacov: 22, kapacita: 100, prestiz: 250, referencnaCena: 120 },
};

// Ratraky — GDD sekcia 6.3 (2 značky, negenerujú vlastný príjem, len prestíž a náklady)
export const RATRAKY_TYPY = {
  kompakt: { nazov: "Kompakt ratrak", zakladnaCena: 150000, vystavbaHernychMesiacov: 0.5, kapacita: 5, prestiz: 10, referencnaCena: 0 },
  standard: { nazov: "Štandardný ratrak", zakladnaCena: 300000, vystavbaHernychMesiacov: 1, kapacita: 12, prestiz: 20, referencnaCena: 0 },
  vykonny: { nazov: "Výkonný ratrak", zakladnaCena: 520000, vystavbaHernychMesiacov: 1.5, kapacita: 25, prestiz: 35, referencnaCena: 0 },
};

export const ZNACKY_RATRAKY = {
  snowtrac: { nazov: "Snowtrac", popis: "Lacnejší nákup, vyššia údržba", cenaMod: 1.0, prestizMod: 1.0 },
  pistenwolf: { nazov: "Pistenwolf", popis: "Drahší, ale spoľahlivejší", cenaMod: 1.27, prestizMod: 1.1 },
};

// Zasnežovanie — GDD sekcia 6.11 (bez značiek, negeneruje vlastný príjem, podporná infraštruktúra)
export const ZASNEZOVANIE_TYPY = {
  potok: { nazov: "Čerpanie z potoka", zakladnaCena: 250000, vystavbaHernychMesiacov: 2, kapacita: 3, prestiz: 10, referencnaCena: 0 },
  mala_nadrz: { nazov: "Malá nádrž + delá", zakladnaCena: 700000, vystavbaHernychMesiacov: 5, kapacita: 8, prestiz: 30, referencnaCena: 0 },
  stredna_nadrz: { nazov: "Stredná nádrž + automat. systém", zakladnaCena: 1800000, vystavbaHernychMesiacov: 9, kapacita: 18, prestiz: 60, referencnaCena: 0 },
  velka_nadrz: { nazov: "Veľká umelá nádrž (plne automat.)", zakladnaCena: 3500000, vystavbaHernychMesiacov: 14, kapacita: 35, prestiz: 110, referencnaCena: 0 },
};

// Bary na zjazdovke — GDD sekcia 6.7
export const BARY_TYPY = {
  bar: { nazov: "Bar na zjazdovke", zakladnaCena: 180000, vystavbaHernychMesiacov: 1, kapacita: 40, prestiz: 10, referencnaCena: 6 },
};

// Servis a požičovňa — GDD sekcia 6.8 (sezónne prepínanie lyže/bicykle, rovnaká budova)
export const SERVIS_TYPY = {
  servis: { nazov: "Servis a požičovňa", zakladnaCena: 250000, vystavbaHernychMesiacov: 2, kapacita: 25, prestiz: 15, referencnaCena: 20 },
};

// Obchod — GDD sekcia 6.9 (oblečenie, potraviny, suveníry)
export const OBCHOD_TYPY = {
  obchod: { nazov: "Obchod", zakladnaCena: 200000, vystavbaHernychMesiacov: 2, kapacita: 60, prestiz: 15, referencnaCena: 12 },
};

// Zoznam kategórií — každá si nesie vlastný katalóg typov a (nepovinne) vlastné značky
export const KATEGORIE = {
  lanovka: { nazov: "Lanovky", ikona: "🚡", katalog: LANOVKY_TYPY, znackyKatalog: ZNACKY_LANOVKY, maCenu: true },
  parkovisko: { nazov: "Parkoviská", ikona: "🅿️", katalog: PARKOVISKA_TYPY, znackyKatalog: null, maCenu: true },
  pokladna: { nazov: "Pokladne", ikona: "🎫", katalog: POKLADNE_TYPY, znackyKatalog: null, maCenu: false },
  hotel: { nazov: "Hotely", ikona: "🏨", katalog: HOTELY_TYPY, znackyKatalog: null, maCenu: true },
  ratrak: { nazov: "Ratraky", ikona: "🚜", katalog: RATRAKY_TYPY, znackyKatalog: ZNACKY_RATRAKY, maCenu: false },
  zasnezovanie: { nazov: "Zasnežovanie", ikona: "💧", katalog: ZASNEZOVANIE_TYPY, znackyKatalog: null, maCenu: false },
  bar: { nazov: "Bary", ikona: "🍺", katalog: BARY_TYPY, znackyKatalog: null, maCenu: true },
  servis: { nazov: "Servis a požičovňa", ikona: "🎿", katalog: SERVIS_TYPY, znackyKatalog: null, maCenu: true },
  obchod: { nazov: "Obchody", ikona: "🛍️", katalog: OBCHOD_TYPY, znackyKatalog: null, maCenu: true },
};

// Herný čas beží 2x rýchlejšie => reálne dni = herné mesiace * 30 / 2
export function vystavbaVRealnychDnoch(hernychMesiacov) {
  return (hernychMesiacov * 30) / 2;
}

function ziskajInfo(kategoria, typ) {
  return KATEGORIE[kategoria].katalog[typ];
}

function ziskajZnackuMod(kategoria, znacka) {
  const znackyKatalog = KATEGORIE[kategoria].znackyKatalog;
  if (!znackyKatalog || !znacka || !znackyKatalog[znacka]) return { cenaMod: 1, prestizMod: 1 };
  return znackyKatalog[znacka];
}

export function cenaBudovy(kategoria, typ, znacka) {
  const info = ziskajInfo(kategoria, typ);
  const mod = ziskajZnackuMod(kategoria, znacka);
  return Math.round(info.zakladnaCena * mod.cenaMod);
}

export function prestizBudovy(kategoria, typ, znacka) {
  const info = ziskajInfo(kategoria, typ);
  const mod = ziskajZnackuMod(kategoria, znacka);
  return Math.round(info.prestiz * mod.prestizMod);
}

// Jednoduchý model dopytu — platí pre kategórie s vlastnou cenou (lanovky, parkoviská, hotely)
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
