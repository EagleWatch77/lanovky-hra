export function vytvorNotifikacie(budovy, efektivitaBudovy, stanica) {
  const notifikacie = [];
  const hotove = budovy.filter((b) => b.stav === "hotovo");

  for (const b of hotove) {
    const ef = efektivitaBudovy(b);
    if (ef < 0.9) {
      notifikacie.push({
        typ: "varovanie",
        text: `${b.typ} beží na ${Math.round(ef * 100)} % — chýbajú zamestnanci alebo trvá trest po odmietnutí zvýšenia platu`,
      });
    }
  }

  const teraz = new Date();
  const doDecembra = new Date(teraz.getFullYear(), 11, 23) - teraz;
  const dniDoDecembra = Math.ceil(doDecembra / (1000 * 60 * 60 * 24));
  if (dniDoDecembra > 0 && dniDoDecembra <= 14) {
    notifikacie.push({ typ: "info", text: `O ${dniDoDecembra} dní sa otvorí vyjednávanie o plat (23.-31.12.)` });
  }

  if (stanica && stanica.peniaze < 50000) {
    notifikacie.push({ typ: "varovanie", text: "Zostatok klesol pod 50 000 € — pozor na prevádzkové náklady" });
  }

  const NAZVY_KATEGORII = { bar: "Bary", parkovisko: "Parkoviská", hotel: "Hotely", servis: "Servis a požičovňa" };
  for (const kat of Object.keys(NAZVY_KATEGORII)) {
    const stlpec = "konkurencia_" + kat;
    if (stanica && stanica[stlpec]) {
      const mam = hotove.some((b) => b.kategoria === kat);
      notifikacie.push({
        typ: mam ? "info" : "varovanie",
        text: mam
          ? `Konkurencia v kategórii ${NAZVY_KATEGORII[kat]} — trvalo -10% dopytu`
          : `V stredisku je záujem o ${NAZVY_KATEGORII[kat]} — objavila sa konkurencia, kým to nepostavíš, budeš mať pri budúcej stavbe trvalo nižší dopyt`,
      });
    }
  }

  return notifikacie.slice(0, 5);
}
