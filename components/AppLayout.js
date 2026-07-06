"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AkcieBar from "./AkcieBar";
import { vytvorNotifikacie } from "../lib/notifikacie";

export default function AppLayout({ session, stanica, budovy, handleLogout, efektivitaBudovy, children }) {
  const notifikacie = stanica ? vytvorNotifikacie(budovy, efektivitaBudovy, stanica) : [];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar notifikacie={notifikacie} />
      <main style={{ flex: 1, padding: 24, maxWidth: 900 }}>
        {stanica && (
          <TopBar
            email={session.user.email}
            onLogout={handleLogout}
            stanica={stanica}
            budovy={budovy}
            efektivitaBudovy={efektivitaBudovy}
          />
        )}
        {children}
        <AkcieBar />
      </main>
    </div>
  );
}
