// Katalóg typov lanoviek — zjednodušené na 2 pevné typy, žiadne značky
export const LANOVKY_TYPY = {
  vlek: { nazov: "Vlek", zakladnaCena: 150000, vystavbaHernychMesiacov: 1, kapacita: 15, prestiz: 20, referencnaCena: 15, zamestnanci: 3 },
  lanovka: { nazov: "Lanovka", zakladnaCena: 500000, vystavbaHernychMesiacov: 3, kapacita: 40, prestiz: 60, referencnaCena: 22, zamestnanci: 5 },
};

// Parkoviská — 1 pevný typ
export const PARKOVISKA_TYPY = {
  parkovisko: { nazov: "Parkovisko", zakladnaCena: 200000, vystavbaHernychMesiacov: 1, kapacita: 60, prestiz: 15, referencnaCena: 5, zamestnanci: 2 },
};

// Pokladňa — 1 pevný typ
export const POKLADNE_TYPY = {
  pokladna: { nazov: "Pokladňa", zakladnaCena: 80000, vystavbaHernychMesiacov: 0.5, kapacita: 50, prestiz: 10, referencnaCena: 0, zamestnanci: 1 },
};

// Penzión — menšie ubytovanie (Lúka), 1 pevný typ
export const PENZION_TYPY = {
  penzion: { nazov: "Penzión", zakladnaCena: 300000, vystavbaHernychMesiacov: 4, kapacita: 10, prestiz: 30, referencnaCena: 25, zamestnanci: 3 },
};

// Hotel — väčšie ubytovanie (Údolie/Hory/Ľadovec), 1 pevný typ
export const HOTELY_TYPY = {
  hotel: { nazov: "Hotel", zakladnaCena: 2000000, vystavbaHernychMesiacov: 14, kapacita: 50, prestiz: 130, referencnaCena: 70, zamestnanci: 10 },
};

// Ratrak — 1 pevný typ, žiadne značky
export const RATRAKY_TYPY = {
  ratrak: { nazov: "Ratrak", zakladnaCena: 300000, vystavbaHernychMesiacov: 1, kapacita: 15, prestiz: 20, referencnaCena: 0, zamestnanci: 1 },
};

// Zasnežovanie — 1 pevný typ
export const ZASNEZOVANIE_TYPY = {
  zasnezovanie: { nazov: "Zasnežovanie", zakladnaCena: 900000, vystavbaHernychMesiacov: 5, kapacita: 10, prestiz: 35, referencnaCena: 0, zamestnanci: 2 },
};

// Bar na zjazdovke
export const BARY_TYPY = {
  bar: { nazov: "Bar na zjazdovke", zakladnaCena: 180000, vystavbaHernychMesiacov: 1, kapacita: 40, prestiz: 10, referencnaCena: 6, zamestnanci: 2 },
};

// Servis a požičovňa
export const SERVIS_TYPY = {
  servis: { nazov: "Servis a požičovňa", zakladnaCena: 250000, vystavbaHernychMesiacov: 2, kapacita: 25, prestiz: 15, referencnaCena: 20, zamestnanci: 2 },
};

// Obchod
export const OBCHOD_TYPY = {
  obchod: { nazov: "Obchod", zakladnaCena: 200000, vystavbaHernychMesiacov: 2, kapacita: 60, prestiz: 15, referencnaCena: 12, zamestnanci: 2 },
};

// Zoznam kategórií — žiadna už nemá znackyKatalog (zjednodušené)
export const KATEGORIE = {
  lanovka: { nazov: "Lanovky", ikona: "🚡", katalog: LANOVKY_TYPY, znackyKatalog: null, maCenu: true },
  parkovisko: { nazov: "Parkoviská", ikona: "🅿️", katalog: PARKOVISKA_TYPY, znackyKatalog: null, maCenu: true },
  pokladna: { nazov: "Pokladňa", ikona: "🎫", katalog: POKLADNE_TYPY, znackyKatalog: null, maCenu: false, obrazokLeto: "/zona-luka/budova-pokladna-leto.png?v=2", obrazokZima: "/zona-luka/budova-pokladna-zima.png?v=2" },
  penzion: { nazov: "Penzióny", ikona: "🏠", katalog: PENZION_TYPY, znackyKatalog: null, maCenu: true },
  hotel: { nazov: "Hotely", ikona: "🏨", katalog: HOTELY_TYPY, znackyKatalog: null, maCenu: true },
  ratrak: { nazov: "Ratraky", ikona: "🚜", katalog: RATRAKY_TYPY, znackyKatalog: null, maCenu: false },
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

// Jednoduchý model dopytu — platí pre kategórie s vlastnou cenou (lanovky, parkoviská, ubytovanie)
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
export const ZVYSENIE_PLATU_PERCENTO = 5;
export const EFEKTIVITA_PRI_ODMIETNUTI = 0.8;
export const EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI = 0.9;
export const PLAT_ZA_HODINU = 3;

// --- Zóny strediska (Severná strana) - limitované sloty na budovy ---
export const ZONY = {
  luka: {
    nazov: "Lúka",
    ikona: "🌾",
    poradie: 1,
    limity: { vlek: 2, lanovka: 1, parkovisko: 1, bar: 1, penzion: 2, pokladna: 1 },
    popisky: { bar: "Bufet", vlek: "Vleky", lanovka: "Lanovka (do Hôr)" },
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
  konkurenciaKategorie: ["parkovisko", "bar"],
};

// Podmienky odomknutia Hôr (zóna 3) - cez "konektor" lanovku z Lúky
export const ODOMKNUTIE_HOR = {
  vekDni: 180,
  prestiz: 800,
  cena: 5000000,
};

export const PORADIE_ZON = ["luka", "udolie", "hory", "ladovec"];
export const KONKURENCIA_KONFIG = {
  hotel: { max: 2, stratapenazi: 0.25, prestizBonus: 10, sezonne: true },
  bar: { max: 3, stratapenazi: 0.10, prestizBonus: 3, sezonne: false },
  parkovisko: { max: 5, stratapenazi: 0.05, prestizBonus: 1, sezonne: true },
  servis: { max: 3, stratapenazi: 0.03, prestizBonus: 1, sezonne: false },
};
export const VEK_PRE_KONKURENCIU_DNI = 90;

export const KONKURENCIA_VYSTAVBA_MESIACOV = { hotel: 4, bar: 1, parkovisko: 1, servis: 2 };

const ZIMNE_MESIACE = [10, 11, 0, 1, 2, 3];

export function jeZimnyMesiac(mesiac) {
  return ZIMNE_MESIACE.includes(mesiac);
}

export function sezonaIndex(datum) {
  return datum.getFullYear() * 2 + (jeZimnyMesiac(datum.getMonth()) ? 0 : 1);
}

export function zaciatokAktualnejSezony(datum) {
  const mesiac = datum.getMonth();
  const rok = datum.getFullYear();
  if (jeZimnyMesiac(mesiac)) {
    if (mesiac <= 3) return new Date(rok - 1, 10, 1);
    return new Date(rok, 10, 1);
  }
  return new Date(rok, 4, 1);
}

export function konkurencnyMultiplikator(kategoria, pocetKonkurencie) {
  const cfg = KONKURENCIA_KONFIG[kategoria];
  if (!cfg || !pocetKonkurencie) return 1;
  const pocet = pocetKonkurencie[kategoria] || 0;
  return Math.max(0, 1 - cfg.stratapenazi * pocet);
}

export function konkurencnaPrestiz(pocetKonkurencie) {
  if (!pocetKonkurencie) return 0;
  let sucet = 0;
  for (const kat of Object.keys(KONKURENCIA_KONFIG)) {
    sucet += (pocetKonkurencie[kat] || 0) * KONKURENCIA_KONFIG[kat].prestizBonus;
  }
  return sucet;
}

// --- Úpadok prestíže pri dlhodobo nízkych peniazoch ---
export const NIZKA_HOTOVOST = 50000;
export const GRACE_DNI_PRED_UPADKOM = 21;
export const DENNY_UPADOK_PRESTIZE = 0.01;
export const CENA_NAJATIA = 3000;

export function zamestnanciPotrebni(kategoria, typ) {
  return ziskajInfo(kategoria, typ).zamestnanci || 0;
}

export function potrebniZamestnanci(hotoveBudovy) {
  return hotoveBudovy.reduce((sucet, b) => {
    const info = ziskajInfo(b.kategoria, b.typ);
    return sucet + (info.zamestnanci || 0);
  }, 0);
}

export function efektivitaZamestnancov(najatiPocet, potrebnyPocet) {
  if (potrebnyPocet === 0) return 1;
  return Math.min(1, najatiPocet / potrebnyPocet);
}
