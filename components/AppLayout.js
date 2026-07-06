"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AkcieBar from "./AkcieBar";
import { vytvorNotifikacie } from "../lib/notifikacie";

const POZADIE_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="obloha" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1420"/>
      <stop offset="60%" stop-color="#0d1b2a"/>
      <stop offset="100%" stop-color="#142433"/>
    </linearGradient>
    <linearGradient id="hora1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a3a4a"/>
      <stop offset="100%" stop-color="#1a2632"/>
    </linearGradient>
    <linearGradient id="hora2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a4d5e"/>
      <stop offset="100%" stop-color="#22303c"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#obloha)"/>
  <polygon points="0,600 250,350 450,550 650,300 900,600 1600,400 1600,900 0,900" fill="url(#hora1)" opacity="0.7"/>
  <polygon points="0,700 300,500 600,650 850,450 1150,700 1600,550 1600,900 0,900" fill="url(#hora2)"/>
  <polygon points="250,350 300,400 200,400" fill="#c9d6de" opacity="0.5"/>
  <polygon points="650,300 700,360 590,360" fill="#c9d6de" opacity="0.5"/>
  <polygon points="850,450 900,500 800,500" fill="#c9d6de" opacity="0.4"/>
</svg>
`)}`;

export default function AppLayout({ session, stanica, budovy, handleLogout, efektivitaBudovy, children }) {
  const notifikacie = stanica ? vytvorNotifikacie(budovy, efektivitaBudovy, stanica) : [];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        padding: 16,
        gap: 16,
        boxSizing: "border-box",
        backgroundImage: `url("${POZADIE_SVG}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Sidebar notifikacie={notifikacie} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0, maxWidth: 1000 }}>
        {stanica && (
          <TopBar
            email={session.user.email}
            onLogout={handleLogout}
            stanica={stanica}
            budovy={budovy}
            efektivitaBudovy={efektivitaBudovy}
          />
        )}
        <div style={{ flex: 1 }}>{children}</div>
        <AkcieBar />
      </main>
    </div>
  );
}
