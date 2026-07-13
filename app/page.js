"use client";

import { useState } from "react";
import { useGameState } from "../lib/useGameState";
import AuthForm from "../components/AuthForm";
import TopBar from "../components/TopBar";
import NavSide from "../components/NavSide";
import WindowModal from "../components/WindowModal";
import BudovyOkno from "../components/okna/BudovyOkno";
import VyjednavanieModal from "../components/VyjednavanieModal";
import PrestizRadar from "../components/PrestizRadar";
import LanovkyPanel from "../components/LanovkyPanel";
import PocasiePanel from "../components/PocasiePanel";
import { KATEGORIE } from "../lib/katalog";
import { hernyDatum } from "../lib/hernyCas";
import { jeZimnyMesiac } from "../lib/katalog";
import { vytvorNotifikacie } from "../lib/notifikacie";
import { cardStyle, buttonStyle, inputStyle } from "../lib/styles";

export default function PrehladPage() {
  const {
    session,
    stanica,
    budovy,
    loading,
    ukazVyjednavanie,
    potrebujeNazov,
    vytvorStanicu,
    vyjednatPlat,
    handleLogout,
    efektivitaBudovy,
    pocetKonkurencie,
    postavitBudovu,
    najatPreBudovu,
    prepustitPreBudovu,
    zmenitCenu,
    podmienkyOdomknutiaUdolia,
    odomknutUdolie,
    podmienkyOdomknutiaHor,
    odomknutHory,
  } = useGameState();

  const [novyNazov, setNovyNazov] = useState("");
  const [panelOtvoreny, setPanelOtvoreny] = useState(true);
  const [okno, setOkno] = useState(null);

  if (!session) return <AuthForm />;

  if (potrebujeNazov) {
    return (
      <main style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>🚡 Vitaj!</h1>
        <p style={{ color: "#9fb0bf", marginBottom: 16 }}>Ako sa bude volať tvoje stredisko?</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (novyNazov.trim()) vytvorStanicu(novyNazov.trim());
          }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <input
            type="text"
            placeholder="napr. Snežné sedlo"
            value={novyNazov}
            onChange={(e) => setNovyNazov(e.target.value)}
            required
            maxLength={40}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Založiť stredisko</button>
        </form>
      </main>
    );
  }

  if (loading || !stanica) {
    return <p style={{ color: "#9fb0bf", padding: 24 }}>Načítavam...</p>;
  }

  const voVystavbe = budovy.filter((b) => b.stav === "vo_vystavbe");
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");
  const podpriemernaEfektivita = hotoveBudovy.filter((b) => efektivitaBudovy(b) < 1).length;

  const suhrnKategorii = {};
  for (const b of hotoveBudovy) {
    suhrnKategorii[b.kategoria] = (suhrnKategorii[b.kategoria] || 0) + 1;
  }

  const notifikacie = vytvorNotifikacie(budovy, efektivitaBudovy, stanica);
  const mapaObrazok = jeZimnyMesiac(hernyDatum(new Date()).getMonth()) ? "/mapa-plna-zima.png" : "/mapa-plna-leto.png";

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#05090d" }}>
      <VyjednavanieModal ukaz={ukazVyjednavanie} onVyjednat={vyjednatPlat} />
      <NavSide onOtvorBudovy={() => setOkno("budovy")} />

      {okno === "budovy" && (
        <WindowModal title="🏗️ Budovy" onClose={() => setOkno(null)}>
          <BudovyOkno
            stanica={stanica}
            budovy={budovy}
            postavitBudovu={postavitBudovu}
            najatPreBudovu={najatPreBudovu}
            prepustitPreBudovu={prepustitPreBudovu}
            zmenitCenu={zmenitCenu}
            efektivitaBudovy={efektivitaBudovy}
            pocetKonkurencie={pocetKonkurencie}
            podmienkyOdomknutiaUdolia={podmienkyOdomknutiaUdolia}
            odomknutUdolie={odomknutUdolie}
            podmienkyOdomknutiaHor={podmienkyOdomknutiaHor}
            odomknutHory={odomknutHory}
          />
        </WindowModal>
      )}

      {/* Mapa na celú obrazovku — čisto dekoratívna */}
      <img
        src={mapaObrazok}
        alt="Mapa strediska"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center" }}
      />

      {/* Plávajúca horná lišta */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 3, background: "rgba(13,20,27,0.55)", backdropFilter: "blur(6px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", padding: "6px 12px" }}>
        <TopBar onLogout={handleLogout} stanica={stanica} budovy={budovy} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie} notifikacie={notifikacie} />
      </div>

      {/* Tlačidlo na zbalenie/rozbalenie info panelu */}
      <button
        onClick={() => setPanelOtvoreny((o) => !o)}
        title={panelOtvoreny ? "Skryť panel" : "Zobraziť panel"}
        style={{
          position: "absolute",
          top: 66,
          right: panelOtvoreny ? 272 : 12,
          zIndex: 4,
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "rgba(13,20,27,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#e8edf2",
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        {panelOtvoreny ? "›" : "‹"}
      </button>

      {/* Plávajúci info panel */}
      {panelOtvoreny && (
        <div style={{ position: "absolute", top: 66, right: 12, width: 250, maxHeight: "calc(100vh - 82px)", overflowY: "auto", zIndex: 3, display: "flex", flexDirection: "column", gap: 8 }}>
          <PocasiePanel />

          <div style={{ ...cardStyle, textAlign: "center" }}>
            <div style={{ color: "#9fb0bf", fontSize: 13, marginBottom: 4 }}>{stanica.nazov}</div>
            <div style={{ color: "#9fb0bf", fontSize: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <span>🏗️ Hotových budov: <strong style={{ color: "#e8edf2" }}>{hotoveBudovy.length}</strong></span>
              <span>🚧 Vo výstavbe: <strong style={{ color: "#e8edf2" }}>{voVystavbe.length}</strong></span>
              {podpriemernaEfektivita > 0 && (
                <span style={{ color: "#f2994a" }}>⚠️ {podpriemernaEfektivita} budov beží na zníženú efektivitu</span>
              )}
            </div>

            {Object.keys(suhrnKategorii).length > 0 && (
              <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {Object.keys(suhrnKategorii).map((kat) => (
                  <div key={kat} style={{ fontSize: 14, color: "#9fb0bf" }}>
                    {KATEGORIE[kat].ikona} {KATEGORIE[kat].nazov}: <strong style={{ color: "#e8edf2" }}>{suhrnKategorii[kat]}</strong>
                  </div>
                ))}
              </div>
            )}

            {hotoveBudovy.length === 0 && voVystavbe.length === 0 && (
              <p style={{ color: "#657685", fontSize: 15, marginTop: 8 }}>
                Zatiaľ nemáš žiadnu budovu. Choď na stránku <strong>Budovy</strong> a postav prvú.
              </p>
            )}
          </div>

          <PrestizRadar budovy={budovy} efektivitaBudovy={efektivitaBudovy} />
          <LanovkyPanel budovy={budovy} efektivitaBudovy={efektivitaBudovy} />
        </div>
      )}
    </div>
  );
}
