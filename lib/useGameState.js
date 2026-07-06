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
} from "./katalog";

export function useGameState() {
  const [session, setSession] = useState(null);
  const [stanica, setStanica] = useState(null);
  const [budovy, setBudovy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zisk, setZisk] = useState(0);
  const [ukazVyjednavanie, setUkazVyjednavanie] = useState(false);

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
      const { data: newSt } = await supabase
        .from("stanice")
        .insert({ user_id: userId, nazov: "Moja prvá stanica", peniaze: 1000000 })
        .select()
        .single();
      st = newSt;
    }

    const { data: bud } = await supabase.from("budovy").select("*").eq("stanica_id", st.id);
    let budovyData = bud || [];

    const teraz = new Date();

    const dokoncene = [];
    let nakladyNaNajatie = 0;
    for (const b of budovyData) {
      if (b.stav === "vo_vystavbe" && new Date(b.koniec_vystavby) <= teraz) {
        dokoncene.push(b);
      }
    }
    for (const b of dokoncene) {
      const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
      await supabase.from("budovy").update({ stav: "hotovo", zamestnanci_pridelenych: potrebnyB }).eq("id", b.id);
      nakladyNaNajatie += potrebnyB * CENA_NAJATIA;
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

    let zarobene = 0;
    let sucetPrestiz = 0;
    let sucetPlatov = 0;
    for (const b of hotoveTeraz) {
      const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
      const efektivitaB = efektivitaZamestnancov(b.zamestnanci_pridelenych || 0, potrebnyB) * efektivnyBonus;

      if (b.cena && KATEGORIE[b.kategoria].maCenu) {
        zarobene += prijemZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * hodin;
      }
      sucetPrestiz += prestizBudovy(b.kategoria, b.typ, b.znacka) * efektivitaB;
      sucetPlatov += (b.zamestnanci_pridelenych || 0) * PLAT_ZA_HODINU * (st.plat_multiplikator ?? 1) * hodin;
    }
    zarobene = Math.round(zarobene - sucetPlatov - nakladyNaNajatie);

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
    } else {
      setZisk(0);
    }

    setStanica(st);
    setBudovy(budovyData);

    const vypocitanaPrestiz = Math.round(sucetPrestiz);
    if (vypocitanaPrestiz !== st.prestiz) {
      await supabase.from("stanice").update({ prestiz: vypocitanaPrestiz }).eq("id", st.id);
      st = { ...st, prestiz: vypocitanaPrestiz };
      setStanica(st);
    }

    setLoading(false);
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

  return {
    session,
    stanica,
    budovy,
    loading,
    zisk,
    ukazVyjednavanie,
    postavitBudovu,
    vyjednatPlat,
    najatPreBudovu,
    prepustitPreBudovu,
    zmenitCenu,
    handleLogout,
    efektivitaBudovy,
  };
}
