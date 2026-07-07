// Herný svet beží 2x rýchlejšie ako reálny čas.
// "Herný deň 1" (00:00) sa zhoduje s týmto reálnym okamihom — spoločný "začiatok sveta" pre všetkých hráčov.
export const EPOCH = new Date(2026, 6, 7, 0, 0, 0); // 7. júl 2026, 00:00 reálneho času

// Prepočíta reálny dátum na herný (beží 2x rýchlejšie od EPOCH)
export function hernyDatum(realDatum = new Date()) {
  const elapsedMs = realDatum.getTime() - EPOCH.getTime();
  return new Date(EPOCH.getTime() + elapsedMs * 2);
}

// Opačný smer — z herného dátumu (napr. budúci "herný 31. január") vypočíta reálny okamih,
// kedy táto chvíľa v hernom svete skutočne nastane. Používa sa na ukladanie termínov do DB.
export function realDatumZHerneho(hernyCielovyDatum) {
  const hernyElapsedMs = hernyCielovyDatum.getTime() - EPOCH.getTime();
  return new Date(EPOCH.getTime() + hernyElapsedMs / 2);
}
