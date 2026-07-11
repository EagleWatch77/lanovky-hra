"use client";

import TopBar from "./TopBar";
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
        <div style={{ ...cardStyle, marginTop: 0, padding: "10px 16px" }}>
          <TopBar onLogout={handleLogout} stanica={stanica} budovy={budovy} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie} notifikacie={notifikacie} />
        </div>
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
