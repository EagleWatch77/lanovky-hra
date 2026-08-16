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
