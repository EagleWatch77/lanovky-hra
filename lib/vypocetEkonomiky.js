// Jadro ekonomiky — vypočíta a ULOŽÍ všetko pre JEDNU stanicu.
// Volateľné z appky (useGameState.js, cez browser supabase klienta) AJ zo servera (api/tick, cez service role klienta).
import {
  KATEGORIE,
  vystavbaVRealnychDnoch,
  cenaBudovy,
  prestizBudovy,
  zamestnanciPotrebni,
  efektivitaZamestnancov,
  prijemZaHodinu,
  turistiZaHodinu,
  PLAT_ZA_HODINU,
  CENA_NAJATIA,
  PRVA_POZIADAVKA_PERCENTO,
  EFEKTIVITA_PRI_ODMIETNUTI,
  dalsiaPoziadavka,
  efektivitaPriVlastnomNavrhu,
  KONKURENCIA_ZONY_KONFIG,
  KONKURENCIA_VYSTAVBA_MESIACOV,
  VEK_PRE_KONKURENCIU_DNI,
  konkurencnyMultiplikator,
  konkurencnaPrestiz,
  sezonaIndex,
  jeZimnyMesiac,
  jeMedzisezona,
  NIZKA_HOTOVOST,
  GRACE_DNI_PRED_UPADKOM,
  DENNY_UPADOK_PRESTIZE,
  ZONY,
  globalnyCenovyMultiplikator,
  skutocnaReferencnaCena,
  referencnaCenaSkipasu,
  aktualnaCenaSkipasu,
  idealnaPrevadzkaHodin,
  prevadzkovyFaktor,
  KATEGORIE_S_PREVADZKOU,
  dobaVHodinach,
  dennaSpokojnostLuka,
  pokladnaSpokojnostBonus,
  preplnenieFaktor,
  prijemParkoviskaZaHodinu,
  prijemUbytovaniaZaHodinu,
  efektivnaPrestizProLigu,
  vypocitajKvotuZony,
  vyberLiguHracov,
  jeVlekMimoSezony,
  hernyRok,
  rocnyCyklusIndex,
  udrzbaZaHodinuBudova,
  udrzbaModZnacky,
  kapacitaBudovy,
  ELEKTRIKA_ZASNEZOVANIE_ZA_HODINU,
   palivoRatrakaZaHodinu,
  chraneneMesiaceZasnezovania,
  ZASNEZOVANIE_TYPY,
  jeMesiacZasnezovania,
  vypocitajSpokojnostStrediska,
} from "./katalog";
import { lanovkovyMultiplikatorDna, parkoviskovyMultiplikatorDna, zasnezovanieFunguje, jeBurkaDnes, jeSilnyVietorDnes } from "./pocasie";
import { hernyDatum, realDatumZHerneho } from "./hernyCas";

export async function spracujStanicu(supabase, stanicaId) {
  let { data: st } = await supabase.from("stanice").select("*").eq("id", stanicaId).single();
  if (!st) return null;

  const { data: bud } = await supabase.from("budovy").select("*").eq("stanica_id", st.id);
  let budovyData = bud || [];

  const teraz = new Date();
  const hDatum = hernyDatum(teraz);

  const dokoncene = [];
  let nakladyNaNajatie = 0;
  const nakladyNajatiaPodKategorii = {};
  for (const b of budovyData) {
    if (b.stav === "vo_vystavbe" && new Date(b.koniec_vystavby) <= teraz) {
      dokoncene.push(b);
    }
  }
  for (const b of dokoncene) {
    if (b.bobova_draha_vo_vystavbe) {
      await supabase.from("budovy").update({ stav: "hotovo", bobova_draha: true, bobova_draha_vo_vystavbe: false }).eq("id", b.id);
      continue;
    }
    const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
    await supabase.from("budovy").update({ stav: "hotovo", zamestnanci_pridelenych: potrebnyB }).eq("id", b.id);
    const nakladyB = potrebnyB * CENA_NAJATIA;
    nakladyNaNajatie += nakladyB;
    nakladyNajatiaPodKategorii[b.kategoria] = (nakladyNajatiaPodKategorii[b.kategoria] || 0) + nakladyB;
  }
  if (dokoncene.length > 0) {
    const dokonceneId = dokoncene.map((b) => b.id);
    budovyData = budovyData.map((b) => {
      if (!dokonceneId.includes(b.id)) return b;
      if (b.bobova_draha_vo_vystavbe) {
        return { ...b, stav: "hotovo", bobova_draha: true, bobova_draha_vo_vystavbe: false };
      }
      return { ...b, stav: "hotovo", zamestnanci_pridelenych: zamestnanciPotrebni(b.kategoria, b.typ) };
    });
  }
  const posledna = new Date(st.last_update);
  let hodin = (teraz - posledna) / (1000 * 60 * 60);
  hodin = Math.min(Math.max(hodin, 0), 72);

  const hotoveTeraz = budovyData.filter((b) => b.stav === "hotovo");
  const efektivnyBonus = new Date(st.efektivita_bonus_do) >= teraz ? (st.efektivita_bonus ?? 1) : 1;
  const { data: konk } = await supabase.from("konkurencia").select("*").eq("stanica_id", st.id);
  let konkurenciaData = konk || [];

  const dokonceneKonk = konkurenciaData.filter((k) => k.stav === "vo_vystavbe" && new Date(k.koniec_vystavby) <= teraz);
  if (dokonceneKonk.length > 0) {
    const idsKonk = dokonceneKonk.map((k) => k.id);
    await supabase.from("konkurencia").update({ stav: "hotovo" }).in("id", idsKonk);
    konkurenciaData = konkurenciaData.map((k) => (idsKonk.includes(k.id) ? { ...k, stav: "hotovo" } : k));
  }

  const vekDni = (teraz - new Date(st.created_at)) / (1000 * 60 * 60 * 24);
  const sezonaTeraz = sezonaIndex(hDatum);
  if (vekDni >= VEK_PRE_KONKURENCIU_DNI && st.posledna_sezona_konkurencie !== sezonaTeraz) {
    const jeLeto = !jeZimnyMesiac(hDatum.getMonth());
    for (const zona of Object.keys(KONKURENCIA_ZONY_KONFIG)) {
      for (const kat of Object.keys(KONKURENCIA_ZONY_KONFIG[zona])) {
        const cfg = KONKURENCIA_ZONY_KONFIG[zona][kat];
        if (cfg.sezonne && !jeLeto) continue;
        const mam = hotoveTeraz.some((b) => b.kategoria === kat && b.zona === zona);
        const existujucichJednotiek = konkurenciaData.filter((k) => k.kategoria === kat && k.zona === zona).length;
        if (!mam && existujucichJednotiek < cfg.max) {
          const dniVystavbyKonk = vystavbaVRealnychDnoch(KONKURENCIA_VYSTAVBA_MESIACOV[kat]);
          const koniecKonk = new Date(teraz.getTime() + dniVystavbyKonk * 24 * 60 * 60 * 1000);
          const { data: novaKonk } = await supabase
            .from("konkurencia")
            .insert({ stanica_id: st.id, kategoria: kat, zona, stav: "vo_vystavbe", koniec_vystavby: koniecKonk.toISOString() })
            .select()
            .single();
          if (novaKonk) konkurenciaData = [...konkurenciaData, novaKonk];
        }
      }
    }
    const { data: stPoSezone } = await supabase
      .from("stanice")
      .update({ posledna_sezona_konkurencie: sezonaTeraz })
      .eq("id", st.id)
      .select()
      .single();
    st = stPoSezone ?? { ...st, posledna_sezona_konkurencie: sezonaTeraz };
  }

  const pocetKonkurencie = {};
  for (const k of konkurenciaData) {
    if (k.stav === "hotovo") {
      const kluc = `${k.zona}:${k.kategoria}`;
      pocetKonkurencie[kluc] = (pocetKonkurencie[kluc] || 0) + 1;
    }
  }

const hernyDenKluc = `${hDatum.getFullYear()}-${hDatum.getMonth()}-${hDatum.getDate()}`;
  let zakladnyDennyPocetTuristov = st.denny_pocet_turistov || 0;
  if (st.posledny_herny_den !== hernyDenKluc) {
    zakladnyDennyPocetTuristov = 0;
    const { data: stPoNovomDni } = await supabase
      .from("stanice")
      .update({ denny_pocet_turistov: 0, posledny_herny_den: hernyDenKluc })
      .eq("id", st.id)
      .select()
      .single();
    st = stPoNovomDni ?? { ...st, denny_pocet_turistov: 0, posledny_herny_den: hernyDenKluc };
  }

  const aktualnyCyklus = rocnyCyklusIndex(hDatum);
  let zakladnaSezonnaPrestiz = st.sezonna_prestiz_turisti || 0;
  if (st.posledny_rocny_cyklus !== aktualnyCyklus) {
    const jePrvyKrat = st.posledny_rocny_cyklus == null;
    zakladnaSezonnaPrestiz = 0;
    const { data: stPoResete } = await supabase
      .from("stanice")
      .update({ sezonna_prestiz_turisti: 0, posledny_rocny_cyklus: aktualnyCyklus })
      .eq("id", st.id)
      .select()
      .single();
    st = stPoResete ?? { ...st, sezonna_prestiz_turisti: 0, posledny_rocny_cyklus: aktualnyCyklus };
    if (!jePrvyKrat) {
      await supabase.from("spravy").insert({
        od_stanica_id: st.id,
        komu_stanica_id: st.id,
        text: "🔄 Nová sezóna začína! Tvoja sezónna prestíž z turistov bola vynulovaná — poďme na nový rok. Skontroluj si ceny v okne Ceny, referenčné ceny sa zmenili podľa sezóny.",
        predmet: "Nová sezóna",
      });
    }
  }
const globalnyMult = globalnyCenovyMultiplikator(st, hotoveTeraz);
  const zasnezovacieBudovy = hotoveTeraz.filter((b) => b.kategoria === "zasnezovanie");
  const maZasnezovacieBudovy = zasnezovacieBudovy.length > 0;
  const zasnezovanieZapnute = zasnezovacieBudovy.some((b) => b.zasnezovanie_zapnute);
  const dovolujeVietor = zasnezovanieFunguje(hDatum);
    const zasnezovanieBezi = maZasnezovacieBudovy && zasnezovanieZapnute && dovolujeVietor;
  // Set mesiacov, ktoré hráčovi chráni jeho typ zasnežovania (prázdny, ak nebeží)
  const maZasnezovanie = zasnezovanieBezi ? chraneneMesiaceZasnezovania(hotoveTeraz) : new Set();

  const jeBurka = jeBurkaDnes(hDatum);
  const jeSilnyVietor = jeSilnyVietorDnes(hDatum);
    
  // Prvý priechod — bez dát o zónach (potrebujeme spokojnosť na výpočet turistov)
  const spokojnostPrvy = vypocitajSpokojnostStrediska(hotoveTeraz, st, hDatum, globalnyMult, maZasnezovanie, jeBurka, jeSilnyVietor);
  let spokojnostVysledok = spokojnostPrvy;
  const spokojnostLuka = spokojnostVysledok.spolu / 100;
  const spokojnostRozpis = spokojnostVysledok;
  const maPokladnu = hotoveTeraz.some((b) => b.kategoria === "pokladna");
  const pokladnaFaktor = maPokladnu ? 1 : 0.5;

  const { data: ligaData } = await supabase.from("liga_udaje").select("*");
  const vsetkyStanice = ligaData || [];
  const mojaLiga = vyberLiguHracov(st.id, st.created_at, vsetkyStanice);

  function sucetEfektivnejPrestizeZona(filterFn) {
    return mojaLiga.filter(filterFn).reduce((sum, s) => {
      const vekS = (teraz - new Date(s.created_at)) / (1000 * 60 * 60 * 24);
      return sum + efektivnaPrestizProLigu(s.prestiz, vekS);
    }, 0);
  }

  const sucetLuka = sucetEfektivnejPrestizeZona(() => true);
  const sucetUdolie = sucetEfektivnejPrestizeZona((s) => s.udolie_odomknute);
  const sucetHory = sucetEfektivnejPrestizeZona((s) => s.hory_odomknute);
  const vlastnaEfektivnaPrestiz = efektivnaPrestizProLigu(st.prestiz, vekDni);

  const kvoty = {
    luka: vypocitajKvotuZony(vlastnaEfektivnaPrestiz, sucetLuka, "luka"),
    udolie: st.udolie_odomknute ? vypocitajKvotuZony(vlastnaEfektivnaPrestiz, sucetUdolie, "udolie") : 0,
    hory: st.hory_odomknute ? vypocitajKvotuZony(vlastnaEfektivnaPrestiz, sucetHory, "hory") : 0,
  };

  const jeStrediskoZatvorene = jeMedzisezona(hDatum);
  const zonaDennyDav = {};
  const turistiInfo = {};
  const rozpisTuristovPodBudov = [];
  for (const b of hotoveTeraz) {
    if (b.kategoria === "lanovka" && b.cena) {
      const infoB = KATEGORIE.lanovka.katalog[b.typ];
      if (jeStrediskoZatvorene || jeVlekMimoSezony(b.typ, hDatum.getMonth(), b.bobova_draha)) {
        turistiInfo[b.id] = { turistiSkutocneB: 0, spokojnostFaktorB: 0 };
        rozpisTuristovPodBudov.push({ nazov: infoB?.nazov || b.typ, kapacita: infoB?.kapacita || 0, turistiZaHodinu: 0 });
    } else {
        const refCenaB = referencnaCenaSkipasu(hotoveTeraz, hDatum, globalnyMult, maZasnezovanie);
        const cenaSkipasu = aktualnaCenaSkipasu(st, hDatum.getMonth());
        const turistiZakladneB = turistiZaHodinu(b.kategoria, b.typ, cenaSkipasu, refCenaB, b.znacka);
        let spokojnostFaktorB = spokojnostLuka;
        spokojnostFaktorB *= preplnenieFaktor(refCenaB, cenaSkipasu);
        const turistiSkutocneB = turistiZakladneB * spokojnostFaktorB;
        turistiInfo[b.id] = { turistiSkutocneB, spokojnostFaktorB };
        zonaDennyDav[b.zona] = (zonaDennyDav[b.zona] || 0) + turistiSkutocneB;
        rozpisTuristovPodBudov.push({ nazov: infoB?.nazov || b.typ, kapacita: kapacitaBudovy(b.kategoria, b.typ, b.znacka), turistiZaHodinu: Math.round(turistiSkutocneB) });
      }
    }
  }

  for (const zonaKluc of Object.keys(zonaDennyDav)) {
    const kvota = kvoty[zonaKluc];
    if (kvota != null && zonaDennyDav[zonaKluc] > kvota && zonaDennyDav[zonaKluc] > 0) {
      const skalovanie = kvota / zonaDennyDav[zonaKluc];
      for (const b of hotoveTeraz) {
        if (b.zona === zonaKluc && turistiInfo[b.id]) {
          turistiInfo[b.id].turistiSkutocneB *= skalovanie;
        }
      }
          zonaDennyDav[zonaKluc] = kvota;
    }
  }

  // Druhý priechod spokojnosti — teraz už vieme, koľko turistov je v ktorej zóne
  spokojnostVysledok = vypocitajSpokojnostStrediska(
    hotoveTeraz,
    st,
    hDatum,
    globalnyMult,
    maZasnezovanie,
    jeBurka,
    jeSilnyVietor,
    zonaDennyDav
  );

  let sucetPrestizBudovy = 0;
  let sucetPrestizTuristov = 0;
  const prijemPodKategorii = {};
  const nakladyPlatyPodKategorii = {};
  const lanovkovyMult = lanovkovyMultiplikatorDna(hDatum);
  const parkoviskovyMult = parkoviskovyMultiplikatorDna(hDatum);
  const idealDoba = idealnaPrevadzkaHodin(hDatum.getMonth(), st.hory_odomknute);
  const hraczovaDoba = dobaVHodinach(st.prevadzka_zaciatok || "08:30", st.prevadzka_koniec || "16:00");
  const { revenuFaktor: prevRevenuFaktor, wageFaktor: prevWageFaktor } = prevadzkovyFaktor(hraczovaDoba, idealDoba);
  for (const b of hotoveTeraz) {
    const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
    const riadiSaPrevadzkou = KATEGORIE_S_PREVADZKOU.includes(b.kategoria);
    const referencnaCenaDnes = KATEGORIE[b.kategoria].maCenu ? skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult, maZasnezovanie) : 0;

    const operacnaEfektivita =
      efektivitaZamestnancov(b.zamestnanci_pridelenych || 0, potrebnyB) *
      efektivnyBonus *
      konkurencnyMultiplikator(b.kategoria, b.zona, pocetKonkurencie) *
      (riadiSaPrevadzkou ? prevRevenuFaktor : 1);

    const jeLanovkaSTuristami = b.kategoria === "lanovka" && b.cena && turistiInfo[b.id];
    const efektivitaB = jeLanovkaSTuristami
      ? turistiInfo[b.id].spokojnostFaktorB * operacnaEfektivita
      : operacnaEfektivita;

    if (b.cena && KATEGORIE[b.kategoria].maCenu) {
      let prijemZaHodinuB;
    if (jeLanovkaSTuristami) {
               prijemZaHodinuB = turistiInfo[b.id].turistiSkutocneB * aktualnaCenaSkipasu(st, hDatum.getMonth());
   } else if (b.kategoria === "parkovisko") {
        const dennyDav = (zonaDennyDav[b.zona] || 0) * hraczovaDoba;
        const kapacitaMiest = KATEGORIE.parkovisko.katalog[b.typ].kapacita;
        const cenaParkovne = b.zona === "udolie" ? (st.cena_parkovne_udolie ?? 5) : (st.cena_parkovne_luka ?? 5);
        prijemZaHodinuB = prijemParkoviskaZaHodinu(kapacitaMiest, cenaParkovne, dennyDav, referencnaCenaDnes);
      } else if (b.kategoria === "penzion" || b.kategoria === "hotel") {
        const dennyDav = (zonaDennyDav[b.zona] || 0) * hraczovaDoba;
        const kapacitaLozok = KATEGORIE[b.kategoria].katalog[b.typ].kapacita;
        const cenaUbytovania = b.kategoria === "hotel" ? (st.cena_hotel ?? 70) : (st.cena_penzion ?? 25);
        prijemZaHodinuB = prijemUbytovaniaZaHodinu(kapacitaLozok, cenaUbytovania, dennyDav, referencnaCenaDnes);
      } else {
        prijemZaHodinuB = prijemZaHodinu(b.kategoria, b.typ, b.cena, referencnaCenaDnes);
      }
      const vietorMultiplikator = b.kategoria === "lanovka" ? lanovkovyMult : b.kategoria === "parkovisko" ? parkoviskovyMult : 1;
      const prijemNasobitel = jeLanovkaSTuristami ? operacnaEfektivita : efektivitaB;
      const prijemB = prijemZaHodinuB * prijemNasobitel * vietorMultiplikator * pokladnaFaktor * hodin;
      prijemPodKategorii[b.kategoria] = (prijemPodKategorii[b.kategoria] || 0) + prijemB;
    }
    const prestizZakladna = prestizBudovy(b.kategoria, b.typ, b.znacka);
    sucetPrestizBudovy += prestizZakladna;

    if (["parkovisko", "bar", "penzion", "hotel"].includes(b.kategoria)) {
      const infoKapacita = KATEGORIE[b.kategoria].katalog[b.typ];
      rozpisTuristovPodBudov.push({ nazov: infoKapacita?.nazov || b.typ, kapacita: infoKapacita?.kapacita || 0 });
    }

    if (jeLanovkaSTuristami) {
      const prestizNaTuristu = 2 + 6 * Math.pow(turistiInfo[b.id].spokojnostFaktorB, 2);
      const prestizZTuristovZaHodinu = turistiInfo[b.id].turistiSkutocneB * prestizNaTuristu * operacnaEfektivita;
      sucetPrestizTuristov += prestizZTuristovZaHodinu * hodin;
    }
    const wageFaktorB = riadiSaPrevadzkou ? prevWageFaktor : 1;
    const platB = (b.zamestnanci_pridelenych || 0) * PLAT_ZA_HODINU * (st.plat_multiplikator ?? 1) * wageFaktorB * hodin;
    nakladyPlatyPodKategorii[b.kategoria] = (nakladyPlatyPodKategorii[b.kategoria] || 0) + platB;
  }

  const rok = hernyRok(vekDni);
// Palivo ratrakov — len v zime
  const palivoHodinovo = hotoveTeraz
    .filter((b) => b.kategoria === "ratrak")
    .reduce((s, b) => s + palivoRatrakaZaHodinu(b.typ, hDatum.getMonth()), 0);

  const udrzbaHodinovo = hotoveTeraz.reduce(    (s, b) =>
      s +
      udrzbaZaHodinuBudova(
        cenaBudovy(b.kategoria, b.typ, b.znacka),
        rok,
        b.zona,
        udrzbaModZnacky(b.kategoria, b.typ, b.znacka)
      ),
    0
  );
   const nakladyUdrzbaSuma = udrzbaHodinovo * hodin;
    const nakladyPalivoSuma = palivoHodinovo * hodin;

  // Elektrina — každý typ zasnežovania má vlastnú spotrebu
  const elektrinaHodinovo = hotoveTeraz
    .filter((b) => b.kategoria === "zasnezovanie")
    .reduce((s, b) => s + (ZASNEZOVANIE_TYPY[b.typ]?.elektrinaZaHodinu || 0), 0);
  const nakladyElektrinaSuma = jeMesiacZasnezovania(hDatum.getMonth()) ? elektrinaHodinovo * hodin : 0;

  const celkovyPrijem = Object.values(prijemPodKategorii).reduce((a, b) => a + b, 0);
  const celkoveNakladyPlaty = Object.values(nakladyPlatyPodKategorii).reduce((a, b) => a + b, 0);
  let zarobene = Math.round(celkovyPrijem - celkoveNakladyPlaty - nakladyNaNajatie - nakladyUdrzbaSuma - nakladyElektrinaSuma - nakladyPalivoSuma);

  if (st.udolie_odomknute) {
    if (hDatum.getMonth() === 11 && st.odbory_navrh_rok !== hDatum.getFullYear()) {
      const novaPoziadavka =
        st.odbory_navrh_rok == null
          ? PRVA_POZIADAVKA_PERCENTO
          : dalsiaPoziadavka(st.odbory_navrh_percento, st.odbory_rozhodnutie, st);
      const { data: stPoNavrhu } = await supabase
        .from("stanice")
        .update({
          odbory_navrh_percento: novaPoziadavka,
          odbory_navrh_rok: hDatum.getFullYear(),
          odbory_rozhodnutie: null,
          odbory_vlastne_percento: null,
        })
        .eq("id", st.id)
        .select()
        .single();
      st = stPoNavrhu ?? st;
    }

    if (
      hDatum.getMonth() === 0 &&
      st.odbory_navrh_rok === hDatum.getFullYear() - 1 &&
      st.odbory_aplikovane_rok !== hDatum.getFullYear()
    ) {
      const rozhodnutie = st.odbory_rozhodnutie || "zamietnut";
      let novyMultiplikator = st.plat_multiplikator ?? 1;
      let novaEfektivitaBonus = EFEKTIVITA_PRI_ODMIETNUTI;

      if (rozhodnutie === "prijat") {
        novyMultiplikator = novyMultiplikator * (1 + st.odbory_navrh_percento / 100);
        novaEfektivitaBonus = 1;
      } else if (rozhodnutie === "vlastny") {
        const vlastne = st.odbory_vlastne_percento || 0;
        novyMultiplikator = novyMultiplikator * (1 + vlastne / 100);
        novaEfektivitaBonus = efektivitaPriVlastnomNavrhu(vlastne, st.odbory_navrh_percento);
      }

      const hernyBonusDo = new Date(hDatum.getFullYear(), 0, 31, 23, 59, 59);
      const bonusDo = realDatumZHerneho(hernyBonusDo);

      const { data: stPoAplikacii } = await supabase
        .from("stanice")
        .update({
          plat_multiplikator: novyMultiplikator,
          efektivita_bonus: novaEfektivitaBonus,
          efektivita_bonus_do: bonusDo.toISOString(),
          odbory_aplikovane_rok: hDatum.getFullYear(),
        })
        .eq("id", st.id)
        .select()
        .single();
      st = stPoAplikacii ?? st;
    }
  }

  if (hodin > 0.01 || nakladyNaNajatie > 0) {
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ peniaze: st.peniaze + zarobene, last_update: teraz.toISOString() })
      .eq("id", st.id)
      .select()
      .single();
    st = updatedSt;

    const transakcieNaVlozenie = [];
    for (const kat of Object.keys(prijemPodKategorii)) {
      const suma = Math.round(prijemPodKategorii[kat]);
      if (suma !== 0) transakcieNaVlozenie.push({ stanica_id: st.id, suma, typ: "prijem", kategoria: kat });
    }
    for (const kat of Object.keys(nakladyPlatyPodKategorii)) {
      const suma = Math.round(nakladyPlatyPodKategorii[kat]);
      if (suma !== 0) transakcieNaVlozenie.push({ stanica_id: st.id, suma: -suma, typ: "naklady_platy", kategoria: kat });
    }
    for (const kat of Object.keys(nakladyNajatiaPodKategorii)) {
      const suma = Math.round(nakladyNajatiaPodKategorii[kat]);
      if (suma !== 0) transakcieNaVlozenie.push({ stanica_id: st.id, suma: -suma, typ: "naklady_najatie", kategoria: kat });
    }
    const sumaUdrzba = Math.round(nakladyUdrzbaSuma);
    if (sumaUdrzba !== 0) transakcieNaVlozenie.push({ stanica_id: st.id, suma: -sumaUdrzba, typ: "naklady_udrzba", kategoria: null });
    const sumaElektrina = Math.round(nakladyElektrinaSuma);
    if (sumaElektrina !== 0) transakcieNaVlozenie.push({ stanica_id: st.id, suma: -sumaElektrina, typ: "naklady_elektrina", kategoria: "zasnezovanie" });
    const sumaPalivo = Math.round(nakladyPalivoSuma);
    if (sumaPalivo !== 0) transakcieNaVlozenie.push({ stanica_id: st.id, suma: -sumaPalivo, typ: "naklady_palivo", kategoria: "ratrak" });
    if (transakcieNaVlozenie.length > 0) {
      await supabase.from("transakcie").insert(transakcieNaVlozenie);
    }
  }

  let podHranicouOd = st.pod_hranicou_od;
  if (st.peniaze < NIZKA_HOTOVOST) {
    if (!podHranicouOd) podHranicouOd = teraz.toISOString();
  } else {
    podHranicouOd = null;
  }
  if (podHranicouOd !== st.pod_hranicou_od) {
    await supabase.from("stanice").update({ pod_hranicou_od: podHranicouOd }).eq("id", st.id);
    st = { ...st, pod_hranicou_od: podHranicouOd };
  }

  const celkomTuristov = Math.round(
    Object.values(turistiInfo).reduce((s, t) => s + (t.turistiSkutocneB || 0), 0)
  );

  const novyDennyPocetTuristov = zakladnyDennyPocetTuristov + celkomTuristov * hodin;
  if (celkomTuristov > 0) {
    await supabase.from("stanice").update({ denny_pocet_turistov: novyDennyPocetTuristov }).eq("id", st.id);
    st = { ...st, denny_pocet_turistov: novyDennyPocetTuristov };
  }

  const novaSezonnaPrestizTuristi = zakladnaSezonnaPrestiz + sucetPrestizTuristov;
  if (sucetPrestizTuristov > 0) {
    await supabase.from("stanice").update({ sezonna_prestiz_turisti: novaSezonnaPrestizTuristi }).eq("id", st.id);
    st = { ...st, sezonna_prestiz_turisti: novaSezonnaPrestizTuristi };
  }

  const konkurencnaPrestizVypocet = konkurencnaPrestiz(pocetKonkurencie);
  const cielovaPrestiz = Math.round(sucetPrestizBudovy + novaSezonnaPrestizTuristi + konkurencnaPrestizVypocet);
  const prestizRozpis = {
    budovy: Math.round(sucetPrestizBudovy),
    turisti: Math.round(novaSezonnaPrestizTuristi),
    konkurencia: Math.round(konkurencnaPrestizVypocet),
    spolu: cielovaPrestiz,
  };

  let novaPrestiz = cielovaPrestiz;
  if (podHranicouOd) {
    const dniPodHranicou = (teraz - new Date(podHranicouOd)) / (1000 * 60 * 60 * 24);
    if (dniPodHranicou > GRACE_DNI_PRED_UPADKOM) {
      novaPrestiz = Math.round(Math.max(0, st.prestiz * Math.pow(1 - DENNY_UPADOK_PRESTIZE, hodin / 24)));
    }
  }

  if (novaPrestiz !== st.prestiz) {
    await supabase.from("stanice").update({ prestiz: novaPrestiz }).eq("id", st.id);
    st = { ...st, prestiz: novaPrestiz };
  }
return {
    stanica: st,
    budovy: budovyData,
    konkurencia: konkurenciaData,
    zisk: Math.round(zarobene),
    prestizRozpis,
    pocetTuristov: celkomTuristov,
    dennyPocetTuristov: Math.round(novyDennyPocetTuristov),
    rozpisTuristovPodBudov,
    spokojnostCelkova: spokojnostLuka,
    spokojnostRozpis,
  };
}
