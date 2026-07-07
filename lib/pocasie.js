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

// Pásma sily vetra (m/s) s pravdepodobnosťou — v zime fúka častejšie silno ako v lete
const PASMA_VETRA_ZIMA = [
  { min: 0, max: 5, vaha: 43 },
  { min: 5, max: 15, vaha: 32 },
  { min: 15, max: 20, vaha: 21 },
  { min: 20, max: 30, vaha: 4 },
];

const PASMA_VETRA_LETO = [
  { min: 0, max: 5, vaha: 44 },
  { min: 5, max: 15, vaha: 33 },
  { min: 15, max: 20, vaha: 21 },
  { min: 20, max: 30, vaha: 2 },
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

function vypocitajVietor(pasma, seed, offsetCasu) {
  const pasmo = vyberZoZoznamu(pasma, seedRandom(seed) * 100);
  const vRamciPasma = seedRandom(seed + 1) * (pasmo.max - pasmo.min);
  const hodnota = pasmo.min + vRamciPasma + offsetCasu;
  return Math.max(0, Math.round(hodnota));
}

// Vráti počasie pre celý deň — jeden typ počasia (mení sa každý deň), vietor a teplota sa mierne líšia podľa času
export function vypocitajDenoePocasie(datum) {
  const kluc = datumNaKluc(datum);
  const zima = jeZimnyMesiac(datum.getMonth());
  const typyPocasia = zima ? TYPY_POCASIA_ZIMA : TYPY_POCASIA_LETO;
  const pasmaVetra = zima ? PASMA_VETRA_ZIMA : PASMA_VETRA_LETO;

  // Zriedkavá kombinácia: slnečno + silný vietor (cca 0,5 % dní)
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

  const casy = [
    { cas: "08:00", teplotaOffset: -3, vietorOffset: 1 },
    { cas: "12:00", teplotaOffset: 2, vietorOffset: 0 },
    { cas: "15:00", teplotaOffset: 0, vietorOffset: -1 },
  ];

  const zaznamy = casy.map((c, i) => {
    const seedVietor = seedZoStringu(kluc + "vietor" + i);
    let vietor = jeVzacnaKombinacia ? 20 + Math.round(seedRandom(seedVietor) * 10) : vypocitajVietor(pasmaVetra, seedVietor, c.vietorOffset);
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
