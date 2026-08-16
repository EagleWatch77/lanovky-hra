"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
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
  ODOMKNUTIE_UDOLIA,
  ODOMKNUTIE_HOR,
  ODOMKNUTIE_LANOVIEK_LUKA,
  globalnyCenovyMultiplikator,
  skutocnaReferencnaCena,
  CENA_COOLDOWN_HODIN,
  idealnaPrevadzkaHodin,
  prevadzkovyFaktor,
  KATEGORIE_S_PREVADZKOU,
  PREVADZKA_HODIN_MIN,
  PREVADZKA_HODIN_MAX,
  dobaVHodinach,
  dennaSpokojnostLuka,
  pokladnaSpokojnostBonus,
  preplnenieFaktor,
  jeVhodnyMesiacNaStavbu,
  faktorPredlzeniaVystavby,
  prijemParkoviskaZaHodinu,
  prijemUbytovaniaZaHodinu,
 efektivnaPrestizProLigu,
  vypocitajKvotuZony,
  vyberLiguHracov,
  jeVlekMimoSezony,
  CENA_BOBOVEJ_DRAHY,
 hernyRok,
  rocnyCyklusIndex,
  udrzbaZaHodinuBudova,
  ELEKTRIKA_ZASNEZOVANIE_ZA_HODINU,
  jeMesiacZasnezovania,
} from "./katalog";
import { lanovkovyMultiplikatorDna, parkoviskovyMultiplikatorDna, zasnezovanieFunguje } from "./pocasie";
import { hernyDatum, realDatumZHerneho } from "./hernyCas";

export function useGameState() {
  const [session, setSession] = useState(null);
  const [stanica, setStanica] = useState(null);
  const [budovy, setBudovy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zisk, setZisk] = useState(0);
 const [prestizRozpis, setPrestizRozpis] = useState({ budovy: 0, turisti: 0, konkurencia: 0, spolu: 0 });
 const [pocetTuristov, setPocetTuristov] = useState(0);
 const [spokojnostCelkova, setSpokojnostCelkova] = useState(1);
  const [spokojnostRozpis, setSpokojnostRozpis] = useState({ zaklad: 0, pokladna: 0, minimum: 0, spolu: 1 });
  const [potrebujeNazov, setPotrebujeNazov] = useState(false);
  const [konkurenciaJednotky, setKonkurenciaJednotky] = useState([]);
  const [aliancie, setAliancie] = useState([]);
  const [mojeZiadosti, setMojeZiadosti] = useState([]);
  const [prijateZiadosti, setPrijateZiadosti] = useState([]);
  const [prijatePozvanky, setPrijatePozvanky] = useState([]);
  const [aliancneSpravy, setAliancneSpravy] = useState([]);
  const [spravy, setSpravy] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) nacitajVsetko();
  }, [session]);

  useEffect(() => {
    if (stanica) {
      nacitajAliancie();
      nacitajSpravy();
      nacitajMojeZiadosti();
      nacitajPrijateZiadosti();
      nacitajPrijatePozvanky();
      if (stanica.aliancia_id) nacitajAliancneSpravy(stanica.aliancia_id);
    }
  }, [stanica?.id]);

  async function nacitajVsetko() {
    setLoading(true);
    const userId = session.user.id;

    let { data: st } = await supabase.from("stanice").select("*").eq("user_id", userId).maybeSingle();

    if (!st) {
      setPotrebujeNazov(true);
      setLoading(false);
      return;
    }

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

    // --- Ročný cyklus (1 zima + 1 leto) — reset sezónnej prestíže z turistov, rovnaký pre všetkých naraz ---
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

    // --- Denná spokojnosť v Lúke (parkovisko/bufet vs. dav z vlekov) + bonus/postih pokladne ---
    const budovyLuka = hotoveTeraz.filter((b) => b.zona === "luka");
    const konkurenciaLuka = konkurenciaData.filter((k) => k.zona === "luka" && k.stav === "hotovo");
const dennaSpokojnostZaklad = dennaSpokojnostLuka(budovyLuka, konkurenciaLuka);
    const maPokladnu = hotoveTeraz.some((b) => b.kategoria === "pokladna");
    const hernyMesiacovOdZalozenia = vekDni / 15;
    const pokladnaBonus = pokladnaSpokojnostBonus(maPokladnu, hernyMesiacovOdZalozenia);
    const spokojnostLuka = Math.max(0, Math.min(1, dennaSpokojnostZaklad + pokladnaBonus));
    setSpokojnostCelkova(spokojnostLuka);
    setSpokojnostRozpis({
      zaklad: Math.round(dennaSpokojnostZaklad * 100),
      pokladna: Math.round(pokladnaBonus * 100),
      minimum: 30,
      spolu: Math.round(spokojnostLuka * 100),
    });
    const pokladnaFaktor = maPokladnu ? 1 : 0.5;

    const globalnyMult = globalnyCenovyMultiplikator(st, hotoveTeraz);
    // Zasnežovanie (postavené v Údolí) chráni Okt/Máj pred prepadom na "letnú" úroveň — platí pre Lúku/Údolie/Hory
    const zasnezovacieBudovy = hotoveTeraz.filter((b) => b.kategoria === "zasnezovanie");
    const maZasnezovacieBudovy = zasnezovacieBudovy.length > 0;
    const zasnezovanieZapnute = zasnezovacieBudovy.some((b) => b.zasnezovanie_zapnute);
    const dovolujeVietor = zasnezovanieFunguje(hDatum);
    const maZasnezovanie = maZasnezovacieBudovy && zasnezovanieZapnute && dovolujeVietor;

    // Ratrak v Údolí — ak chýba (v období Dec-Máj), -10% spokojnosť na lanovkách v Údolí
    const maRatrakUdolie = hotoveTeraz.some((b) => b.zona === "udolie" && b.kategoria === "ratrak");
    const jeRatrakoveObdobie = maZasnezovanie
      ? jeZimnyMesiac(hDatum.getMonth()) // so zasnežovaním: celá zima Okt-Máj (8 mesiacov)
      : [10, 11, 0, 1, 2, 3].includes(hDatum.getMonth()); // bez zasnežovania: len Nov-Apr (Okt/Máj sú "leto")
    const ratrakFaktor = maRatrakUdolie || !jeRatrakoveObdobie ? 1 : 0.9;

    // --- Ligový pool: natiahni prestíž všetkých hráčov a spočítaj svoju kvótu na zónu ---
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

    // --- KROK 1: Spokojnosť ovplyvní SKUTOČNÝ počet turistov (nie len zisk z nich) ---
    // Toto sa počíta pre všetky lanovky VOPRED, nech vieme aj denný dav pre parkovisko/ubytovanie
const jeStrediskoZatvorene = jeMedzisezona(hDatum);
    const zonaDennyDav = {};
    const turistiInfo = {}; // b.id -> { turistiSkutocne, spokojnostFaktorB }
    for (const b of hotoveTeraz) {
      if (b.kategoria === "lanovka" && b.cena) {
        if (jeStrediskoZatvorene || jeVlekMimoSezony(b.typ, hDatum.getMonth(), b.bobova_draha)) {
          turistiInfo[b.id] = { turistiSkutocneB: 0, spokojnostFaktorB: 0 };
        } else {
          const refCenaB = skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult, maZasnezovanie);
          const turistiZakladneB = turistiZaHodinu(b.kategoria, b.typ, b.cena, refCenaB);
          let spokojnostFaktorB = 1;
          if (b.zona === "luka") spokojnostFaktorB *= spokojnostLuka;
          if (b.zona === "udolie") spokojnostFaktorB *= ratrakFaktor;
          spokojnostFaktorB *= preplnenieFaktor(refCenaB, b.cena);
          const turistiSkutocneB = turistiZakladneB * spokojnostFaktorB;
          turistiInfo[b.id] = { turistiSkutocneB, spokojnostFaktorB };
          zonaDennyDav[b.zona] = (zonaDennyDav[b.zona] || 0) + turistiSkutocneB;
        }
      }
    }

    // Orezanie na ligovú kvótu — ak by si dostal viac turistov, než ti patrí podľa podielu v lige
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

     // --- KROK 2: Hlavný cyklus — príjem a prestíž zo skutočných (už zníženych) turistov ---
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

      // Prevádzková (operačná) efektivita — koľko z každého turistu reálne premeníš na zisk/prestíž
      // (zamestnanci, mzdy, konkurencia, prevádzková doba) — spokojnosť sem UŽ NEPATRÍ, tá je v KROKU 1
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
          prijemZaHodinuB = turistiInfo[b.id].turistiSkutocneB * b.cena;
        } else if (b.kategoria === "parkovisko") {
          const dennyDav = (zonaDennyDav[b.zona] || 0) * hraczovaDoba;
          const kapacitaMiest = KATEGORIE.parkovisko.katalog[b.typ].kapacita;
        prijemZaHodinuB = prijemParkoviskaZaHodinu(kapacitaMiest, b.cena, dennyDav, referencnaCenaDnes);
        } else if (b.kategoria === "penzion" || b.kategoria === "hotel") {
          const dennyDav = (zonaDennyDav[b.zona] || 0) * hraczovaDoba;
          const kapacitaLozok = KATEGORIE[b.kategoria].katalog[b.typ].kapacita;
          prijemZaHodinuB = prijemUbytovaniaZaHodinu(kapacitaLozok, b.cena, dennyDav, referencnaCenaDnes);
        } else {
          prijemZaHodinuB = prijemZaHodinu(b.kategoria, b.typ, b.cena, referencnaCenaDnes);
        }
        const vietorMultiplikator = b.kategoria === "lanovka" ? lanovkovyMult : b.kategoria === "parkovisko" ? parkoviskovyMult : 1;
        const prijemNasobitel = jeLanovkaSTuristami ? operacnaEfektivita : efektivitaB;
        const prijemB = prijemZaHodinuB * prijemNasobitel * vietorMultiplikator * pokladnaFaktor * hodin;
        prijemPodKategorii[b.kategoria] = (prijemPodKategorii[b.kategoria] || 0) + prijemB;
      }
  // Základná prestíž za samotné postavenie — pevná, nezávislá od efektivity (jednorazovo za to, že budova stojí)
     const prestizZakladna = prestizBudovy(b.kategoria, b.typ, b.znacka);
      sucetPrestizBudovy += prestizZakladna;

   if (jeLanovkaSTuristami) {
        const prestizNaTuristu = 2 + 6 * Math.pow(turistiInfo[b.id].spokojnostFaktorB, 2); // 2-8, exponenciálne — malé rozdiely na vrchole = väčší rozdiel v bodoch
        const prestizZTuristovZaHodinu = turistiInfo[b.id].turistiSkutocneB * prestizNaTuristu * operacnaEfektivita;
        sucetPrestizTuristov += prestizZTuristovZaHodinu * hodin; // sčítava sa v čase (ako peniaze), nie momentka
      }
      const wageFaktorB = riadiSaPrevadzkou ? prevWageFaktor : 1;
      const platB = (b.zamestnanci_pridelenych || 0) * PLAT_ZA_HODINU * (st.plat_multiplikator ?? 1) * wageFaktorB * hodin;
      nakladyPlatyPodKategorii[b.kategoria] = (nakladyPlatyPodKategorii[b.kategoria] || 0) + platB;
    }
const rok = hernyRok(vekDni);
    const udrzbaHodinovo = hotoveTeraz.reduce(
      (s, b) => s + udrzbaZaHodinuBudova(cenaBudovy(b.kategoria, b.typ, b.znacka), rok, b.zona),
      0
    );
    const nakladyUdrzbaSuma = udrzbaHodinovo * hodin;

    const elektrinaBezi = maZasnezovanie && jeMesiacZasnezovania(hDatum.getMonth());
    const nakladyElektrinaSuma = elektrinaBezi ? ELEKTRIKA_ZASNEZOVANIE_ZA_HODINU * hodin : 0;

    const celkovyPrijem = Object.values(prijemPodKategorii).reduce((a, b) => a + b, 0);
    const celkoveNakladyPlaty = Object.values(nakladyPlatyPodKategorii).reduce((a, b) => a + b, 0);
    let zarobene = Math.round(celkovyPrijem - celkoveNakladyPlaty - nakladyNaNajatie - nakladyUdrzbaSuma - nakladyElektrinaSuma);

    // --- Vyjednávanie o platoch (len Údolie+) ---
    if (st.udolie_odomknute) {
      // 1.12 — nová požiadavka od odborov na tento rok (ak ešte nebola tento rok vygenerovaná)
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

      // 1.1 — aplikuje sa minuloročné rozhodnutie (ak ešte nebolo aplikované)
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
      setZisk(zarobene);

