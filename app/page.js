"use client";

import { useState } from "react";
import { useGameState } from "../lib/useGameState";
import AuthForm from "../components/AuthForm";
import TopBar from "../components/TopBar";
import TopBarPrava from "../components/TopBarPrava";
import NavSide from "../components/NavSide";
import WindowModal from "../components/WindowModal";
import BudovyOkno from "../components/okna/BudovyOkno";
import KonkurenciaOkno from "../components/okna/KonkurenciaOkno";
import FinancieOkno from "../components/okna/FinancieOkno";
import RebricekOkno from "../components/okna/RebricekOkno";
import InfoOkno from "../components/okna/InfoOkno";
import NastaveniaOkno from "../components/okna/NastaveniaOkno";
import VyjednavanieModal from "../components/VyjednavanieModal";
import LanovkyPanel from "../components/LanovkyPanel";
import PocasiePanel from "../components/PocasiePanel";
import { hernyDatum } from "../lib/hernyCas";
import { jeZimnyMesiac } from "../lib/katalog";
import { vytvorNotifikacie } from "../lib/notifikacie";
import { cardStyle, buttonStyle, inputStyle } from "../lib/styles";

const LOGA = ["🏔️", "🚡", "⛷️", "🎿", "🏂", "🗻", "❄️", "🏨", "🎫", "🌲", "🏕️", "🚠", "🛷", "⛰️", "🥌", "🧊"];

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
    konkurenciaJednotky,
    premenovatStanicu,
    zmenitLogo,
    zmenitEmail,
    zmenitHeslo,
    zmazatMojeData,
  } = useGameState();

  const [novyNazov, setNovyNazov] = useState("");
  const [vybraneLogo, setVybraneLogo] = useState("🏔️");
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
            if (novyNazov.trim()) vytvorStanicu(novyNazov.trim(), vybraneLogo);
          }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <label style={{ fontSize: 13, color: "#9fb0bf" }}>Vyber logo strediska</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LOGA.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setVybraneLogo(l)}
                style={{
                  fontSize: 24,
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  border: vybraneLogo === l ? "2px solid #2f9e6e" : "1px solid #2a3744",
                  background: vybraneLogo === l ? "rgba(47,158,110,0.2)" : "#0f1720",
                  cursor: "pointer",
                }}
              >
                {l}
              </button>
            ))}
          </div>
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
      <NavSide
        onOtvorBudovy={() => setOkno("budovy")}
        onOtvorKonkurencia={() => setOkno("konkurencia")}
        onOtvorFinancie={() => setOkno("financie")}
        onOtvorRebricek={() => setOkno("rebricek")}
        onOtvorInfo={() => setOkno("info")}
      />

      {okno === "nastavenia" && (
        <WindowModal title="⚙️ Nastavenia" onClose={() => setOkno(null)} width={520}>
          <NastaveniaOkno
            session={session}
            stanica={stanica}
            premenovatStanicu={premenovatStanicu}
            zmenitLogo={zmenitLogo}
            zmenitEmail={zmenitEmail}
            zmenitHeslo={zmenitHeslo}
            zmazatMojeData={zmazatMojeData}
          />
        </WindowModal>
      )}

      {okno === "info" && (
        <WindowModal title="ℹ️ Info" onClose={() => setOkno(null)} width={560}>
          <InfoOkno />
        </WindowModal>
      )}

      {okno === "rebricek" && (
        <WindowModal title="🏆 Rebríček podľa prestíže" onClose={() => setOkno(null)} width={480}>
          <RebricekOkno stanica={stanica} />
        </WindowModal>
      )}

      {okno === "financie" && (
        <WindowModal title="💰 Financie" onClose={() => setOkno(null)} width={640}>
          <FinancieOkno stanica={stanica} />
        </WindowModal>
      )}

      {okno === "konkurencia" && (
        <WindowModal title="🛡️ Konkurencia" onClose={() => setOkno(null)} width={480}>
          <KonkurenciaOkno konkurenciaJednotky={konkurenciaJednotky} />
        </WindowModal>
      )}

      {okno === "budovy" && (
        <WindowModal title="🏗️ Budovy" onClose={() => setOkno(null)} width={640}>
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

      {/* Samostatné logo — bez rámika, priamo na mape */}
      <div style={{ position: "absolute", top: 8, left: 12, zIndex: 3, fontSize: 42, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
        {stanica.logo || "🏔️"}
      </div>

      {/* Plávajúci zhluk vľavo hore — názov, štatistiky */}
      <div style={{ position: "absolute", top: 12, left: 70, zIndex: 3, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", padding: "6px 12px" }}>
        <TopBar stanica={stanica} budovy={budovy} efektivitaBudovy={efektivitaBudovy} />
      </div>

      {/* Plávajúci zhluk vpravo hore — notifikácie, nastavenia, odhlásiť */}
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 3, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", padding: "6px 8px" }}>
        <TopBarPrava notifikacie={notifikacie} onOtvorNastavenia={() => setOkno("nastavenia")} onLogout={handleLogout} />
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

        

         <LanovkyPanel budovy={budovy} efektivitaBudovy={efektivitaBudovy} />
        </div>
      )}
    </div>
  );
}
