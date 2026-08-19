"use client";

import { CheckCircle2, CloudSun, ListTodo, Palette } from "lucide-react";

const HOTOVE = [
  "Registrácia a prihlásenie hráčov, vlastný názov strediska",
  "Peniaze (trvalé) a Prestíž — rozdelená na pevnú časť z budov a sezónnu časť z turistov",
  "9 kategórií budov: lanovky, parkoviská, pokladňa, penzióny/hotely, ratraky, zasnežovanie, bary, servis/požičovňa",
  "Zóny strediska (Lúka → Údolie → Hory → Ľadovec) s limitovaným počtom slotov na kategóriu a postupným odomykaním za peniaze + prestíž",
  "Výstavba na reálny čas (beží aj keď nie si online)",
  "Nastaviteľné ceny pri budovách s vlastným príjmom, dopyt reaguje na cenu — platí aj pre parkovisko a ubytovanie",
  "Sezónna krivka cien (Október-Máj zima, Jún-September leto) — referenčná cena sa mení podľa mesiaca",
  "Denný model príjmu pre parkovisko a ubytovanie (paušál/deň, nie hodinový prietok ako pri lanovkách)",
  "Zamestnanci — automaticky na plný stav, súčasť nákladov na prevádzku",
  "Ročné vyjednávanie o plat (Údolie+, december–január), efektivita klesne pri odmietnutí",
  "Konkurencia — objavuje sa po 90 dňoch, stavia rovnako dlho ako ty, znižuje dopyt (25%), zvyšuje prestíž strediska",
  "Denná spokojnosť Lúky — pokrytie parkoviska/bufetu voči davu z vlekov, minimum 30 % (kliknuteľné v hornom paneli)",
  "Vlek v lete bez bobovej dráhy nezarába nič — Bobová dráha (200-450k €) umožňuje celoročnú prevádzku",
  "Ratrak (Údolie) — bez neho -10 % spokojnosť v zime, mzdy zamestnancov bežia celoročne",
  "Zasnežovanie — manuálny prepínač ZAP/VYP, previazané s vetrom (silný vietor = nefunguje aj keď zapnuté), elektrina 127 €/h len Nov-Feb",
  "Medzisezóna (1.-7. október) — stredisko je skutočne zatvorené, žiadny príjem, mzdy/údržba bežia ďalej",
  "Sezónny reset prestíže — prestíž z turistov sa vynuluje raz za ročný cyklus (1 zima + 1 leto), rovnako pre všetkých hráčov naraz",
  "Údržba budov — % z hodnoty rastie s vekom strediska, každý 3. rok nárazovo vyššia, +50 % pre zónu Hory",
  "Ligový systém — spoločný pool turistov na zónu, delený podľa prestíže; nováčikovský bonus (3× klesá na 1× za 90 dní); ligy = 10 najbližšie registrovaných hráčov",
  "Úpadok prestíže pri dlhodobo nízkych peniazoch (pod 50 000 € dlhšie ako 3 týždne)",
  "Počasie — denne sa mení, vietor a búrky ovplyvňujú dopyt lanoviek/parkovísk/zasnežovania (pozri tabuľku nižšie)",
  "Herný kalendár — beží 2× rýchlejšie ako reálny čas, dátum v hornom paneli je kliknuteľný",
  "Rebríček hráčov podľa prestíže, verejné profily hráčov",
  "Financie — denný/týždenný/mesačný/sezónny prehľad zárobkov a výdavkov podľa kategórie",
  "Nastavenia — zmena názvu, emailu, hesla, zmazanie dát",
  "Mapa strediska na pozadí (mení sa zima/leto), navigácia cez okná priamo nad mapou",
  "Časovač na pozadí — ekonomika sa počíta pre všetkých hráčov automaticky raz za hodinu, aj bez otvorenej appky",
  "Ski konzorciá — zakladanie, žiadosti o vstup, pozvánky, spoločná nástenka",
  "Správy medzi hráčmi",
];

const UI_HOTOVE = [
  "Svetlá „ľadová\" téma naprieč hrou — biele frostové panely, jednotné farby a tiene",
  "Fonty Sora (nadpisy a čísla) a Inter (text) načítané cez Next.js",
  "Horná lišta cez celú šírku — logo strediska, názov, štatistiky, notifikácie a nastavenia",
  "Logo strediska ako Lucide ikona (15 na výber pri zakladaní) namiesto emoji",
  "Emoji nahradené Lucide ikonami v celej hre",
  "Počasie presunuté do hornej lišty ako rozbaľovací panel",
  "Panel zóny — obrázok zóny (mení sa podľa sezóny), prepínanie šípkami, štatistiky, tlačidlo Spravovať zónu",
  "Panel rebríčka — ukazuje hráčov okolo teba a tvoje poradie",
  "Panel týždenných misií (zatiaľ so zástupnými dátami)",
  "Panel udalostí — napojený na skutočný stav hry, odbory sa zobrazia keď naozaj žiadajú",
  "Mapa strediska cez celé pozadie, prispôsobená na rôzne monitory",
  "Jednotná veľkosť a vzhľad všetkých okien",
];

const PLANOVANE = [
  "Návod pre nových hráčov — manažér na okraji obrazovky, listovací sprievodca na 8 strán",
  "Výrobcovia lanoviek — rôzne ceny, kapacity, rýchlosť, údržba, spotreba a spoľahlivosť",
  "Ligy s postupom a zostupom na konci herného roka",
  "Misie napojené na reálne dáta (zatiaľ zástupné)",
  "Ďalšie typy udalostí — míľniky, sezónne udalosti, novinky",
  "Letné obrázky zón Údolie, Hory a Ľadovec",
  "Zvyšné okná do svetlej témy (Budovy, Nastavenia, Aliancia, Fórum, Správy, Rebríček)",
  "Spokojnosť Infraštruktúra — prechod na skutočný pomer kapacita/dopyt (nie len „máš/nemáš\")",
  "Anti-cheat pre ligu — prestíž pod hranicou sa nebude počítať do súčtu ligy",
  "Ľadovec — vlastný (lacnejší) ratrak systém, obmedzené/žiadne leto",
  "Náhodné incidenty (poruchy, sťažnosti)",
  "Upratanie nepoužívaných súborov v projekte",
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
          <Palette size={15} color="#8a5fd6" strokeWidth={2.3} />
          Rozhranie a vzhľad
        </h3>
        <ul style={zoznam}>
          {UI_HOTOVE.map((polozka, i) => (
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
          o 25 % (len júl/august). Zasnežovanie pri silnom vetre nefunguje vôbec, aj keď je zapnuté.
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

      <p style={{ color: "#aebccd", fontSize: 11, marginTop: 4, lineHeight: 1.45 }}>
        Kompletný herný dizajnový dokument (GDD.md) obsahuje všetky detaily a čísla — nájdeš ho v GitHub repozitári
        projektu.
      </p>
    </div>
  );
}
