"use client";

import { useState } from "react";
import { useGameState } from "../lib/useGameState";
import AuthForm from "../components/AuthForm";
import AppLayout from "../components/AppLayout";
import VyjednavanieModal from "../components/VyjednavanieModal";
import PrestizRadar from "../components/PrestizRadar";
import LanovkyPanel from "../components/LanovkyPanel";
import PocasiePanel from "../components/PocasiePanel";
import Link from "next/link";
import { KATEGORIE, ZONY } from "../lib/katalog";
import { hernyDatum } from "../lib/hernyCas";
import { jeZimnyMesiac } from "../lib/katalog";
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
  } = useGameState();

  const [novyNazov, setNovyNazov] = useState("");

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

  const voVystavbe = budovy.filter((b) => b.stav === "vo_vystavbe");
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");
  const podpriemernaEfektivita = hotoveBudovy.filter((b) => efektivitaBudovy(b) < 1).length;

  const suhrnKategorii = {};
  for (const b of hotoveBudovy) {
    suhrnKategorii[b.kategoria] = (suhrnKategorii[b.kategoria] || 0) + 1;
  }

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      {loading && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      <VyjednavanieModal ukaz={!loading && ukazVyjednavanie} onVyjednat={vyjednatPlat} />

      {!loading && stanica && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "3 1 400px", textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block", borderRadius: 12, overflow: "hidden" }}>
              <img
                src={jeZimnyMesiac(hernyDatum(new Date()).getMonth()) ? "/mapa-cistazima.png" : "/mapa-cistaleto.png"}
                alt="Mapa strediska"
                style={{ height: "calc(100vh - 200px)", maxWidth: "100%", width: "auto", display: "block" }}
              />

              {/* Prvý testovací bod — Vlek v Lúke */}
              <Link
                href="/budovy"
                title="Postaviť vlek v Lúke"
                style={{
                  position: "absolute",
                  left: "56.4%",
                  top: "89.3%",
                  width: 32,
                  height: 32,
                  marginLeft: -16,
                  marginTop: -16,
                  borderRadius: "50%",
                  background: "rgba(47,158,110,0.85)",
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  textDecoration: "none",
                  boxShadow: "0 0 12px rgba(47,158,110,0.8)",
                }}
              >
                🚡
              </Link>
            </div>
          </div>

          <div style={{ flex: "1 1 240px", maxWidth: 320, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
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
                  Zatiaľ nemáš žiadnu budovu. Choď na stránku <strong>🏗️ Budovy</strong> a postav prvú.
                </p>
              )}
            </div>

            <PrestizRadar budovy={budovy} efektivitaBudovy={efektivitaBudovy} />
            <LanovkyPanel budovy={budovy} efektivitaBudovy={efektivitaBudovy} />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
