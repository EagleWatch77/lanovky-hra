"use client";

import { useState } from "react";
import { useGameState } from "../lib/useGameState";
import AuthForm from "../components/AuthForm";
import Nav from "../components/Nav";
import VyjednavanieModal from "../components/VyjednavanieModal";
import { KATEGORIE } from "../lib/katalog";
import { cardStyle, buttonStyle, inputStyle } from "../lib/styles";

export default function PrehladPage() {
  const {
    session,
    stanica,
    budovy,
    loading,
    zisk,
    ukazVyjednavanie,
    potrebujeNazov,
    vytvorStanicu,
    vyjednatPlat,
    handleLogout,
    efektivitaBudovy,
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
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <Nav email={session.user.email} onLogout={handleLogout} />

      {loading && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      <VyjednavanieModal ukaz={!loading && ukazVyjednavanie} onVyjednat={vyjednatPlat} />

      {!loading && stanica && (
        <>
          <div style={{ ...cardStyle, marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#9fb0bf", fontSize: 13 }}>{stanica.nazov}</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>💰 {Math.round(stanica.peniaze).toLocaleString("sk-SK")} €</div>
              {zisk !== 0 && (
                <div style={{ color: zisk > 0 ? "#4ade80" : "#f2994a", fontWeight: 600, fontSize: 14 }}>
                  {zisk > 0 ? "+" : ""}{zisk.toLocaleString("sk-SK")} € od minula
                </div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#9fb0bf", fontSize: 13 }}>Prestíž</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f2c94c" }}>⭐ {stanica.prestiz}</div>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 16 }}>Rýchly prehľad</h3>
            <div style={{ color: "#9fb0bf", fontSize: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <span>🏗️ Hotových budov: <strong style={{ color: "#e8edf2" }}>{hotoveBudovy.length}</strong></span>
              <span>🚧 Vo výstavbe: <strong style={{ color: "#e8edf2" }}>{voVystavbe.length}</strong></span>
              {podpriemernaEfektivita > 0 && (
                <span style={{ color: "#f2994a" }}>⚠️ {podpriemernaEfektivita} budov beží na zníženú efektivitu (chýbajú zamestnanci)</span>
              )}
            </div>

            {Object.keys(suhrnKategorii).length > 0 && (
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {Object.keys(suhrnKategorii).map((kat) => (
                  <div key={kat} style={{ fontSize: 13, color: "#9fb0bf" }}>
                    {KATEGORIE[kat].ikona} {KATEGORIE[kat].nazov}: <strong style={{ color: "#e8edf2" }}>{suhrnKategorii[kat]}</strong>
                  </div>
                ))}
              </div>
            )}

            {hotoveBudovy.length === 0 && voVystavbe.length === 0 && (
              <p style={{ color: "#657685", fontSize: 14, marginTop: 8 }}>
                Zatiaľ nemáš žiadnu budovu. Choď na stránku <strong>🏗️ Budovy</strong> a postav prvú.
              </p>
            )}
          </div>
        </>
      )}
    </main>
  );
}
