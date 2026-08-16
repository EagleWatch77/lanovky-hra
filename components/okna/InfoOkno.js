"use client";

import { cardStyle } from "../../lib/styles";

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
  "Medzisezóna (25.-31. máj, 1.-7. október) — stredisko je skutočne zatvorené, žiadny príjem, mzdy/údržba bežia ďalej",
  "Sezónny reset prestíže — prestíž z turistov sa vynuluje raz za ročný cyklus (1 zima + 1 leto), rovnako pre všetkých hráčov naraz",
  "Údržba budov — % z hodnoty rastie s vekom strediska, každý 3. rok nárazovo vyššia, +50 % pre zónu Hory",
  "Ligový systém — spoločný pool turistov na zónu, delený podľa prestíže; nováčikovský bonus (3× klesá na 1× za 90 dní); ligy = 10 najbližšie registrovaných hráčov",
  "Úpadok prestíže pri dlhodobo nízkych peniazoch (pod 50 000 € dlhšie ako 3 týždne)",
  "Počasie — denne sa mení, vietor a búrky ovplyvňujú dopyt lanoviek/parkovísk/zasnežovania (pozri tabuľku nižšie)",
  "Herný kalendár — beží 2× rýchlejšie ako reálny čas, dátum v hornom paneli je kliknuteľný (ukáže hranice aktuálnej a ďalšej sezóny)",
  "Rebríček hráčov podľa prestíže, verejné profily hráčov",
  "Financie — denný/týždenný/mesačný/sezónny prehľad zárobkov a výdavkov podľa kategórie",
  "Nastavenia — zmena názvu, emailu, hesla, zmazanie dát",
"Mapa strediska na pozadí (mení sa zima/leto), navigácia cez okná priamo nad mapou",
  "Časovač na pozadí — ekonomika sa počíta pre všetkých hráčov automaticky raz za hodinu, aj bez otvorenej appky",
  "Herný čas s hodinami/minútami v hornom paneli",
  "Kliknuteľný dátum v paneli — ukáže hranice aktuálnej aj ďalšej sezóny, vrátane medzisezóny",
  "Medzisezóna (1.-7. október) — stredisko je počas nej zatvorené, žiadny príjem",
];
const PLANOVANE = [
  "Anti-cheat pre ligu — prestíž pod hranicou (napr. 10) sa nebude počítať do súčtu ligy, rieši multi-účty aj dlho neaktívnych hráčov",
  "Denný počet turistov v hornom paneli (kliknuteľný rozpis podľa jednotlivých budov, sčíta sa cez celý herný deň)",
  "Nový transparentný vzorec spokojnosti (jednotlivé postihy namiesto skrytého násobenia)",
  "Oprava panela Lanovky — má ukazovať skutočnú vyťaženosť dopytom, nie efektivitu zamestnancov",
  "Ľadovec — vlastný (lacnejší) ratrak systém, obmedzené/žiadne leto (ochrana ľadovca pre budúce generácie)",
  "Ubytovacia spokojnosť — kapacita penziónov/hotelov vs. skutočný dopyt na prespanie",
  "Klikacie body priamo na mape (stavanie kliknutím na konkrétne miesto)",
  "Náhodné incidenty (poruchy, sťažnosti)",
  "Ligový systém s postupom/zostupom medzi úrovňami",
  "Aliancie a spoločné projekty",
  "Južná strana strediska (rozšírenie)",
];

const TYPY_POCASIA_TABULKA = [
  { nazov: "Slnečno", zima: "25%", leto: "35%" },
  { nazov: "Zamračené", zima: "30%", leto: "25%" },
  { nazov: "Polojasno", zima: "15%", leto: "20%" },
  { nazov: "Sneží", zima: "25%", leto: "—" },
  { nazov: "Prší", zima: "5%", leto: "20%" },
  { nazov: "Búrka (len júl/august)", zima: "—", leto: "4%" },
];

export default function InfoOkno() {
  return (
    <div>
      <div style={{ ...cardStyle, marginTop: 0 }}>
        <h3 style={{ marginTop: 0 }}>✅ Čo už funguje</h3>
        <ul style={{ color: "#e8edf2", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          {HOTOVE.map((polozka, i) => (
            <li key={i}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>🌦️ Typy počasia</h3>
        <p style={{ color: "#9fb0bf", fontSize: 13 }}>
          Počasie sa mení každý deň, rovnaké pre všetkých hráčov. Silný vietor znižuje príjem lanoviek o 66 %, búrka o 25 % (len júl/august). Parkoviská reagujú na vietor inak podľa času. Zasnežovanie pri silnom vetre nefunguje vôbec, aj keď je zapnuté.
        </p>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #223040" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#9fb0bf" }}>Typ počasia</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#9fb0bf" }}>❄️ Zima</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#9fb0bf" }}>☀️ Leto</th>
              </tr>
            </thead>
            <tbody>
              {TYPY_POCASIA_TABULKA.map((r) => (
                <tr key={r.nazov} style={{ borderBottom: "1px solid #1a2632" }}>
                  <td style={{ padding: "6px 8px" }}>{r.nazov}</td>
                  <td style={{ textAlign: "right", padding: "6px 8px", color: "#e8edf2" }}>{r.zima}</td>
                  <td style={{ textAlign: "right", padding: "6px 8px", color: "#e8edf2" }}>{r.leto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>🔜 Čo je v pláne</h3>
        <ul style={{ color: "#9fb0bf", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          {PLANOVANE.map((polozka, i) => (
            <li key={i}>{polozka}</li>
          ))}
        </ul>
      </div>

      <p style={{ color: "#657685", fontSize: 12, marginTop: 8 }}>
        Kompletný herný dizajnový dokument (GDD.md) obsahuje všetky detaily a čísla — nájdeš ho v GitHub repozitári projektu.
      </p>
    </div>
  );
}
