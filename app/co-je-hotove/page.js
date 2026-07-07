"use client";

import { useGameState } from "../../lib/useGameState";
import AuthForm from "../../components/AuthForm";
import AppLayout from "../../components/AppLayout";
import { cardStyle } from "../../lib/styles";

const HOTOVE = [
  "Registrácia a prihlásenie hráčov, vlastný názov strediska",
  "Peniaze a Prestíž (oddelené hodnoty)",
  "9 kategórií budov: lanovky, parkoviská, pokladne, hotely, ratraky, zasnežovanie, bary, servis/požičovňa, obchody",
  "Výrobné značky pri lanovkách (Alpinor/Montera/Nordtech) a ratrakoch (Snowtrac/Pistenwolf)",
  "Výstavba na reálny čas (beží aj keď nie si online)",
  "Nastaviteľné ceny pri budovách s vlastným príjmom, dopyt reaguje na cenu",
  "Zamestnanci per budova — automaticky najatí pri dokončení stavby, dajú sa prepustiť/dohodnúť",
  "Ročné kalendárne vyjednávanie o plat (23.–31. december)",
  "Konkurencia — objavuje sa po 90 dňoch, stavia rovnako dlho ako ty, znižuje dopyt, zvyšuje prestíž strediska",
  "Úpadok prestíže pri dlhodobo nízkych peniazoch (pod 50 000 € dlhšie ako 3 týždne)",
  "Počasie — denne sa mení, ovplyvňuje dopyt lanoviek podľa sily vetra (pozri tabuľku nižšie)",
  "Rebríček hráčov podľa prestíže",
  "Financie — denný/týždenný/mesačný/sezónny/ročný prehľad zárobkov a výdavkov podľa kategórie",
  "Nastavenia — zmena názvu, emailu, hesla, zmazanie dát",
  "Bočné menu, horná lišta so štatistikami, radar graf prestíže",
];

const PLANOVANE = [
  "Vzdialenostná mechanika — parkovisko/pokladňa blízko vs ďaleko od lanovky",
  "Náhodné incidenty (poruchy, sťažnosti)",
  "Ligový systém s postupom/zostupom",
  "Aliancie a spoločné projekty",
  "Ďalšie vylepšenie grafiky (napr. mapa strediska)",
];

const TYPY_POCASIA_TABULKA = [
  { nazov: "Slnečno", zima: "25%", leto: "35%" },
  { nazov: "Zamračené", zima: "30%", leto: "25%" },
  { nazov: "Polojasno", zima: "15%", leto: "20%" },
  { nazov: "Sneží", zima: "25%", leto: "—" },
  { nazov: "Prší", zima: "5%", leto: "20%" },
];

const VZORY_VETRA_TABULKA = [
  { nazov: "Žiadny silný vietor", zima: "96%", leto: "98%" },
  { nazov: "Silný vietor celý deň", zima: "2%", leto: "1%" },
  { nazov: "Silný vietor od 12:00", zima: "1%", leto: "0,5%" },
  { nazov: "Silný vietor do 12:00", zima: "1%", leto: "0,5%" },
];

export default function CoJeHotovePage() {
  const { session, stanica, budovy, handleLogout, efektivitaBudovy, pocetKonkurencie } = useGameState();

  if (!session) return <AuthForm />;

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>✅ Čo už funguje</h3>
        <ul style={{ color: "#e8edf2", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          {HOTOVE.map((polozka, i) => (
            <li key={i}>{polozka}</li>
          ))}
        </ul>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>🌦️ Typy počasia a vietor</h3>
        <p style={{ color: "#9fb0bf", fontSize: 13 }}>Počasie sa mení každý deň, rovnaké pre všetkých hráčov. Pri vetre 20 m/s a viac lanovky nepremávajú (podielovo podľa toho, koľko z dňa vietor fúka).</p>

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

        <p style={{ color: "#9fb0bf", fontSize: 13, marginTop: 16, marginBottom: 4 }}>Vzory silného vetra (20-30 m/s):</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #223040" }}>
                <th style={{ textAlign: "left", padding: "6px 8px", color: "#9fb0bf" }}>Vzor</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#9fb0bf" }}>❄️ Zima</th>
                <th style={{ textAlign: "right", padding: "6px 8px", color: "#9fb0bf" }}>☀️ Leto</th>
              </tr>
            </thead>
            <tbody>
              {VZORY_VETRA_TABULKA.map((r) => (
                <tr key={r.nazov} style={{ borderBottom: "1px solid #1a2632" }}>
                  <td style={{ padding: "6px 8px" }}>{r.nazov}</td>
                  <td style={{ textAlign: "right", padding: "6px 8px", color: "#e8edf2" }}>{r.zima}</td>
                  <td style={{ textAlign: "right", padding: "6px 8px", color: "#e8edf2" }}>{r.leto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "#657685", fontSize: 11, marginTop: 8 }}>
          Navyše cca 0,5 % dní nastane vzácna kombinácia "slnečno + silný vietor celý deň".
        </p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>🔜 Čo je v pláne</h3>
        <ul style={{ color: "#9fb0bf", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          {PLANOVANE.map((polozka, i) => (
            <li key={i}>{polozka}</li>
          ))}
        </ul>
      </div>

      <p style={{ color: "#657685", fontSize: 12, marginTop: 16 }}>
        Kompletný herný dizajnový dokument (GDD.md) obsahuje všetky detaily a čísla — nájdeš ho v GitHub repozitári projektu.
      </p>
    </AppLayout>
  );
}
