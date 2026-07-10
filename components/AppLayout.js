"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AkcieBar from "./AkcieBar";
import { vytvorNotifikacie } from "../lib/notifikacie";
import { cardStyle } from "../lib/styles";
import { jeZimnyMesiac } from "../lib/katalog";
import { hernyDatum } from "../lib/hernyCas";

export default function AppLayout({ session, stanica, budovy, handleLogout, efektivitaBudovy, pocetKonkurencie, children }) {
  const notifikacie = stanica ? vytvorNotifikacie(budovy, efektivitaBudovy, stanica) : [];
  const jeZima = jeZimnyMesiac(hernyDatum(new Date()).getMonth());
  const mapaObrazok = jeZima ? "/mapa-cistazima.png" : "/mapa-cistaleto.png";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxSizing: "border-box",
        backgroundImage: `url("${mapaObrazok}")`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#05090d",
      }}
    >
      {stanica && (
        <div style={{ ...cardStyle, marginTop: 0, padding: "14px 20px" }}>
          <TopBar onLogout={handleLogout} stanica={stanica} budovy={budovy} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie} />
        </div>
      )}

      <div style={{ display: "flex", gap: 16, flex: 1 }}>
        <Sidebar notifikacie={notifikacie} />
        <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          {children}
          <AkcieBar />
        </main>
      </div>
    </div>
  );
}
