"use client";

import { useState } from "react";
import { KATEGORIE, cenaBudovy, prestizBudovy, vystavbaVRealnychDnoch, zamestnanciPotrebni, prijemZaHodinu, turistiZaHodinu, konkurencnyMultiplikator } from "../lib/katalog";
import { cardStyle, buttonStyle, tileStyle, tileStyleActive, inputStyle, linkStyle } from "../lib/styles";

export default function SlotModal({
  zona,
  kategoria,
  typFilter,
  existujucaBudova,
  postavitBudovu,
  najatPreBudovu,
  prepustitPreBudovu,
  zmenitCenu,
  efektivitaBudovy,
  pocetKonkurencie,
  onClose,
}) {
  const katalogPlny = KATEGORIE[kategoria].katalog;
  const katalog = typFilter ? Object.fromEntries(Object.entries(katalogPlny).filter(([t]) => typFilter.includes(t))) : katalogPlny;
  const [vyberTyp, setVyberTyp] = useState(Object.keys(katalog)[0]);
  const znackyKatalog = KATEGORIE[kategoria].znackyKatalog;
  const [vyberZnacka, setVyberZnacka] = useState(znackyKatalog ? Object.keys(znackyKatalog)[0] : null);

  const overlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
  const modalStyle = { ...cardStyle, width: 480, maxWidth: "100%", maxHeight: "85vh", overflowY: "auto", background: "rgba(15,23,32,0.97)", marginTop: 0 };

  if (existujucaBudova && existujucaBudova.stav === "vo_vystavbe") {
    const zostava = Math.max(0, Math.ceil((new Date(existujucaBudova.koniec_vystavby) - new Date()) / (1000 * 60 * 60 * 24)));
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ marginTop: 0 }}>🚧 Vo výstavbe</h3>
          <p style={{ color: "#9fb0bf" }}>Zostáva {zostava} {zostava === 1 ? "deň" : zostava < 5 ? "dni" : "dní"} do dokončenia.</p>
          <button onClick={onClose} style={buttonStyle}>Zavrieť</button>
        </div>
      </div>
    );
  }

  if (existujucaBudova && existujucaBudova.stav === "hotovo") {
    const b = existujucaBudova;
    const info = katalogPlny[b.typ];
    const maCenu = KATEGORIE[kategoria].maCenu;
    const efektivitaB = efektivitaBudovy(b);
    const konkurenciaMult = konkurencnyMultiplikator(b.kategoria, pocetKonkurencie);
    const potrebnyB = zamestnanciPotrebni(b.kategoria, b.typ);
    const odhadTuristov = maCenu ? Math.round(turistiZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * konkurenciaMult) : null;
    const odhadPrijem = maCenu ? Math.round(prijemZaHodinu(b.kategoria, b.typ, b.cena) * efektivitaB * konkurenciaMult) : null;

    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{info.nazov}{b.znacka && <span style={{ color: "#9fb0bf", fontWeight: 400 }}> {KATEGORIE[kategoria].znackyKatalog[b.znacka].ikona} {KATEGORIE[kategoria].znackyKatalog[b.znacka].nazov}</span>}</h3>
            <button onClick={onClose} style={linkStyle}>✕</button>
          </div>
          <p style={{ color: "#9fb0bf", fontSize: 13, marginTop: 8 }}>
            Kapacita: {info.kapacita}/hod
            {maCenu && <> · Odhad: {odhadTuristov} turistov/hod · ~{odhadPrijem} €/hod</>}
            {konkurenciaMult < 1 && <span style={{ color: "#f2994a" }}> · ⚠️ Konkurencia</span>}
          </p>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: efektivitaB < 1 ? "#f2994a" : "#9fb0bf" }}>
              👷 {b.zamestnanci_pridelenych || 0} / {potrebnyB}
              {efektivitaB < 1 && ` — ${Math.round(efektivitaB * 100)} %`}
            </span>
            <button onClick={() => prepustitPreBudovu(b)} style={{ ...buttonStyle, padding: "2px 10px", background: "#3a4753" }} disabled={(b.zamestnanci_pridelenych || 0) <= 0}>−</button>
            <button onClick={() => najatPreBudovu(b)} style={{ ...buttonStyle, padding: "2px 10px" }} disabled={(b.zamestnanci_pridelenych || 0) >= potrebnyB}>+</button>
          </div>
          {maCenu && (
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 13, color: "#9fb0bf" }}>Cena (€):</label>
              <input type="number" min="1" defaultValue={b.cena} onBlur={(e) => zmenitCenu(b, Number(e.target.value))} style={{ ...inputStyle, width: 90, padding: "4px 8px" }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Postaviť — {KATEGORIE[kategoria].nazov}</h3>
          <button onClick={onClose} style={linkStyle}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0" }}>
          {Object.keys(katalog).map((typ) => (
            <button key={typ} onClick={() => setVyberTyp(typ)} style={vyberTyp === typ ? tileStyleActive : tileStyle}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{katalog[typ].nazov}</div>
              <div style={{ fontSize: 11, color: "#9fb0bf", marginTop: 4 }}>{cenaBudovy(kategoria, typ, vyberZnacka).toLocaleString("sk-SK")} €</div>
            </button>
          ))}
        </div>

        {znackyKatalog && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {Object.keys(znackyKatalog).map((zn) => (
              <button key={zn} onClick={() => setVyberZnacka(zn)} style={{ ...(vyberZnacka === zn ? tileStyleActive : tileStyle), flex: "1 1 130px" }}>
                <div style={{ fontSize: 22 }}>{znackyKatalog[zn].ikona}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{znackyKatalog[zn].nazov}</div>
                <div style={{ fontSize: 11, color: "#9fb0bf", marginTop: 2 }}>{znackyKatalog[zn].popis}</div>
              </button>
            ))}
          </div>
        )}

        <div style={{ ...cardStyle, marginTop: 0, background: "#131c24" }}>
          <div style={{ color: "#9fb0bf", fontSize: 13 }}>
            💰 Cena: <strong style={{ color: "#e8edf2" }}>{cenaBudovy(kategoria, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €</strong><br />
            🕐 Výstavba: <strong style={{ color: "#e8edf2" }}>{Math.round(vystavbaVRealnychDnoch(katalog[vyberTyp].vystavbaHernychMesiacov))} dní</strong><br />
            ⭐ Prestíž: <strong style={{ color: "#f2c94c" }}>{prestizBudovy(kategoria, vyberTyp, vyberZnacka)}</strong><br />
            👷 Zamestnanci: <strong style={{ color: "#e8edf2" }}>{zamestnanciPotrebni(kategoria, vyberTyp)}</strong> (automaticky najatí)
          </div>
        </div>

        <button
          onClick={() => {
            postavitBudovu(kategoria, vyberTyp, vyberZnacka, zona);
            onClose();
          }}
          style={{ ...buttonStyle, marginTop: 14, width: "100%" }}
        >
          ✅ Postaviť za {cenaBudovy(kategoria, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €
        </button>
      </div>
    </div>
  );
}
