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
  PLAT_ZA_HODINU,
  CENA_NAJATIA,
  ZVYSENIE_PLATU_PERCENTO,
  EFEKTIVITA_PRI_ODMIETNUTI,
  EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI,
  KONKURENCIA_KONFIG,
  KONKURENCIA_VYSTAVBA_MESIACOV,
  VEK_PRE_KONKURENCIU_DNI,
  konkurencnyMultiplikator,
  konkurencnaPrestiz,
  sezonaIndex,
  jeZimnyMesiac,
  NIZKA_HOTOVOST,
  GRACE_DNI_PRED_UPADKOM,
  DENNY_UPADOK_PRESTIZE,
} from "./katalog";
import { jeDnesVietorNaZatvorenieLanoviek } from "./pocasie";

export function useGameState() {
  const [session, setSession] = useState(null);
  const [stanica, setStanica] = useState(null);
  const [budovy, setBudovy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zisk, setZisk] = useState(0);
  const [ukazVyjednavanie, setUkazVyjednavanie] = useState(false);
  const [potrebujeNazov, setPotrebujeNazov] = useState(false);
  const [konkurenciaJednotky, setKonkurenciaJednotky] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) nacitajVsetko();
  }, [session]);

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

    // Konkurencia — vlastná tabuľka, jednotky majú svoj čas výstavby ako budovy hráča
    const { data: konk } = await supabase.from("konkurencia").select("*").eq("stanica_id", st.id);
    let konkurenciaData = konk || [];

    const dokonceneKonk = konkurenciaData.filter((k) => k.stav === "vo_vystavbe" && new Date(k.koniec_vystavby) <= teraz);
    if (dokonceneKonk.length > 0) {
      const idsKonk = dokonceneKonk.map((k) => k.id);
      await supabase.from("konkurencia").update({ stav: "hotovo" }).in("id", idsKonk);
      konkurenciaData = konkurenciaData.map((k) => (idsKonk.includes(k.id) ? { ...k, stav: "hotovo" } : k));
    }

    const vekDni = (teraz - new Date(st.created_at)) / (1000 * 60 * 60 * 24);
    const sezonaTeraz = sezonaIndex(teraz);
    if (vekDni >= VEK_PRE_KONKURENCIU_DNI && st.posledna_sezona_konkurencie !== sezonaTeraz) {
      const jeLeto = !jeZimnyMesiac(teraz.getMonth());
      for (const kat of Object.keys(KONKURENCIA_KONFIG)) {
        const cfg = KONKURENCIA_KONFIG[kat];
        if (cfg.sezonne && !jeLeto) continue; // hotel/parkovisko len v lete
        const mam = hotoveTeraz.some((b) => b.kategoria === kat);
        const existujucichJednotiek = konkurenciaData.filter((k) => k.kategoria === kat).length;
        if (!mam && existujucichJednotiek < cfg.max) {
          const dniVystavbyKonk = vystavbaVRealnychDnoch(KONKURENCIA_VYSTAVBA_MESIACOV[kat]);
          const koniecKonk = new Date(teraz.getTime() + dniVystavbyKonk * 24 * 60 * 60 * 1000);
          const { data: novaKonk } = await supabase
            .from("konkurencia")
            .insert({ stanica_id: st.id, kategoria: kat, stav: "vo_vystavbe", koniec_vystavby: koniecKonk.toISOString() })
            .select()
            .single();
          if (novaKonk) konkurenciaData = [...konkurenciaData, novaKonk];
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

    // Počty DOKONČENÝCH jednotiek konkurencie na kategóriu — toto ovplyvňuje dopyt/prestíž
    const pocetKonkurencie = {};
    for (const k of konkurenciaData) {
      if (k.stav === "hotovo") pocetKonkurencie[k.kategoria] = (pocetKonkurencie[k.kategoria] || 0) + 1;
    }

    let sucetPrestiz = 0;
    const prijemPodKategorii = {};
    const nakladyPlatyPodKategorii = {};
    const lanovkyZastavene = jeDnesVietorNaZatvorenieLanoviek(teraz);
    for (const b of hotoveTeraz) {
      const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
      const efektivitaB = efektivitaZamestnancov(b.zamestnanci_pridelenych || 0, potrebnyB) * efektivnyBonus * konkurencnyMultiplikator(b.kategoria, pocetKonkurencie);

      if (b.cena && KATEGORIE[b.kategoria].maCenu) {
        const vietorMultiplikator = b.kategoria === "lanovka" && lanovkyZastavene ? 0 : 1;
        const prijemB = prijemZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * vietorMultiplikator * hodin;
        prijemPodKategorii[b.kategoria] = (prijemPodKategorii[b.kategoria] || 0) + prijemB;
      }
      sucetPrestiz += prestizBudovy(b.kategoria, b.typ, b.znacka) * efektivitaB;
      const platB = (b.zamestnanci_pridelenych || 0) * PLAT_ZA_HODINU * (st.plat_multiplikator ?? 1) * hodin;
      nakladyPlatyPodKategorii[b.kategoria] = (nakladyPlatyPodKategorii[b.kategoria] || 0) + platB;
    }
    const celkovyPrijem = Object.values(prijemPodKategorii).reduce((a, b) => a + b, 0);
    const celkoveNakladyPlaty = Object.values(nakladyPlatyPodKategorii).reduce((a, b) => a + b, 0);
    let zarobene = Math.round(celkovyPrijem - celkoveNakladyPlaty - nakladyNaNajatie);

    const jeDecembrovyTyzden = teraz.getMonth() === 11 && teraz.getDate() >= 23;
    const cielovyRok = jeDecembrovyTyzden ? teraz.getFullYear() + 1 : teraz.getFullYear();
    if (jeDecembrovyTyzden && st.vyjednavany_rok < cielovyRok) {
      setUkazVyjednavanie(true);
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

    // Sledovanie, odkedy je stredisko pod hranicou nízkej hotovosti
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
        // Prestíž upadá od svojej doterajšej hodnoty, nie skáče na cieľovú (aj keby bola vyššia)
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

  async function vytvorStanicu(nazov) {
    setLoading(true);
    const userId = session.user.id;
    await supabase.from("stanice").insert({ user_id: userId, nazov, peniaze: 1000000 });
    setPotrebujeNazov(false);
    await nacitajVsetko();
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

  async function postavitBudovu(kategoria, typ, znacka) {
    const cena = cenaBudovy(kategoria, typ, znacka);
    if (stanica.peniaze < cena) {
      alert("Nemáš dosť peňazí na túto stavbu!");
      return;
    }
    setLoading(true);

    const info = KATEGORIE[kategoria].katalog[typ];
    const dniVystavby = vystavbaVRealnychDnoch(info.vystavbaHernychMesiacov);
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

  async function vyjednatPlat(volba) {
    let novyMultiplikator = stanica.plat_multiplikator ?? 1;
    let novaEfektivitaBonus = 1;

    if (volba === "prijat") {
      novyMultiplikator = novyMultiplikator * (1 + ZVYSENIE_PLATU_PERCENTO / 100);
      novaEfektivitaBonus = 1;
    } else if (volba === "ciastocne") {
      novyMultiplikator = novyMultiplikator * (1 + ZVYSENIE_PLATU_PERCENTO / 200);
      novaEfektivitaBonus = EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI;
    } else {
      novaEfektivitaBonus = EFEKTIVITA_PRI_ODMIETNUTI;
    }

    const teraz = new Date();
    const cielovyRok = teraz.getMonth() === 11 ? teraz.getFullYear() + 1 : teraz.getFullYear();
    const bonusDo = new Date(cielovyRok, 0, 31, 23, 59, 59);

    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({
        plat_multiplikator: novyMultiplikator,
        efektivita_bonus: novaEfektivitaBonus,
        efektivita_bonus_do: bonusDo.toISOString(),
        vyjednavany_rok: cielovyRok,
      })
      .eq("id", stanica.id)
      .select()
      .single();

    setStanica(updatedSt);
    setUkazVyjednavanie(false);
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
    const { data: updatedBud } = await supabase
      .from("budovy")
      .update({ cena: novaCena })
      .eq("id", budova.id)
      .select()
      .single();
    setBudovy(budovy.map((b) => (b.id === budova.id ? updatedBud : b)));
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
    if (k.stav === "hotovo") pocetKonkurencie[k.kategoria] = (pocetKonkurencie[k.kategoria] || 0) + 1;
  }

  return {
    session,
    stanica,
    budovy,
    loading,
    zisk,
    ukazVyjednavanie,
    potrebujeNazov,
    konkurenciaJednotky,
    vytvorStanicu,
    premenovatStanicu,
    zmenitEmail,
    zmenitHeslo,
    zmazatMojeData,
    postavitBudovu,
    vyjednatPlat,
    najatPreBudovu,
    prepustitPreBudovu,
    zmenitCenu,
    handleLogout,
    efektivitaBudovy,
    pocetKonkurencie,
  };
}
