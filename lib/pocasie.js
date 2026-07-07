import { jeZimnyMesiac } from "./katalog";

// Typy počasia s pravdepodobnosťou výskytu (spolu 100%)
const TYPY_POCASIA = [
  { typ: "slnecno", ikona: "☀️", nazov: "Slnečno", vaha: 30 },
  { typ: "zamracene", ikona: "☁️", nazov: "Zamračené", vaha: 35 },
  { typ: "polojasno", ikona: "⛅", nazov: "Polojasno", vaha: 15 },
  { typ: "prsi", ikona: "🌧️", nazov: "Prší", vaha: 10 },
  { typ: "snezi", ikona: "🌨️", nazov: "Sneží", vaha: 10 },
];

// Pásma sily vetra (m/s) s pravdepodobnosťou
const PASMA_VETRA = [
  { min: 0, max: 5, vaha: 40 },
  { min: 5, max: 15, vaha: 30 },
  { min: 15, max: 20, vaha: 20 },
  { min: 20, max: 30, vaha: 10 },
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

function vypocitajVietor(seed, offsetCasu) {
  const pasmo = vyberZoZoznamu(PASMA_VETRA, seedRandom(seed) * 100);
  const vRamciPasma = seedRandom(seed + 1) * (pasmo.max - pasmo.min);
  const hodnota = pasmo.min + vRamciPasma + offsetCasu;
  return Math.max(0, Math.round(hodnota));
}

// Vráti počasie pre celý deň — jeden typ počasia (mení sa každý deň), vietor a teplota sa mierne líšia podľa času
export function vypocitajDenoePocasie(datum) {
  const kluc = datumNaKluc(datum);
  const zima = jeZimnyMesiac(datum.getMonth());

  // Zriedkavá kombinácia: slnečno + silný vietor (cca 0,5 % dní)
  const seedKombo = seedZoStringu(kluc + "kombo");
  const jeVzacnaKombinacia = seedRandom(seedKombo) < 0.005;

  let typDna;
  if (jeVzacnaKombinacia) {
    typDna = TYPY_POCASIA[0]; // slnečno
  } else {
    const seedTyp = seedZoStringu(kluc + "typ");
    typDna = vyberZoZoznamu(TYPY_POCASIA, seedRandom(seedTyp) * 100);
  }

  const zakladnaTeplota = zima ? seedRandom(seedZoStringu(kluc + "t")) * 8 - 8 : seedRandom(seedZoStringu(kluc + "t")) * 16 + 12;

  const casy = [
    { cas: "08:00", teplotaOffset: -3, vietorOffset: 1 },
    { cas: "12:00", teplotaOffset: 2, vietorOffset: 0 },
    { cas: "15:00", teplotaOffset: 0, vietorOffset: -1 },
  ];

  const zaznamy = casy.map((c, i) => {
    const seedVietor = seedZoStringu(kluc + "vietor" + i);
    let vietor = jeVzacnaKombinacia ? 20 + Math.round(seedRandom(seedVietor) * 10) : vypocitajVietor(seedVietor, c.vietorOffset);
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
