import { jeZimnyMesiac } from "./katalog";

// Typy počasia s pravdepodobnosťou výskytu — rozdielne pre zimu a leto
const TYPY_POCASIA_ZIMA = [
  { typ: "slnecno", ikona: "☀️", nazov: "Slnečno", vaha: 25 },
  { typ: "zamracene", ikona: "☁️", nazov: "Zamračené", vaha: 30 },
  { typ: "polojasno", ikona: "⛅", nazov: "Polojasno", vaha: 15 },
  { typ: "snezi", ikona: "🌨️", nazov: "Sneží", vaha: 25 },
  { typ: "prsi", ikona: "🌧️", nazov: "Prší", vaha: 5 },
];

const TYPY_POCASIA_LETO = [
  { typ: "slnecno", ikona: "☀️", nazov: "Slnečno", vaha: 35 },
  { typ: "zamracene", ikona: "☁️", nazov: "Zamračené", vaha: 25 },
  { typ: "polojasno", ikona: "⛅", nazov: "Polojasno", vaha: 20 },
  { typ: "prsi", ikona: "🌧️", nazov: "Prší", vaha: 20 },
];

// Júl a august (herný čas) — pridáva sa búrka (4 %), ostatné typy sa proporčne zmenšia, aby súčet ostal 100 %
const TYPY_POCASIA_LETO_JUL_AUG = [
  { typ: "slnecno", ikona: "☀️", nazov: "Slnečno", vaha: 34 },
  { typ: "zamracene", ikona: "☁️", nazov: "Zamračené", vaha: 24 },
  { typ: "polojasno", ikona: "⛅", nazov: "Polojasno", vaha: 19 },
  { typ: "prsi", ikona: "🌧️", nazov: "Prší", vaha: 19 },
  { typ: "burka", ikona: "⛈️", nazov: "Búrka", vaha: 4 },
];

// Nízke pásma vetra (0-20 m/s) — najvyššie pásmo (20-30) riešime cez kategórie "silného vetra" nižšie
const PASMA_VETRA_NIZKE_ZIMA = [
  { min: 0, max: 5, vaha: 45 },
  { min: 5, max: 15, vaha: 33 },
  { min: 15, max: 20, vaha: 22 },
];

const PASMA_VETRA_NIZKE_LETO = [
  { min: 0, max: 5, vaha: 45 },
  { min: 5, max: 15, vaha: 34 },
  { min: 15, max: 20, vaha: 21 },
];

// Kategórie "silného vetra" pre celý deň — určujú VZOR, nie len náhodné hodnoty na každý čas zvlášť
const SILNY_VIETOR_ZIMA = [
  { typ: "ziadny", vaha: 96 },
  { typ: "cely_den", vaha: 2 },
  { typ: "od_12", vaha: 1 },
  { typ: "do_12", vaha: 1 },
];

const SILNY_VIETOR_LETO = [
  { typ: "ziadny", vaha: 98 },
  { typ: "cely_den", vaha: 1 },
  { typ: "od_12", vaha: 0.5 },
  { typ: "do_12", vaha: 0.5 },
];

export const VIETOR_ZATVARA_LANOVKY_OD = 20; // m/s — len na vizuálne zobrazenie na paneli

// Pevné percentá dopadu na lanovky — búrka je kratšia (-25 %), silný vietor môže trvať dlhšie (-66 %)
const LANOVKY_MULT_BURKA = 0.75;
const LANOVKY_MULT_SILNY_VIETOR = 1 / 3;

function seedZoStringu(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seedRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function datumNaKluc(datum) {
  return `${datum.getFullYear()}-${datum.getMonth()}-${datum.getDate()}`;
}

function vyberZoZoznamu(zoznam, nahodneCislo0az100) {
  let akumulator = 0;
  for (const polozka of zoznam) {
    akumulator += polozka.vaha;
    if (nahodneCislo0az100 <= akumulator) return polozka;
  }
  return zoznam[zoznam.length - 1];
}

function vysokyVietor(seed) {
  return 20 + seedRandom(seed) * 10;
}

function nizkyVietor(pasma, seed) {
  const pasmo = vyberZoZoznamu(pasma, seedRandom(seed) * 100);
  return pasmo.min + seedRandom(seed + 1) * (pasmo.max - pasmo.min);
}

// Spoločný "stav dňa" — typ počasia a vzor vetra sú NEZÁVISLÉ javy (búrka je kratšia, silný vietor môže trvať celý deň)
function urciDennyStav(datum) {
  const kluc = datumNaKluc(datum);
  const zima = jeZimnyMesiac(datum.getMonth());
  const julAlebeAugust = !zima && (datum.getMonth() === 6 || datum.getMonth() === 7);
  const typyPocasia = zima ? TYPY_POCASIA_ZIMA : julAlebeAugust ? TYPY_POCASIA_LETO_JUL_AUG : TYPY_POCASIA_LETO;
  const pasmaNizke = zima ? PASMA_VETRA_NIZKE_ZIMA : PASMA_VETRA_NIZKE_LETO;
  const kategorieVetra = zima ? SILNY_VIETOR_ZIMA : SILNY_VIETOR_LETO;

  const seedKombo = seedZoStringu(kluc + "kombo");
  const jeVzacnaKombinacia = seedRandom(seedKombo) < 0.005;

  let typDna;
  if (jeVzacnaKombinacia) {
    typDna = typyPocasia[0]; // slnečno
  } else {
    const seedTyp = seedZoStringu(kluc + "typ");
    typDna = vyberZoZoznamu(typyPocasia, seedRandom(seedTyp) * 100);
  }

  const jeBurka = typDna.typ === "burka";

  const seedVietorKat = seedZoStringu(kluc + "vietorkat");
  const kategoriaVetra = jeVzacnaKombinacia ? { typ: "cely_den" } : vyberZoZoznamu(kategorieVetra, seedRandom(seedVietorKat) * 100);
  const jeSilnyVietor = jeVzacnaKombinacia || kategoriaVetra.typ !== "ziadny";

  return { kluc, zima, typDna, jeVzacnaKombinacia, jeBurka, kategoriaVetra, jeSilnyVietor, pasmaNizke };
}

// Pevný multiplikátor na príjem z lanoviek pre daný deň — búrka -25 %, silný vietor -66 %, inak normálne
export function lanovkovyMultiplikatorDna(datum) {
  const { jeBurka, jeSilnyVietor } = urciDennyStav(datum);
  if (jeBurka) return LANOVKY_MULT_BURKA;
  if (jeSilnyVietor) return LANOVKY_MULT_SILNY_VIETOR;
  return 1;
}

// Parkoviská reagujú len na vietor (nie búrku) — a inak než lanovky:
// ľudia prídu ráno, kým je pokoj, a zaplatia hneď pri príchode
export function parkoviskovyMultiplikatorDna(datum) {
  const { kategoriaVetra } = urciDennyStav(datum);
  if (kategoriaVetra.typ === "cely_den") return 0; // nikto neprišiel celý deň
  if (kategoriaVetra.typ === "do_12") return 1 / 3; // fúkalo ráno, prišla len tretina
  return 1; // "od_12" alebo pokoj — ráno v pohode prišli a zaplatili, aj keby poobede fúkalo
}

// Vráti počasie pre celý deň (3 vzorky: 08:00/12:00/15:00) — len na zobrazenie, ekonomika používa lanovkovyMultiplikatorDna
export function vypocitajDenoePocasie(datum) {
  const { kluc, zima, typDna, jeVzacnaKombinacia, jeBurka, kategoriaVetra, jeSilnyVietor, pasmaNizke } = urciDennyStav(datum);

  const zakladnaTeplota = zima ? seedRandom(seedZoStringu(kluc + "t")) * 8 - 8 : seedRandom(seedZoStringu(kluc + "t")) * 16 + 12;

  const casy = [
    { cas: "08:00", teplotaOffset: -3, poradie: 0 },
    { cas: "12:00", teplotaOffset: 2, poradie: 1 },
    { cas: "15:00", teplotaOffset: 0, poradie: 2 },
  ];

  const zaznamy = casy.map((c, i) => {
    const seedVietor = seedZoStringu(kluc + "vietor" + i);
    let vietor;
    if (kategoriaVetra.typ === "cely_den") {
      vietor = vysokyVietor(seedVietor);
    } else if (kategoriaVetra.typ === "od_12") {
      vietor = c.poradie === 0 ? nizkyVietor(pasmaNizke, seedVietor) : vysokyVietor(seedVietor);
    } else if (kategoriaVetra.typ === "do_12") {
      vietor = c.poradie === 0 ? vysokyVietor(seedVietor) : nizkyVietor(pasmaNizke, seedVietor);
    } else {
      vietor = nizkyVietor(pasmaNizke, seedVietor);
    }
    vietor = Math.max(0, Math.round(vietor));

    return {
      cas: c.cas,
      ikona: typDna.ikona,
      nazov: jeVzacnaKombinacia ? "Slnečno, silný vietor" : typDna.nazov,
      teplota: Math.round(zakladnaTeplota + c.teplotaOffset),
      vietor,
      lanovkyZatvorene: vietor >= VIETOR_ZATVARA_LANOVKY_OD,
      jeBurka,
      jeSilnyVietor,
    };
  });

  return zaznamy;
}
