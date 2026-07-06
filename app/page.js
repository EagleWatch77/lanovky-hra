"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  KATEGORIE,
  vystavbaVRealnychDnoch,
  cenaBudovy,
  prestizBudovy,
  turistiZaHodinu,
  prijemZaHodinu,
  potrebniZamestnanci,
  efektivitaZamestnancov,
  PLAT_ZA_HODINU,
  CENA_NAJATIA,
  ZVYSENIE_PLATU_PERCENTO,
  EFEKTIVITA_PRI_ODMIETNUTI,
  EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI,
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

  const [ukazStavbu, setUkazStavbu] = useState(false);
  const [ukazRebricek, setUkazRebricek] = useState(false);
  const [rebricek, setRebricek] = useState([]);
  const [ukazVyjednavanie, setUkazVyjednavanie] = useState(false);
  const [vyberKategoria, setVyberKategoria] = useState("lanovka");
  const [vyberTyp, setVyberTyp] = useState("vlek");
  const [vyberZnacka, setVyberZnacka] = useState("montera");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) nacitajVsetko();
  }, [session]);

  function zmenitKategoriu(novaKategoria) {
    const prvyTyp = Object.keys(KATEGORIE[novaKategoria].katalog)[0];
    const znackyKatalog = KATEGORIE[novaKategoria].znackyKatalog;
    const prvaZnacka = znackyKatalog ? Object.keys(znackyKatalog)[0] : null;
    setVyberKategoria(novaKategoria);
    setVyberTyp(prvyTyp);
    setVyberZnacka(prvaZnacka);
  }

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

    const dokoncene = [];
    for (const b of budovyData) {
      if (b.stav === "vo_vystavbe" && new Date(b.koniec_vystavby) <= teraz) {
        dokoncene.push(b.id);
      }
    }
    if (dokoncene.length > 0) {
      await supabase.from("budovy").update({ stav: "hotovo" }).in("id", dokoncene);
      budovyData = budovyData.map((b) => (dokoncene.includes(b.id) ? { ...b, stav: "hotovo" } : b));
    }

    const posledna = new Date(st.last_update);
    let hodin = (teraz - posledna) / (1000 * 60 * 60);
    hodin = Math.min(Math.max(hodin, 0), 72);

    const hotoveTeraz = budovyData.filter((b) => b.stav === "hotovo");
    const potrebny = potrebniZamestnanci(hotoveTeraz);
    const efektivitaObsadenia = efektivitaZamestnancov(st.zamestnanci, potrebny);
    const efektivnyBonus = new Date(st.efektivita_bonus_do) >= teraz ? (st.efektivita_bonus ?? 1) : 1;
    const celkovaEfektivita = efektivitaObsadenia * efektivnyBonus;

    let zarobene = 0;
    for (const b of hotoveTeraz) {
      if (b.cena && KATEGORIE[b.kategoria].maCenu) {
        zarobene += prijemZaHodinu(b.kategoria, b.typ, b.cena) * celkovaEfektivita * hodin;
      }
    }
    const platyNaklady = st.zamestnanci * PLAT_ZA_HODINU * (st.plat_multiplikator ?? 1) * hodin;
    zarobene = Math.round(zarobene - platyNaklady);

    // Vyjednávanie o plat prebieha 23.-31. december, pre plat platný od 1. januára
    const jeDecembrovyTyzden = teraz.getMonth() === 11 && teraz.getDate() >= 23;
    const cielovyRok = jeDecembrovyTyzden ? teraz.getFullYear() + 1 : teraz.getFullYear();
    if (jeDecembrovyTyzden && st.vyjednavany_rok < cielovyRok) {
      setUkazVyjednavanie(true);
    }

    if (hodin > 0.01) {
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

    const zakladnaPrestiz = vypocitajPrestiz(budovyData);
    const vypocitanaPrestiz = Math.round(zakladnaPrestiz * celkovaEfektivita);
    if (vypocitanaPrestiz !== st.prestiz) {
      await supabase.from("stanice").update({ prestiz: vypocitanaPrestiz }).eq("id", st.id);
      st = { ...st, prestiz: vypocitanaPrestiz };
      setStanica(st);
    }

    setLoading(false);
  }

  function vypocitajPrestiz(budovyZoznam) {
    return budovyZoznam
      .filter((b) => b.stav === "hotovo")
      .reduce((sucet, b) => sucet + prestizBudovy(b.kategoria, b.typ, b.znacka), 0);
  }

  async function postavitBudovu() {
    const cena = cenaBudovy(vyberKategoria, vyberTyp, vyberZnacka);
    if (stanica.peniaze < cena) {
      alert("Nemáš dosť peňazí na túto stavbu!");
      return;
    }
    setLoading(true);

    const info = KATEGORIE[vyberKategoria].katalog[vyberTyp];
    const dniVystavby = vystavbaVRealnychDnoch(info.vystavbaHernychMesiacov);
    const teraz = new Date();
    const koniec = new Date(teraz.getTime() + dniVystavby * 24 * 60 * 60 * 1000);

    const { data: novaBudova } = await supabase
      .from("budovy")
      .insert({
        stanica_id: stanica.id,
        kategoria: vyberKategoria,
        typ: vyberTyp,
        znacka: KATEGORIE[vyberKategoria].znackyKatalog ? vyberZnacka : null,
        stav: "vo_vystavbe",
        zaciatok_vystavby: teraz.toISOString(),
        koniec_vystavby: koniec.toISOString(),
        cena: KATEGORIE[vyberKategoria].maCenu ? info.referencnaCena : null,
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

  async function nacitajRebricek() {
    const { data } = await supabase.from("rebricek").select("*").order("prestiz", { ascending: false });
    setRebricek(data || []);
    setUkazRebricek(true);
  }

  async function vyjednatPlat(volba) {
    let novyMultiplikator = stanica.plat_multiplikator ?? 1;
    let novaEfektivitaBonus = 1;

    if (volba === "prijat") {
      novyMultiplikator = novyMultiplikator * (1 + ZVYSENIE_PLATU_PERCENTO / 100);
      novaEfektivitaBonus = 1;
    } else if (volba === "ciastocne") {
      novyMultiplikator = novyMultiplikator * (1 + ZVYSENIE_PLATU_PERCENTO / 200);
      novaEfektivitaBonus = EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI;
    } else {
      novaEfektivitaBonus = EFEKTIVITA_PRI_ODMIETNUTI;
    }

    const teraz = new Date();
    const cielovyRok = teraz.getMonth() === 11 ? teraz.getFullYear() + 1 : teraz.getFullYear();
    // Trest platí do 31. januára cieľového roka (23:59:59)
    const bonusDo = new Date(cielovyRok, 0, 31, 23, 59, 59);

    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({
        plat_multiplikator: novyMultiplikator,
        efektivita_bonus: novaEfektivitaBonus,
        efektivita_bonus_do: bonusDo.toISOString(),
        vyjednavany_rok: cielovyRok,
      })
      .eq("id", stanica.id)
      .select()
      .single();

    setStanica(updatedSt);
    setUkazVyjednavanie(false);
  }

  async function najatZamestnanca() {
    if (stanica.peniaze < CENA_NAJATIA) {
      alert("Nemáš dosť peňazí na najatie ďalšieho zamestnanca!");
      return;
    }
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ zamestnanci: stanica.zamestnanci + 1, peniaze: stanica.peniaze - CENA_NAJATIA })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
  }

  async function prepustitZamestnanca() {
    if (stanica.zamestnanci <= 0) return;
    const { data: updatedSt } = await supabase
      .from("stanice")
      .update({ zamestnanci: stanica.zamestnanci - 1 })
      .eq("id", stanica.id)
      .select()
      .single();
    setStanica(updatedSt);
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

  const voVystavbe = budovy.filter((b) => b.stav === "vo_vystavbe");
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");
  const potrebny = potrebniZamestnanci(hotoveBudovy);
  const efektivitaObsadenia = stanica ? efektivitaZamestnancov(stanica.zamestnanci, potrebny) : 1;
  const efektivnyBonusTeraz = stanica && new Date(stanica.efektivita_bonus_do) >= new Date() ? (stanica.efektivita_bonus ?? 1) : 1;
  const celkovaEfektivita = stanica ? efektivitaObsadenia * efektivnyBonusTeraz : 1;
  const prestiz = stanica ? stanica.prestiz : 0;
  const aktualnyKatalog = KATEGORIE[vyberKategoria].katalog;

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h1 style={{ fontSize: 22 }}>🚡 {session.user.email}</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={nacitajRebricek} style={linkStyle}>🏆 Rebríček</button>
          <button onClick={handleLogout} style={linkStyle}>Odhlásiť sa</button>
        </div>
      </div>

      {ukazRebricek && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>🏆 Rebríček podľa prestíže</h3>
            <button onClick={() => setUkazRebricek(false)} style={linkStyle}>✕ Zavrieť</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rebricek.map((r, i) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: stanica && r.id === stanica.id ? "#16241d" : "#0f1720",
                  border: stanica && r.id === stanica.id ? "1px solid #2f9e6e" : "1px solid #2a3744",
                }}
              >
                <span>#{i + 1} {r.nazov}{stanica && r.id === stanica.id && " (ty)"}</span>
                <span style={{ color: "#f2c94c", fontWeight: 600 }}>⭐ {r.prestiz}</span>
              </div>
            ))}
            {rebricek.length === 0 && <p style={{ color: "#657685" }}>Zatiaľ žiadni hráči v rebríčku.</p>}
          </div>
        </div>
      )}

      {loading && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      {!loading && ukazVyjednavanie && (
        <div style={{ ...cardStyle, border: "2px solid #f2994a", background: "#241c14" }}>
          <h3 style={{ marginTop: 0 }}>👷 Zamestnanci žiadajú vyššiu mzdu</h3>
          <p style={{ color: "#e8edf2" }}>
            Je čas na ročné vyjednávanie. Zamestnanci chcú zvýšenie platu o <strong>{ZVYSENIE_PLATU_PERCENTO}%</strong>. Ako sa rozhodneš?
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            <button onClick={() => vyjednatPlat("prijat")} style={buttonStyle}>
              ✅ Prijať celé (+{ZVYSENIE_PLATU_PERCENTO}% k platu, 100% výkon)
            </button>
            <button onClick={() => vyjednatPlat("ciastocne")} style={{ ...buttonStyle, background: "#c9822e" }}>
              🤝 Ponúknuť polovicu ({Math.round(EFEKTIVITA_PRI_CIASTOCNOM_PRIJATI * 100)}% výkon)
            </button>
            <button onClick={() => vyjednatPlat("odmietnut")} style={{ ...buttonStyle, background: "#3a4753" }}>
              ❌ Odmietnuť ({Math.round(EFEKTIVITA_PRI_ODMIETNUTI * 100)}% výkon)
            </button>
          </div>
        </div>
      )}

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

          <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#9fb0bf", fontSize: 13 }}>👷 Zamestnanci</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                {stanica.zamestnanci} / {potrebny} potrebných
              </div>
              {celkovaEfektivita < 1 && (
                <div style={{ color: "#f2994a", fontSize: 13, marginTop: 4 }}>
                  ⚠️ Turisti si všímajú — budovy bežia na {Math.round(celkovaEfektivita * 100)} % výkonu (ovplyvňuje aj príjem, aj prestíž)
                </div>
              )}
              <div style={{ color: "#657685", fontSize: 12, marginTop: 4 }}>Plat: {PLAT_ZA_HODINU} €/hod na osobu</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={prepustitZamestnanca} style={{ ...buttonStyle, background: "#3a4753" }} disabled={stanica.zamestnanci <= 0}>−</button>
              <button onClick={najatZamestnanca} style={buttonStyle}>+ Najať ({CENA_NAJATIA.toLocaleString("sk-SK")} €)</button>
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
              const odhadTuristov = maCenu ? Math.round(turistiZaHodinu(b.kategoria, b.typ, b.cena) * celkovaEfektivita) : null;
              const odhadPrijem = maCenu ? Math.round(prijemZaHodinu(b.kategoria, b.typ, b.cena) * celkovaEfektivita) : null;
              const bPrestiz = prestizBudovy(b.kategoria, b.typ, b.znacka);
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
                    ⭐ Prestíž: <strong style={{ color: "#f2c94c" }}>{prestizBudovy(vyberKategoria, vyberTyp, vyberZnacka)}</strong>
                  </div>
                </div>

                <button onClick={postavitBudovu} style={{ ...buttonStyle, marginTop: 16, width: "100%" }} disabled={loading}>
                  ✅ Postaviť za {cenaBudovy(vyberKategoria, vyberTyp, vyberZnacka).toLocaleString("sk-SK")} €
                </button>
              </div>
            )}
          </div>

          <p style={{ color: "#657685", fontSize: 12, marginTop: 24 }}>
            💡 Tip: nižšia cena priláka viac turistov, ale každý zaplatí menej. Pokladne zatiaľ negenerujú vlastný príjem, len podporujú prevádzku. Stavba beží aj keď nie si online.
          </p>
        </>
      )}
    </main>
  );
}

const KATEGORIE_IKONY = {
  lanovka: "🚡",
  parkovisko: "🅿️",
  pokladna: "🎫",
};

const inputStyle = { padding: "10px 12px", borderRadius: 8, border: "1px solid #2a3744", background: "#151e27", color: "#e8edf2", fontSize: 16 };
const buttonStyle = { padding: "10px 16px", borderRadius: 8, border: "none", background: "#2f9e6e", color: "white", fontSize: 14, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" };
const linkStyle = { background: "none", border: "none", color: "#7fb8e0", cursor: "pointer", fontSize: 14, padding: 0 };
const cardStyle = { marginTop: 16, padding: 20, borderRadius: 12, background: "#151e27", border: "1px solid #2a3744" };
const rowCardStyle = { ...cardStyle, marginTop: 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 };
const tileStyle = { padding: "12px 16px", borderRadius: 10, border: "1px solid #2a3744", background: "#0f1720", color: "#e8edf2", cursor: "pointer", textAlign: "center", minWidth: 90 };
const tileStyleActive = { ...tileStyle, border: "2px solid #2f9e6e", background: "#16241d" };
