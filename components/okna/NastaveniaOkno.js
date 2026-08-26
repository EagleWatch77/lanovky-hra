"use client";

import { useState } from "react";
import { LOGA } from "../../lib/loga";
import { OBRAZKY_RIADITELA } from "../../lib/katalog";
import { User, KeyRound, Image as ImageIcon, AlertTriangle, Check, Save } from "lucide-react";

const karta = {
  background: "#ffffff",
  border: "1px solid rgba(120,160,205,0.22)",
  borderRadius: 14,
  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
  padding: 14,
  marginBottom: 12,
};

const nadpisKarty = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  margin: "0 0 12px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

const popisok = {
  display: "block",
  fontSize: 11.5,
  color: "#8a94a3",
  marginBottom: 5,
  fontWeight: 600,
};

const vstup = {
  padding: "9px 11px",
  borderRadius: 11,
  border: "1px solid rgba(120,160,205,0.28)",
  background: "#fff",
  color: "#1b2c42",
  fontSize: 12.5,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

const btn = {
  border: "none",
  borderRadius: 11,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 12.5,
  cursor: "pointer",
  padding: "10px 15px",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  background: "linear-gradient(180deg,#4aa3ee,#2f92e6)",
  boxShadow: "0 6px 14px rgba(47,146,230,0.26)",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const riadok = { marginBottom: 16 };

function Hlaska({ text, typ = "ok" }) {
  if (!text) return null;
  const farby = { ok: "#1f8a49", chyba: "#c0392b", info: "#c9830f" };
  return (
    <p style={{ display: "flex", alignItems: "center", gap: 5, color: farby[typ], fontSize: 12, marginTop: 7, marginBottom: 0 }}>
      {typ === "ok" && <Check size={13} strokeWidth={2.6} />}
      {text}
    </p>
  );
}

export default function NastaveniaOkno({
  session,
  stanica,
  premenovatStanicu,
  zmenitMenoHraca,
  zmenitLogo,
  zmenitEmail,
  zmenitHeslo,
  zmazatMojeData,
  ulozitProfil,
}) {
  const [zalozka, setZalozka] = useState("profil");

  const [nazov, setNazov] = useState(stanica?.nazov || "");
  const [menoHraca, setMenoHraca] = useState(stanica?.meno_hraca || "");
  const [vek, setVek] = useState(stanica?.vek ?? "");
  const [bydlisko, setBydlisko] = useState(stanica?.bydlisko || "");
  const [popis, setPopis] = useState(stanica?.popis || "");
  const [pohlavie, setPohlavie] = useState(stanica?.pohlavie === "zena" ? "zena" : "muz");
  const [spravaProfil, setSpravaProfil] = useState("");

  const [novyEmail, setNovyEmail] = useState("");
  const [spravaEmail, setSpravaEmail] = useState("");
  const [noveHeslo, setNoveHeslo] = useState("");
  const [spravaHeslo, setSpravaHeslo] = useState("");
  const [potvrdenieZmazania, setPotvrdenieZmazania] = useState("");

  async function ulozitVsetko(e) {
    e.preventDefault();
    if (nazov.trim() && nazov.trim() !== stanica?.nazov) await premenovatStanicu(nazov.trim());
    if (menoHraca.trim() !== (stanica?.meno_hraca || "")) await zmenitMenoHraca(menoHraca.trim());
    await ulozitProfil({ vek, bydlisko, popis, pohlavie });
    setSpravaProfil("Uložené");
    setTimeout(() => setSpravaProfil(""), 2500);
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

  function zalozkaStyl(kluc) {
    const aktivna = zalozka === kluc;
    return {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: 11,
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-inter), system-ui, sans-serif",
      fontWeight: 600,
      fontSize: 12.5,
      background: aktivna ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "rgba(120,160,205,0.14)",
      color: aktivna ? "#fff" : "#5a6f88",
      boxShadow: aktivna ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
    };
  }

  return (
    <div>
      {/* Záložky */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setZalozka("profil")} style={zalozkaStyl("profil")}>
          <User size={14} strokeWidth={2.2} /> Profil
        </button>
        <button onClick={() => setZalozka("logo")} style={zalozkaStyl("logo")}>
          <ImageIcon size={14} strokeWidth={2.2} /> Logo
        </button>
        <button onClick={() => setZalozka("ucet")} style={zalozkaStyl("ucet")}>
          <KeyRound size={14} strokeWidth={2.2} /> Účet
        </button>
      </div>

      {/* --- PROFIL --- */}
      {zalozka === "profil" && (
        <form onSubmit={ulozitVsetko}>
          <div style={karta}>
            <h3 style={nadpisKarty}>
              <User size={15} color="#2f8ae0" strokeWidth={2.3} />
              Tvoj profil
            </h3>

            <div style={riadok}>
              <label style={popisok}>Názov strediska</label>
              <input
                type="text"
                value={nazov}
                onChange={(e) => setNazov(e.target.value)}
                maxLength={40}
                style={{ ...vstup, width: "100%" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, ...riadok }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <label style={popisok}>Tvoje meno</label>
                <input
                  type="text"
                  placeholder="Napr. Mirko"
                  value={menoHraca}
                  onChange={(e) => setMenoHraca(e.target.value)}
                  maxLength={30}
                  style={{ ...vstup, width: "100%" }}
                />
              </div>
              <div style={{ width: 90, flexShrink: 0 }}>
                <label style={popisok}>Vek</label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  placeholder="—"
                  value={vek}
                  onChange={(e) => setVek(e.target.value)}
                  style={{ ...vstup, width: "100%" }}
                />
              </div>
            </div>

            <div style={riadok}>
              <label style={popisok}>Bydlisko</label>
              <input
                type="text"
                placeholder="Napr. Liptovský Mikuláš"
                value={bydlisko}
                onChange={(e) => setBydlisko(e.target.value)}
                maxLength={40}
                style={{ ...vstup, width: "100%" }}
              />
            </div>

            <div style={riadok}>
              <label style={popisok}>Riaditeľ strediska</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { kluc: "muz", nazov: "Muž" },
                  { kluc: "zena", nazov: "Žena" },
                ].map((p) => {
                  const vybrate = pohlavie === p.kluc;
                  return (
                    <button
                      key={p.kluc}
                      type="button"
                      onClick={() => setPohlavie(p.kluc)}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 8px",
                        borderRadius: 12,
                        cursor: "pointer",
                        background: vybrate ? "#eaf4fd" : "#fff",
                        border: vybrate ? "2px solid #2f92e6" : "1px solid rgba(120,160,205,0.24)",
                        boxShadow: vybrate ? "0 4px 12px rgba(47,146,230,0.18)" : "none",
                      }}
                    >
                      <img
                        src={OBRAZKY_RIADITELA[p.kluc].luka}
                        alt=""
                        style={{ height: 70, objectFit: "contain" }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-sora), system-ui, sans-serif",
                          fontWeight: 700,
                          fontSize: 12,
                          color: vybrate ? "#1b2c42" : "#8a94a3",
                        }}
                      >
                        {p.nazov}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={popisok}>
                O tebe <span style={{ fontWeight: 400 }}>({popis.length} / 500)</span>
              </label>
              <textarea
                placeholder="Napíš pár slov o sebe alebo o svojom stredisku…"
                value={popis}
                onChange={(e) => setPopis(e.target.value.slice(0, 500))}
                rows={4}
                style={{ ...vstup, width: "100%", resize: "vertical", lineHeight: 1.55 }}
              />
            </div>

            <button type="submit" style={{ ...btn, marginTop: 14 }}>
              <Save size={14} strokeWidth={2.4} />
              Uložiť
            </button>
            <Hlaska text={spravaProfil} />
          </div>
        </form>
      )}

      {/* --- LOGO --- */}
      {zalozka === "logo" && (
        <div style={karta}>
          <h3 style={nadpisKarty}>
            <ImageIcon size={15} color="#2f8ae0" strokeWidth={2.3} />
            Logo strediska
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: 8 }}>
            {LOGA.map((l) => {
              const vybrate = stanica?.logo === l.kluc;
              return (
                <button
                  key={l.kluc}
                  onClick={() => zmenitLogo(l.kluc)}
                  title={l.popis}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 56,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: vybrate ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "#fff",
                    border: vybrate ? "none" : "1px solid rgba(120,160,205,0.24)",
                    boxShadow: vybrate ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
                  }}
                >
                  <l.Ikona size={24} strokeWidth={2} color={vybrate ? "#fff" : "#5a6f88"} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ÚČET --- */}
      {zalozka === "ucet" && (
        <div>
          <div style={karta}>
            <h3 style={nadpisKarty}>
              <KeyRound size={15} color="#2f8ae0" strokeWidth={2.3} />
              Prihlasovacie údaje
            </h3>

            <div style={riadok}>
              <label style={popisok}>Email (teraz: {session.user.email})</label>
              <form onSubmit={odoslatEmail} style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  placeholder="Nový email"
                  value={novyEmail}
                  onChange={(e) => setNovyEmail(e.target.value)}
                  style={{ ...vstup, flex: 1 }}
                />
                <button type="submit" style={btn}>
                  Zmeniť
                </button>
              </form>
              <Hlaska text={spravaEmail} typ="info" />
            </div>

            <div>
              <label style={popisok}>Heslo</label>
              <form onSubmit={odoslatHeslo} style={{ display: "flex", gap: 8 }}>
                <input
                  type="password"
                  placeholder="Nové heslo (min. 6 znakov)"
                  value={noveHeslo}
                  onChange={(e) => setNoveHeslo(e.target.value)}
                  style={{ ...vstup, flex: 1 }}
                />
                <button type="submit" style={btn}>
                  Zmeniť
                </button>
              </form>
              <Hlaska text={spravaHeslo} typ="info" />
            </div>
          </div>

          <div style={{ ...karta, background: "#fdeeee", border: "1px solid rgba(214,69,69,0.28)" }}>
            <h3 style={{ ...nadpisKarty, color: "#c0392b" }}>
              <AlertTriangle size={15} color="#d64545" strokeWidth={2.3} />
              Zmazanie strediska
            </h3>
            <p style={{ color: "#8a5f5f", fontSize: 12, lineHeight: 1.55, marginTop: 0, marginBottom: 11 }}>
              Natrvalo zmaže tvoje stredisko a všetky budovy. Nedá sa to vrátiť späť. Napíš <strong>ZMAZAT</strong> a
              potvrď.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Napíš ZMAZAT"
                value={potvrdenieZmazania}
                onChange={(e) => setPotvrdenieZmazania(e.target.value)}
                style={{ ...vstup, flex: 1 }}
              />
              <button
                onClick={potvrditZmazanie}
                disabled={potvrdenieZmazania !== "ZMAZAT"}
                style={{
                  ...btn,
                  background: potvrdenieZmazania === "ZMAZAT" ? "linear-gradient(180deg,#e05a5a,#c0392b)" : "#c5d2e0",
                  boxShadow: potvrdenieZmazania === "ZMAZAT" ? "0 6px 14px rgba(192,57,43,0.28)" : "none",
                  cursor: potvrdenieZmazania === "ZMAZAT" ? "pointer" : "not-allowed",
                }}
              >
                Zmazať natrvalo
              </button>
            </div>
            <p style={{ color: "#a88", fontSize: 11, marginTop: 11, marginBottom: 0, lineHeight: 1.5 }}>
              Zmaže sa stredisko a budovy. Prihlasovací účet zostane — jeho zmazanie treba spraviť ručne.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
