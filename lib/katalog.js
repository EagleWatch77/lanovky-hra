// Katalóg typov lanoviek — skutočné typy zariadení (nie viazané na zónu)
// celorocne: funguje aj v lete (kabínky a visuté lanovky vozia turistov)
export const LANOVKY_TYPY = {
  vlek: {
    nazov: "Vlek",
    popis: "Kotvový vlek pre začiatočníkov. Len v zime.",
    zakladnaCena: 300000, vystavbaHernychMesiacov: 1, kapacita: 30, prestiz: 40, referencnaCena: 15, zamestnanci: 3,
    celorocne: false,
  },
  sedacka_2: {
    nazov: "2-sedačka (pevná)",
    popis: "Najlacnejšia sedačková lanovka. Pomalá, ale spoľahlivá.",
    zakladnaCena: 550000, vystavbaHernychMesiacov: 3, kapacita: 45, prestiz: 60, referencnaCena: 17, zamestnanci: 5,
    celorocne: false,
  },
  sedacka_4: {
    nazov: "4-sedačka (pevná)",
    popis: "Osvedčený štandard. Dobrý pomer ceny a kapacity.",
    zakladnaCena: 850000, vystavbaHernychMesiacov: 4, kapacita: 90, prestiz: 95, referencnaCena: 19, zamestnanci: 7,
    celorocne: false,
  },
  sedacka_4_odp: {
    nazov: "4-sedačka (odpojiteľná)",
    popis: "Rýchlejšia a pohodlnejšia. Vyššia údržba.",
    zakladnaCena: 1200000, vystavbaHernychMesiacov: 5, kapacita: 120, prestiz: 120, referencnaCena: 21, zamestnanci: 8,
    celorocne: false,
  },
  sedacka_6_odp: {
    nazov: "6-sedačka (odpojiteľná)",
    popis: "Vysoká kapacita pre hlavné zjazdovky.",
    zakladnaCena: 1800000, vystavbaHernychMesiacov: 6, kapacita: 180, prestiz: 160, referencnaCena: 23, zamestnanci: 10,
    celorocne: false,
  },
  sedacka_8_odp: {
    nazov: "8-sedačka (odpojiteľná)",
    popis: "Špičková sedačková lanovka. Prevezie obrovský nápor.",
    zakladnaCena: 2600000, vystavbaHernychMesiacov: 7, kapacita: 240, prestiz: 200, referencnaCena: 25, zamestnanci: 12,
    celorocne: false,
  },
  kabinka_8: {
    nazov: "Kabínka 8-miestna",
    popis: "Gondola s uzavretými kabínami. Funguje celoročne.",
    zakladnaCena: 2200000, vystavbaHernychMesiacov: 7, kapacita: 200, prestiz: 190, referencnaCena: 24, zamestnanci: 11,
    celorocne: true,
  },
  kabinka_10: {
    nazov: "Kabínka 10-miestna",
    popis: "Väčšia gondola pre hlavné prepojenia strediska.",
    zakladnaCena: 3000000, vystavbaHernychMesiacov: 8, kapacita: 280, prestiz: 230, referencnaCena: 26, zamestnanci: 13,
    celorocne: true,
  },
  kabinka_15: {
    nazov: "Kabínka 15-miestna",
    popis: "Veľkokapacitná gondola. Chrbtica moderného strediska.",
    zakladnaCena: 4200000, vystavbaHernychMesiacov: 10, kapacita: 400, prestiz: 280, referencnaCena: 28, zamestnanci: 16,
    celorocne: true,
  },
lanovka_3s: {
    nazov: "3S lanovka",
    popis: "Trojlanová lanovka. Zdolá extrémne prevýšenie aj vietor.",
    zakladnaCena: 6500000, vystavbaHernychMesiacov: 12, kapacita: 500, prestiz: 400, referencnaCena: 32, zamestnanci: 20,
    celorocne: true,
  },
  funitel: {
    nazov: "Funitel",
    popis: "Dve laná blízko seba. Najodolnejšia voči vetru.",
    zakladnaCena: 5500000, vystavbaHernychMesiacov: 11, kapacita: 450, prestiz: 350, referencnaCena: 30, zamestnanci: 18,
    celorocne: true,
  },
  kabinka_20: {
    nazov: "Kabínka 20-miestna",
    popis: "Špičková gondola s obrovskou priepustnosťou.",
    zakladnaCena: 5000000, vystavbaHernychMesiacov: 11, kapacita: 500, prestiz: 320, referencnaCena: 30, zamestnanci: 18,
    celorocne: true,
  },
  kyvadlova_100: {
    nazov: "Kyvadlová lanovka",
    popis: "Dve obrovské kabíny pre 100 osôb. Symbol veľkého strediska.",
    zakladnaCena: 9000000, vystavbaHernychMesiacov: 14, kapacita: 600, prestiz: 500, referencnaCena: 35, zamestnanci: 24,
    celorocne: true,
  },
};

// Obrázky zariadení — jeden na druh, nie na každý model
export const OBRAZKY_LANOVIEK = {
  vlek: "/lanovky/vlek_transparent.png",
  sedacka_2: "/lanovky/dvojsedackapevna.png",
  sedacka_4: "/lanovky/pevna-lanovka_transparent.png",
  sedacka_4_odp: "/lanovky/odpojitelna-lanovka_transparent.png",
  sedacka_6_odp: "/lanovky/odpojitelna-lanovka_transparent.png",
  sedacka_8_odp: "/lanovky/odpojitelna-lanovka_transparent.png",
  kabinka_8: "/lanovky/kabina_transparent.png",
  kabinka_10: "/lanovky/kabina_transparent.png",
  kabinka_15: "/lanovky/kabina_transparent.png",
  lanovka_3s: "/lanovky/s3system_transparent.png",
  funitel: "/lanovky/funitel_transparent.png",
  kabinka_20: "/lanovky/kabina_transparent.png",
  kyvadlova_100: "/lanovky/kyvadlova_transparent.png",
};

// Ktoré typy sa dajú postaviť do daného slotu
export const TYPY_PRE_SLOT = {
  vlek: ["vlek"],
  lanovka: ["sedacka_2", "sedacka_4", "sedacka_4_odp", "sedacka_6_odp", "sedacka_8_odp", "kabinka_8", "kabinka_10", "kabinka_15", "kabinka_20"],
  spojnica: ["sedacka_4_odp", "sedacka_6_odp", "sedacka_8_odp", "kabinka_8", "kabinka_10", "kabinka_15", "kabinka_20"],
  spojnica_ladovec: ["lanovka_3s", "funitel", "kyvadlova_100"],
};

// Logá výrobcov — doplň cesty, keď obrázky vytvoríš (256×256 PNG, priehľadné pozadie)
export const LOGA_VYROBCOV = {
  alpenlift: "/logo/alpenligt.png",
  silvretta: "/logo/silvretta_transparent.png",
  apex: "/logo/apex_transparent.png",
  kristallis: "/logo/kristallis_transparent.png",
  solaris: "/logo/solaris_transparent.png",
};

// Čo ktorý výrobca vyrába
export const PONUKA_VYROBCU = {
  alpenlift: ["vlek", "sedacka_2", "sedacka_4", "sedacka_4_odp"],
  silvretta: ["vlek", "sedacka_4", "sedacka_4_odp", "kabinka_8"],
  apex: ["sedacka_4_odp", "sedacka_6_odp", "kabinka_8", "kabinka_10", "lanovka_3s", "funitel"],
  kristallis: ["sedacka_6_odp", "kabinka_10", "kabinka_15", "lanovka_3s", "funitel"],
  solaris: ["sedacka_8_odp", "kabinka_20", "kyvadlova_100"],
};

// --- Značky výrobcov lanoviek ---
// Modifikátory sa násobia so základnými hodnotami z katalógu typu.
export const ZNACKY_LANOVIEK = {
  alpenlift: {
    nazov: "Alpenlift",
    popis: "Lacný a nenáročný. Ušetríš pri stavbe, doplatíš na údržbe.",
    cenaMod: 0.85,
    kapacitaMod: 0.9,
    udrzbaMod: 1.15,
    prestizMod: 0.8,
  },
  silvretta: {
    nazov: "Silvretta",
    popis: "Spoľahlivý štandard bez prekvapení.",
    cenaMod: 1.0,
    kapacitaMod: 1.0,
    udrzbaMod: 1.0,
    prestizMod: 1.0,
  },
  apex: {
    nazov: "Apex",
    popis: "Vysoká kapacita pre veľký nápor lyžiarov.",
    cenaMod: 1.25,
    kapacitaMod: 1.35,
    udrzbaMod: 1.2,
    prestizMod: 1.0,
  },
  kristallis: {
    nazov: "Kristallis",
    popis: "Prémiová kvalita. Drahá kúpa, lacná prevádzka, vysoká prestíž.",
    cenaMod: 1.5,
    kapacitaMod: 1.1,
    udrzbaMod: 0.85,
    prestizMod: 1.4,
  },
  solaris: {
    nazov: "Solaris",
    popis: "Špičková technológia. Najvyššia kapacita, minimálna údržba.",
    cenaMod: 1.4,
    kapacitaMod: 1.45,
    udrzbaMod: 0.7,
    prestizMod: 1.5,
    premiova: true,
  },
};

// Vleky majú na výber len dve značky
export const ZNACKY_VLEKOV = {
  alpenlift: ZNACKY_LANOVIEK.alpenlift,
  silvretta: ZNACKY_LANOVIEK.silvretta,
};

// Ktoré značky sú dostupné pre daný typ lanovky
export function znackyPreTyp(typ) {
  return typ === "vlek" ? ZNACKY_VLEKOV : ZNACKY_LANOVIEK;
}

// Parkoviská — viac typov
export const PARKOVISKA_TYPY = {
  parkovisko_strkove: {
    nazov: "Štrkové parkovisko",
    popis: "Jednoduchá štrková plocha. Lacná, ale bez komfortu.",
    zakladnaCena: 120000, vystavbaHernychMesiacov: 0.5, kapacita: 40, prestiz: 8, referencnaCena: 4, zamestnanci: 1,
  },
  parkovisko_asfaltove: {
    nazov: "Asfaltové parkovisko",
    popis: "Vyznačené miesta a spevnený povrch. Osvedčený štandard.",
    zakladnaCena: 200000, vystavbaHernychMesiacov: 1, kapacita: 60, prestiz: 15, referencnaCena: 5, zamestnanci: 2,
  },
  parkovisko_centralne: {
    nazov: "Centrálne parkovisko",
    popis: "Veľká plocha ďalej od zjazdoviek. Veľa miest, nižšia cena.",
    zakladnaCena: 350000, vystavbaHernychMesiacov: 2, kapacita: 150, prestiz: 10, referencnaCena: 3, zamestnanci: 3,
  },
  parkovaci_dom: {
    nazov: "Parkovací dom",
    popis: "Viacpodlažná garáž. Obrovská kapacita na malej ploche.",
    zakladnaCena: 900000, vystavbaHernychMesiacov: 5, kapacita: 250, prestiz: 45, referencnaCena: 7, zamestnanci: 4,
    premiova: true,
  },
};

// Ktoré typy parkovísk sa dajú stavať v ktorej zóne
export const PARKOVISKA_PRE_ZONU = {
  luka: ["parkovisko_strkove", "parkovisko_asfaltove", "parkovisko_centralne"],
  udolie: ["parkovisko_strkove", "parkovisko_asfaltove", "parkovaci_dom"],
};

// Ktoré parkoviská majú podmienku odomknutia
export const ODOMKNUTIE_PARKOVISK = {
  parkovisko_centralne: "hory",
};

// Obrázky ubytovania
export const OBRAZKY_UBYTOVANIA = {
  penzion: "/ubytovanie/penzion.png",
  hotel_3: "/ubytovanie/3hviezdy-hotel_transparent.png",
  hotel_4: "/ubytovanie/4hviezdy-hotel_transparent.png",
  hotel_5: "/ubytovanie/5hviezdy-hotel_transparent.png",
  summit_resort: "/ubytovanie/premium-hotel_transparent.png",
};

// Obrázky parkovísk
export const OBRAZKY_PARKOVISK = {
  parkovisko_strkove: "/parkoviska/strkove-parkovisko.png",
  parkovisko_asfaltove: "/parkoviska/asfaltove-parkovisko.png",
  parkovisko_centralne: "/parkoviska/centralne-parkovisko.png",
  parkovaci_dom: "/parkoviska/parkovaci-dom.png",
};

// Pokladne — tri typy. Kapacita = koľko osôb za hodinu zvládnu odbaviť.
export const POKLADNE_TYPY = {
  pokladna_mala: {
    nazov: "Malá pokladňa",
    popis: "Jedno okienko. Zvládne 30 osôb za hodinu.",
    zakladnaCena: 80000, vystavbaHernychMesiacov: 0.5, kapacita: 30, prestiz: 10, referencnaCena: 0, zamestnanci: 1,
  },
  pokladna_velka: {
    nazov: "Veľká pokladňa",
    popis: "Štyri okienka a prístrešok. Zvládne 120 osôb za hodinu.",
    zakladnaCena: 250000, vystavbaHernychMesiacov: 1, kapacita: 120, prestiz: 25, referencnaCena: 0, zamestnanci: 3,
  },
  pokladna_infocentrum: {
    nazov: "Pokladňa s infocentrom",
    popis: "Päť okienok a informácie. Zvládne 150 osôb za hodinu.",
    zakladnaCena: 500000, vystavbaHernychMesiacov: 2, kapacita: 150, prestiz: 50, referencnaCena: 0, zamestnanci: 5,
  },
};

// Koľko turistov si reálne kupuje lístok pri pokladni
// (zvyšok má sezónku, viacdňový lístok alebo online nákup)
export const PODIEL_KUPUJE_LISTOK = 0.4;

// Koľko turistov prichádza autom (zvyšok sú ubytovaní hostia a autobusy)
export const PODIEL_PRICHADZA_AUTOM = 0.7;

// Ktoré pokladne sa dajú stavať v ktorej zóne
export const POKLADNE_PRE_ZONU = {
  luka: ["pokladna_mala", "pokladna_velka"],
  udolie: ["pokladna_mala", "pokladna_velka", "pokladna_infocentrum"],
};

// Obrázky pokladní
export const OBRAZKY_POKLADNI = {
  pokladna_mala: "/pokladne/mala-pokladna_tranparent.png",
  pokladna_velka: "/pokladne/velka-pokladna_tranparent.png",
  pokladna_infocentrum: "/pokladne/infocentrum_tranparent.png",
};

// Penzión — menšie ubytovanie (Lúka), 1 pevný typ
export const PENZION_TYPY = {
  penzion: { nazov: "Penzión", zakladnaCena: 300000, vystavbaHernychMesiacov: 4, kapacita: 10, prestiz: 30, referencnaCena: 25, zamestnanci: 3 },
};

// Hotely — štyri triedy
export const HOTELY_TYPY = {
  hotel_3: {
    nazov: "Hotel ***",
    popis: "Solídny horský hotel s balkónmi. Základ pre náročnejších hostí.",
    zakladnaCena: 2000000, vystavbaHernychMesiacov: 14, kapacita: 50, prestiz: 130, referencnaCena: 70, zamestnanci: 10,
  },
  hotel_4: {
    nazov: "Hotel ****",
    popis: "Wellness krídlo s bazénom a presklená hala. Vyšší štandard.",
    zakladnaCena: 3500000, vystavbaHernychMesiacov: 18, kapacita: 80, prestiz: 200, referencnaCena: 110, zamestnanci: 16,
  },
  hotel_5: {
    nazov: "Hotel *****",
    popis: "Luxusný rezort s panoramatickou terasou a vyhrievaným bazénom.",
    zakladnaCena: 6000000, vystavbaHernychMesiacov: 22, kapacita: 120, prestiz: 320, referencnaCena: 180, zamestnanci: 26,
  },
  summit_resort: {
    nazov: "Summit Resort",
    popis: "Špičkový horský rezort. Najvyšší komfort a prestíž.",
    zakladnaCena: 8000000, vystavbaHernychMesiacov: 26, kapacita: 160, prestiz: 450, referencnaCena: 220, zamestnanci: 34,
    premiova: true,
  },
};
// Ratraky — tri typy, líšia sa terénom a spotrebou paliva
export const RATRAKY_TYPY = {
  ratrak_stary: {
    nazov: "Starší ratrak",
    popis: "Lacný a úsporný, ale zvládne len mierne svahy.",
    zakladnaCena: 300000, vystavbaHernychMesiacov: 1, kapacita: 15, prestiz: 20, referencnaCena: 0, zamestnanci: 1,
    palivoZaHodinu: 15,
  },
  ratrak_navijak: {
    nazov: "Ratrak s navijakom",
    popis: "Zdolá aj strmé svahy. Vyššia spotreba paliva.",
    zakladnaCena: 1200000, vystavbaHernychMesiacov: 2, kapacita: 40, prestiz: 55, referencnaCena: 0, zamestnanci: 2,
    palivoZaHodinu: 45,
  },
  ratrak_premium: {
    nazov: "Prémiový ratrak",
    popis: "Zvládne všetko a spotrebuje menej než navijak.",
    zakladnaCena: 1800000, vystavbaHernychMesiacov: 2, kapacita: 60, prestiz: 80, referencnaCena: 0, zamestnanci: 2,
    palivoZaHodinu: 30,
    premiova: true,
  },
};

// Ktoré ratraky sa dajú stavať v ktorej zóne
// (v Horách a na Ľadovci je terén strmý — starý ratrak tam nestačí)
export const RATRAKY_PRE_ZONU = {
  luka: ["ratrak_stary", "ratrak_navijak", "ratrak_premium"],
  udolie: ["ratrak_stary", "ratrak_navijak", "ratrak_premium"],
  hory: ["ratrak_navijak", "ratrak_premium"],
  ladovec: ["ratrak_navijak", "ratrak_premium"],
};

// Obrázky ratrakov
export const OBRAZKY_RATRAKOV = {
  ratrak_stary: "/ratraky/starsi-ratrak_transparent.png",
  ratrak_navijak: "/ratraky/ratrak-s-navijakom_transparent.png",
  ratrak_premium: "/ratraky/premium-ratrak_transparent.png",
};

// Zasnežovanie — tri typy podľa zdroja vody
export const ZASNEZOVANIE_TYPY = {
  zasnezovanie_potok: {
    nazov: "Čerpacia stanica pri potoku",
    popis: "Lacný zdroj s obmedzeným prietokom. Stačí pre Lúku a Údolie.",
    zakladnaCena: 900000, vystavbaHernychMesiacov: 5, kapacita: 10, prestiz: 35, referencnaCena: 0, zamestnanci: 2,
    elektrinaZaHodinu: 127,
    chraniMesiace: [9],
  },
  zasnezovanie_jazero: {
    nazov: "Čerpacia stanica pri jazere",
    popis: "Stabilný zdroj vody. Predĺži sezónu o október aj máj.",
    zakladnaCena: 1800000, vystavbaHernychMesiacov: 7, kapacita: 25, prestiz: 70, referencnaCena: 0, zamestnanci: 3,
    elektrinaZaHodinu: 200,
    chraniMesiace: [9, 4],
  },
  zasnezovanie_nadrz: {
    nazov: "Vodná nádrž",
    popis: "Vlastná zásoba vody. Najdlhšia sezóna, nezávislá od počasia.",
    zakladnaCena: 3000000, vystavbaHernychMesiacov: 10, kapacita: 50, prestiz: 120, referencnaCena: 0, zamestnanci: 5,
    elektrinaZaHodinu: 280,
    chraniMesiace: [8, 9, 4, 5],
    premiova: true,
  },
};

// Ktoré zasnežovanie stačí pre danú úroveň strediska
// (po odomknutí Hôr potok už nestačí)
export const ZASNEZOVANIE_PRE_HORY = ["zasnezovanie_jazero", "zasnezovanie_nadrz"];

// Obrázky zasnežovania
export const OBRAZKY_ZASNEZOVANIA = {
  zasnezovanie_potok: "/zasnezovanie/male-zasnezovanie_transparent.png",
  zasnezovanie_jazero: "/zasnezovanie/zasnezovanie_transparent.png",
  zasnezovanie_nadrz: "/zasnezovanie/premium-zasnezovanie_transparent.png",
};

// Bufet — jednoduché občerstvenie, funguje celoročne
export const BUFET_TYPY = {
  bufet: {
    nazov: "Bufet",
    popis: "Jednoduchá búdka s občerstvením. Základná služba pri vlekoch.",
    zakladnaCena: 150000, vystavbaHernychMesiacov: 1, kapacita: 30, prestiz: 8, referencnaCena: 6, zamestnanci: 2,
  },
};

// Apréski — moderný bar so zážitkom, hlavne v zime
export const BARY_TYPY = {
  bar: {
    nazov: "Apréski bar",
    popis: "Presklený bar s terasou. Drahší zážitok, vyššia prestíž.",
    zakladnaCena: 450000, vystavbaHernychMesiacov: 3, kapacita: 20, prestiz: 35, referencnaCena: 12, zamestnanci: 4,
  },
};

// Obrázky služieb
export const OBRAZKY_SLUZIEB = {
  bufet: "/sluzby/bufet.png",
  bar: "/sluzby/apreskibar.png",
};

// Servis a požičovňa — dva typy
export const SERVIS_TYPY = {
  servis_maly: {
    nazov: "Malá požičovňa",
    popis: "Základná požičovňa lyží a snowboardov.",
    zakladnaCena: 250000, vystavbaHernychMesiacov: 2, kapacita: 25, prestiz: 15, referencnaCena: 20, zamestnanci: 2,
  },
  servis_velky: {
    nazov: "Ski servis a požičovňa",
    popis: "Plná služba — požičovňa, brúsenie aj voskovanie.",
    zakladnaCena: 600000, vystavbaHernychMesiacov: 3, kapacita: 60, prestiz: 40, referencnaCena: 28, zamestnanci: 5,
  },
};

// Obrázky servisu
export const OBRAZKY_SERVISU = {
  servis_maly: "/sluzby/skiservis_transparent.png",
  servis_velky: "/sluzby/central-servis_transparent.png",
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
  bufet: { nazov: "Bufet", ikona: "🌭", katalog: BUFET_TYPY, znackyKatalog: null, maCenu: true },
  bar: { nazov: "Apréski bar", ikona: "🍺", katalog: BARY_TYPY, znackyKatalog: null, maCenu: true },
  servis: { nazov: "Servis a požičovňa", ikona: "🎿", katalog: SERVIS_TYPY, znackyKatalog: null, maCenu: true },
};

// Herný čas beží 2x rýchlejšie => reálne dni = herné mesiace * 30 / 2
export function vystavbaVRealnychDnoch(hernychMesiacov) {
  return (hernychMesiacov * 30) / 2;
}

function ziskajInfo(kategoria, typ) {
  return KATEGORIE[kategoria].katalog[typ];
}

function ziskajZnackuMod(kategoria, typ, znacka) {
  const ZIADNA = { cenaMod: 1, kapacitaMod: 1, udrzbaMod: 1, prestizMod: 1 };
  if (kategoria !== "lanovka" || !znacka) return ZIADNA;
  const dostupne = znackyPreTyp(typ);
  return dostupne[znacka] || ZIADNA;
}

// Kapacita budovy so zohľadnením značky
export function kapacitaBudovy(kategoria, typ, znacka) {
  const info = ziskajInfo(kategoria, typ);
  const mod = ziskajZnackuMod(kategoria, typ, znacka);
  return Math.round(info.kapacita * mod.kapacitaMod);
}

// Násobiteľ údržby podľa značky
export function udrzbaModZnacky(kategoria, typ, znacka) {
  return ziskajZnackuMod(kategoria, typ, znacka).udrzbaMod;
}

export function cenaBudovy(kategoria, typ, znacka) {
  const info = ziskajInfo(kategoria, typ);
  const mod = ziskajZnackuMod(kategoria, typ, znacka);
  return Math.round(info.zakladnaCena * mod.cenaMod);
}

export function prestizBudovy(kategoria, typ, znacka) {
  const info = ziskajInfo(kategoria, typ);
  const mod = ziskajZnackuMod(kategoria, typ, znacka);
  return Math.round(info.prestiz * mod.prestizMod);
}

// Jednoduchý model dopytu — teraz prijíma referenčnú cenu ako parameter (mení sa podľa sezóny/rozvinutosti)
export function turistiZaHodinu(kategoria, typ, cena, referencnaCenaDnes, znacka = null) {
  const info = ziskajInfo(kategoria, typ);
  const refCena = referencnaCenaDnes ?? info.referencnaCena;
  if (!refCena) return 0;
  const kapacita = kapacitaBudovy(kategoria, typ, znacka);
  const bezpecnaCena = Math.max(cena, 1);
  const dopyt = (kapacita * refCena) / bezpecnaCena;
  return Math.min(dopyt, kapacita);
}

export function prijemZaHodinu(kategoria, typ, cena, referencnaCenaDnes, znacka = null) {
  return turistiZaHodinu(kategoria, typ, cena, referencnaCenaDnes, znacka) * cena;
}

// --- Ročné vyjednávanie o plat (kalendárne, spoločné pre všetkých hráčov) ---
export const EFEKTIVITA_PRI_ODMIETNUTI = 0.8;

// --- Vyjednávanie o platoch (nový systém, viazaný na Údolie+) ---
export const PRVA_POZIADAVKA_PERCENTO = 5;
export const MIN_POZIADAVKA_PERCENTO = 2;

export function eskalaciaPercento(stanica) {
  if (stanica.hory_odomknute) return 1;
  return 0.5;
}

export function dalsiaPoziadavka(minulaPoziadavka, minuleRozhodnutie, stanica) {
  const delta = eskalaciaPercento(stanica);
  if (minuleRozhodnutie === "prijat") return minulaPoziadavka + delta;
  if (minuleRozhodnutie === "zamietnut") return Math.max(MIN_POZIADAVKA_PERCENTO, minulaPoziadavka - delta);
  return minulaPoziadavka;
}

export function efektivitaPriVlastnomNavrhu(vlastnePercento, poziadavkaPercento) {
  if (!poziadavkaPercento || poziadavkaPercento <= 0) return 1;
  const pomer = Math.max(0, Math.min(1, vlastnePercento / poziadavkaPercento));
  return EFEKTIVITA_PRI_ODMIETNUTI + (1 - EFEKTIVITA_PRI_ODMIETNUTI) * pomer;
}

export const PLAT_ZA_HODINU = 3;

// --- Zóny strediska - limitované sloty na budovy ---
// Kľúče lanoviek sú teraz priamo konkrétne typy (viď LANOVKY_TYPY)
export const ZONY = {
  luka: {
    nazov: "Lúka",
    ikona: "🌾",
    poradie: 1,
    limity: { vlek: 2, lanovka: 1, spojnica_udolie: 1, spojnica_hory: 1, parkovisko: 1, bufet: 1, penzion: 2, pokladna: 1, ratrak: 1 },
    popisky: { spojnica_udolie: "Spojnica do Údolia", spojnica_hory: "Spojnica do Hôr" },
  },
  udolie: {
    nazov: "Údolie",
    ikona: "🏞️",
    poradie: 2,
    limity: { lanovka: 3, parkovisko: 2, hotel: 2, ratrak: 1, zasnezovanie: 1, bufet: 1, bar: 1, servis: 1, pokladna: 1 },
  },
  hory: {
    nazov: "Hory",
    ikona: "🌲",
    poradie: 3,
    limity: { lanovka: 2, spojnica_ladovec: 1, hotel: 1, bar: 1, ratrak: 2 },
    popisky: { spojnica_ladovec: "Spojnica na Ľadovec" },
  },
  ladovec: {
    nazov: "Ľadovec",
    ikona: "🧊",
    poradie: 4,
    limity: { lanovka: 2, hotel: 1, ratrak: 1 },
  },
};

// Ktorý slot má aké typy na výber
export const SLOT_TYP = {
  vlek: "vlek",
  lanovka: "lanovka",
  spojnica_udolie: "spojnica",
  spojnica_hory: "spojnica",
  spojnica_ladovec: "spojnica_ladovec",
};

// Ktoré sloty sú lanovkové (patria pod kategóriu "lanovka")
export const LANOVKOVE_SLOTY = ["vlek", "lanovka", "spojnica_udolie", "spojnica_hory", "spojnica_ladovec"];

// Ktoré sloty fungujú aj v lete (turisti chodia na turistiku hore)
// Zapisuje sa ako "zona:slot:poradie" — poradie je index budovy v slote (0 = prvá)
export const LETNE_SLOTY = [
  "luka:spojnica_hory:0",   // spojnica z Lúky do Hôr
  "hory:lanovka:0",         // prvá lanovka v Horách
  "hory:spojnica_ladovec:0",// spojnica na Ľadovec
  "ladovec:lanovka:0",      // prvá lanovka na Ľadovci
];

// Funguje daná lanovka v lete?
// Vlek funguje len s bobovou dráhou, ostatné podľa toho, či sú v letnom slote.
export function jeLetnaLanovka(budova, poradieVSlote) {
  if (budova.kategoria !== "lanovka") return false;
  if (budova.bobova_draha) return true;
  const slot = budova.slot || budova.kategoria;
  return LETNE_SLOTY.includes(`${budova.zona}:${slot}:${poradieVSlote}`);
}

export function jeLanovkovySlot(slot) {
  return LANOVKOVE_SLOTY.includes(slot);
}

export function typyPreSlot(slot) {
  return TYPY_PRE_SLOT[SLOT_TYP[slot]] || [];
}

// Ktorí výrobcovia majú aspoň jeden typ vhodný pre daný slot
export function vyrobcoviaPreSlot(slot) {
  const povoleneTypy = TYPY_PRE_SLOT[SLOT_TYP[slot]] || [];
  const vysledok = {};
  for (const kluc of Object.keys(ZNACKY_LANOVIEK)) {
    const ponuka = (PONUKA_VYROBCU[kluc] || []).filter((t) => povoleneTypy.includes(t));
 if (ponuka.length > 0) vysledok[kluc] = { ...ZNACKY_LANOVIEK[kluc], ponuka, logo: LOGA_VYROBCOV[kluc] || null };
  }
  return vysledok;
}
// Spojnice sa odomykajú spolu s cieľovou zónou
export const ODOMKNUTIE_LANOVIEK_LUKA = {
  spojnica_udolie: "udolie",
  spojnica_hory: "hory",
};

// Spojnica na Ľadovec (v zóne Hory) — zatiaľ nedostupná
export const ODOMKNUTIE_SPOJNIC_HORY = {
  spojnica_ladovec: "ladovec",
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
    parkovisko: { max: 1, stratapenazi: 0.25, prestizBonus: 1, sezonne: true },
    bufet: { max: 1, stratapenazi: 0.25, prestizBonus: 3, sezonne: false },
  },
  udolie: {
    hotel: { max: 1, stratapenazi: 0.25, prestizBonus: 10, sezonne: true },
    parkovisko: { max: 1, stratapenazi: 0.25, prestizBonus: 1, sezonne: true },
    servis: { max: 1, stratapenazi: 0.25, prestizBonus: 1, sezonne: false },
    bar: { max: 1, stratapenazi: 0.25, prestizBonus: 3, sezonne: false },
  },
};
export const VEK_PRE_KONKURENCIU_DNI = 90;

export const KONKURENCIA_VYSTAVBA_MESIACOV = { hotel: 14, penzion: 4, bufet: 1, bar: 3, parkovisko: 1, servis: 2 };

const ZIMNE_MESIACE = [9, 10, 11, 0, 1, 2, 3, 4]; // Október - Máj (8 mesiacov)

export function jeZimnyMesiac(mesiac) {
  return ZIMNE_MESIACE.includes(mesiac);
}

// Medzisezóna — krátke obdobie prechodu medzi sezónami, stredisko je zatvorené (žiadny príjem, mzdy/údržba bežia ďalej)
// Len jesenná (1.-7. október) — zima→leto je priamy prechod bez medzisezóny
export function jeMedzisezona(datum) {
  const mesiac = datum.getMonth();
  const den = datum.getDate();
  return mesiac === 9 && den >= 1 && den <= 7;
}

// Ročný cyklus (1 zima + 1 leto) — rovnaký pre VŠETKÝCH hráčov naraz (kalendárny, nie podľa dátumu registrácie)
// Cyklus "2026" = Október 2026 až September 2027 (zima 2026/27 + leto 2027)
export function rocnyCyklusIndex(datum) {
  const mesiac = datum.getMonth();
  const rok = datum.getFullYear();
  return mesiac >= 9 ? rok : rok - 1;
}

// Vlek (na rozdiel od gondol/lanoviek) je čisto lyžiarske zariadenie — v lete nefunguje vôbec
// Vlek je čisto lyžiarske zariadenie — v lete nefunguje, POKIAĽ nemá pridanú bobovú dráhu
export const CENA_BOBOVEJ_DRAHY = 200000;

// Nefunguje táto lanovka práve teraz? (v lete jazdia len vybrané sloty)
export function jeLanovkaMimoSezony(budova, mesiac, poradieVSlote) {
  if (jeZimnyMesiac(mesiac)) return false;
  return !jeLetnaLanovka(budova, poradieVSlote);
}

export function sezonaIndex(datum) {
  return datum.getFullYear() * 2 + (jeZimnyMesiac(datum.getMonth()) ? 0 : 1);
}

// Skutočné hranice zimnej/letnej sezóny (Október-Máj = zima, Jún-September = leto)
export function hranicaSezony(datum) {
  const mesiac = datum.getMonth();
  const rok = datum.getFullYear();
  if (jeZimnyMesiac(mesiac)) {
    const zaciatokRok = mesiac >= 9 ? rok : rok - 1;
    return { zaciatok: new Date(zaciatokRok, 9, 1), koniec: new Date(zaciatokRok + 1, 4, 31), typ: "zima" };
  }
  return { zaciatok: new Date(rok, 5, 1), koniec: new Date(rok, 8, 30), typ: "leto" };
}

// Kedy začína ĎALŠIA sezóna (deň po konci aktuálnej)
export function zaciatokDalsejSezony(datum) {
  const aktualna = hranicaSezony(datum);
  const zaciatok = new Date(aktualna.koniec);
  zaciatok.setDate(zaciatok.getDate() + 1);
  return { zaciatok, typ: aktualna.typ === "zima" ? "leto" : "zima" };
}

// Kompletný prehľad — aktuálna sezóna, medzisezóna po nej, a kedy naozaj začína ďalšia sezóna
// Zima: 8.10-31.5 | Leto: 1.6-30.9 | Medzisezóna: len 1.-7.10 (žiadna pred letom)
export function sezonnyPrehlad(datum) {
  const mesiac = datum.getMonth();
  const den = datum.getDate();
  const rok = datum.getFullYear();

  if (mesiac === 9 && den <= 7) {
    return {
      aktualna: { typ: "medzisezona", zaciatok: new Date(rok, 9, 1), koniec: new Date(rok, 9, 7) },
      medzisezona: { zaciatok: new Date(rok, 9, 1), koniec: new Date(rok, 9, 7) },
      dalsia: { typ: "zima", zaciatok: new Date(rok, 9, 8) },
    };
  }

  const jeZima = mesiac >= 9 || mesiac <= 4;
  if (jeZima) {
    const zaciatokRok = mesiac >= 9 ? rok : rok - 1;
    return {
      aktualna: { typ: "zima", zaciatok: new Date(zaciatokRok, 9, 8), koniec: new Date(zaciatokRok + 1, 4, 31) },
      medzisezona: { zaciatok: new Date(zaciatokRok + 1, 9, 1), koniec: new Date(zaciatokRok + 1, 9, 7) },
      dalsia: { typ: "leto", zaciatok: new Date(zaciatokRok + 1, 5, 1) },
    };
  }

  return {
    aktualna: { typ: "leto", zaciatok: new Date(rok, 5, 1), koniec: new Date(rok, 8, 30) },
    medzisezona: { zaciatok: new Date(rok, 9, 1), koniec: new Date(rok, 9, 7) },
    dalsia: { typ: "zima", zaciatok: new Date(rok, 9, 8) },
  };
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
  5: 0.30,  // Jún
  6: 0.45,  // Júl (letný vrchol)
  7: 0.45,  // August
  8: 0.30,  // September
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
// Mesiace, čo bez zasnežovania klesnú na "letnú" úroveň dopytu (žiadny prirodzený sneh)
export const MESIACE_ZASNEZOVANIE_CHRANI = [9, 4]; // Október, Máj
export const SEZONNA_KRIVKA_LETO_NAHRADA = 0.30; // rovnaká ako okrajové letné mesiace (Jún/September)

// Ktoré mesiace hráčovi chráni jeho zasnežovanie (podľa typu, ktorý má postavený)
export function chraneneMesiaceZasnezovania(hotoveBudovy) {
  const zasnezovania = hotoveBudovy.filter((b) => b.kategoria === "zasnezovanie");
  const mesiace = new Set();
  for (const z of zasnezovania) {
    const typ = ZASNEZOVANIE_TYPY[z.typ];
    for (const m of typ?.chraniMesiace || []) mesiace.add(m);
  }
  return mesiace;
}

// Efektívny sezónny násobiteľ — zohľadní, ktoré mesiace hráčovi zasnežovanie chráni
// maZasnezovanie môže byť boolean (staré správanie) alebo Set chránených mesiacov
export function efektivnySezonnyMultiplikator(mesiac, maZasnezovanie) {
  const chranene =
    maZasnezovanie instanceof Set
      ? maZasnezovanie
      : maZasnezovanie
      ? new Set(MESIACE_ZASNEZOVANIE_CHRANI)
      : new Set();

  if (!chranene.has(mesiac) && MESIACE_ZASNEZOVANIE_CHRANI.includes(mesiac)) {
    return SEZONNA_KRIVKA_LETO_NAHRADA;
  }
  // Nádrž chráni aj september a jún — tie inak majú letnú krivku
  if (chranene.has(mesiac) && (mesiac === 8 || mesiac === 5)) {
    return SEZONNA_KRIVKA_CENY[9] ?? 0.75;
  }
  return SEZONNA_KRIVKA_CENY[mesiac] ?? 1;
}

// Priemerná referenčná cena všetkých postavených lanoviek — základ pre skipas.
// Čím lepšie lanovky máš, tým vyššiu cenu skipasu si môžeš dovoliť.
export function priemernaReferencnaCenaLanoviek(hotoveBudovy) {
  const lanovky = hotoveBudovy.filter((b) => b.kategoria === "lanovka");
  if (lanovky.length === 0) return LANOVKY_TYPY.vlek.referencnaCena;
  const sucet = lanovky.reduce((s, b) => s + (LANOVKY_TYPY[b.typ]?.referencnaCena || 0), 0);
  return sucet / lanovky.length;
}

// Referenčná cena skipasu = priemer z lanoviek × sezónna krivka × globálny multiplikátor
// Aktuálna cena skipasu — v zime celodenný, v lete jedna jazda
export function aktualnaCenaSkipasu(stanica, mesiac) {
  if (jeZimnyMesiac(mesiac)) return stanica.cena_skipasu ?? 15;
  return stanica.cena_skipasu_leto ?? 8;
}

export function referencnaCenaSkipasu(hotoveBudovy, hDatum, globalnyMultiplikator = 1, maZasnezovanie = true) {
  const zaklad = priemernaReferencnaCenaLanoviek(hotoveBudovy);
  const sezonnyMult = efektivnySezonnyMultiplikator(hDatum.getMonth(), maZasnezovanie);
  return zaklad * sezonnyMult * globalnyMultiplikator;
}

export function skutocnaReferencnaCena(kategoria, typ, hDatum, globalnyMultiplikator = 1, maZasnezovanie = true) {
  const info = KATEGORIE[kategoria]?.katalog[typ];
  if (!info || !info.referencnaCena) return 0;
  const sezonnyMult = efektivnySezonnyMultiplikator(hDatum.getMonth(), maZasnezovanie);
  return info.referencnaCena * sezonnyMult * globalnyMultiplikator;
}

// --- Prevádzková doba (hodiny/deň) ---
// Ideálna dĺžka prevádzky podľa herného mesiaca (kopíruje reálne otváracie hodiny lyžiarskych stredísk)
export const IDEALNA_PREVADZKA_HODIN = {
  9: 7,    // Október
  10: 7,   // November
  11: 7,   // December
  0: 7,    // Január
  1: 7.5,  // Február
  2: 7.5,  // Marec
  3: 7.5,  // Apríl
  4: 7,    // Máj
  5: 7,    // Jún
  6: 8.5,  // Júl (+1 ak sú odomknuté Hory)
  7: 8.5,  // August (+1 ak sú odomknuté Hory)
  8: 7,    // September
};

export const PREVADZKA_HODIN_MIN = 4;
export const PREVADZKA_HODIN_MAX = 14;

// Kategórie, ktoré sa riadia prevádzkovou dobou (ubytovanie beží 24h, preto tu nie je)
export const KATEGORIE_S_PREVADZKOU = ["lanovka", "bar", "servis", "parkovisko", "pokladna"];

export function idealnaPrevadzkaHodin(mesiac, horyOdomknute) {
  let zaklad = IDEALNA_PREVADZKA_HODIN[mesiac] ?? 7.5;
  if ((mesiac === 6 || mesiac === 7) && horyOdomknute) zaklad += 1;
  return zaklad;
}

// Vráti { revenuFaktor, wageFaktor } ako ZLOMOK Z 24 HODÍN:
// - príjem: max toľko hodín, koľko je ideál (viac navyše nezarobí nič, je tma)
// - mzdy: min toľko hodín, koľko je ideál (menej ťa nezachráni od plnej mzdy)
export function prevadzkovyFaktor(hraczovaDobaHodin, idealnaDobaHodin) {
  if (!idealnaDobaHodin) return { revenuFaktor: hraczovaDobaHodin / 24, wageFaktor: hraczovaDobaHodin / 24 };
  const prijmoveHodiny = Math.min(hraczovaDobaHodin, idealnaDobaHodin);
  const mzdoveHodiny = Math.max(hraczovaDobaHodin, idealnaDobaHodin);
  return {
    revenuFaktor: prijmoveHodiny / 24,
    wageFaktor: mzdoveHodiny / 24,
  };
}

// Prevod "08:30" -> 8.5 (hodiny ako desatinné číslo)
export function casNaHodiny(text) {
  if (!text || typeof text !== "string") return 0;
  const [h, m] = text.split(":").map(Number);
  return (h || 0) + (m || 0) / 60;
}

// Prevod 8.5 -> "08:30"
export function hodinyNaCas(hodiny) {
  const celeHodiny = Math.floor(hodiny);
  const minuty = Math.round((hodiny - celeHodiny) * 60);
  return `${String(celeHodiny).padStart(2, "0")}:${String(minuty).padStart(2, "0")}`;
}

// Dĺžka prevádzky v hodinách zo začiatku a konca (text formát "HH:MM")
export function dobaVHodinach(zaciatok, koniec) {
  const zaciatokH = casNaHodiny(zaciatok);
  const koniecH = casNaHodiny(koniec);
  return Math.max(0, koniecH - zaciatokH);
}

// --- Denná spokojnosť v Lúke (zjednodušená verzia) ---
// dav = kapacita vlekov/lanoviek v Lúke; pokrytie parkoviska a bufetu (vlastné alebo konkurenčné) voči tomuto davu
export const DENNA_SPOKOJNOST_MINIMUM = 0.3;

export function dennaSpokojnostLuka(budovyLuka, konkurenciaLuka) {
  const davKapacita = budovyLuka
    .filter((b) => b.kategoria === "lanovka")
    .reduce((s, b) => s + (LANOVKY_TYPY[b.typ]?.kapacita || 0), 0);
  if (davKapacita === 0) return 1;

  function pokrytie(kat, katalog) {
    const vlastna = budovyLuka.find((b) => b.kategoria === kat);
    if (vlastna) return Math.min(1, (katalog[vlastna.typ]?.kapacita || 0) / davKapacita);
    const konkurencna = konkurenciaLuka.find((k) => k.kategoria === kat && k.stav === "hotovo");
    if (konkurencna) return Math.min(1, (katalog[kat]?.kapacita || 0) / davKapacita);
    return 0;
  }

  const priemer = (pokrytie("parkovisko", PARKOVISKA_TYPY) + pokrytie("bar", BARY_TYPY)) / 2;
  return DENNA_SPOKOJNOST_MINIMUM + priemer * (1 - DENNA_SPOKOJNOST_MINIMUM);
}

// --- Bonus/postih spokojnosti podľa toho, ako dlho chýba pokladňa ---
// 1. herný mesiac: +10% (nadšenie "zadarmo"), 2.-3. mesiac: -15% (fronty/chaos), 4.+ mesiac: 0% (neutrálne)
export function pokladnaSpokojnostBonus(maPokladnu, hernyMesiacovOdZalozenia) {
  if (maPokladnu) return 0;
  if (hernyMesiacovOdZalozenia < 1) return 0.10;
  if (hernyMesiacovOdZalozenia < 3) return -0.15;
  return 0;
}

export function vypocitajSpokojnostStrediska(hotoveBudovy, st, hDatum, globalnyMult, maZasnezovanie, jeBurka, jeSilnyVietor, zonaDennyDav = {}) {
  let infrastruktura = 0;
  let ceny = 0;
  let sluzby = 0;

  const mesiac = hDatum.getMonth();
  const jeLeto = !jeZimnyMesiac(mesiac);
  const ma = (kat, zona) => hotoveBudovy.some((b) => b.kategoria === kat && b.zona === zona);

  // ===== INFRAŠTRUKTÚRA — čo v stredisku chýba =====

  // --- LÚKA (vždy) ---
  if (!ma("parkovisko", "luka")) infrastruktura -= 8;
  if (!ma("bufet", "luka")) infrastruktura -= 8;
  if (!ma("pokladna", "luka")) infrastruktura -= 8;

  // V lete potrebuje Lúka bobovú dráhu, inak nemajú turisti čo robiť
  if (jeLeto) {
    const maBobovku = hotoveBudovy.some((b) => b.zona === "luka" && b.bobova_draha);
    if (!maBobovku) infrastruktura -= 8;
  }

  // --- ÚDOLIE ---
  if (st.udolie_odomknute) {
    if (!ma("parkovisko", "udolie")) infrastruktura -= 6;
    if (!ma("hotel", "udolie")) infrastruktura -= 6;
    if (!ma("ratrak", "udolie")) infrastruktura -= 6;
    if (!ma("zasnezovanie", "udolie")) infrastruktura -= 6;

    // Pokladňa v Údolí — stupňovaný postih podľa typu
    const pokladneUdolie = hotoveBudovy.filter((b) => b.kategoria === "pokladna" && b.zona === "udolie");
    const maInfocentrum = pokladneUdolie.some((b) => b.typ === "pokladna_infocentrum");
    if (pokladneUdolie.length === 0) infrastruktura -= 8;
    else if (!maInfocentrum) infrastruktura -= 3;
  }

  // --- HORY ---
  if (st.hory_odomknute) {
    if (!ma("hotel", "hory")) infrastruktura -= 10;
    if (!ma("ratrak", "hory")) infrastruktura -= 6;
  }

  // ===== SLUŽBY — ako to funguje pre návštevníka =====

  // Celkový denný dav (súčet cez všetky zóny)
  const celkovyDav = Object.values(zonaDennyDav).reduce((a, b) => a + b, 0);

  // Rady pri pokladni
  const radyPokladna = radyPriPokladni(hotoveBudovy, celkovyDav);
  sluzby -= radyPokladna * 12;

  // Preplnenie lanoviek — počíta sa po zónach, berie sa tá najhoršia
  let najhorsiePreplnenie = 0;
  for (const zonaKluc of Object.keys(zonaDennyDav)) {
    const kapacitaZony = hotoveBudovy
      .filter((b) => b.kategoria === "lanovka" && b.zona === zonaKluc)
      .reduce((s, b) => s + kapacitaBudovy(b.kategoria, b.typ, b.znacka), 0);
    const preplnenie = preplnenieZony(kapacitaZony, zonaDennyDav[zonaKluc]);
    if (preplnenie > najhorsiePreplnenie) najhorsiePreplnenie = preplnenie;
  }
  sluzby -= najhorsiePreplnenie * 12;

  // Kapacita parkovania — autom príde asi 70 % turistov, 1 miesto = 2 osoby
  if (celkovyDav > 0) {
    const miestaSpolu = hotoveBudovy
      .filter((b) => b.kategoria === "parkovisko")
      .reduce((s, b) => s + (PARKOVISKA_TYPY[b.typ]?.kapacita || 0), 0);
    const potrebaMiest = (celkovyDav * PODIEL_PRICHADZA_AUTOM) / 2;
    if (miestaSpolu > 0 && potrebaMiest > miestaSpolu) {
      const pomer = potrebaMiest / miestaSpolu;
      sluzby -= Math.min(1, (pomer - 1) / 1.5) * 6;
    }
  }

  // ===== CENY =====

  // Skipas — jedna cena pre všetky lanovky (v lete letná, v zime zimná)
  const cenaSkipasu = aktualnaCenaSkipasu(st, mesiac);
  const refSkipas = referencnaCenaSkipasu(hotoveBudovy, hDatum, globalnyMult, maZasnezovanie);
  const maLanovky = hotoveBudovy.some((b) => b.kategoria === "lanovka");
  if (maLanovky && refSkipas) {
    if (cenaSkipasu > refSkipas * 2) ceny -= 5;
    ceny -= (1 - preplnenieFaktor(refSkipas, cenaSkipasu)) * 10;
  }

  // Parkovné a ubytovanie — spoločné ceny zo stanice
  const cenoveKontroly = [
    { kategoria: "parkovisko", typ: "parkovisko_asfaltove", cena: st.cena_parkovne_luka ?? 5 },
    { kategoria: "penzion", typ: "penzion", cena: st.cena_penzion ?? 25 },
    { kategoria: "hotel", typ: "hotel_3", cena: st.cena_hotel ?? 70 },
  ];
  for (const k of cenoveKontroly) {
    if (!hotoveBudovy.some((b) => b.kategoria === k.kategoria)) continue;
    const refCena = skutocnaReferencnaCena(k.kategoria, k.typ, hDatum, globalnyMult, maZasnezovanie);
    if (refCena && k.cena > refCena * 2) ceny -= 5;
  }

  // Bufety, apréski a servis majú vlastnú cenu na budovu
  for (const b of hotoveBudovy) {
    if (!["bufet", "bar", "servis"].includes(b.kategoria)) continue;
    if (!b.cena) continue;
    const refCena = skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult, maZasnezovanie);
    if (!refCena) continue;
    if (b.cena > refCena * 2) ceny -= 5;
  }

  // ===== POČASIE =====
  let pocasie = 0;
  if (jeBurka) pocasie -= 10;
  if (jeSilnyVietor) pocasie -= 20;

  infrastruktura = Math.max(-60, infrastruktura);
  sluzby = Math.max(-30, sluzby);
  ceny = Math.max(-40, ceny);
  pocasie = Math.max(-20, pocasie);

  const spolu = Math.max(0, Math.min(100, 100 + infrastruktura + sluzby + ceny + pocasie));

  return {
    infrastruktura: Math.round(infrastruktura),
    sluzby: Math.round(sluzby),
    ceny: Math.round(ceny),
    pocasie: Math.round(pocasie),
    spolu: Math.round(spolu),
  };
}
// --- Rady pri pokladni ---
// Ak kapacita pokladní nestačí na počet kupujúcich, tvoria sa rady a klesá spokojnosť.
export function radyPriPokladni(hotoveBudovy, dennyDavZaHodinu) {
  const kupujucich = dennyDavZaHodinu * PODIEL_KUPUJE_LISTOK;
  if (kupujucich <= 0) return 0;

  const kapacita = hotoveBudovy
    .filter((b) => b.kategoria === "pokladna")
    .reduce((s, b) => s + (POKLADNE_TYPY[b.typ]?.kapacita || 0), 0);

  if (kapacita <= 0) return 1; // žiadna pokladňa = maximálne rady
  const pomer = kupujucich / kapacita;
  if (pomer <= 1) return 0; // stíhajú
  return Math.min(1, (pomer - 1) / 2); // pri dvojnásobnom prekročení je postih plný
}

// --- Preplnenie zóny (kapacita lanoviek vs. počet turistov v zóne) ---
// Vracia 0 (žiadne rady) až 1 (extrémne preplnené)
export function preplnenieZony(kapacitaZony, turistiVZone) {
  if (kapacitaZony <= 0 || turistiVZone <= 0) return 0;
  const pomer = turistiVZone / kapacitaZony;
  if (pomer <= 1.2) return 0; // do 120 % kapacity je to v pohode
  return Math.min(1, (pomer - 1.2) / 0.8); // pri 200 % je postih plný
}

// --- Preplnenie vleku/lanovky (nízka cena priláka viac ľudí, než unesie) ---
// dopyt (bez orezania na kapacitu) vs. kapacita: do 120% žiadny postih,
// nad 120% -5% spokojnosti za každých ďalších +10% dopytu navyše
export function preplnenieFaktor(referencnaCenaDnes, cena) {
  if (!referencnaCenaDnes || !cena) return 1;
  const pomer = referencnaCenaDnes / Math.max(cena, 1); // = dopyt / kapacita
  if (pomer <= 1.2) return 1;
  const kroky = (pomer - 1.2) / 0.1;
  const postih = Math.min(1, 0.05 * kroky);
  return 1 - postih;
}

// --- Nováčikovský multiplikátor (pre ligový systém — spravodlivosť pri rôznom štarte hráčov) ---
// Deň 0: 3× efektívna prestíž pre výpočet podielu turistov, lineárne klesá na 1× do 90. dňa
export const NOVACIK_MULTIPLIKATOR_START = 3;
export const NOVACIK_DNI_DO_KONCA = 90;

export function novacikovskyMultiplikator(vekDni) {
  if (vekDni >= NOVACIK_DNI_DO_KONCA) return 1;
  const pomer = Math.max(0, vekDni) / NOVACIK_DNI_DO_KONCA;
  return NOVACIK_MULTIPLIKATOR_START - (NOVACIK_MULTIPLIKATOR_START - 1) * pomer;
}

// --- Ligový pool turistov (spoločný strop na zónu, delený medzi hráčov podľa prestíže) ---
// Ročné odhady (východiskový bod, doladíme podľa reálnej hry)
export const POOL_ROCNE = {
  luka: 3000000,
  udolie: 1800000,
  hory: 1500000,
  ladovec: 700000,
};

export function poolZaHodinu(zona) {
  const rocny = POOL_ROCNE[zona] || 0;
  return rocny / 8760; // 8760 hodín v roku
}

// Efektívna prestíž hráča pre výpočet podielu (s nováčikovským bonusom)
export function efektivnaPrestizProLigu(prestiz, vekDni) {
  return Math.max(0, prestiz) * novacikovskyMultiplikator(vekDni);
}

// Tvoja hodinová kvóta turistov pre danú zónu
export function vypocitajKvotuZony(vlastnaEfektivnaPrestiz, sucetEfektivnejPrestize, zona) {
  if (sucetEfektivnejPrestize <= 0) return poolZaHodinu(zona);
  const podiel = vlastnaEfektivnaPrestiz / sucetEfektivnejPrestize;
  return podiel * poolZaHodinu(zona);
}

// --- Výber "ligy" — najbližšie registrovaní hráči podľa dátumu, min. veľkosť skupiny ---
export const MIN_HRACOV_V_LIGE = 10;

export function vyberLiguHracov(vlastneId, vlastnyCreatedAt, vsetciHraci) {
  const vlastnyCas = new Date(vlastnyCreatedAt).getTime();
  const zoradeni = vsetciHraci
    .map((h) => ({ ...h, rozdiel: Math.abs(new Date(h.created_at).getTime() - vlastnyCas) }))
    .sort((a, b) => a.rozdiel - b.rozdiel);
  return zoradeni.slice(0, Math.min(MIN_HRACOV_V_LIGE, zoradeni.length));
}

// --- Údržba budov (% z hodnoty budov, rastie s vekom, každý 3. rok nárazovo vyššia) ---
export const UDRZBA_ZAKLAD_PERCENTO = 3;
export const UDRZBA_RAST_ROCNE = 0.3;
export const UDRZBA_ZAKLAD_STROP = 8;
export const UDRZBA_NARAZOVY_BONUS = 4;
export const UDRZBA_NARAZOVY_STROP = 12;
export const UDRZBA_KAZDY_N_ROK = 3;
export const REALNYCH_HODIN_V_HERNOM_ROKU = 182.625 * 24; // ~4383 (1 herný rok = 6 reálnych mesiacov)

export function hernyRok(vekDni) {
  return Math.floor(vekDni / 182.625) + 1;
}

export function udrzbaPercento(rok) {
  const zaklad = Math.min(UDRZBA_ZAKLAD_STROP, UDRZBA_ZAKLAD_PERCENTO + UDRZBA_RAST_ROCNE * (rok - 1));
  const jeNarazovyRok = rok % UDRZBA_KAZDY_N_ROK === 0;
  if (jeNarazovyRok) return Math.min(UDRZBA_NARAZOVY_STROP, zaklad + UDRZBA_NARAZOVY_BONUS);
  return zaklad;
}

// Hory nemajú vlastný slot na ratrak/zasnežovanie — kompenzácia formou vyššej údržby (+50%)
export const UDRZBA_HORY_NAVYSENIE = 1.5;

export function udrzbaZaHodinuBudova(hodnotaBudovy, rok, zona, znackaMod = 1) {
  const percento = udrzbaPercento(rok) * (zona === "hory" ? UDRZBA_HORY_NAVYSENIE : 1) * znackaMod;
  const rocnaUdrzba = hodnotaBudovy * (percento / 100);
  return rocnaUdrzba / REALNYCH_HODIN_V_HERNOM_ROKU;
}

// --- Zasnežovanie: elektrina, len keď je zapnuté hráčom, vietor to dovoľuje, a je vhodný mesiac ---
export const ELEKTRIKA_ZASNEZOVANIE_ZA_HODINU = 127;
export const MESIACE_ZASNEZOVANIA = [10, 11, 0, 1]; // November - Február

// Palivo ratrakov — počíta sa len v zimných mesiacoch (v lete sa neupravuje)
export function palivoRatrakaZaHodinu(typ, mesiac) {
  if (!jeZimnyMesiac(mesiac)) return 0;
  return RATRAKY_TYPY[typ]?.palivoZaHodinu || 0;
}

export function jeMesiacZasnezovania(mesiac) {
  return MESIACE_ZASNEZOVANIA.includes(mesiac);
}

// --- Parkovisko: DENNÝ paušál za miesto (autá stoja celý deň, nie prietokový model ako vlek) ---
// 1 miesto = 2 osoby/auto. Obsadenosť = koľko z denného davu (z lanoviek) sa reálne zmestí.
// Vracia príjem prepočítaný NA HODINU (rozpočítaný z denného príjmu), aby sedel s existujúcim hodinovým akruálom.
export function prijemParkoviskaZaHodinu(kapacitaMiest, cenaZaMiesto, dennyDavLudi, referencnaCenaDnes) {
  const kapacitaLudi = kapacitaMiest * 2;
  const cenovyFaktor = referencnaCenaDnes ? Math.min(1, referencnaCenaDnes / Math.max(cenaZaMiesto, 1)) : 1;
  const efektivnyDav = dennyDavLudi * cenovyFaktor;
  const obsadenost = Math.min(1, efektivnyDav / Math.max(kapacitaLudi, 1));
  const obsadeneMiesta = kapacitaMiest * obsadenost;
  const dennyPrijem = obsadeneMiesta * cenaZaMiesto;
  return dennyPrijem / 24;
}

// --- Ubytovanie (penzión/hotel): DENNÝ paušál za osobu/noc, nie hodinový prietokový model ---
// Len časť denného davu chce prespať (zvyšok sú jednodňoví návštevníci)
export const PODIEL_CHCE_PRESPAT = 0.15;

export function prijemUbytovaniaZaHodinu(kapacitaLozok, cenaZaOsobu, dennyDavLudi, referencnaCenaDnes) {
  const chcePrespat = dennyDavLudi * PODIEL_CHCE_PRESPAT;
  const cenovyFaktor = referencnaCenaDnes ? Math.min(1, referencnaCenaDnes / Math.max(cenaZaOsobu, 1)) : 1;
  const efektivnyDopyt = chcePrespat * cenovyFaktor;
  const obsadenost = Math.min(1, efektivnyDopyt / Math.max(kapacitaLozok, 1));
  const obsadeneLozka = kapacitaLozok * obsadenost;
  const dennyPrijem = obsadeneLozka * cenaZaOsobu;
  return dennyPrijem / 24;
}


// --- Sezónne obmedzenie výstavby (zemné práce sa nedajú robiť v zasneženej zime) ---
// Parkovisko a hotel — len Apríl-Október (7 mesiacov, väčšie zemné práce)
export const SEZONNE_STAVBY_7_MESIACOV = ["parkovisko", "hotel"];
export const MESIACE_7 = [3, 4, 5, 6, 7, 8, 9]; // Apríl - Október

// Penzión a bufet — celý rok okrem najtvrdšej zimy (Dec-Feb), 9 mesiacov
export const SEZONNE_STAVBY_9_MESIACOV = ["penzion", "bar"];
export const MESIACE_9 = [2, 3, 4, 5, 6, 7, 8, 9, 10]; // Marec - November (vynechané Dec/Jan/Feb)

export function jeVhodnyMesiacNaStavbu(kategoria, mesiac) {
  if (SEZONNE_STAVBY_7_MESIACOV.includes(kategoria)) return MESIACE_7.includes(mesiac);
  if (SEZONNE_STAVBY_9_MESIACOV.includes(kategoria)) return MESIACE_9.includes(mesiac);
  return true; // vlek, lanovka, pokladňa atď. — bez obmedzenia mesiaca
}

// Vlek (a ostatné lanovky) sa dajú stavať celý rok, ale v zime (Dec-Feb) trvá výstavba 1,25× dlhšie
const ZIMNE_MESIACE_PREDLZENIE = [11, 0, 1]; // December, Január, Február
export const PREDLZENIE_VYSTAVBY_V_ZIME = 1.25;

export function faktorPredlzeniaVystavby(kategoria, mesiac) {
  if (kategoria !== "lanovka") return 1;
  return ZIMNE_MESIACE_PREDLZENIE.includes(mesiac) ? PREDLZENIE_VYSTAVBY_V_ZIME : 1;
}

// --- Prestavba, búranie a predaj budov ---

// Kategórie, ktoré sa dajú prestavať na vyšší typ (bez búrania, platíš plnú cenu novej)
export const PRESTAVITELNE_KATEGORIE = ["pokladna", "zasnezovanie", "servis", "hotel", "parkovisko"];

// Kategórie, ktoré sa musia zbúrať (búranie stojí % z ceny)
export const BURATELNE_KATEGORIE = ["lanovka"];

// Kategórie, ktoré sa dajú predať za zostatkovú cenu
export const PREDAJNE_KATEGORIE = ["ratrak"];

export const CENA_BURANIA_PERCENTO = 10;

// Zostatková cena pri predaji — 50 % nová, −10 % za každý herný rok, minimum 20 %
export function zostatkovaCena(povodnaCena, vekDni) {
  const roky = Math.floor(vekDni / 182.625);
  const percento = Math.max(20, 50 - roky * 10);
  return Math.round(povodnaCena * (percento / 100));
}

export function cenaBurania(kategoria, typ, znacka) {
  return Math.round(cenaBudovy(kategoria, typ, znacka) * (CENA_BURANIA_PERCENTO / 100));
}

// Na aké typy sa dá daná budova prestavať (len drahšie v rámci tej istej kategórie)
export function moznostiPrestavby(kategoria, aktualnyTyp) {
  if (!PRESTAVITELNE_KATEGORIE.includes(kategoria)) return [];
  const katalog = KATEGORIE[kategoria]?.katalog || {};
  const aktualnaCena = katalog[aktualnyTyp]?.zakladnaCena || 0;
  return Object.keys(katalog).filter((t) => (katalog[t]?.zakladnaCena || 0) > aktualnaCena);
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
