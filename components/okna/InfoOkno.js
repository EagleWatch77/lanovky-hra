"use client";

import { CheckCircle2, CloudSun, ListTodo, Palette, Wallet, Building2, AlertTriangle, Hammer, Users, ShieldAlert, Sparkles } from "lucide-react";

const HOTOVE = [
  "Registrácia a prihlásenie hráčov, vlastný názov strediska",
  "Nový hráč začína s postaveným vlekom (Alpenlift) a kapitálom 500 000 €",
  "Obdobie milosti — prvých 45 dní bez postihov za infraštruktúru a služby, potom 15 dní postupný nábeh",
  "Peniaze (trvalé) a Prestíž — pevná časť z budov a sezónna časť z turistov",
  "Zóny strediska (Lúka → Údolie → Hory → Ľadovec) s limitovaným počtom slotov a postupným odomykaním",
  "Výstavba na reálny čas (beží aj keď nie si online)",
  "Skipas — zvlášť zimná cena (celý deň) a letná (jedna jazda)",
  "Parkovné zvlášť pre Lúku a Údolie, jedna cena pre penzióny a jedna pre hotely",
  "Sezónna krivka cien (Október–Máj zima, Jún–September leto)",
  "Zamestnanci — automaticky na plný stav, súčasť nákladov na prevádzku",
  "Ročné vyjednávanie o plat (Údolie+, december–január), efektivita klesne pri odmietnutí",
  "Spokojnosť strediska — infraštruktúra, služby, ceny a počasie (kliknuteľné v hornom paneli)",
  "Medzisezóna (1.–7. október) — stredisko zatvorené, mzdy a údržba bežia ďalej",
  "Sezónny reset prestíže — prestíž z turistov sa vynuluje raz za ročný cyklus",
  "Údržba budov — % z hodnoty rastie s vekom, každý 3. rok vyššia, +50 % pre zónu Hory",
  "Ligový systém — spoločný pool turistov na zónu, nováčikovský bonus 3× klesá na 1× za 90 dní",
  "Úpadok prestíže pri dlhodobo nízkych peniazoch",
  "Počasie — denne sa mení, vietor a búrky ovplyvňujú dopyt aj toleranciu rád",
  "Herný kalendár — beží 2× rýchlejšie ako reálny čas",
  "Rebríček hráčov aj konzorcií, profil hráča s trofejami a možnosťou poslať správu",
  "Financie — denný/týždenný/mesačný/sezónny prehľad v troch záložkách",
  "Časovač na pozadí — ekonomika sa počíta raz za hodinu aj bez otvorenej appky",
  "Ski konzorciá — zakladanie, žiadosti, pozvánky, nástenka, trofeje konzorcia",
  "Správy medzi hráčmi",
];

const EKONOMIKA = [
  "Plne rozvinuté stredisko zvládne okolo 9 000 turistov denne (strop ~11 000)",
  "Kapacity lanoviek prepočítané tak, aby sedeli s poolom — vlek 12, 4-sedačka 25, kabínka 20 až 115 os./h",
  "Pool turistov na zónu: Lúka 9,86 mil., Údolie 8,45 mil., Hory 7,04 mil., Ľadovec 2,82 mil. ročne",
  "Pool sa delí medzi hráčov v lige podľa prestíže — kto sa lepšie stará, dostane väčší podiel",
  "Kapacita lanoviek je strop — nepríde viac ľudí, než unesieš",
  "PREPLNENIE: porovnáva sa dopyt s kapacitou, nie orezaný počet turistov",
  "Tolerancia rád podľa počasia — jasno 130 %, zamračené a sneží 120 %, dážď a vietor len 105 %",
  "Nad 150 % kapacity už ľudia odídu inam",
  "Rady pri pokladni — lístok si kupuje 40 % turistov, jedna transakcia je 2,5 osoby",
  "Kapacita parkovania — autom príde 70 % turistov, 1 miesto = 2 osoby",
];

const KONKURENCIA = [
  "Konkurencia sa objaví po 90 dňoch od založenia strediska",
  "Má tri úrovne — berie 25 %, 32 % alebo 40 % dopytu, ale zároveň dvíha prestíž celej oblasti",
  "Vyvíjajú sa hotel, bufet a parkovisko. Penzión a servis ostávajú na jednej úrovni",
  "Prestaví sa, keď stredisko priláka viac ľudí (800 a 2 500 turistov denne) alebo keď ju hráč predbehne kvalitou",
  "Prestavuje sa vždy len o jeden stupeň a najviac raz za herný rok",
  "Prestavba trvá rovnako dlho ako pôvodná stavba — hráč vidí, koľko dní zostáva",
  "V okne Konkurencia vidno obrázok aj názov podľa úrovne (Hotel ★★★ → ★★★★ → ★★★★★)",
];

const KRYSTALY = [
  "Kryštály — prémiová mena, kurz 1 € = 50 kryštálov",
  "Zostatok je vidno v hornej lište vpravo, kliknutím sa otvorí okno",
  "Balíčky: 250 (5 €), 550 (10 €), 1 200 (20 €), 3 250 (50 €), 7 000 (100 €) — väčšie majú bonus",
  "Nákup zatiaľ nie je spustený — chýba platobná brána",
  "AUTOMATICKÉ CENY: hra nastaví všetky ceny raz za herný týždeň, presnejšie než bežný odhad (±10 %)",
  "Automatika stojí 300 kryštálov na sezónu alebo 500 na herný rok, hráč môže kedykoľvek zasiahnuť ručne",
  "POZVÁNKY: každý hráč má vlastný odkaz, pozvaný sa zachytí automaticky pri registrácii",
  "Odmena 100 kryštálov pozývajúcemu a 50 pozvanému — až keď má pozvaný 300 prestíže z budov a hrá 30 dní",
  "Prémiové budovy majú ceny v kryštáloch: ratrak 250, parkovací dom 350, vodná nádrž 400, Solaris 700–1 000, hotely 800–900",
];

const BUDOVY = [
  "Sloty sú oddelené od typov — v každej zóne máš daný počet miest a vyberáš si, čo tam postavíš",
  "LANOVKY: 13 typov — vlek, sedačky 2/4/6/8-miestne, kabínky 8/10/15/20, 3S, Funitel, Kyvadlová",
  "5 výrobcov: Alpenlift, Silvretta, Apex, Kristallis, Solaris (za kryštály)",
  "LETNÁ PREVÁDZKA: v lete jazdia len určené sloty — spojnica do Hôr, prvá lanovka v Horách, spojnica na Ľadovec, prvá lanovka na Ľadovci",
  "O letnej prevádzke rozhoduje slot, nie typ — aj sedačka bude jazdiť, len s vlastnou kapacitou",
  "PARKOVISKÁ: štrkové, asfaltové, centrálne (s Horami), parkovací dom (prémiový, len Údolie)",
  "HOTELY v Údolí: 3*, 4*, 5* a Summit Resort (prémiový)",
  "HOTELY v Horách a na Ľadovci: Horská chata a Panoramatický rezort (prémiový)",
  "POKLADNE: malá (30 os./h), veľká (120), s infocentrom (150, len v Údolí)",
  "RATRAKY: starší, s navijakom, prémiový — spotrebúvajú palivo v zime, kupujú sa (nestavajú)",
  "ZASNEŽOVANIE: potok (chráni október), jazero (október a máj), vodná nádrž (aj september a jún, prémiová)",
  "Bufet a Apréski bar sú dve samostatné kategórie",
];

const PRESTAVBA = [
  "PRESTAVBA (pokladňa, zasnežovanie, servis, hotel, parkovisko) — budova sa nebúra, len prestavia na vyšší typ",
  "Pri prestavbe platíš plnú cenu novej budovy a stavba trvá rovnako dlho ako bežná výstavba",
  "BÚRANIE (lanovky a vleky) — stojí 10 % z ceny budovy, slot sa uvoľní",
  "PREDAJ (ratraky) — dostaneš späť zostatkovú cenu: 50 % nový, −10 % za každý herný rok, minimum 20 %",
];

const UI_HOTOVE = [
  "Svetlá „ľadová\" téma naprieč hrou — biele frostové panely, jednotné farby a tiene",
  "Horná lišta cez celú šírku — všetky štatistiky sú kliknuteľné a rozbalia detailný panel",
  "Počasie a sezóna spojené do jedného chipu vrátane medzisezóny",
  "Peňažný tok — príjem, prevádzka, čistý tok za deň a varovanie pri strate",
  "Panel zóny — obrázok podľa sezóny, kapacita so značkou, hodnotenie hviezdičkami podľa kvality budov",
  "Hodnotenie zóny meria kvalitu, nie počet — päť hviezdičiek si vyžaduje drahšie zariadenia",
  "Okno Budovy rozdelené do sekcií, výber výrobcu a potom modelu",
  "Letné sloty označené štítkom JAZDÍ AJ V LETE",
  "Namiesto vyskakovacích hlášok sa tlačidlo vypne a ukáže, koľko peňazí chýba",
];

const OPRAVIT = [
  "Ľadovec je rozostavaný — podmienky sú dohodnuté (25 000 prestíže, 15 mil. €, konzorcium 5 členov), ale nie sú v kóde",
  "Ľadovec sa v okne Budovy nedá otvoriť a nemá pool turistov",
  "Prémiové budovy majú v okne Budovy stále ceny v eurách, majú byť v kryštáloch",
  "Chyba pri prestavbe parkoviska na centrálne — treba preveriť",
  "Míľniky za kryštály (prvá lanovka, odomknutie zón) sa zatiaľ nevyplácajú",
];

const PLANOVANE = [
  "Návod pre nových hráčov — manažér na okraji obrazovky, listovací sprievodca",
  "Bonus na turistov za kryštály (+20 % nad kvótu) a za reklamu (+10 % na 8 hodín) — až keď budú hráči",
  "Ligy s postupom a zostupom na konci herného roka",
  "Misie napojené na reálne dáta (zatiaľ zástupné)",
  "Zónové počasie — na vrchole môže fúkať, kým v údolí sa lyžuje (a viac typov počasia)",
  "Sezónky — hráč pred sezónou nastaví počet a cenu, rozdelia sa cez celú sezónu",
  "Nastavenia a Správy do svetlej témy",
  "Ako motivovať silných hráčov brať do konzorcia aj slabších",
  "Svetový pohár ako samostatná mechanika",
  "Ochrana proti viacnásobným účtom",
  "Letné obrázky zón Údolie, Hory a Ľadovec",
  "Upratanie nepoužívaných súborov",
];

const MONETIZACIA = [
  {
    nazov: "Kryštály (hotové)",
    popis: "Prémiová mena. Kupujú sa za ne prémiové budovy a automatické ceny. Nákup čaká na platobnú bránu.",
  },
  {
    nazov: "Automatické ceny (hotové)",
    popis: "Hráč nemusí chodiť každý týždeň prestavovať ceny. Predáva sa pohodlie, nie výhoda — kto neplatí, dosiahne to isté, len musí klikať.",
  },
  {
    nazov: "Pozvánky (hotové)",
    popis: "Hráč pozve kamaráta a obaja dostanú kryštály. Prináša nových hráčov a nestojí nič okrem hernej meny.",
  },
  {
    nazov: "Predplatné",
    popis: "Mesačný poplatok s trvalými výhodami — rýchlejšia výstavba, viac slotov. Hlavný a stabilný príjem.",
  },
  {
    nazov: "Kozmetika",
    popis: "Vzhľad strediska, farby kabín, rám okolo mena v rebríčku. Neovplyvňuje hru, takže bez pay-to-win.",
  },
];

const TYPY_POCASIA_TABULKA = [
  { nazov: "Slnečno", zima: "25%", leto: "35%" },
  { nazov: "Zamračené", zima: "30%", leto: "25%" },
  { nazov: "Polojasno", zima: "15%", leto: "20%" },
  { nazov: "Sneží", zima: "25%", leto: "—" },
  { nazov: "Prší", zima: "5%", leto: "20%" },
  { nazov: "Búrka (len júl/august)", zima: "—", leto: "4%" },
];

const karta = {
  background: "#ffffff",
  border: "1px solid rgba(120,160,205,0.22)",
  borderRadius: 14,
  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
  padding: 14,
  marginBottom: 12,
};

const nadpisKarty = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  margin: "0 0 10px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

const zoznam = {
  color: "#5a6f88",
  fontSize: 12.5,
  lineHeight: 1.65,
  paddingLeft: 18,
  margin: 0,
};

function Sekcia({ Ikona, farba, nadpis, polozky }) {
  return (
    <div style={karta}>
      <h3 style={nadpisKarty}>
        <Ikona size={15} color={farba} strokeWidth={2.3} />
        {nadpis}
      </h3>
      <ul style={zoznam}>
        {polozky.map((p, i) => (
          <li key={i} style={{ marginBottom: 3 }}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export default function InfoOkno() {
  return (
    <div>
      <Sekcia Ikona={CheckCircle2} farba="#2ca24e" nadpis="Čo už funguje" polozky={HOTOVE} />
      <Sekcia Ikona={Users} farba="#2ca24e" nadpis="Ekonomika a turisti" polozky={EKONOMIKA} />
      <Sekcia Ikona={Building2} farba="#2f8ae0" nadpis="Budovy, typy a výrobcovia" polozky={BUDOVY} />
      <Sekcia Ikona={ShieldAlert} farba="#d64545" nadpis="Konkurencia" polozky={KONKURENCIA} />
      <Sekcia Ikona={Sparkles} farba="#2f8ae0" nadpis="Kryštály a prémiové funkcie" polozky={KRYSTALY} />
      <Sekcia Ikona={Hammer} farba="#c9930f" nadpis="Prestavba, búranie a predaj" polozky={PRESTAVBA} />
      <Sekcia Ikona={Palette} farba="#8a5fd6" nadpis="Rozhranie a vzhľad" polozky={UI_HOTOVE} />

      <div style={{ ...karta, background: "#fff7ea", border: "1px solid rgba(239,154,61,0.32)" }}>
        <h3 style={nadpisKarty}>
          <AlertTriangle size={15} color="#c9830f" strokeWidth={2.3} />
          Treba dokončiť
        </h3>
        <ul style={{ ...zoznam, color: "#8a5f20" }}>
          {OPRAVIT.map((p, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{p}</li>
          ))}
        </ul>
      </div>

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <CloudSun size={15} color="#2f8ae0" strokeWidth={2.3} />
          Typy počasia
        </h3>
        <p style={{ color: "#8a94a3", fontSize: 12, lineHeight: 1.55, marginTop: 0 }}>
          Počasie sa mení každý deň, rovnaké pre všetkých hráčov. Silný vietor znižuje príjem lanoviek o 66 %, búrka
          o 25 %. Zasnežovanie pri silnom vetre nefunguje. Počasie tiež mení, ako veľmi ľuďom vadia rady.
        </p>
        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(120,160,205,0.24)" }}>
                <th style={{ textAlign: "left", padding: "7px 8px", color: "#8a94a3", fontWeight: 600, fontSize: 11 }}>
                  Typ počasia
                </th>
                <th style={{ textAlign: "right", padding: "7px 8px", color: "#8a94a3", fontWeight: 600, fontSize: 11 }}>
                  Zima
                </th>
                <th style={{ textAlign: "right", padding: "7px 8px", color: "#8a94a3", fontWeight: 600, fontSize: 11 }}>
                  Leto
                </th>
              </tr>
            </thead>
            <tbody>
              {TYPY_POCASIA_TABULKA.map((r) => (
                <tr key={r.nazov} style={{ borderBottom: "1px solid rgba(120,160,205,0.14)" }}>
                  <td style={{ padding: "7px 8px", color: "#1b2c42" }}>{r.nazov}</td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "7px 8px",
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 600,
                      color: r.zima === "—" ? "#c5d2e0" : "#1b2c42",
                    }}
                  >
                    {r.zima}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "7px 8px",
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 600,
                      color: r.leto === "—" ? "#c5d2e0" : "#1b2c42",
                    }}
                  >
                    {r.leto}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sekcia Ikona={ListTodo} farba="#ef9a3d" nadpis="Čo je v pláne" polozky={PLANOVANE} />

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Wallet size={15} color="#c9930f" strokeWidth={2.3} />
          Monetizácia
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {MONETIZACIA.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                borderRadius: 11,
                background: "rgba(120,160,205,0.06)",
                border: "1px solid rgba(120,160,205,0.16)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#1b2c42",
                  marginBottom: 3,
                }}
              >
                {m.nazov}
              </div>
              <div style={{ fontSize: 11.5, color: "#5a6f88", lineHeight: 1.5 }}>{m.popis}</div>
            </div>
          ))}
        </div>
        <p
          style={{
            color: "#c9830f",
            fontSize: 11.5,
            fontWeight: 600,
            marginTop: 12,
            marginBottom: 0,
            lineHeight: 1.5,
            background: "#fff7ea",
            border: "1px solid rgba(239,154,61,0.3)",
            borderRadius: 10,
            padding: "9px 11px",
          }}
        >
          Bonusy, ktoré berú turistov z poolu, sa pridajú až keď bude dosť hráčov. Zatiaľ sa predáva len pohodlie.
        </p>
      </div>
    </div>
  );
}
