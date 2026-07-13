"use client";

import { useState } from "react";
import { useGameState } from "../lib/useGameState";
import AuthForm from "../components/AuthForm";
import TopBar from "../components/TopBar";
import NavSide from "../components/NavSide";
import VyjednavanieModal from "../components/VyjednavanieModal";
import SlotModal from "../components/SlotModal";
import PrestizRadar from "../components/PrestizRadar";
import LanovkyPanel from "../components/LanovkyPanel";
import PocasiePanel from "../components/PocasiePanel";
import { KATEGORIE, LANOVKY_TYPY } from "../lib/katalog";
import { hernyDatum } from "../lib/hernyCas";
import { jeZimnyMesiac } from "../lib/katalog";
import { vytvorNotifikacie } from "../lib/notifikacie";
import { cardStyle, buttonStyle, inputStyle } from "../lib/styles";

const NELANOVKOVE_TYPY = Object.keys(LANOVKY_TYPY).filter((t) => t !== "vlek");

// Klikacie sloty (moje budovy) v zóne Lúka
const SLOTY_LUKA = [
  { id: "vlek1", kategoria: "lanovka", typFilter: ["vlek"], poradie: 0, left: "56.4%", top: "89.3%" },
  { id: "vlek2", kategoria: "lanovka", typFilter: ["vlek"], poradie: 1, left: "59.8%", top: "89.3%" },
  { id: "lanovka", kategoria: "lanovka", typFilter: NELANOVKOVE_TYPY, poradie: 0, left: "43.5%", top: "86.0%", zamykaHory: true },
  { id: "parkovisko", kategoria: "parkovisko", typFilter: null, poradie: 0, left: "15.7%", top: "92.8%" },
  { id: "bufet", kategoria: "bar", typFilter: null, poradie: 0, left: "35.0%", top: "77.2%" },
  { id: "penzion1", kategoria: "hotel", typFilter: null, poradie: 0, left: "80.4%", top: "94.3%" },
  { id: "penzion2", kategoria: "hotel", typFilter: null, poradie: 1, left: "74.7%", top: "92.1%" },
  { id: "pokladna", kategoria: "pokladna", typFilter: null, poradie: 0, left: "59.8%", top: "94.8%" },
];

// Vizuálne body konkurencie (nie klikacie) v zóne Lúka
const KONKURENCIA_MARKERY_LUKA = [
  { kat: "bar", poradie: 0, left: "24.8%", top: "77.6%" },
  { kat: "hotel", poradie: 0, left: "77.6%", top: "85.5%" },
  { kat: "hotel", poradie: 1, left: "86.9%", top: "90.9%" },
  { kat: "parkovisko", poradie: 0, left: "68.9%", top: "96.5%" },
];

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
  } = useGameState();

  const [novyNazov, setNovyNazov] = useState("");
  const [panelOtvoreny, setPanelOtvoreny] = useState(true);
  const [otvorenySlot, setOtvorenySlot] = useState(null);

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
  const mapaObrazok = jeZimnyMesiac(hernyDatum(new Date()).getMonth()) ? "/mapa-cistazima.png" : "/mapa-cistaleto.png";

  // Nájde N-tú (podľa poradia postavenia) budovu zodpovedajúcu slotu
  function najdiBudovuProSlot(zona, kategoria, typFilter, poradie) {
    const zhody = budovy
      .filter((b) => b.zona === zona && b.kategoria === kategoria && (!typFilter || typFilter.includes(b.typ)))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return zhody[poradie];
  }

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#05090d" }}>
      <VyjednavanieModal ukaz={ukazVyjednavanie} onVyjednat={vyjednatPlat} />
      <NavSide />

      {otvorenySlot && (
        <SlotModal
          zona="luka"
          kategoria={otvorenySlot.kategoria}
          typFilter={otvorenySlot.typFilter}
          existujucaBudova={najdiBudovuProSlot("luka", otvorenySlot.kategoria, otvorenySlot.typFilter, otvorenySlot.poradie)}
          postavitBudovu={postavitBudovu}
          najatPreBudovu={najatPreBudovu}
          prepustitPreBudovu={prepustitPreBudovu}
          zmenitCenu={zmenitCenu}
          efektivitaBudovy={efektivitaBudovy}
          pocetKonkurencie={pocetKonkurencie}
          onClose={() => setOtvorenySlot(null)}
        />
      )}

      {/* Mapa na celú obrazovku */}
      <img
        src={mapaObrazok}
        alt="Mapa strediska"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
      />

      {/* Klikacie sloty — Lúka */}
      {SLOTY_LUKA.map((slot) => {
        const budovaVSlote = najdiBudovuProSlot("luka", slot.kategoria, slot.typFilter, slot.poradie);
        const zamknuty = slot.zamykaHory && !stanica.hory_odomknute && !budovaVSlote;
        const voVystavbeTuto = budovaVSlote?.stav === "vo_vystavbe";

        return (
          <button
            key={slot.id}
            onClick={() => {
              if (zamknuty) return;
              setOtvorenySlot(slot);
            }}
            title={zamknuty ? "Odomkne sa spolu s Horami" : KATEGORIE[slot.kategoria].nazov}
            style={{
              position: "absolute",
              left: slot.left,
              top: slot.top,
              width: 34,
              height: 34,
              marginLeft: -17,
              marginTop: -17,
              borderRadius: "50%",
              background: zamknuty ? "rgba(80,80,80,0.5)" : voVystavbeTuto ? "rgba(242,153,74,0.85)" : budovaVSlote ? "rgba(47,158,110,0.85)" : "rgba(255,255,255,0.25)",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              boxShadow: budovaVSlote ? "0 0 10px rgba(47,158,110,0.6)" : "none",
              zIndex: 2,
              cursor: zamknuty ? "default" : "pointer",
              padding: 0,
              opacity: zamknuty ? 0.6 : 1,
            }}
          >
            {zamknuty ? "🔒" : voVystavbeTuto ? "🚧" : budovaVSlote ? KATEGORIE[slot.kategoria].ikona : "+"}
          </button>
        );
      })}

      {/* Vizuálne body konkurencie — Lúka (nie klikacie) */}
      {KONKURENCIA_MARKERY_LUKA.map((m, i) => {
        const aktivny = (pocetKonkurencie[m.kat] || 0) > m.poradie;
        return (
          <div
            key={i}
            title={aktivny ? `Konkurencia — ${KATEGORIE[m.kat].nazov}` : "Konkurencia sa tu ešte neobjavila"}
            style={{
              position: "absolute",
              left: m.left,
              top: m.top,
              width: 26,
              height: 26,
              marginLeft: -13,
              marginTop: -13,
              borderRadius: "50%",
              background: aktivny ? "rgba(242,73,73,0.55)" : "rgba(255,255,255,0.08)",
              border: aktivny ? "2px solid rgba(242,73,73,0.9)" : "1px dashed rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              zIndex: 1,
              opacity: aktivny ? 1 : 0.5,
            }}
          >
            {aktivny ? KATEGORIE[m.kat].ikona : ""}
          </div>
        );
      })}

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
                Zatiaľ nemáš žiadnu budovu. Klikni na + na mape a postav prvú.
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
