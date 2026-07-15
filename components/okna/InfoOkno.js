"use client";

import { cardStyle } from "../../lib/styles";

const HOTOVE = [
  "Registrácia a prihlásenie hráčov, vlastný názov strediska",
  "Peniaze a Prestíž (oddelené hodnoty)",
  "9 kategórií budov: lanovky, parkoviská, pokladňa, penzióny/hotely, ratraky, zasnežovanie, bary, servis/požičovňa, obchody — každá s 1 pevným typom a cenou",
  "Zóny strediska (Lúka → Údolie → Hory → Ľadovec) s limitovaným počtom slotov na kategóriu a postupným odomykaním za peniaze + prestíž",
  "Výstavba na reálny čas (beží aj keď nie si online)",
  "Nastaviteľné ceny pri budovách s vlastným príjmom, dopyt reaguje na cenu",
  "Zamestnanci — automaticky na plný stav, súčasť nákladov na prevádzku",
  "Ročné kalendárne vyjednávanie o plat (herný 23.–31. december), efektivita klesne pri odmietnutí",
  "Konkurencia — objavuje sa po 90 dňoch, stavia rovnako dlho ako ty, znižuje dopyt, zvyšuje prestíž strediska",
  "Úpadok prestíže pri dlhodobo nízkych peniazoch (pod 50 000 € dlhšie ako 3 týždne)",
  "Počasie — denne sa mení, vietor a búrky ovplyvňujú dopyt lanoviek/parkovísk (pozri tabuľku nižšie)",
  "Herný kalendár — beží 2× rýchlejšie ako reálny čas, sezóny a ročník podľa herného dátumu",
  "Rebríček hráčov podľa prestíže, verejné profily hráčov",
  "Financie — denný/týždenný/mesačný/sezónny prehľad zárobkov a výdavkov podľa kategórie",
  "Nastavenia — zmena názvu, emailu, hesla, zmazanie dát",
  "Mapa strediska na pozadí (mení sa zima/leto), navigácia cez okná priamo nad mapou",
];

const PLANOVANE = [
  "Klikacie body priamo na mape (stavanie kliknutím na konkrétne miesto)",
  "Náhodné incidenty (poruchy, sťažnosti)",
  "Ligový systém s postupom/zostupom",
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
          Počasie sa mení každý deň, rovnaké pre všetkých hráčov. Silný vietor znižuje príjem lanoviek o 66 %, búrka o 25 % (len júl/august). Parkoviská reagujú na vietor inak podľa času.
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
