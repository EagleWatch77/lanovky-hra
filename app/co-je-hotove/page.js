"use client";

import { useGameState } from "../../lib/useGameState";
import AuthForm from "../../components/AuthForm";
import Nav from "../../components/Nav";
import { cardStyle } from "../../lib/styles";

const HOTOVE = [
  "Registrácia a prihlásenie hráčov",
  "Peniaze a Prestíž (oddelené hodnoty)",
  "9 kategórií budov: lanovky, parkoviská, pokladne, hotely, ratraky, zasnežovanie, bary, servis/požičovňa, obchody",
  "Výrobné značky pri lanovkách (Alpinor/Montera/Nordtech) a ratrakoch (Snowtrac/Pistenwolf)",
  "Výstavba na reálny čas (beží aj keď nie si online)",
  "Nastaviteľné ceny pri budovách s vlastným príjmom, dopyt reaguje na cenu",
  "Zamestnanci per budova — automaticky najatí pri dokončení stavby, dajú sa prepustiť/dohodnúť",
  "Ročné kalendárne vyjednávanie o plat (23.–31. december)",
  "Rebríček hráčov podľa prestíže",
  "Rozdelenie appky na viac stránok (Prehľad / Budovy / Rebríček / Čo je hotové)",
];

const PLANOVANE = [
  "Vzdialenostná mechanika — parkovisko/pokladňa blízko vs ďaleko od lanovky",
  "Počasie ovplyvňujúce denný dopyt",
  "Náhodné incidenty (poruchy, sťažnosti)",
  "Konkurencia — sledovanie cien iných hráčov",
  "Ligový systém s postupom/zostupom",
  "Aliancie a spoločné projekty",
  "Vylepšenie grafiky a celkového vzhľadu",
];

export default function CoJeHotovePage() {
  const { session, loading, handleLogout } = useGameState();

  if (!session) return <AuthForm />;

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <Nav email={session.user.email} onLogout={handleLogout} />

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>✅ Čo už funguje</h3>
        <ul style={{ color: "#e8edf2", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          {HOTOVE.map((polozka, i) => (
            <li key={i}>{polozka}</li>
          ))}
        </ul>
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
    </main>
  );
}
