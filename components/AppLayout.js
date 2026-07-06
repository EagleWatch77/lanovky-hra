"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout({ session, stanica, budovy, handleLogout, efektivitaBudovy, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
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
      </main>
    </div>
  );
}
