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
  ELEKTRIKA_ZASNEZOVANIE_ZA_HODINU,
  jeMesiacZasnezovania,
} from "./katalog";
import { lanovkovyMultiplikatorDna, parkoviskovyMultiplikatorDna, zasnezovanieFunguje } from "./pocasie";
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
