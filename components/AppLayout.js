"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AkcieBar from "./AkcieBar";
import { vytvorNotifikacie } from "../lib/notifikacie";

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
        backgroundImage: `url("/pozadie-hory.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Sidebar notifikacie={notifikacie} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
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
