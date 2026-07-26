// Katalóg typov lanoviek — teraz konkrétne trasy s vlastnou kapacitou
export const LANOVKY_TYPY = {
  vlek: { nazov: "Vlek", zakladnaCena: 300000, vystavbaHernychMesiacov: 1, kapacita: 30, prestiz: 40, referencnaCena: 15, zamestnanci: 6 },
  lanovka_luka: { nazov: "Lanovka (Lúka)", zakladnaCena: 750000, vystavbaHernychMesiacov: 4, kapacita: 60, prestiz: 90, referencnaCena: 20, zamestnanci: 7 },
  lanovka_do_hor: { nazov: "Lanovka do Hôr", zakladnaCena: 950000, vystavbaHernychMesiacov: 5, kapacita: 75, prestiz: 110, referencnaCena: 22, zamestnanci: 9 },
  lanovka_udolie: { nazov: "Lanovka (Údolie)", zakladnaCena: 750000, vystavbaHernychMesiacov: 4, kapacita: 60, prestiz: 90, referencnaCena: 20, zamestnanci: 7 },
  lanovka_na_vrchol: { nazov: "Lanovka na vrchol", zakladnaCena: 1250000, vystavbaHernychMesiacov: 7, kapacita: 100, prestiz: 150, referencnaCena: 25, zamestnanci: 12 },
  lanovka_ladovec: { nazov: "Lanovka na Ľadovec", zakladnaCena: 650000, vystavbaHernychMesiacov: 4, kapacita: 50, prestiz: 75, referencnaCena: 24, zamestnanci: 6 },
  lanovka_ladovec_lokalna: { nazov: "Lanovka (Ľadovec)", zakladnaCena: 550000, vystavbaHernychMesiacov: 3, kapacita: 50, prestiz: 65, referencnaCena: 24, zamestnanci: 5 },
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

// Apréski (predtým "Bar na zjazdovke")
export const BARY_TYPY = {
  bar: { nazov: "Apréski", zakladnaCena: 180000, vystavbaHernychMesiacov: 1, kapacita: 40, prestiz: 10, referencnaCena: 6, zamestnanci: 2 },
};

// Servis a požičovňa
export const SERVIS_TYPY = {
  servis: { nazov: "Servis a požičovňa", zakladnaCena: 250000, vystavbaHernychMesiacov: 2, kapacita: 25, prestiz: 15, referencnaCena: 20, zamestnanci: 2 },
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
  bar: { nazov: "Apréski", ikona: "🍺", katalog: BARY_TYPY, znackyKatalog: null, maCenu: true },
  servis: { nazov: "Servis a požičovňa", ikona: "🎿", katalog: SERVIS_TYPY, znackyKatalog: null, maCenu: true },
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

// Jednoduchý model dopytu — teraz prijíma referenčnú cenu ako parameter (mení sa podľa sezóny/rozvinutosti)
export function turistiZaHodinu(kategoria, typ, cena, referencnaCenaDnes) {
  const info = ziskajInfo(kategoria, typ);
  const refCena = referencnaCenaDnes ?? info.referencnaCena;
  if (!refCena) return 0;
  const bezpecnaCena = Math.max(cena, 1);
  const dopyt = (info.kapacita * refCena) / bezpecnaCena;
  return Math.min(dopyt, info.kapacita);
}

export function prijemZaHodinu(kategoria, typ, cena, referencnaCenaDnes) {
  return turistiZaHodinu(kategoria, typ, cena, referencnaCenaDnes) * cena;
}

// --- Ročné vyjednávanie o plat (kalendárne, spoločné pre všetkých hráčov) ---
export const ZVYSENIE_PLATU_PERCENTO = 5;
export const EFEKTIVITA_PRI_ODMIETNUTI = 0.8;
export const EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI = 0.9;
export const PLAT_ZA_HODINU = 3;

// --- Zóny strediska - limitované sloty na budovy ---
// Kľúče lanoviek sú teraz priamo konkrétne typy (viď LANOVKY_TYPY)
export const ZONY = {
  luka: {
    nazov: "Lúka",
    ikona: "🌾",
    poradie: 1,
    limity: { vlek: 2, lanovka_luka: 1, lanovka_do_hor: 1, parkovisko: 1, bar: 1, penzion: 2, pokladna: 1 },
    popisky: { bar: "Bufet" },
  },
  udolie: {
    nazov: "Údolie",
    ikona: "🏞️",
    poradie: 2,
    limity: { lanovka_udolie: 2, parkovisko: 2, hotel: 2, ratrak: 1, zasnezovanie: 1, bar: 1, servis: 1 },
  },
  hory: {
    nazov: "Hory",
    ikona: "🌲",
    poradie: 3,
    limity: { lanovka_na_vrchol: 1, hotel: 1 },
  },
  ladovec: {
    nazov: "Ľadovec",
    ikona: "🧊",
    poradie: 4,
    limity: { lanovka_ladovec: 1, lanovka_ladovec_lokalna: 1, hotel: 1 },
  },
};

// Podmienky na odomknutie jednotlivých lanoviek v Lúke (mimo bežných zónových zámkov)
export const ODOMKNUTIE_LANOVIEK_LUKA = {
  lanovka_luka: "udolie", // odomkne sa spolu s Údolím
  lanovka_do_hor: "hory", // odomkne sa spolu s Horami
};

// Podmienky odomknutia Údolia (zóna 2) - všetky musia byť splnené naraz
export const ODOMKNUTIE_UDOLIA = {
  vekDni: 90,
  prestiz: 300,
  cena: 2500000,
  konkurenciaKategorie: ["luka:parkovisko", "luka:bar"],
};

// Podmienky odomknutia Hôr (zóna 3) - cez "konektor" lanovku z Lúky
export const ODOMKNUTIE_HOR = {
  vekDni: 180,
  prestiz: 800,
  cena: 5000000,
};

export const PORADIE_ZON = ["luka", "udolie", "hory", "ladovec"];
export const KONKURENCIA_ZONY_KONFIG = {
  luka: {
    penzion: { max: 2, stratapenazi: 0.25, prestizBonus: 10, sezonne: true },
    parkovisko: { max: 1, stratapenazi: 0.05, prestizBonus: 1, sezonne: true },
    bar: { max: 1, stratapenazi: 0.10, prestizBonus: 3, sezonne: false },
  },
  udolie: {
    hotel: { max: 1, stratapenazi: 0.25, prestizBonus: 10, sezonne: true },
    parkovisko: { max: 1, stratapenazi: 0.05, prestizBonus: 1, sezonne: true },
    servis: { max: 1, stratapenazi: 0.03, prestizBonus: 1, sezonne: false },
  },
};
export const VEK_PRE_KONKURENCIU_DNI = 90;

export const KONKURENCIA_VYSTAVBA_MESIACOV = { hotel: 14, penzion: 4, bar: 1, parkovisko: 1, servis: 2 };

const ZIMNE_MESIACE = [9, 10, 11, 0, 1, 2, 3, 4]; // Október - Máj (8 mesiacov)

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

// pocetKonkurencie je teraz kľúčované ako "zona:kategoria" (napr. "luka:parkovisko")
export function konkurencnyMultiplikator(kategoria, zona, pocetKonkurencie) {
  const cfg = KONKURENCIA_ZONY_KONFIG[zona]?.[kategoria];
  if (!cfg || !pocetKonkurencie) return 1;
  const pocet = pocetKonkurencie[`${zona}:${kategoria}`] || 0;
  return Math.max(0, 1 - cfg.stratapenazi * pocet);
}

export function konkurencnaPrestiz(pocetKonkurencie) {
  if (!pocetKonkurencie) return 0;
  let sucet = 0;
  for (const zona of Object.keys(KONKURENCIA_ZONY_KONFIG)) {
    for (const kat of Object.keys(KONKURENCIA_ZONY_KONFIG[zona])) {
      const kluc = `${zona}:${kat}`;
      sucet += (pocetKonkurencie[kluc] || 0) * KONKURENCIA_ZONY_KONFIG[zona][kat].prestizBonus;
    }
  }
  return sucet;
}

// --- Úpadok prestíže pri dlhodobo nízkych peniazoch ---
export const NIZKA_HOTOVOST = 50000;
export const GRACE_DNI_PRED_UPADKOM = 21;
export const DENNY_UPADOK_PRESTIZE = 0.01;
export const CENA_NAJATIA = 3000;

// --- Skrytá referenčná cena, hráč vidí len odhad (±25%) ---
// Cooldown na zmenu ceny: 1x za herný týždeň (7 herných dní = 3,5 reálneho dňa = 84 reálnych hodín)
export const CENA_COOLDOWN_HODIN = 84;

function jednoduchyHash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h << 5) - h + text.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Odhad, čo hráč vidí — ±25% okolo aktuálnej (pohyblivej) skutočnej ceny
export function odhadovanaCena(stanicaId, kategoria, typ, sezonaIndexCislo, skutocnaCenaDnes) {
  if (!skutocnaCenaDnes) return null;
  const seed = jednoduchyHash(`${stanicaId}-${kategoria}-${typ}-${sezonaIndexCislo}`);
  const odchylka = 0.75 + (seed % 1000) / 1000 * 0.5; // rozsah 0.75 - 1.25
  return Math.round(skutocnaCenaDnes * odchylka);
}

// --- Sezónna krivka cien (podľa herného mesiaca) ---
// Október-Máj = zima (8 mesiacov, vrchol cez Vianoce/Nový rok), Jún-Sept = leto (4 mesiace)
export const SEZONNA_KRIVKA_CENY = {
  9: 0.75,  // Október
  10: 0.90, // November
  11: 1.15, // December
  0: 1.20,  // Január (vrchol)
  1: 1.15,  // Február
  2: 1.00,  // Marec
  3: 0.85,  // Apríl
  4: 0.70,  // Máj
  5: 0.80,  // Jún
  6: 1.00,  // Júl
  7: 1.00,  // August
  8: 0.80,  // September
};

// --- Zónový bonus podľa toho, čo má hráč odomknuté A postavené ---
export const ZONOVY_BONUS = {
  luka: 0,
  udolie: 0.15,
  hory: 0.30,
  ladovec: 0.45,
};

// Globálny násobiteľ ceny podľa "rozvinutosti" strediska (odomknuté zóny × naplnenosť slotov v nich)
export function globalnyCenovyMultiplikator(stanica, budovy) {
  let bonus = 0;
  const zonyNaKontrolu = [];
  if (stanica.udolie_odomknute) zonyNaKontrolu.push("udolie");
  if (stanica.hory_odomknute) zonyNaKontrolu.push("hory");
  // Ľadovec zatiaľ nemá odomykaciu logiku, preto sa nezapočítava

  for (const zonaKluc of zonyNaKontrolu) {
    const limity = ZONY[zonaKluc]?.limity || {};
    const celkomSlotov = Object.values(limity).reduce((a, b) => a + b, 0);
    const hotoveVZone = budovy.filter((b) => b.zona === zonaKluc && b.stav === "hotovo").length;
    const naplnenost = celkomSlotov > 0 ? Math.min(1, hotoveVZone / celkomSlotov) : 0;
    bonus += ZONOVY_BONUS[zonaKluc] * naplnenost;
  }

  return 1 + bonus;
}

// Skutočná (skrytá) referenčná cena pre daný deň = základ × sezónna krivka × globálny násobiteľ
export function skutocnaReferencnaCena(kategoria, typ, hDatum, globalnyMultiplikator = 1) {
  const info = KATEGORIE[kategoria]?.katalog[typ];
  if (!info || !info.referencnaCena) return 0;
  const sezonnyMult = SEZONNA_KRIVKA_CENY[hDatum.getMonth()] ?? 1;
  return info.referencnaCena * sezonnyMult * globalnyMultiplikator;
}

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
