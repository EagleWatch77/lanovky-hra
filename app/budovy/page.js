"use client";

import { useState } from "react";
import { useGameState } from "../../lib/useGameState";
import AuthForm from "../../components/AuthForm";
import Nav from "../../components/Nav";
import VyjednavanieModal from "../../components/VyjednavanieModal";
import {
  KATEGORIE,
  vystavbaVRealnychDnoch,
  cenaBudovy,
  prestizBudovy,
  turistiZaHodinu,
  prijemZaHodinu,
  zamestnanciPotrebni,
  CENA_NAJATIA,
} from "../../lib/katalog";
import { inputStyle, buttonStyle, linkStyle, cardStyle, rowCardStyle, tileStyle, tileStyleActive } from "../../lib/styles";

export default function BudovyPage() {
  const {
    session,
    stanica,
    budovy,
    loading,
    ukazVyjednavanie,
    vyjednatPlat,
    handleLogout,
    postavitBudovu,
    zmenitCenu,
    najatPreBudovu,
    prepustitPreBudovu,
    efektivitaBudovy,
  } = useGameState();

  const [ukazStavbu, setUkazStavbu] = useState(false);
  const [vyberKategoria, setVyberKategoria] = useState("lanovka");
  const [vyberTyp, setVyberTyp] = useState("vlek");
  const [vyberZnacka, setVyberZnacka] = useState("montera");

  if (!session) return <AuthForm />;

  function zmenitKategoriu(novaKategoria) {
    const prvyTyp = Object.keys(KATEGORIE[novaKategoria].katalog)[0];
    const znackyKatalog = KATEGORIE[novaKategoria].znackyKatalog;
    const prvaZnacka = znackyKatalog ? Object.keys(znackyKatalog)[0] : null;
    setVyberKategoria(novaKategoria);
    setVyberTyp(prvyTyp);
    setVyberZnacka(prvaZnacka);
  }

  function zostavaCasu(koniecVystavby) {
    const zostava = new Date(koniecVystavby) - new Date();
    if (zostava <= 0) return "Dokončuje sa...";
    const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
    return `${dni} ${dni === 1 ? "deň" : dni < 5 ? "dni" : "dní"} do dokončenia`;
  }

  const voVystavbe = budovy.filter((b) => b.stav === "vo_vystavbe");
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");
  const aktualnyKatalog = KATEGORIE[vyberKategoria].katalog;

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <Nav email={session.user.email} onLogout={handleLogout} />

      {loading && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      <VyjednavanieModal ukaz={!loading && ukazVyjednavanie} onVyjednat={vyjednatPlat} />

      {!loading && stanica && (
        <>
          <div style={{ ...cardStyle, marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#9fb0bf" }}>Zostatok</span>
            <span style={{ fontSize: 20, fontWeight: 700 }}>💰 {Math.round(stanica.peniaze).toLocaleString("sk-SK")} €</span>
          </div>

          {voVystavbe.length > 0 && (
            <>
              <h2 style={{ fontSize: 18, margin: "24px 0 12px" }}>Vo výstavbe</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {voVystavbe.map((b) => (
                  <div key={b.id} style={rowCardStyle}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        🚧 {KATEGORIE[b.kategoria].katalog[b.typ].nazov}
                        {b.znacka && <span style={{ color: "#9fb0bf", fontWeight: 400 }}> ({KATEGORIE[b.kategoria].znackyKatalog[b.znacka].nazov})</span>}
                      </div>
                      <div style={{ color: "#f2c94c", fontSize: 13, marginTop: 4 }}>{zostavaCasu(b.koniec_vystavby)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 style={{ fontSize: 18, margin: "24px 0 12px" }}>Tvoje budovy</h2>
          {hotoveBudovy.length === 0 && (
            <p style={{ color: "#657685", fontSize: 14 }}>Zatiaľ žiadna hotová budova.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {hotoveBudovy.map((b) => {
              const info = KATEGORIE[b.kategoria].katalog[b.typ];
              const maCenu = KATEGORIE[b.kategoria].maCenu;
              const efektivitaB = efektivitaBudovy(b);
              const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
              const odhadTuristov = maCenu ? Math.round(turistiZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB) : null;
              const odhadPrijem = maCenu ? Math.round(prijemZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB) : null;
              const bPrestiz = Math.round(prestizBudovy(b.kategoria, b.typ, b.znacka) * efektivitaB);
              return (
                <div key={b.id} style={rowCardStyle}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {info.nazov}
                      {b.znacka && <span style={{ color: "#9fb0bf", fontWeight: 400 }}> ({KATEGORIE[b.kategoria].znackyKatalog[b.znacka].nazov})</span>}
                      <span style={{ color: "#657685", fontWeight: 400, fontSize: 12 }}> — {KATEGORIE[b.kategoria].nazov}</span>
                    </div>
                    <div style={{ color: "#9fb0bf", fontSize: 13, marginTop: 4 }}>
                      Kapacita: {info.kapacita}/hod
                      {maCenu && <> &nbsp;|&nbsp; Odhad: {odhadTuristov} turistov/hod &nbsp;|&nbsp; ~{odhadPrijem} €/hod</>}
                      &nbsp;|&nbsp; ⭐ {bPrestiz}
                    </div>
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: efektivitaB < 1 ? "#f2994a" : "#9fb0bf" }}>
                        👷 {b.zamestnanci_pridelenych || 0} / {potrebnyB}
                        {efektivitaB < 1 && ` — beží na ${Math.round(efektivitaB * 100)} %`}
                      </span>
                      <button onClick={() => prepustitPreBudovu(b)} style={{ ...buttonStyle, padding: "2px 10px", background: "#3a4753" }} disabled={(b.zamestnanci_pridelenych || 0) <= 0}>−</button>
                      <button onClick={() => najatPreBudovu(b)} style={{ ...buttonStyle, padding: "2px 10px" }} disabled={(b.zamestnanci_pridelenych || 0) >= potrebnyB}>+ ({CENA_NAJATIA.toLocaleString("sk-SK")} €)</button>
                    </div>
                    {maCenu && (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                        <label style={{ fontSize: 13, color: "#9fb0bf" }}>Cena (€):</label>
                        <input
                          type="number"
                          min="1"
                          defaultValue={b.cena}
                          onBlur={(e) => zmenitCenu(b, Number(e.target.value))}
                          style={{ ...inputStyle, width: 80, padding: "4px 8px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24 }}>
            {!ukazStavbu ? (
              <button onClick={() => setUkazStavbu(true)} style={buttonStyle}>➕ Postaviť novú budovu</button>
            ) : (
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ margin: 0 }}>Postaviť novú budovu</h3>
                  <button onClick={() => setUkazStavbu(false)} style={linkStyle}>✕ Zavrieť</button>
                </div>

                <div style={{ color: "#657685", fontSize: 12, marginBottom: 8 }}>1. Vyber kategóriu</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {Object.keys(KATEGORIE).map((kat) => (
                    <button
                      key={kat}
                      onClick={() => zmenitKategoriu(kat)}
                      style={vyberKategoria === kat ? tileStyleActive : tileStyle}
                    >
                      <div style={{ fontSize: 28 }}>{KATEGORIE[kat].ikona}</div>
                      <div style={{ fontSize: 13, marginTop: 4 }}>{KATEGORIE[kat].nazov}</div>
                    </button>
                  ))}
                </div>

                <div style={{ color: "#657685", fontSize: 12, marginBottom: 8 }}>2. Vyber typ</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {Object.keys(aktualnyKatalog).map((typ) => (
                    <button
                      key={typ}
                      onClick={() => setVyberTyp(typ)}
                      style={vyberTyp === typ ? tileStyleActive : tileStyle}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{aktualnyKatalog[typ].nazov}</div>
                      <div style={{ fontSize: 11, color: "#9fb0bf", marginTop: 4 }}>
                        {cenaBudovy(vyberKategoria, typ, vyberZnacka).toLocaleString("sk-SK")} €
                      </div>
                    </button>
                  ))}
                </div>

                {KATEGORIE[vyberKategoria].znackyKatalog && (
                  <>
                    <div style={{ color: "#657685", fontSize: 12, marginBottom: 8 }}>3. Vyber značku</div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                      {Object.keys(KATEGORIE[vyberKategoria].znackyKatalog).map((zn) => {
                        const znackyKatalog = KATEGORIE[vyberKategoria].znackyKatalog;
                        return (
                          <button
                            key={zn}
                            onClick={() => setVyberZnacka(zn)}
                            style={vyberZnacka === zn ? tileStyleActive : tileStyle}
                          >
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{znackyKatalog[zn].nazov}</div>
                            <div style={{ fontSize: 11, color: "#9fb0bf", marginTop: 4, maxWidth: 110 }}>{znackyKatalog[zn].popis}</div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div style={{ ...cardStyle, marginTop: 0, background: "#0f1720" }}>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>{aktualnyKatalog[vyberTyp]?.nazov}</div>
                  <div style={{ color: "#9fb0bf", fontSize: 13 }}>
                    💰 Cena: <strong style={{ color: "#e8edf2" }}>{cenaBudovy(vyberKategoria, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €</strong><br />
                    🕐 Výstavba: <strong style={{ color: "#e8edf2" }}>{Math.round(vystavbaVRealnychDnoch(aktualnyKatalog[vyberTyp].vystavbaHernychMesiacov))} dní</strong><br />
                    ⭐ Prestíž: <strong style={{ color: "#f2c94c" }}>{prestizBudovy(vyberKategoria, vyberTyp, vyberZnacka)}</strong><br />
                    👷 Zamestnanci po dokončení: <strong style={{ color: "#e8edf2" }}>{zamestnanciPotrebni(vyberKategoria, vyberTyp)}</strong> (automaticky najatí)
                  </div>
                </div>

                <button
                  onClick={() => {
                    postavitBudovu(vyberKategoria, vyberTyp, vyberZnacka);
                    setUkazStavbu(false);
                  }}
                  style={{ ...buttonStyle, marginTop: 16, width: "100%" }}
                  disabled={loading}
                >
                  ✅ Postaviť za {cenaBudovy(vyberKategoria, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €
                </button>
              </div>
            )}
          </div>

          <p style={{ color: "#657685", fontSize: 12, marginTop: 24 }}>
            💡 Tip: pri dokončení stavby sa automaticky najme potrebný počet zamestnancov (zaplatíš za nich). Ak niektorých prepustíš, budova pobeží na nižšiu efektivitu — ovplyvní to aj príjem, aj prestíž.
          </p>
        </>
      )}
    </main>
  );
}
