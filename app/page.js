"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  LANOVKY_TYPY,
  ZNACKY,
  vystavbaVRealnychDnoch,
  cenaLanovky,
  prestizLanovky,
  turistiZaHodinu,
  prijemZaHodinu,
} from "../lib/katalog";

export default function Home() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [stanica, setStanica] = useState(null);
  const [budovy, setBudovy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zisk, setZisk] = useState(0);
  const [vyberTyp, setVyberTyp] = useState("vlek");
  const [vyberZnacka, setVyberZnacka] = useState("montera");
  const [ukazStavbu, setUkazStavbu] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) nacitajVsetko();
  }, [session]);

  async function nacitajVsetko() {
    setLoading(true);
    const userId = session.user.id;

    let { data: st } = await supabase.from("stanice").select("*").eq("user_id", userId).maybeSingle();

    if (!st) {
      const { data: newSt } = await supabase
        .from("stanice")
        .insert({ user_id: userId, nazov: "Moja prvá stanica", peniaze: 1000000 })
        .select()
        .single();
      st = newSt;
    }

    const { data: bud } = await supabase.from("budovy").select("*").eq("stanica_id", st.id);
    let budovyData = bud || [];

    const teraz = new Date();

    // Skontrolujeme, či niektorá stavba medzičasom nedokončila
    const dokoncene = [];
    for (const b of budovyData) {
      if (b.stav === "vo_vystavbe" && new Date(b.koniec_vystavby) <= teraz) {
        dokoncene.push(b.id);
      }
    }
    if (dokoncene.length > 0) {
      await supabase.from("budovy").update({ stav: "hotovo" }).in("id", dokoncene);
      budovyData = budovyData.map((b) =>
        dokoncene.includes(b.id) ? { ...b, stav: "hotovo" } : b
      );
    }

    // Dopočítame príjem od posledného prihlásenia z hotových budov
    const posledna = new Date(st.last_update);
    let hodin = (teraz - posledna) / (1000 * 60 * 60);
    hodin = Math.min(Math.max(hodin, 0), 72);

    let zarobene = 0;
    for (const b of budovyData) {
      if (b.stav === "hotovo" && b.cena) {
        zarobene += prijemZaHodinu(b.typ, b.cena) * hodin;
      }
    }
    zarobene = Math.round(zarobene);

    if (zarobene > 0) {
      const { data: updatedSt } = await supabase
        .from("stanice")
        .update({ peniaze: st.peniaze + zarobene, last_update: teraz.toISOString() })
        .eq("id", st.id)
        .select()
        .single();
      st = updatedSt;
      setZisk(zarobene);
    } else {
      setZisk(0);
    }

    setStanica(st);
    setBudovy(budovyData);
    setLoading(false);
  }

  function vypocitajPrestiz(budovyZoznam) {
    return budovyZoznam
      .filter((b) => b.stav === "hotovo")
      .reduce((sucet, b) => sucet + prestizLanovky(b.typ, b.znacka), 0);
  }

  async function postavitLanovku() {
    const cena = cenaLanovky(vyberTyp, vyberZnacka);
    if (stanica.peniaze < cena) {
      alert("Nemáš dosť peňazí na túto lanovku!");
      return;
    }
    setLoading(true);

    const dniVystavby = vystavbaVRealnychDnoch(LANOVKY_TYPY[vyberTyp].vystavbaHernychMesiacov);
    const teraz = new Date();
    const koniec = new Date(teraz.getTime() + dniVystavby * 24 * 60 * 60 * 1000);

    const { data: novaBudova } = await supabase
      .from("budovy")
      .insert({
        stanica_id: stanica.id,
        kategoria: "lanovka",
        typ: vyberTyp,
        znacka: vyberZnacka,
        stav: "vo_vystavbe",
        zaciatok_vystavby: teraz.toISOString(),
        koniec_vystavby: koniec.toISOString(),
        cena: LANOVKY_TYPY[vyberTyp].referencnaCena,
      })
      .select()
      .single();

    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ peniaze: stanica.peniaze - cena })
      .eq("id", stanica.id)
      .select()
      .single();

    setStanica(updatedSt);
    setBudovy([...budovy, novaBudova]);
    setUkazStavbu(false);
    setLoading(false);
  }

  async function zmenitCenu(budova, novaCena) {
    const { data: updatedBud } = await supabase
      .from("budovy")
      .update({ cena: novaCena })
      .eq("id", budova.id)
      .select()
      .single();
    setBudovy(budovy.map((b) => (b.id === budova.id ? updatedBud : b)));
  }

  async function handleAuth(e) {
    e.preventDefault();
    setMessage("");
    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Chyba: " + error.message);
      else setMessage("Účet vytvorený! Skús sa rovno prihlásiť.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("Chyba: " + error.message);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setStanica(null);
    setBudovy([]);
  }

  function zostavaCasu(koniecVystavby) {
    const zostava = new Date(koniecVystavby) - new Date();
    if (zostava <= 0) return "Dokončuje sa...";
    const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
    return `${dni} ${dni === 1 ? "deň" : dni < 5 ? "dni" : "dní"} do dokončenia`;
  }

  if (!session) {
    return (
      <main style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>🚡 Lanovky Hra</h1>
        <p style={{ color: "#9fb0bf", marginBottom: 24 }}>Prototyp — prihlásenie / registrácia</p>
        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Heslo (min. 6 znakov)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
          <button type="submit" style={buttonStyle}>{mode === "login" ? "Prihlásiť sa" : "Zaregistrovať sa"}</button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ ...linkStyle, marginTop: 16 }}>
          {mode === "login" ? "Nemáš účet? Zaregistruj sa" : "Už máš účet? Prihlás sa"}
        </button>
        {message && <p style={{ marginTop: 16, color: "#f2c94c" }}>{message}</p>}
      </main>
    );
  }

  const prestiz = stanica ? vypocitajPrestiz(budovy) : 0;
  const voVystavbe = budovy.filter((b) => b.stav === "vo_vystavbe");
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 22 }}>🚡 {session.user.email}</h1>
        <button onClick={handleLogout} style={linkStyle}>Odhlásiť sa</button>
      </div>

      {loading && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      {!loading && stanica && (
        <>
          <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#9fb0bf", fontSize: 13 }}>{stanica.nazov}</div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>💰 {Math.round(stanica.peniaze).toLocaleString("sk-SK")} €</div>
              {zisk > 0 && <div style={{ color: "#4ade80", fontWeight: 600, fontSize: 14 }}>+{zisk.toLocaleString("sk-SK")} € od minula</div>}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#9fb0bf", fontSize: 13 }}>Prestíž</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#f2c94c" }}>⭐ {prestiz}</div>
            </div>
          </div>

          {voVystavbe.length > 0 && (
            <>
              <h2 style={{ fontSize: 18, margin: "24px 0 12px" }}>Vo výstavbe</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {voVystavbe.map((b) => (
                  <div key={b.id} style={rowCardStyle}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        🚧 {LANOVKY_TYPY[b.typ].nazov} <span style={{ color: "#9fb0bf", fontWeight: 400 }}>({ZNACKY[b.znacka].nazov})</span>
                      </div>
                      <div style={{ color: "#f2c94c", fontSize: 13, marginTop: 4 }}>{zostavaCasu(b.koniec_vystavby)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h2 style={{ fontSize: 18, margin: "24px 0 12px" }}>Tvoje lanovky</h2>
          {hotoveBudovy.length === 0 && (
            <p style={{ color: "#657685", fontSize: 14 }}>Zatiaľ žiadna hotová lanovka.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {hotoveBudovy.map((b) => {
              const odhadTuristov = Math.round(turistiZaHodinu(b.typ, b.cena));
              const odhadPrijem = Math.round(prijemZaHodinu(b.typ, b.cena));
              const bPrestiz = prestizLanovky(b.typ, b.znacka);
              return (
                <div key={b.id} style={rowCardStyle}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {LANOVKY_TYPY[b.typ].nazov} <span style={{ color: "#9fb0bf", fontWeight: 400 }}>({ZNACKY[b.znacka].nazov})</span>
                    </div>
                    <div style={{ color: "#9fb0bf", fontSize: 13, marginTop: 4 }}>
                      Kapacita: {LANOVKY_TYPY[b.typ].kapacita}/hod &nbsp;|&nbsp; Odhad: {odhadTuristov} turistov/hod &nbsp;|&nbsp; ~{odhadPrijem} €/hod &nbsp;|&nbsp; ⭐ {bPrestiz}
                    </div>
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <label style={{ fontSize: 13, color: "#9fb0bf" }}>Cena lístka (€):</label>
                      <input
                        type="number"
                        min="1"
                        defaultValue={b.cena}
                        onBlur={(e) => zmenitCenu(b, Number(e.target.value))}
                        style={{ ...inputStyle, width: 80, padding: "4px 8px" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24 }}>
            {!ukazStavbu ? (
              <button onClick={() => setUkazStavbu(true)} style={buttonStyle}>➕ Postaviť novú lanovku</button>
            ) : (
              <div style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>Postaviť novú lanovku</h3>

                <label style={{ fontSize: 13, color: "#9fb0bf" }}>Typ:</label>
                <select value={vyberTyp} onChange={(e) => setVyberTyp(e.target.value)} style={{ ...inputStyle, width: "100%", marginTop: 4, marginBottom: 12 }}>
                  {Object.keys(LANOVKY_TYPY).map((typ) => (
                    <option key={typ} value={typ}>{LANOVKY_TYPY[typ].nazov}</option>
                  ))}
                </select>

                <label style={{ fontSize: 13, color: "#9fb0bf" }}>Značka:</label>
                <select value={vyberZnacka} onChange={(e) => setVyberZnacka(e.target.value)} style={{ ...inputStyle, width: "100%", marginTop: 4, marginBottom: 12 }}>
                  {Object.keys(ZNACKY).map((zn) => (
                    <option key={zn} value={zn}>{ZNACKY[zn].nazov} — {ZNACKY[zn].popis}</option>
                  ))}
                </select>

                <div style={{ color: "#9fb0bf", fontSize: 13, marginBottom: 16 }}>
                  Cena: <strong style={{ color: "#e8edf2" }}>{cenaLanovky(vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €</strong>
                  &nbsp;|&nbsp; Výstavba: <strong style={{ color: "#e8edf2" }}>{Math.round(vystavbaVRealnychDnoch(LANOVKY_TYPY[vyberTyp].vystavbaHernychMesiacov))} dní</strong>
                  &nbsp;|&nbsp; Prestíž: <strong style={{ color: "#f2c94c" }}>⭐ {prestizLanovky(vyberTyp, vyberZnacka)}</strong>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={postavitLanovku} style={buttonStyle} disabled={loading}>Postaviť</button>
                  <button onClick={() => setUkazStavbu(false)} style={{ ...buttonStyle, background: "#3a4753" }}>Zrušiť</button>
                </div>
              </div>
            )}
          </div>

          <p style={{ color: "#657685", fontSize: 12, marginTop: 24 }}>
            💡 Tip: nižšia cena lístka priláka viac turistov, ale každý zaplatí menej. Skús nájsť rovnováhu. Stavba beží aj keď nie si online — po prihlásení uvidíš, čo sa medzitým dokončilo.
          </p>
        </>
      )}
    </main>
  );
}

const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #2a3744", background: "#151e27", color: "#e8edf2", fontSize: 16 };
const buttonStyle = { padding: "10px 16px", borderRadius: 8, border: "none", background: "#2f9e6e", color: "white", fontSize: 14, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" };
const linkStyle = { background: "none", border: "none", color: "#7fb8e0", cursor: "pointer", fontSize: 14, padding: 0 };
const cardStyle = { marginTop: 16, padding: 20, borderRadius: 12, background: "#151e27", border: "1px solid #2a3744" };
const rowCardStyle = { ...cardStyle, marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 };
