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
} from "./katalog";
import { lanovkovyMultiplikatorDna, parkoviskovyMultiplikatorDna } from "./pocasie";
import { hernyDatum, realDatumZHerneho } from "./hernyCas";

export function useGameState() {
  const [session, setSession] = useState(null);
  const [stanica, setStanica] = useState(null);
  const [budovy, setBudovy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zisk, setZisk] = useState(0);
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
      const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
      await supabase.from("budovy").update({ stav: "hotovo", zamestnanci_pridelenych: potrebnyB }).eq("id", b.id);
      const nakladyB = potrebnyB * CENA_NAJATIA;
      nakladyNaNajatie += nakladyB;
      nakladyNajatiaPodKategorii[b.kategoria] = (nakladyNajatiaPodKategorii[b.kategoria] || 0) + nakladyB;
    }
    if (dokoncene.length > 0) {
      const dokonceneId = dokoncene.map((b) => b.id);
      budovyData = budovyData.map((b) =>
        dokonceneId.includes(b.id) ? { ...b, stav: "hotovo", zamestnanci_pridelenych: zamestnanciPotrebni(b.kategoria, b.typ) } : b
      );
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

    // --- Denná spokojnosť v Lúke (parkovisko/bufet vs. dav z vlekov) + bonus/postih pokladne ---
    const budovyLuka = hotoveTeraz.filter((b) => b.zona === "luka");
    const konkurenciaLuka = konkurenciaData.filter((k) => k.zona === "luka" && k.stav === "hotovo");
    const dennaSpokojnostZaklad = dennaSpokojnostLuka(budovyLuka, konkurenciaLuka);
    const maPokladnu = hotoveTeraz.some((b) => b.kategoria === "pokladna");
    const hernyMesiacovOdZalozenia = vekDni / 15;
    const pokladnaBonus = pokladnaSpokojnostBonus(maPokladnu, hernyMesiacovOdZalozenia);
    const spokojnostLuka = Math.max(0, Math.min(1, dennaSpokojnostZaklad + pokladnaBonus));
    const pokladnaFaktor = maPokladnu ? 1 : 0.5;

    // Kapacita lanoviek podľa zóny — potrebné pre denný dav pri výpočte parkoviska
    const zonaLanovkaKapacita = {};
    for (const b of hotoveTeraz) {
      if (b.kategoria === "lanovka") {
        zonaLanovkaKapacita[b.zona] = (zonaLanovkaKapacita[b.zona] || 0) + (KATEGORIE.lanovka.katalog[b.typ]?.kapacita || 0);
      }
    }

    let sucetPrestiz = 0;
    const prijemPodKategorii = {};
    const nakladyPlatyPodKategorii = {};
    const lanovkovyMult = lanovkovyMultiplikatorDna(hDatum);
    const parkoviskovyMult = parkoviskovyMultiplikatorDna(hDatum);
    const globalnyMult = globalnyCenovyMultiplikator(st, hotoveTeraz);
    const idealDoba = idealnaPrevadzkaHodin(hDatum.getMonth(), st.hory_odomknute);
    const hraczovaDoba = dobaVHodinach(st.prevadzka_zaciatok || "08:30", st.prevadzka_koniec || "16:00");
    const { revenuFaktor: prevRevenuFaktor, wageFaktor: prevWageFaktor } = prevadzkovyFaktor(hraczovaDoba, idealDoba);
 for (const b of hotoveTeraz) {
      const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
      const riadiSaPrevadzkou = KATEGORIE_S_PREVADZKOU.includes(b.kategoria);
      const ovplyvnenaSpokojnostouLuka = b.zona === "luka" && ["lanovka", "parkovisko", "bar"].includes(b.kategoria);
      const referencnaCenaDnes = KATEGORIE[b.kategoria].maCenu ? skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult) : 0;
      const preplnenie = b.kategoria === "lanovka" && b.cena ? preplnenieFaktor(referencnaCenaDnes, b.cena) : 1;
      const efektivitaB =
        efektivitaZamestnancov(b.zamestnanci_pridelenych || 0, potrebnyB) *
        efektivnyBonus *
        konkurencnyMultiplikator(b.kategoria, b.zona, pocetKonkurencie) *
        (riadiSaPrevadzkou ? prevRevenuFaktor : 1) *
        (ovplyvnenaSpokojnostouLuka ? spokojnostLuka : 1) *
        preplnenie;

  if (b.cena && KATEGORIE[b.kategoria].maCenu) {
        let prijemZaHodinuB;
        if (b.kategoria === "parkovisko") {
          const dennyDav = (zonaLanovkaKapacita[b.zona] || 0) * hraczovaDoba;
          const kapacitaMiest = KATEGORIE.parkovisko.katalog[b.typ].kapacita;
          prijemZaHodinuB = prijemParkoviskaZaHodinu(kapacitaMiest, b.cena, dennyDav);
        } else if (b.kategoria === "penzion" || b.kategoria === "hotel") {
          const dennyDav = (zonaLanovkaKapacita[b.zona] || 0) * hraczovaDoba;
          const kapacitaLozok = KATEGORIE[b.kategoria].katalog[b.typ].kapacita;
          prijemZaHodinuB = prijemUbytovaniaZaHodinu(kapacitaLozok, b.cena, dennyDav);
        } else {
          prijemZaHodinuB = prijemZaHodinu(b.kategoria, b.typ, b.cena, referencnaCenaDnes);
        }
        const vietorMultiplikator = b.kategoria === "lanovka" ? lanovkovyMult : b.kategoria === "parkovisko" ? parkoviskovyMult : 1;
        const prijemB = prijemZaHodinuB * efektivitaB * vietorMultiplikator * pokladnaFaktor * hodin;
        prijemPodKategorii[b.kategoria] = (prijemPodKategorii[b.kategoria] || 0) + prijemB;
      }
      sucetPrestiz += prestizBudovy(b.kategoria, b.typ, b.znacka) * efektivitaB;
      const wageFaktorB = riadiSaPrevadzkou ? prevWageFaktor : 1;
      const platB = (b.zamestnanci_pridelenych || 0) * PLAT_ZA_HODINU * (st.plat_multiplikator ?? 1) * wageFaktorB * hodin;
      nakladyPlatyPodKategorii[b.kategoria] = (nakladyPlatyPodKategorii[b.kategoria] || 0) + platB;
    }
    const celkovyPrijem = Object.values(prijemPodKategorii).reduce((a, b) => a + b, 0);
    const celkoveNakladyPlaty = Object.values(nakladyPlatyPodKategorii).reduce((a, b) => a + b, 0);
    let zarobene = Math.round(celkovyPrijem - celkoveNakladyPlaty - nakladyNaNajatie);

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
      if (transakcieNaVlozenie.length > 0) {
        await supabase.from("transakcie").insert(transakcieNaVlozenie);
      }
    } else {
      setZisk(0);
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

    const cielovaPrestiz = Math.round(sucetPrestiz + konkurencnaPrestiz(pocetKonkurencie));

    let novaPrestiz = cielovaPrestiz;
    if (podHranicouOd) {
      const dniPodHranicou = (teraz - new Date(podHranicouOd)) / (1000 * 60 * 60 * 24);
      if (dniPodHranicou > GRACE_DNI_PRED_UPADKOM) {
        novaPrestiz = Math.round(Math.max(0, st.prestiz * Math.pow(1 - DENNY_UPADOK_PRESTIZE, hodin / 24)));
      }
    }

    setStanica(st);
    setBudovy(budovyData);
    setKonkurenciaJednotky(konkurenciaData);

    if (novaPrestiz !== st.prestiz) {
      await supabase.from("stanice").update({ prestiz: novaPrestiz }).eq("id", st.id);
      st = { ...st, prestiz: novaPrestiz };
      setStanica(st);
    }

    setLoading(false);
  }

  async function vytvorStanicu(nazov, logo, menoHraca) {
    setLoading(true);
    const userId = session.user.id;
    await supabase.from("stanice").insert({ user_id: userId, nazov, logo: logo || "🏔️", meno_hraca: menoHraca || null, peniaze: 800000 });
    setPotrebujeNazov(false);
    await nacitajVsetko();
  }

  async function zmenitMenoHraca(novyMeno) {
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ meno_hraca: novyMeno })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function zmenitLogo(novyLogo) {
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ logo: novyLogo })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function premenovatStanicu(novyNazov) {
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ nazov: novyNazov })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function postavitBudovu(kategoria, typ, znacka, zona) {
    const hDatumTeraz = hernyDatum(new Date());
    if (!jeVhodnyMesiacNaStavbu(kategoria, hDatumTeraz.getMonth())) {
      alert("Túto budovu sa dá začať stavať len v teplejšom období roka (nie v zasneženej zime).");
      return;
    }

    if (zona === "udolie" && !stanica.udolie_odomknute) {
      alert("Údolie ešte nie je odomknuté!");
      return;
    }
    if (zona === "hory" && !stanica.hory_odomknute) {
      alert("Hory ešte nie sú odomknuté!");
      return;
    }
    if (zona === "ladovec") {
      alert("Ľadovec zatiaľ nie je dostupný.");
      return;
    }

    if (zona === "luka" && kategoria === "lanovka") {
      const potrebnaZona = ODOMKNUTIE_LANOVIEK_LUKA[typ];
      if (potrebnaZona === "udolie" && !stanica.udolie_odomknute) {
        alert("Táto lanovka sa odomkne spolu s Údolím!");
        return;
      }
      if (potrebnaZona === "hory" && !stanica.hory_odomknute) {
        alert("Táto lanovka sa odomkne spolu s Horami!");
        return;
      }
    }

    // Kľúč limitu je pri lanovkách rovno konkrétny typ (každý typ = vlastný slot v zóne)
    const limitKluc = kategoria === "lanovka" ? typ : kategoria;
    const limit = ZONY[zona]?.limity[limitKluc] || 0;
    const obsadene = budovy.filter((b) => {
      if (b.zona !== zona || b.stav === "zrusene") return false;
      if (kategoria === "lanovka") {
        return b.kategoria === "lanovka" && b.typ === typ;
      }
      return b.kategoria === kategoria;
    }).length;
    if (obsadene >= limit) {
      alert(`V zóne ${ZONY[zona].nazov} už nie je voľný slot na túto kategóriu (max ${limit}).`);
      return;
    }

    const cena = cenaBudovy(kategoria, typ, znacka);
    if (stanica.peniaze < cena) {
      alert("Nemáš dosť peňazí na túto stavbu!");
      return;
    }
    setLoading(true);

    const info = KATEGORIE[kategoria].katalog[typ];
    const predlzenie = faktorPredlzeniaVystavby(kategoria, hDatumTeraz.getMonth());
    const dniVystavby = vystavbaVRealnychDnoch(info.vystavbaHernychMesiacov) * predlzenie;
    const teraz = new Date();
    const koniec = new Date(teraz.getTime() + dniVystavby * 24 * 60 * 60 * 1000);

    const { data: novaBudova } = await supabase
      .from("budovy")
      .insert({
        stanica_id: stanica.id,
        kategoria,
        typ,
        znacka: KATEGORIE[kategoria].znackyKatalog ? znacka : null,
        stav: "vo_vystavbe",
        zaciatok_vystavby: teraz.toISOString(),
        koniec_vystavby: koniec.toISOString(),
        cena: KATEGORIE[kategoria].maCenu ? info.referencnaCena : null,
        zona,
      })
      .select()
      .single();

    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ peniaze: stanica.peniaze - cena })
      .eq("id", stanica.id)
      .select()
      .single();

    setStanica(updatedSt);
    setBudovy([...budovy, novaBudova]);
    await supabase.from("transakcie").insert({ stanica_id: stanica.id, suma: -cena, typ: "stavba", kategoria });
    setLoading(false);
  }

  function podmienkyOdomknutiaUdolia() {
    if (!stanica) return null;
    const vekDni = (new Date() - new Date(stanica.created_at)) / (1000 * 60 * 60 * 24);
    const konkurenciaSplnena = ODOMKNUTIE_UDOLIA.konkurenciaKategorie.some((k) => (pocetKonkurencie[k] || 0) > 0);
    return {
      vek: vekDni >= ODOMKNUTIE_UDOLIA.vekDni,
      prestiz: stanica.prestiz >= ODOMKNUTIE_UDOLIA.prestiz,
      konkurencia: konkurenciaSplnena,
      peniaze: stanica.peniaze >= ODOMKNUTIE_UDOLIA.cena,
      vsetkoSplnene:
        vekDni >= ODOMKNUTIE_UDOLIA.vekDni &&
        stanica.prestiz >= ODOMKNUTIE_UDOLIA.prestiz &&
        konkurenciaSplnena &&
        stanica.peniaze >= ODOMKNUTIE_UDOLIA.cena,
    };
  }

  async function odomknutUdolie() {
    const podmienky = podmienkyOdomknutiaUdolia();
    if (!podmienky?.vsetkoSplnene) return;
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ peniaze: stanica.peniaze - ODOMKNUTIE_UDOLIA.cena, udolie_odomknute: true })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
    await supabase.from("transakcie").insert({ stanica_id: stanica.id, suma: -ODOMKNUTIE_UDOLIA.cena, typ: "stavba", kategoria: null });
  }

  function podmienkyOdomknutiaHor() {
    if (!stanica) return null;
    const vekDni = (new Date() - new Date(stanica.created_at)) / (1000 * 60 * 60 * 24);
    return {
      vek: vekDni >= ODOMKNUTIE_HOR.vekDni,
      prestiz: stanica.prestiz >= ODOMKNUTIE_HOR.prestiz,
      peniaze: stanica.peniaze >= ODOMKNUTIE_HOR.cena,
      udolie: stanica.udolie_odomknute,
      vsetkoSplnene:
        vekDni >= ODOMKNUTIE_HOR.vekDni &&
        stanica.prestiz >= ODOMKNUTIE_HOR.prestiz &&
        stanica.peniaze >= ODOMKNUTIE_HOR.cena &&
        stanica.udolie_odomknute,
    };
  }

  async function odomknutHory() {
    const podmienky = podmienkyOdomknutiaHor();
    if (!podmienky?.vsetkoSplnene) return;
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ peniaze: stanica.peniaze - ODOMKNUTIE_HOR.cena, hory_odomknute: true })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
    await supabase.from("transakcie").insert({ stanica_id: stanica.id, suma: -ODOMKNUTIE_HOR.cena, typ: "stavba", kategoria: null });
  }

  async function rozhodnutieOdbory(typ, vlastnePercento) {
    const update = { odbory_rozhodnutie: typ };
    if (typ === "vlastny") {
      update.odbory_vlastne_percento = vlastnePercento;
    }
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update(update)
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function najatPreBudovu(budova) {
    const potrebnyB = zamestnanciPotrebni(budova.kategoria, budova.typ);
    if ((budova.zamestnanci_pridelenych || 0) >= potrebnyB) return;
    if (stanica.peniaze < CENA_NAJATIA) {
      alert("Nemáš dosť peňazí na najatie ďalšieho zamestnanca!");
      return;
    }
    const { data: updatedBud } = await supabase
      .from("budovy")
      .update({ zamestnanci_pridelenych: (budova.zamestnanci_pridelenych || 0) + 1 })
      .eq("id", budova.id)
      .select()
      .single();
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ peniaze: stanica.peniaze - CENA_NAJATIA })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
    setBudovy(budovy.map((b) => (b.id === budova.id ? updatedBud : b)));
    await supabase.from("transakcie").insert({ stanica_id: stanica.id, suma: -CENA_NAJATIA, typ: "zamestnanec", kategoria: budova.kategoria });
  }

  async function prepustitPreBudovu(budova) {
    if ((budova.zamestnanci_pridelenych || 0) <= 0) return;
    const { data: updatedBud } = await supabase
      .from("budovy")
      .update({ zamestnanci_pridelenych: budova.zamestnanci_pridelenych - 1 })
      .eq("id", budova.id)
      .select()
      .single();
    setBudovy(budovy.map((b) => (b.id === budova.id ? updatedBud : b)));
  }

  async function zmenitCenu(budova, novaCena) {
    if (budova.cena_zmenena_at) {
      const hodinOdZmeny = (new Date() - new Date(budova.cena_zmenena_at)) / (1000 * 60 * 60);
      if (hodinOdZmeny < CENA_COOLDOWN_HODIN) {
        const zostavaHodin = Math.ceil(CENA_COOLDOWN_HODIN - hodinOdZmeny);
        alert(`Cenu môžeš zmeniť len raz za herný týždeň. Skús to znova o ${zostavaHodin} h.`);
        return;
      }
    }
    const { data: updatedBud } = await supabase
      .from("budovy")
      .update({ cena: novaCena, cena_zmenena_at: new Date().toISOString() })
      .eq("id", budova.id)
      .select()
      .single();
    setBudovy(budovy.map((b) => (b.id === budova.id ? updatedBud : b)));
  }

  async function zmenitPrevadzkovuDobu(zaciatok, koniec) {
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ prevadzka_zaciatok: zaciatok, prevadzka_koniec: koniec })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function zmenitEmail(novyEmail) {
    const { error } = await supabase.auth.updateUser({ email: novyEmail });
    if (error) return { error: error.message };
    return { success: "Na nový email bola odoslaná potvrdzovacia správa. Zmena sa prejaví po potvrdení." };
  }

  async function zmenitHeslo(noveHeslo) {
    const { error } = await supabase.auth.updateUser({ password: noveHeslo });
    if (error) return { error: error.message };
    return { success: "Heslo bolo zmenené." };
  }

  async function zmazatMojeData() {
    await supabase.from("budovy").delete().eq("stanica_id", stanica.id);
    await supabase.from("stanice").delete().eq("id", stanica.id);
    await handleLogout();
  }

  // --- Aliancie ---
  async function nacitajAliancie() {
    const { data } = await supabase.from("aliancie").select("*").order("nazov");
    setAliancie(data || []);
  }

  async function vytvoritAlianciu(nazov) {
    const { data: novaAliancia, error } = await supabase
      .from("aliancie")
      .insert({ nazov, zakladatel_stanica_id: stanica.id })
      .select()
      .single();
    if (error) {
      alert("Chyba: " + error.message + " (kód: " + error.code + ")");
      return;
    }
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ aliancia_id: novaAliancia.id })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
    await nacitajAliancie();
  }

  async function pripojitSaKAlliancii(alianciaId) {
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ aliancia_id: alianciaId })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function opustitAllianciu() {
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ aliancia_id: null })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function upravitPopisKonzorcia(alianciaId, popis) {
    await supabase.from("aliancie").update({ popis }).eq("id", alianciaId);
    await nacitajAliancie();
  }

  async function nacitajAliancneSpravy(alianciaId) {
    const cielId = alianciaId || stanica?.aliancia_id;
    if (!cielId) {
      setAliancneSpravy([]);
      return;
    }
    const { data } = await supabase
      .from("aliancia_forum")
      .select("*, odosielatel:od_stanica_id(nazov, meno_hraca)")
      .eq("aliancia_id", cielId)
      .order("created_at", { ascending: true });
    setAliancneSpravy(data || []);
  }

  async function poslatAliancnuSpravu(text, replyTo = null) {
    if (!text.trim() || !stanica?.aliancia_id) return;
    const { error } = await supabase
      .from("aliancia_forum")
      .insert({ aliancia_id: stanica.aliancia_id, od_stanica_id: stanica.id, text: text.trim(), reply_to: replyTo });
    if (error) {
      alert("Chyba: " + error.message);
      return;
    }
    await nacitajAliancneSpravy();
  }

  async function oznacitForumPrecitane() {
    if (!stanica) return;
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ forum_precitane_do: new Date().toISOString() })
      .eq("id", stanica.id)
      .select()
      .single();
    if (updatedSt) setStanica(updatedSt);
  }

  // --- Žiadosti o vstup do konzorcia ---
  async function nacitajMojeZiadosti() {
    if (!stanica) return;
    const { data } = await supabase.from("aliancia_ziadosti").select("*").eq("stanica_id", stanica.id);
    setMojeZiadosti(data || []);
    const prijataOdlisna = (data || []).find(
      (z) => z.typ !== "pozvanka" && z.stav === "prijata" && z.aliancia_id !== stanica.aliancia_id
    );
    if (prijataOdlisna) {
      const { data: freshSt } = await supabase.from("stanice").select("*").eq("id", stanica.id).single();
      if (freshSt) setStanica(freshSt);
    }
  }

  async function nacitajPrijateZiadosti() {
    if (!stanica) return;
    const { data: mojeAliancie } = await supabase.from("aliancie").select("id").eq("zakladatel_stanica_id", stanica.id);
    if (!mojeAliancie || mojeAliancie.length === 0) {
      setPrijateZiadosti([]);
      return;
    }
    const alianciaIds = mojeAliancie.map((a) => a.id);
    const { data } = await supabase
      .from("aliancia_ziadosti")
      .select("*, ziadatel:stanica_id(nazov, meno_hraca)")
      .in("aliancia_id", alianciaIds)
      .eq("stav", "cakajuca");
    setPrijateZiadosti(data || []);
  }

  async function poziadatOVstup(alianciaId) {
    const { error } = await supabase
      .from("aliancia_ziadosti")
      .upsert(
        { aliancia_id: alianciaId, stanica_id: stanica.id, stav: "cakajuca", typ: "ziadost", oznamene: false },
        { onConflict: "aliancia_id,stanica_id" }
      );
    if (error) {
      alert("Chyba: " + error.message);
      return;
    }
    const alianciaInfo = aliancie.find((a) => a.id === alianciaId);
    if (alianciaInfo?.zakladatel_stanica_id) {
      await supabase.from("spravy").insert({
        od_stanica_id: stanica.id,
        komu_stanica_id: alianciaInfo.zakladatel_stanica_id,
        text: `📨 Nová žiadosť o vstup do konzorcia "${alianciaInfo.nazov}" od hráča ${stanica.nazov}${stanica.meno_hraca ? ` (${stanica.meno_hraca})` : ""}.`,
      });
    }
    await nacitajMojeZiadosti();
  }

  async function schvalitZiadost(ziadostId, ziadatelStanicaId, alianciaId) {
    await supabase.from("aliancia_ziadosti").update({ stav: "prijata" }).eq("id", ziadostId);
    await supabase.from("stanice").update({ aliancia_id: alianciaId }).eq("id", ziadatelStanicaId);
    const nazovKonzorcia = aliancie.find((a) => a.id === alianciaId)?.nazov || "konzorcia";
    await supabase.from("spravy").insert({
      od_stanica_id: stanica.id,
      komu_stanica_id: ziadatelStanicaId,
      text: `🎉 Tvoja žiadosť o vstup do konzorcia "${nazovKonzorcia}" bola prijatá! Vitaj medzi nami.`,
    });
    await nacitajPrijateZiadosti();
  }

  async function zamietnutZiadost(ziadostId, ziadatelStanicaId, alianciaId) {
    await supabase.from("aliancia_ziadosti").update({ stav: "zamietnuta" }).eq("id", ziadostId);
    const nazovKonzorcia = aliancie.find((a) => a.id === alianciaId)?.nazov || "konzorcia";
    await supabase.from("spravy").insert({
      od_stanica_id: stanica.id,
      komu_stanica_id: ziadatelStanicaId,
      text: `Tvoja žiadosť o vstup do konzorcia "${nazovKonzorcia}" bola zamietnutá. Môžeš skúsiť požiadať znova alebo nájsť iné konzorcium.`,
    });
    await nacitajPrijateZiadosti();
  }

  async function oznacitZiadostOznamenu(ziadostId) {
    await supabase.from("aliancia_ziadosti").update({ oznamene: true }).eq("id", ziadostId);
    await nacitajMojeZiadosti();
  }

  async function nacitajPrijatePozvanky() {
    if (!stanica) return;
    const { data } = await supabase
      .from("aliancia_ziadosti")
      .select("*, aliancia:aliancia_id(nazov)")
      .eq("stanica_id", stanica.id)
      .eq("typ", "pozvanka")
      .eq("stav", "cakajuca");
    setPrijatePozvanky(data || []);
  }

  async function prijatPozvanku(pozvankaId, alianciaId) {
    await supabase.from("aliancia_ziadosti").update({ stav: "prijata" }).eq("id", pozvankaId);
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ aliancia_id: alianciaId })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
    await nacitajPrijatePozvanky();
  }

  async function odmietnutPozvanku(pozvankaId) {
    await supabase.from("aliancia_ziadosti").update({ stav: "zamietnuta" }).eq("id", pozvankaId);
    await nacitajPrijatePozvanky();
  }

  async function pozvatHraca(alianciaId, cieloveStanicaId) {
    const { error } = await supabase
      .from("aliancia_ziadosti")
      .upsert(
        { aliancia_id: alianciaId, stanica_id: cieloveStanicaId, typ: "pozvanka", stav: "cakajuca", oznamene: false },
        { onConflict: "aliancia_id,stanica_id" }
      );
    if (error) {
      alert("Chyba: " + error.message);
    }
  }

  async function vyhoditClena(clenStanicaId) {
    const { error } = await supabase.from("stanice").update({ aliancia_id: null }).eq("id", clenStanicaId);
    if (error) {
      alert("Chyba: " + error.message);
    }
  }

  // --- Správy ---
  async function nacitajSpravy() {
    if (!stanica) return;
    const { data } = await supabase
      .from("spravy")
      .select("*, odosielatel:od_stanica_id(nazov, meno_hraca)")
      .eq("komu_stanica_id", stanica.id)
      .order("created_at", { ascending: false });
    setSpravy(data || []);
  }

  async function poslatSpravu(komuStanicaId, text, predmet) {
    if (!text.trim()) return;
    await supabase
      .from("spravy")
      .insert({ od_stanica_id: stanica.id, komu_stanica_id: komuStanicaId, text: text.trim(), predmet: (predmet || "").trim() || "(bez predmetu)" });
  }

  async function oznacitPrecitane(spravaId) {
    await supabase.from("spravy").update({ precitana: true }).eq("id", spravaId);
    setSpravy(spravy.map((s) => (s.id === spravaId ? { ...s, precitana: true } : s)));
  }

  async function vymazatSpravy(idZoznam) {
    if (!idZoznam || idZoznam.length === 0) return;
    const { error } = await supabase.from("spravy").delete().in("id", idZoznam);
    if (error) {
      alert("Chyba: " + error.message);
      return;
    }
    setSpravy(spravy.filter((s) => !idZoznam.includes(s.id)));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setStanica(null);
    setBudovy([]);
  }

  function efektivitaBudovy(b) {
    const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
    const efektivnyBonusTeraz = stanica && new Date(stanica.efektivita_bonus_do) >= new Date() ? (stanica.efektivita_bonus ?? 1) : 1;
    return efektivitaZamestnancov(b.zamestnanci_pridelenych || 0, potrebnyB) * efektivnyBonusTeraz;
  }

  const pocetKonkurencie = {};
  for (const k of konkurenciaJednotky) {
    if (k.stav === "hotovo") {
      const kluc = `${k.zona}:${k.kategoria}`;
      pocetKonkurencie[kluc] = (pocetKonkurencie[kluc] || 0) + 1;
    }
  }

  const pocetNeprecitanychVoFore = stanica
    ? aliancneSpravy.filter(
        (s) => s.od_stanica_id !== stanica.id && new Date(s.created_at) > new Date(stanica.forum_precitane_do || 0)
      ).length
    : 0;

  return {
    session,
    stanica,
    budovy,
    loading,
    zisk,
    rozhodnutieOdbory,
    potrebujeNazov,
    konkurenciaJednotky,
    aliancie,
    mojeZiadosti,
    prijateZiadosti,
    prijatePozvanky,
    aliancneSpravy,
    nacitajAliancneSpravy,
    poslatAliancnuSpravu,
    oznacitForumPrecitane,
    pocetNeprecitanychVoFore,
    spravy,
    nacitajAliancie,
    vytvoritAlianciu,
    pripojitSaKAlliancii,
    opustitAllianciu,
    upravitPopisKonzorcia,
    poziadatOVstup,
    schvalitZiadost,
    zamietnutZiadost,
    oznacitZiadostOznamenu,
    prijatPozvanku,
    odmietnutPozvanku,
    pozvatHraca,
    vyhoditClena,
    nacitajSpravy,
    nacitajMojeZiadosti,
    poslatSpravu,
    oznacitPrecitane,
    vymazatSpravy,
    vytvorStanicu,
    premenovatStanicu,
    zmenitMenoHraca,
    zmenitLogo,
    zmenitEmail,
    zmenitHeslo,
    zmazatMojeData,
    postavitBudovu,
    najatPreBudovu,
    prepustitPreBudovu,
    zmenitCenu,
    zmenitPrevadzkovuDobu,
    handleLogout,
    efektivitaBudovy,
    pocetKonkurencie,
    podmienkyOdomknutiaUdolia,
    odomknutUdolie,
    podmienkyOdomknutiaHor,
    odomknutHory,
  };
}
