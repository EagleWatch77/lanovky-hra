// Katalóg typov lanoviek — GDD sekcia 6.1
export const LANOVKY_TYPY = {
  vlek: { nazov: "Vlek", zakladnaCena: 150000, vystavbaHernychMesiacov: 1, kapacita: 15, prestiz: 20, referencnaCena: 15, zamestnanci: 3 },
  sedacka_pevna: { nazov: "Pevná sedačková lanovka", zakladnaCena: 400000, vystavbaHernychMesiacov: 2, kapacita: 25, prestiz: 40, referencnaCena: 20, zamestnanci: 5 },
  sedacka_4: { nazov: "Odpojiteľná 4-sedačka", zakladnaCena: 900000, vystavbaHernychMesiacov: 3, kapacita: 45, prestiz: 70, referencnaCena: 25, zamestnanci: 6 },
  sedacka_6: { nazov: "Odpojiteľná 6-sedačka", zakladnaCena: 1300000, vystavbaHernychMesiacov: 3.5, kapacita: 65, prestiz: 90, referencnaCena: 28, zamestnanci: 7 },
  sedacka_8: { nazov: "Odpojiteľná 8-sedačka", zakladnaCena: 1800000, vystavbaHernychMesiacov: 4, kapacita: 90, prestiz: 110, referencnaCena: 30, zamestnanci: 8 },
  kabinka_8: { nazov: "Kabínková 8-miestna", zakladnaCena: 2500000, vystavbaHernychMesiacov: 5, kapacita: 110, prestiz: 140, referencnaCena: 35, zamestnanci: 9 },
  kabinka_10: { nazov: "Kabínková 10-miestna", zakladnaCena: 3200000, vystavbaHernychMesiacov: 5.5, kapacita: 140, prestiz: 160, referencnaCena: 38, zamestnanci: 10 },
  kabinka_15: { nazov: "Kabínková 15-miestna", zakladnaCena: 4200000, vystavbaHernychMesiacov: 6, kapacita: 190, prestiz: 190, referencnaCena: 42, zamestnanci: 12 },
  funitel: { nazov: "Funitel", zakladnaCena: 5500000, vystavbaHernychMesiacov: 7, kapacita: 220, prestiz: 220, referencnaCena: 45, zamestnanci: 14 },
  s3: { nazov: "3S systém", zakladnaCena: 8000000, vystavbaHernychMesiacov: 9, kapacita: 280, prestiz: 280, referencnaCena: 50, zamestnanci: 16 },
};

export const ZNACKY_LANOVKY = {
  alpinor: { nazov: "Alpinor", popis: "Prémiová, najspoľahlivejšia", cenaMod: 1.2, prestizMod: 1.25 },
  montera: { nazov: "Montera", popis: "Vyvážená, bezpečná voľba", cenaMod: 1.0, prestizMod: 1.0 },
  nordtech: { nazov: "Nordtech", popis: "Lacnejšia, riskantnejšia", cenaMod: 0.85, prestizMod: 0.9 },
};

// Parkoviská — GDD sekcia 6.4 (bez značiek; vzdialenosť od lanovky riešime neskôr)
export const PARKOVISKA_TYPY = {
  strkove: { nazov: "Štrkové parkovisko", zakladnaCena: 80000, vystavbaHernychMesiacov: 0.5, kapacita: 40, prestiz: 5, referencnaCena: 3, zamestnanci: 1 },
  asfaltove: { nazov: "Asfaltové parkovisko", zakladnaCena: 250000, vystavbaHernychMesiacov: 1, kapacita: 60, prestiz: 15, referencnaCena: 5, zamestnanci: 2 },
  luxusne: { nazov: "Luxusné asfaltové", zakladnaCena: 500000, vystavbaHernychMesiacov: 1.5, kapacita: 80, prestiz: 35, referencnaCena: 8, zamestnanci: 3 },
  parkovaci_dom: { nazov: "Parkovací dom", zakladnaCena: 1400000, vystavbaHernychMesiacov: 4, kapacita: 200, prestiz: 70, referencnaCena: 6, zamestnanci: 5 },
};

// Pokladne — GDD sekcia 6.5 (bez značiek, negenerujú vlastný príjem)
export const POKLADNE_TYPY = {
  mala: { nazov: "Malá pokladňa", zakladnaCena: 40000, vystavbaHernychMesiacov: 0.5, kapacita: 30, prestiz: 5, referencnaCena: 0, zamestnanci: 1 },
  velka: { nazov: "Veľká pokladňa", zakladnaCena: 150000, vystavbaHernychMesiacov: 1, kapacita: 80, prestiz: 15, referencnaCena: 0, zamestnanci: 2 },
};

// Hotely — GDD sekcia 6.6 (bez značiek; cena = cena za noc, ktorú si hráč nastaví)
export const HOTELY_TYPY = {
  penzion: { nazov: "Penzión", zakladnaCena: 300000, vystavbaHernychMesiacov: 4, kapacita: 10, prestiz: 30, referencnaCena: 25, zamestnanci: 3 },
  maly_hotel: { nazov: "Malý hotel", zakladnaCena: 900000, vystavbaHernychMesiacov: 8, kapacita: 25, prestiz: 70, referencnaCena: 45, zamestnanci: 6 },
  hotel: { nazov: "Hotel", zakladnaCena: 2000000, vystavbaHernychMesiacov: 14, kapacita: 50, prestiz: 130, referencnaCena: 70, zamestnanci: 10 },
  grand_hotel: { nazov: "Grand hotel", zakladnaCena: 4500000, vystavbaHernychMesiacov: 22, kapacita: 100, prestiz: 250, referencnaCena: 120, zamestnanci: 10 },
};

// Ratraky — GDD sekcia 6.3 (2 značky, negenerujú vlastný príjem, len prestíž a náklady)
export const RATRAKY_TYPY = {
  kompakt: { nazov: "Kompakt ratrak", zakladnaCena: 150000, vystavbaHernychMesiacov: 0.5, kapacita: 5, prestiz: 10, referencnaCena: 0, zamestnanci: 1 },
  standard: { nazov: "Štandardný ratrak", zakladnaCena: 300000, vystavbaHernychMesiacov: 1, kapacita: 12, prestiz: 20, referencnaCena: 0, zamestnanci: 1 },
  vykonny: { nazov: "Výkonný ratrak", zakladnaCena: 520000, vystavbaHernychMesiacov: 1.5, kapacita: 25, prestiz: 35, referencnaCena: 0, zamestnanci: 2 },
};

export const ZNACKY_RATRAKY = {
  snowtrac: { nazov: "Snowtrac", popis: "Lacnejší nákup, vyššia údržba", cenaMod: 1.0, prestizMod: 1.0 },
  pistenwolf: { nazov: "Pistenwolf", popis: "Drahší, ale spoľahlivejší", cenaMod: 1.27, prestizMod: 1.1 },
};

// Zasnežovanie — GDD sekcia 6.11 (bez značiek, negeneruje vlastný príjem, podporná infraštruktúra)
export const ZASNEZOVANIE_TYPY = {
  potok: { nazov: "Čerpanie z potoka", zakladnaCena: 250000, vystavbaHernychMesiacov: 2, kapacita: 3, prestiz: 10, referencnaCena: 0, zamestnanci: 1 },
  mala_nadrz: { nazov: "Malá nádrž + delá", zakladnaCena: 700000, vystavbaHernychMesiacov: 5, kapacita: 8, prestiz: 30, referencnaCena: 0, zamestnanci: 2 },
  stredna_nadrz: { nazov: "Stredná nádrž + automat. systém", zakladnaCena: 1800000, vystavbaHernychMesiacov: 9, kapacita: 18, prestiz: 60, referencnaCena: 0, zamestnanci: 3 },
  velka_nadrz: { nazov: "Veľká umelá nádrž (plne automat.)", zakladnaCena: 3500000, vystavbaHernychMesiacov: 14, kapacita: 35, prestiz: 110, referencnaCena: 0, zamestnanci: 5 },
};

// Bary na zjazdovke — GDD sekcia 6.7
export const BARY_TYPY = {
  bar: { nazov: "Bar na zjazdovke", zakladnaCena: 180000, vystavbaHernychMesiacov: 1, kapacita: 40, prestiz: 10, referencnaCena: 6, zamestnanci: 2 },
};

// Servis a požičovňa — GDD sekcia 6.8 (sezónne prepínanie lyže/bicykle, rovnaká budova)
export const SERVIS_TYPY = {
  servis: { nazov: "Servis a požičovňa", zakladnaCena: 250000, vystavbaHernychMesiacov: 2, kapacita: 25, prestiz: 15, referencnaCena: 20, zamestnanci: 2 },
};

// Obchod — GDD sekcia 6.9 (oblečenie, potraviny, suveníry)
export const OBCHOD_TYPY = {
  obchod: { nazov: "Obchod", zakladnaCena: 200000, vystavbaHernychMesiacov: 2, kapacita: 60, prestiz: 15, referencnaCena: 12, zamestnanci: 2 },
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

// --- Ročné vyjednávanie o plat (kalendárne, spoločné pre všetkých hráčov) ---
export const ZVYSENIE_PLATU_PERCENTO = 5; // o koľko % žiadajú zvýšenie každý rok
export const EFEKTIVITA_PRI_ODMIETNUTI = 0.8;
export const EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI = 0.9;
// Vyjednávanie prebieha 23.-31.12, nový plat platí od 1.1, trest trvá do 31.1
export const PLAT_ZA_HODINU = 3; // € na jedného zamestnanca za hodinu (herného času)

// --- Zóny strediska (Severná strana) - limitované sloty na budovy ---
export const ZONY = {
  luka: {
    nazov: "Lúka",
    ikona: "🌾",
    poradie: 1,
    limity: { vlek: 2, lanovka: 1, parkovisko: 1, bar: 2, hotel: 2, pokladna: 1, servis: 1 },
    popisky: { hotel: "Penzióny", bar: "Bufet", vlek: "Vleky", lanovka: "Lanovka (do Hôr)" },
  },
  udolie: {
    nazov: "Údolie",
    ikona: "🏞️",
    poradie: 2,
    limity: { lanovka: 3, parkovisko: 2, hotel: 2, ratrak: 1, zasnezovanie: 1, bar: 1, servis: 1 },
  },
  hory: {
    nazov: "Hory",
    ikona: "🌲",
    poradie: 3,
    limity: { lanovka: 2, hotel: 1 },
  },
  ladovec: {
    nazov: "Ľadovec",
    ikona: "🧊",
    poradie: 4,
    limity: { lanovka: 1, hotel: 1 },
  },
};

// Podmienky odomknutia Údolia (zóna 2) - všetky musia byť splnené naraz
export const ODOMKNUTIE_UDOLIA = {
  vekDni: 90,
  prestiz: 300,
  cena: 2500000,
  konkurenciaKategorie: ["parkovisko", "bar"], // aspoň jedna z nich musí mať konkurenciu
};

// Podmienky odomknutia Hôr (zóna 3) - cez "konektor" lanovku z Lúky
export const ODOMKNUTIE_HOR = {
  vekDni: 180,
  prestiz: 800,
  cena: 5000000,
};

export const PORADIE_ZON = ["luka", "udolie", "hory", "ladovec"];

// --- Konkurencia (od 2. sezóny, limitovaný počet jednotiek na kategóriu) ---
export const KONKURENCIA_KONFIG = {
  hotel: { max: 2, stratapenazi: 0.25, prestizBonus: 10, sezonne: true },
  bar: { max: 3, stratapenazi: 0.10, prestizBonus: 3, sezonne: false },
  parkovisko: { max: 5, stratapenazi: 0.05, prestizBonus: 1, sezonne: true },
  servis: { max: 3, stratapenazi: 0.03, prestizBonus: 1, sezonne: false },
};
export const VEK_PRE_KONKURENCIU_DNI = 90; // cca 1 sezóna

// Reprezentatívny čas výstavby (herné mesiace) pre konkurenčnú jednotku v danej kategórii
export const KONKURENCIA_VYSTAVBA_MESIACOV = { hotel: 4, bar: 1, parkovisko: 1, servis: 2 };

const ZIMNE_MESIACE = [10, 11, 0, 1, 2, 3]; // nov-apr

export function jeZimnyMesiac(mesiac) {
  return ZIMNE_MESIACE.includes(mesiac);
}

// Rastúce číslo — mení sa pri každom prechode zima/leto, na sledovanie "novej sezóny"
export function sezonaIndex(datum) {
  return datum.getFullYear() * 2 + (jeZimnyMesiac(datum.getMonth()) ? 0 : 1);
}

// Dátum začiatku aktuálnej sezóny (na filtrovanie "sezónnych" financií)
export function zaciatokAktualnejSezony(datum) {
  const mesiac = datum.getMonth();
  const rok = datum.getFullYear();
  if (jeZimnyMesiac(mesiac)) {
    if (mesiac <= 3) return new Date(rok - 1, 10, 1); // 1. november predošlého roka
    return new Date(rok, 10, 1); // november/december tohto roka
  }
  return new Date(rok, 4, 1); // 1. máj tohto roka
}

// pocetKonkurencie = objekt { hotel: n, bar: n, parkovisko: n, servis: n } — počty DOKONČENÝCH jednotiek
export function konkurencnyMultiplikator(kategoria, pocetKonkurencie) {
  const cfg = KONKURENCIA_KONFIG[kategoria];
  if (!cfg || !pocetKonkurencie) return 1;
  const pocet = pocetKonkurencie[kategoria] || 0;
  return Math.max(0, 1 - cfg.stratapenazi * pocet);
}

// Bonus k celkovej prestíži strediska (nie jednotlivej budovy) z prítomnosti konkurencie
export function konkurencnaPrestiz(pocetKonkurencie) {
  if (!pocetKonkurencie) return 0;
  let sucet = 0;
  for (const kat of Object.keys(KONKURENCIA_KONFIG)) {
    sucet += (pocetKonkurencie[kat] || 0) * KONKURENCIA_KONFIG[kat].prestizBonus;
  }
  return sucet;
}

// --- Úpadok prestíže pri dlhodobo nízkych peniazoch ---
export const NIZKA_HOTOVOST = 50000; // hranica, pod ktorou hrozí úpadok
export const GRACE_DNI_PRED_UPADKOM = 21; // koľko dní pod hranicou je ešte v poriadku
export const DENNY_UPADOK_PRESTIZE = 0.01; // -1 % z aktuálnej prestíže za deň po grace perióde
export const CENA_NAJATIA = 3000; // jednorazový poplatok za najatie 1 zamestnanca

export function zamestnanciPotrebni(kategoria, typ) {
  return ziskajInfo(kategoria, typ).zamestnanci || 0;
}

export function potrebniZamestnanci(hotoveBudovy) {
  return hotoveBudovy.reduce((sucet, b) => {
    const info = ziskajInfo(b.kategoria, b.typ);
    return sucet + (info.zamestnanci || 0);
  }, 0);
}

// Efektivita 0–1: ak máš menej najatých ľudí, než potrebuješ, budovy bežia na zníženú kapacitu
export function efektivitaZamestnancov(najatiPocet, potrebnyPocet) {
  if (potrebnyPocet === 0) return 1;
  return Math.min(1, najatiPocet / potrebnyPocet);
}
