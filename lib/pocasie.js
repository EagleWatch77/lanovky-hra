import { jeZimnyMesiac } from "./katalog";

const TYPY_ZIMA = [
  { typ: "slnecno", ikona: "☀️", nazov: "Slnečno" },
  { typ: "polooblacno", ikona: "⛅", nazov: "Polooblačno" },
  { typ: "oblacno", ikona: "☁️", nazov: "Oblačno" },
  { typ: "snezenie", ikona: "🌨️", nazov: "Sneženie" },
];

const TYPY_LETO = [
  { typ: "slnecno", ikona: "☀️", nazov: "Slnečno" },
  { typ: "polooblacno", ikona: "⛅", nazov: "Polooblačno" },
  { typ: "oblacno", ikona: "☁️", nazov: "Oblačno" },
  { typ: "dazd", ikona: "🌧️", nazov: "Dážď" },
];

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

export function vypocitajDenoePocasie(datum) {
  const kluc = datumNaKluc(datum);
  const zima = jeZimnyMesiac(datum.getMonth());
  const typy = zima ? TYPY_ZIMA : TYPY_LETO;

  const zakladnaTeplota = zima ? seedRandom(seedZoStringu(kluc + "t")) * 8 - 8 : seedRandom(seedZoStringu(kluc + "t")) * 16 + 12;
  const zakladnyVietor = Math.round(seedRandom(seedZoStringu(kluc + "v")) * 25);

  const casy = [
    { cas: "08:00", teplotaOffset: -3, vietorOffset: 2 },
    { cas: "12:00", teplotaOffset: 2, vietorOffset: 0 },
    { cas: "15:00", teplotaOffset: 0, vietorOffset: -2 },
  ];

  return casy.map((c, i) => {
    const indexTypu = Math.floor(seedRandom(seedZoStringu(kluc + "typ" + i)) * typy.length);
    const pocasie = typy[indexTypu];
    return {
      cas: c.cas,
      ikona: pocasie.ikona,
      nazov: pocasie.nazov,
      teplota: Math.round(zakladnaTeplota + c.teplotaOffset),
      vietor: Math.max(0, zakladnyVietor + c.vietorOffset),
    };
  });
}
