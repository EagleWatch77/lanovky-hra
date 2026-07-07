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

export const VIETOR_ZATVARA_LANOVKY_OD = 20; // m/s

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

// Vráti počasie pre celý deň — jeden typ počasia + jeden vzor vetra (mení sa každý deň)
export function vypocitajDenoePocasie(datum) {
  const kluc = datumNaKluc(datum);
  const zima = jeZimnyMesiac(datum.getMonth());
  const typyPocasia = zima ? TYPY_POCASIA_ZIMA : TYPY_POCASIA_LETO;
  const pasmaNizke = zima ? PASMA_VETRA_NIZKE_ZIMA : PASMA_VETRA_NIZKE_LETO;
  const kategorieVetra = zima ? SILNY_VIETOR_ZIMA : SILNY_VIETOR_LETO;

  // Zriedkavá kombinácia: slnečno + silný vietor celý deň (cca 0,5 % dní)
  const seedKombo = seedZoStringu(kluc + "kombo");
  const jeVzacnaKombinacia = seedRandom(seedKombo) < 0.005;

  let typDna;
  if (jeVzacnaKombinacia) {
    typDna = typyPocasia[0]; // slnečno
  } else {
    const seedTyp = seedZoStringu(kluc + "typ");
    typDna = vyberZoZoznamu(typyPocasia, seedRandom(seedTyp) * 100);
  }

  const zakladnaTeplota = zima ? seedRandom(seedZoStringu(kluc + "t")) * 8 - 8 : seedRandom(seedZoStringu(kluc + "t")) * 16 + 12;

  // Vzor silného vetra pre tento deň: žiadny / celý deň / od 12:00 / do 12:00
  const seedVietorKat = seedZoStringu(kluc + "vietorkat");
  const kategoriaVetra = jeVzacnaKombinacia ? { typ: "cely_den" } : vyberZoZoznamu(kategorieVetra, seedRandom(seedVietorKat) * 100);

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
    };
  });

  return zaznamy;
}

// Reprezentatívna hodnota pre výpočet ekonomiky za daný deň (poludňajší záznam)
export function jeDnesVietorNaZatvorenieLanoviek(datum) {
  const pocasie = vypocitajDenoePocasie(datum);
  const poludnajsi = pocasie.find((p) => p.cas === "12:00");
  return poludnajsi ? poludnajsi.lanovkyZatvorene : false;
}

// Podiel dňa, kedy lanovky fungujú — odhad z 3 vzoriek (08:00/12:00/15:00)
// napr. ak stoja len ráno a poobede fungujú, vráti 2/3 (0.667) namiesto tvrdého 0/1
export function podielOtvorenychLanoviek(datum) {
  const pocasie = vypocitajDenoePocasie(datum);
  const otvorene = pocasie.filter((p) => !p.lanovkyZatvorene).length;
  return otvorene / pocasie.length;
}
