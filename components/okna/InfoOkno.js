"use client";

import { CheckCircle2, CloudSun, ListTodo, Palette, Wallet, Building2, AlertTriangle, Hammer, Users } from "lucide-react";

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
  "Denný model príjmu pre parkovisko a ubytovanie",
  "Zamestnanci — automaticky na plný stav, súčasť nákladov na prevádzku",
  "Ročné vyjednávanie o plat (Údolie+, december–január), efektivita klesne pri odmietnutí",
  "Konkurencia — objavuje sa po 90 dňoch, znižuje dopyt, ale zvyšuje prestíž strediska",
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

const BUDOVY = [
  "Sloty sú oddelené od typov — v každej zóne máš daný počet miest a vyberáš si, čo tam postavíš",
  "LANOVKY: 13 typov — vlek, sedačky 2/4/6/8-miestne (pevné aj odpojiteľné), kabínky 8/10/15/20, 3S, Funitel, Kyvadlová",
  "5 výrobcov: Alpenlift (lacný), Silvretta (štandard), Apex (kapacita), Kristallis (prémiový), Solaris (za reálne peniaze)",
  "Každý výrobca mení cenu, kapacitu, údržbu a prestíž — a vyrába len časť modelov",
  "Spojnice medzi zónami: z Lúky do Údolia a do Hôr, z Hôr na Ľadovec",
  "LETNÁ PREVÁDZKA: v lete jazdia len určené sloty — spojnica do Hôr, prvá lanovka v Horách, spojnica na Ľadovec, prvá lanovka na Ľadovci",
  "O letnej prevádzke rozhoduje slot, nie typ — aj sedačka bude jazdiť, len s vlastnou kapacitou",
  "Vleky jazdia v lete len s bobovou dráhou",
  "PARKOVISKÁ: štrkové, asfaltové, centrálne (s Horami), parkovací dom (prémiový, len Údolie)",
  "HOTELY v Údolí: 3*, 4*, 5* a Summit Resort (prémiový)",
  "HOTELY v Horách a na Ľadovci: Horská chata a Panoramatický rezort (prémiový)",
  "POKLADNE: malá (30 os./h), veľká (120), s infocentrom (150, len v Údolí)",
  "SERVIS: malá požičovňa a plný ski servis",
  "RATRAKY: starší (mierne svahy), s navijakom (aj strmé), prémiový — spotrebúvajú palivo v zime",
  "ZASNEŽOVANIE: potok (chráni október), jazero (október a máj), vodná nádrž (aj september a jún, prémiová)",
  "Bufet a Apréski bar sú dve samostatné kategórie",
  "Obrázky pri každom type budovy aj zariadenia, logá výrobcov",
];

const PRESTAVBA = [
  "PRESTAVBA (pokladňa, zasnežovanie, servis, hotel, parkovisko) — budova sa nebúra, len prestavia na vyšší typ",
  "Pri prestavbe platíš plnú cenu novej budovy a stavba trvá rovnako dlho ako bežná výstavba",
  "Prestavať sa dá len na drahší typ, nie späť na lacnejší",
  "BÚRANIE (lanovky a vleky) — stojí 10 % z ceny budovy, slot sa uvoľní",
  "PREDAJ (ratraky) — dostaneš späť zostatkovú cenu: 50 % nový, −10 % za každý herný rok, minimum 20 %",
];

const UI_HOTOVE = [
  "Svetlá „ľadová\" téma naprieč hrou — biele frostové panely, jednotné farby a tiene",
  "Fonty Sora (nadpisy a čísla) a Inter (text)",
  "Horná lišta cez celú šírku — logo strediska, názov, štatistiky, notifikácie a nastavenia",
  "Všetky štatistiky v lište sú kliknuteľné a rozbalia detailný panel",
  "Počasie a sezóna spojené do jedného chipu vrátane medzisezóny",
  "Peňažný tok — príjem, prevádzka, čistý tok za deň a varovanie pri strate",
  "Panel zóny — obrázok podľa sezóny, prepínanie šípkami, tlačidlo Spravovať zónu",
  "Panely rebríčka, týždenných misií a udalostí",
  "Okno Budovy rozdelené do sekcií (Lanovky, Parkovanie, Ubytovanie, Služby, Technika)",
  "Výber výrobcu a potom modelu, s cenou a kapacitou už prepočítanou",
  "Letné sloty označené štítkom JAZDÍ AJ V LETE",
  "Namiesto vyskakovacích hlášok sa tlačidlo vypne a ukáže, koľko peňazí chýba",
  "Ratrak sa kupuje, nie stavia — vlastné tlačidlá aj ikona",
];

const OPRAVIT = [
  "Konkurencia sa zatiaľ nevyvíja — postaví a stojí, nemá úrovne",
  "Kryštály (mena za reálne peniaze) — ikony sú hotové, chýba stĺpec v databáze a napojenie",
  "Ľadovec je rozostavaný — má sloty, ale zóna sa v okne nedá otvoriť a nemá pool turistov",
  "Prémiové budovy majú ceny v eurách, majú byť v kryštáloch",
  "Chyba pri prestavbe parkoviska na centrálne — treba preveriť",
];

const PLANOVANE = [
  "Návod pre nových hráčov — manažér na okraji obrazovky, listovací sprievodca",
  "Vývoj konkurencie — hotel sa prestaví na vyšší podľa počtu turistov a podľa toho, čo postavíš ty",
  "Zónové počasie — na vrchole môže fúkať, kým v údolí sa lyžuje (a viac typov počasia)",
  "Ligy s postupom a zostupom na konci herného roka",
  "Misie napojené na reálne dáta (zatiaľ zástupné)",
  "Ďalšie typy udalostí — míľniky, sezónne udalosti, novinky",
  "Nastavenia a Správy do svetlej témy",
  "Letné obrázky zón Údolie, Hory a Ľadovec",
  "Náhodné incidenty (poruchy, sťažnosti)",
  "Sezónky — hráč pred sezónou nastaví počet a cenu, rozdelia sa cez celú sezónu",
  "Upratanie nepoužívaných súborov (AkcieBar, AppLayout, Nav, Sidebar, PrestizRadar, SlotModal, LanovkyPanel)",
];

const MONETIZACIA = [
  {
    nazov: "Predplatné (základ)",
    popis: "Mesačný poplatok s trvalými výhodami — rýchlejšia výstavba, viac slotov, častejšie zmeny cien. Hlavný a stabilný príjem (model Travian / Rail Nation).",
  },
  {
    nazov: "Kryštály",
    popis: "Herná mena za reálne peniaze. Kupujú sa za ne prémiové budovy — Solaris lanovky, parkovací dom, Summit Resort, prémiový ratrak, vodná nádrž, Panoramatický rezort.",
  },
  {
    nazov: "Kozmetika",
    popis: "Vzhľad strediska, farby kabín, špeciálne logá, rám okolo mena v rebríčku. Neovplyvňuje hru, takže bez pay-to-win.",
  },
  {
    nazov: "Sezónny pas",
    popis: "Platí sa raz za sezónu, plnením úloh získavaš odmeny. Opakuje sa a drží hráčov v hre.",
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

export default function InfoOkno() {
  return (
    <div>
      <div style={karta}>
        <h3 style={nadpisKarty}>
          <CheckCircle2 size={15} color="#2ca24e" strokeWidth={2.3} />
          Čo už funguje
        </h3>
        <ul style={zoznam}>
          {HOTOVE.map((polozka, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Users size={15} color="#2ca24e" strokeWidth={2.3} />
          Ekonomika a turisti
        </h3>
        <ul style={zoznam}>
          {EKONOMIKA.map((polozka, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Building2 size={15} color="#2f8ae0" strokeWidth={2.3} />
          Budovy, typy a výrobcovia
        </h3>
        <ul style={zoznam}>
          {BUDOVY.map((polozka, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Hammer size={15} color="#c9930f" strokeWidth={2.3} />
          Prestavba, búranie a predaj
        </h3>
        <ul style={zoznam}>
          {PRESTAVBA.map((polozka, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Palette size={15} color="#8a5fd6" strokeWidth={2.3} />
          Rozhranie a vzhľad
        </h3>
        <ul style={zoznam}>
          {UI_HOTOVE.map((polozka, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={{ ...karta, background: "#fff7ea", border: "1px solid rgba(239,154,61,0.32)" }}>
        <h3 style={nadpisKarty}>
          <AlertTriangle size={15} color="#c9830f" strokeWidth={2.3} />
          Treba dokončiť
        </h3>
        <ul style={{ ...zoznam, color: "#8a5f20" }}>
          {OPRAVIT.map((polozka, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{polozka}</li>
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

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <ListTodo size={15} color="#ef9a3d" strokeWidth={2.3} />
          Čo je v pláne
        </h3>
        <ul style={zoznam}>
          {PLANOVANE.map((polozka, i) => (
            <li key={i} style={{ marginBottom: 3 }}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={karta}>
        <h3 style={nadpisKarty}>
          <Wallet size={15} color="#c9930f" strokeWidth={2.3} />
          Monetizácia — plán do budúcna
        </h3>
        <p style={{ color: "#8a94a3", fontSize: 12, lineHeight: 1.55, marginTop: 0, marginBottom: 12 }}>
          Poradie podľa toho, čo prináša stabilný opakovaný príjem. Jednorazové nákupy sú slabý základ.
        </p>
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
          Monetizácia má zmysel až keď máš hráčov, ktorí hru hrajú mesiace. Najprv hra, potom zarábanie.
        </p>
      </div>
    </div>
  );
}
