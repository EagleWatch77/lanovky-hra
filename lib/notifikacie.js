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

  return notifikacie.slice(0, 5);
}
