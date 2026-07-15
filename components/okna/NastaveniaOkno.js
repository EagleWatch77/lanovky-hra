"use client";

import { useState } from "react";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

const LOGA = ["🏔️", "🚡", "⛷️", "🎿", "🏂", "🗻", "❄️", "🏨", "🎫", "🌲", "🏕️", "🚠", "🛷", "⛰️", "🥌", "🧊"];

export default function NastaveniaOkno({ session, stanica, premenovatStanicu, zmenitMenoHraca, zmenitLogo, zmenitEmail, zmenitHeslo, zmazatMojeData }) {
  const [nazov, setNazov] = useState("");
  const [spravaNazov, setSpravaNazov] = useState("");

  const [menoHraca, setMenoHraca] = useState("");
  const [spravaMeno, setSpravaMeno] = useState("");

  const [novyEmail, setNovyEmail] = useState("");
  const [spravaEmail, setSpravaEmail] = useState("");

  const [noveHeslo, setNoveHeslo] = useState("");
  const [spravaHeslo, setSpravaHeslo] = useState("");

  const [potvrdenieZmazania, setPotvrdenieZmazania] = useState("");

  async function odoslatNazov(e) {
    e.preventDefault();
    if (!nazov.trim()) return;
    await premenovatStanicu(nazov.trim());
    setSpravaNazov("Uložené ✅");
    setNazov("");
  }

  async function odoslatMeno(e) {
    e.preventDefault();
    await zmenitMenoHraca(menoHraca.trim());
    setSpravaMeno("Uložené ✅");
  }

  async function odoslatEmail(e) {
    e.preventDefault();
    const vysledok = await zmenitEmail(novyEmail);
    setSpravaEmail(vysledok.error || vysledok.success);
  }

  async function odoslatHeslo(e) {
    e.preventDefault();
    if (noveHeslo.length < 6) {
      setSpravaHeslo("Heslo musí mať aspoň 6 znakov.");
      return;
    }
    const vysledok = await zmenitHeslo(noveHeslo);
    setSpravaHeslo(vysledok.error || vysledok.success);
    setNoveHeslo("");
  }

  async function potvrditZmazanie() {
    if (potvrdenieZmazania !== "ZMAZAT") return;
    await zmazatMojeData();
  }

  return (
    <div>
      <div style={{ ...cardStyle, marginTop: 0 }}>
        <h3 style={{ marginTop: 0 }}>Všeobecné</h3>
        <label style={{ fontSize: 13, color: "#9fb0bf" }}>Názov strediska (aktuálne: {stanica?.nazov})</label>
        <form onSubmit={odoslatNazov} style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input
            type="text"
            placeholder="Nový názov"
            value={nazov}
            onChange={(e) => setNazov(e.target.value)}
            maxLength={40}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="submit" style={buttonStyle}>Uložiť</button>
        </form>
        {spravaNazov && <p style={{ color: "#4ade80", fontSize: 13, marginTop: 8 }}>{spravaNazov}</p>}

        <label style={{ fontSize: 13, color: "#9fb0bf", marginTop: 16, display: "block" }}>Tvoje meno (aktuálne: {stanica?.meno_hraca || "nenastavené"})</label>
        <form onSubmit={odoslatMeno} style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input
            type="text"
            placeholder="Napr. Mirko"
            value={menoHraca}
            onChange={(e) => setMenoHraca(e.target.value)}
            maxLength={30}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="submit" style={buttonStyle}>Uložiť</button>
        </form>
        {spravaMeno && <p style={{ color: "#4ade80", fontSize: 13, marginTop: 8 }}>{spravaMeno}</p>}

        <label style={{ fontSize: 13, color: "#9fb0bf", marginTop: 16, display: "block" }}>Logo strediska</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {LOGA.map((l) => (
            <button
              key={l}
              onClick={() => zmenitLogo(l)}
              style={{
                fontSize: 22,
                width: 40,
                height: 40,
                borderRadius: 8,
                border: stanica?.logo === l ? "2px solid #2f9e6e" : "1px solid #2a3744",
                background: stanica?.logo === l ? "rgba(47,158,110,0.2)" : "#0f1720",
                cursor: "pointer",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0 }}>Prihlasovacie údaje</h3>

        <label style={{ fontSize: 13, color: "#9fb0bf" }}>Zmeniť email (aktuálne: {session.user.email})</label>
        <form onSubmit={odoslatEmail} style={{ display: "flex", gap: 8, marginTop: 6, marginBottom: 16 }}>
          <input
            type="email"
            placeholder="Nový email"
            value={novyEmail}
            onChange={(e) => setNovyEmail(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="submit" style={buttonStyle}>Zmeniť</button>
        </form>
        {spravaEmail && <p style={{ color: "#f2c94c", fontSize: 13, marginTop: -8, marginBottom: 16 }}>{spravaEmail}</p>}

        <label style={{ fontSize: 13, color: "#9fb0bf" }}>Zmeniť heslo</label>
        <form onSubmit={odoslatHeslo} style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <input
            type="password"
            placeholder="Nové heslo (min. 6 znakov)"
            value={noveHeslo}
            onChange={(e) => setNoveHeslo(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="submit" style={buttonStyle}>Zmeniť</button>
        </form>
        {spravaHeslo && <p style={{ color: "#f2c94c", fontSize: 13, marginTop: 8 }}>{spravaHeslo}</p>}
      </div>

      <div style={{ ...cardStyle, border: "1px solid #7a2e2e", background: "#241414" }}>
        <h3 style={{ marginTop: 0, color: "#f28b8b" }}>⚠️ Nebezpečná zóna</h3>
        <p style={{ color: "#9fb0bf", fontSize: 13 }}>
          Toto natrvalo zmaže tvoje stredisko a všetky budovy. Nedá sa to vrátiť späť.
          Napíš <strong>ZMAZAT</strong> do poľa nižšie a potvrď.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Napíš ZMAZAT"
            value={potvrdenieZmazania}
            onChange={(e) => setPotvrdenieZmazania(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={potvrditZmazanie}
            disabled={potvrdenieZmazania !== "ZMAZAT"}
            style={{ ...buttonStyle, background: potvrdenieZmazania === "ZMAZAT" ? "#c0392b" : "#3a4753" }}
          >
            Zmazať natrvalo
          </button>
        </div>
        <p style={{ color: "#657685", fontSize: 12, marginTop: 12 }}>
          Poznámka: toto zmaže herné dáta (stredisko, budovy) a odhlási ťa. Samotný prihlasovací účet (email) zostane
          existovať v systéme — jeho úplné zmazanie zatiaľ vyžaduje manuálny krok cez Supabase, ak by si ho chcel.
        </p>
      </div>
    </div>
  );
}
