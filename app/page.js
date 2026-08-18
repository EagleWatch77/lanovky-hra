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
import ZamestnanciOkno from "../components/okna/ZamestnanciOkno";
import CenyOkno from "../components/okna/CenyOkno";
import FinancieOkno from "../components/okna/FinancieOkno";
import RebricekOkno from "../components/okna/RebricekOkno";
import InfoOkno from "../components/okna/InfoOkno";
import NastaveniaOkno from "../components/okna/NastaveniaOkno";
import AlianciaOkno from "../components/okna/AlianciaOkno";
import AlianciaForumOkno from "../components/okna/AlianciaForumOkno";
import SpravyOkno from "../components/okna/SpravyOkno";
import PrestizRozpis from "../components/PrestizRozpis";
import SpokojnostRozpis from "../components/SpokojnostRozpis";
import SezonaInfo from "../components/SezonaInfo";
import TuristiRozpis from "../components/TuristiRozpis";
import PocasiePanel from "../components/PocasiePanel";
import { hernyDatum } from "../lib/hernyCas";
import { jeZimnyMesiac, sezonnyPrehlad, jeMedzisezona } from "../lib/katalog";
import { vytvorNotifikacie } from "../lib/notifikacie";
import { cardStyle, buttonStyle, inputStyle } from "../lib/styles";
import { LOGA, PREDVOLENE_LOGO, ikonaPodlaKluca } from "../lib/loga";
import ZonaPanel from "../components/ZonaPanel";
import RebricekPanel from "../components/RebricekPanel";
import MisiePanel from "../components/MisiePanel";
import UdalostiPanel from "../components/UdalostiPanel";
export default function PrehladPage() {
  const {
    session,
    stanica,
    budovy,
    loading,
    prestizRozpis,
    pocetTuristov,
    dennyPocetTuristov,
    rozpisTuristovPodBudov,
    spokojnostCelkova,
    spokojnostRozpis,
    potrebujeNazov,
    vytvorStanicu,
    rozhodnutieOdbory,
    handleLogout,
    efektivitaBudovy,
    pocetKonkurencie,
    postavitBudovu,
    najatPreBudovu,
    prepustitPreBudovu,
    zmenitCenu,
    zmenitPrevadzkovuDobu,
    pridatBobovuDrahu,
    prepnutZasnezovanie,
    podmienkyOdomknutiaUdolia,
    odomknutUdolie,
    podmienkyOdomknutiaHor,
    odomknutHory,
    konkurenciaJednotky,
    aliancie,
    mojeZiadosti,
    prijateZiadosti,
    prijatePozvanky,
    poziadatOVstup,
    schvalitZiadost,
    zamietnutZiadost,
    oznacitZiadostOznamenu,
    prijatPozvanku,
    odmietnutPozvanku,
    pozvatHraca,
    vyhoditClena,
    aliancneSpravy,
    poslatAliancnuSpravu,
    oznacitForumPrecitane,
    pocetNeprecitanychVoFore,
    spravy,
    nacitajAliancie,
    vytvoritAlianciu,
    pripojitSaKAlliancii,
    opustitAllianciu,
    upravitPopisKonzorcia,
    nacitajSpravy,
    nacitajMojeZiadosti,
    poslatSpravu,
    oznacitPrecitane,
    vymazatSpravy,
    premenovatStanicu,
    zmenitMenoHraca,
    zmenitLogo,
    zmenitEmail,
    zmenitHeslo,
    zmazatMojeData,
  } = useGameState();

  const [novyNazov, setNovyNazov] = useState("");
  const [noveMenoHraca, setNoveMenoHraca] = useState("");
  const [vybraneLogo, setVybraneLogo] = useState(PREDVOLENE_LOGO);
  const panelOtvoreny = true;
  const [okno, setOkno] = useState(null);
  const [otvorenyPanel, setOtvorenyPanel] = useState(null); // null | "prestiz" | "spokojnost" | "datum" | "turisti"
  function prepnutPanel(nazov) {
    setOtvorenyPanel((p) => (p === nazov ? null : nazov));
  }
  if (!session) return <AuthForm />;

  if (potrebujeNazov) {
    return (
      <main style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>🚡 Vitaj!</h1>
        <p style={{ color: "#9fb0bf", marginBottom: 16 }}>Ako sa bude volať tvoje stredisko?</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (novyNazov.trim()) vytvorStanicu(novyNazov.trim(), vybraneLogo, noveMenoHraca.trim());
          }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <label style={{ fontSize: 13, color: "#9fb0bf" }}>Tvoje meno (voliteľné, uvidia ho ostatní hráči)</label>
          <input
            type="text"
            placeholder="napr. Mirko"
            value={noveMenoHraca}
            onChange={(e) => setNoveMenoHraca(e.target.value)}
            maxLength={30}
            style={inputStyle}
          />

          <label style={{ fontSize: 13, color: "#9fb0bf" }}>Vyber logo strediska</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LOGA.map((l) => {
              const jeVybrane = vybraneLogo === l.kluc;
              return (
                <button
                  key={l.kluc}
                  type="button"
                  onClick={() => setVybraneLogo(l.kluc)}
                  title={l.popis}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    border: jeVybrane ? "2px solid #2f9e6e" : "1px solid #2a3744",
                    background: jeVybrane ? "rgba(47,158,110,0.2)" : "#0f1720",
                    color: jeVybrane ? "#3ad08a" : "#cfe0ef",
                    cursor: "pointer",
                  }}
                >
                  <l.Ikona size={22} strokeWidth={1.9} />
                </button>
              );
            })}
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

  const notifikacie = vytvorNotifikacie(budovy, efektivitaBudovy, stanica);
  const hDatumTeraz = hernyDatum(new Date());
  const mapaObrazok = jeZimnyMesiac(hDatumTeraz.getMonth()) ? "/mapa-plna-zima.png" : "/mapa-plna-leto.png";
  const sezonnyPrehladInfo = sezonnyPrehlad(hDatumTeraz);
  const jeTerazMedzisezona = jeMedzisezona(hDatumTeraz);

  // Logo strediska podľa uloženého kľúča (staré emoji => predvolená ikona)
  const LogoIkona = ikonaPodlaKluca(stanica.logo);

  // Spoločný štýl hornej lišty
  const listaStyl = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 58,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "0 14px",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(120,160,205,0.22)",
    boxShadow: "0 4px 20px rgba(60,110,160,0.10)",
  };

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "radial-gradient(1100px 520px at 78% -8%, rgba(120,190,245,0.28), transparent 60%), linear-gradient(180deg,#e7f2fb,#f3f9fe 60%)" }}>

      {/* Mapa na celú obrazovku — čisto dekoratívna */}
<img
        src={mapaObrazok}
        alt="Mapa strediska"
        style={{ position: "absolute", top: 58, left: 0, right: 0, bottom: 0, width: "100%", height: "calc(100% - 58px)", objectFit: "cover", objectPosition: "center" }}
      />

      <NavSide
        onOtvorBudovy={() => setOkno("budovy")}
        onOtvorKonkurencia={() => setOkno("konkurencia")}
        onOtvorFinancie={() => setOkno("financie")}
        onOtvorRebricek={() => setOkno("rebricek")}
        onOtvorInfo={() => setOkno("info")}
        onOtvorAliancia={() => setOkno("aliancia")}
        onOtvorZamestnanci={() => setOkno("zamestnanci")}
        onOtvorCeny={() => setOkno("ceny")}
      />

      {okno === "aliancia" && (
        <WindowModal title="🤝 Ski konzorcium" onClose={() => setOkno(null)} width={480}>
          <AlianciaOkno
            stanica={stanica}
            aliancie={aliancie}
            vytvoritAlianciu={vytvoritAlianciu}
            pripojitSaKAlliancii={pripojitSaKAlliancii}
            opustitAllianciu={opustitAllianciu}
            upravitPopisKonzorcia={upravitPopisKonzorcia}
            poziadatOVstup={poziadatOVstup}
            mojeZiadosti={mojeZiadosti}
            prijateZiadosti={prijateZiadosti}
            schvalitZiadost={schvalitZiadost}
            zamietnutZiadost={zamietnutZiadost}
            oznacitZiadostOznamenu={oznacitZiadostOznamenu}
            prijatePozvanky={prijatePozvanky}
            prijatPozvanku={prijatPozvanku}
            odmietnutPozvanku={odmietnutPozvanku}
            poslatSpravu={poslatSpravu}
            nacitajMojeZiadosti={nacitajMojeZiadosti}
            pozvatHraca={pozvatHraca}
            vyhoditClena={vyhoditClena}
          />
        </WindowModal>
      )}

      {okno === "forum" && (
        <WindowModal title="🗣️ Nástenka konzorcia" onClose={() => setOkno(null)} width={520}>
          <AlianciaForumOkno stanica={stanica} aliancneSpravy={aliancneSpravy} poslatAliancnuSpravu={poslatAliancnuSpravu} />
        </WindowModal>
      )}

      {okno === "spravy" && (
        <WindowModal title="✉️ Správy" onClose={() => setOkno(null)} width={480}>
          <SpravyOkno spravy={spravy} oznacitPrecitane={oznacitPrecitane} poslatSpravu={poslatSpravu} vymazatSpravy={vymazatSpravy} />
        </WindowModal>
      )}

      {okno === "nastavenia" && (
        <WindowModal title="⚙️ Nastavenia" onClose={() => setOkno(null)} width={520}>
          <NastaveniaOkno
            session={session}
            stanica={stanica}
            premenovatStanicu={premenovatStanicu}
            zmenitMenoHraca={zmenitMenoHraca}
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
          <RebricekOkno stanica={stanica} poslatSpravu={poslatSpravu} />
        </WindowModal>
      )}

      {okno === "financie" && (
        <WindowModal title="💰 Financie" onClose={() => setOkno(null)} width={640}>
          <FinancieOkno stanica={stanica} />
        </WindowModal>
      )}

      {okno === "zamestnanci" && (
        <WindowModal title="👷 Zamestnanci" onClose={() => setOkno(null)} width={480}>
          <ZamestnanciOkno stanica={stanica} budovy={budovy} rozhodnutieOdbory={rozhodnutieOdbory} />
        </WindowModal>
      )}

      {okno === "ceny" && (
        <WindowModal title="💶 Ceny" onClose={() => setOkno(null)} width={480}>
          <CenyOkno stanica={stanica} budovy={budovy} zmenitCenu={zmenitCenu} zmenitPrevadzkovuDobu={zmenitPrevadzkovuDobu} />
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
            pridatBobovuDrahu={pridatBobovuDrahu}
          />
        </WindowModal>
      )}

      {/* ===== HORNÁ LIŠTA cez celú šírku ===== */}
      <div style={listaStyl}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* Logo + názov strediska v rohu */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, paddingLeft: 4, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#4aa3ee,#2f92e6)", boxShadow: "0 6px 14px rgba(47,146,230,0.35)", flexShrink: 0 }}>
              <LogoIkona size={22} strokeWidth={2} color="#ffffff" />
            </div>
            <div style={{ fontFamily: "var(--font-sora), system-ui, sans-serif", fontWeight: 700, fontSize: 15, color: "#1b2c42", whiteSpace: "nowrap", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>
              {stanica.nazov}
            </div>
          </div>

          <TopBar
            stanica={stanica}
            budovy={budovy}
            efektivitaBudovy={efektivitaBudovy}
            onKliknutePrestiz={() => prepnutPanel("prestiz")}
            prestizRozbalena={otvorenyPanel === "prestiz"}
            dennyPocetTuristov={dennyPocetTuristov}
            spokojnostCelkova={spokojnostCelkova}
            onKliknuteSpokojnost={() => prepnutPanel("spokojnost")}
            spokojnostRozbalena={otvorenyPanel === "spokojnost"}
            onKliknuteDatum={() => prepnutPanel("datum")}
            datumRozbaleny={otvorenyPanel === "datum"}
            onKliknuteTuristi={() => prepnutPanel("turisti")}
            turistiRozbaleni={otvorenyPanel === "turisti"}
            onKliknutePocasie={() => prepnutPanel("pocasie")}
            pocasieRozbalene={otvorenyPanel === "pocasie"}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <TopBarPrava
            notifikacie={notifikacie}
            onOtvorNastavenia={() => setOkno("nastavenia")}
            onOtvorSpravy={() => setOkno("spravy")}
            pocetNeprecitanych={spravy.filter((s) => !s.precitana && s.od_stanica_id !== stanica.id).length}
            onLogout={handleLogout}
            maKonzorcium={!!stanica.aliancia_id}
            onOtvorForum={() => {
              setOkno("forum");
              oznacitForumPrecitane();
            }}
            pocetNeprecitanychVoFore={pocetNeprecitanychVoFore}
          />
        </div>
      </div>

      {/* Rozbaľovacie panely pod lištou (po kliknutí na čísla) */}
      {otvorenyPanel === "prestiz" && (
        <div style={{ position: "absolute", top: 64, left: 100, zIndex: 6 }}>
          <PrestizRozpis prestizRozpis={prestizRozpis} />
        </div>
      )}
      {otvorenyPanel === "spokojnost" && (
        <div style={{ position: "absolute", top: 64, left: 100, zIndex: 6 }}>
          <SpokojnostRozpis spokojnostRozpis={spokojnostRozpis} />
        </div>
      )}
      {otvorenyPanel === "datum" && (
        <div style={{ position: "absolute", top: 64, left: 100, zIndex: 6 }}>
          <SezonaInfo prehlad={sezonnyPrehladInfo} jeMedzisezonaTeraz={jeTerazMedzisezona} />
        </div>
      )}
{otvorenyPanel === "turisti" && (
        <div style={{ position: "absolute", top: 64, left: 100, zIndex: 6 }}>
          <TuristiRozpis dennyPocetTuristov={dennyPocetTuristov} rozpisTuristovPodBudov={rozpisTuristovPodBudov} />
        </div>
      )}
      {otvorenyPanel === "pocasie" && (
        <div style={{ position: "absolute", top: 64, left: 100, width: 280, zIndex: 6 }}>
          <PocasiePanel />
        </div>
      )}

{/* Udalosti, misie a rebríček — dole vedľa seba, zarovnané na spodnú hranu */}
      {panelOtvoreny && (
        <div style={{ position: "absolute", bottom: 12, right: 274, width: 710, zIndex: 3, display: "flex", alignItems: "flex-end", gap: 10 }}>
         <div style={{ flex: 1 }}>
            <RebricekPanel stanica={stanica} onOtvorRebricek={() => setOkno("rebricek")} />
          </div>
          <div style={{ flex: 1 }}>
            <MisiePanel />
          </div>
         
        </div>
      )}
{/* Panel zóny vpravo hore */}
      <div style={{ position: "absolute", top: 70, right: 12, width: 250, zIndex: 3, display: "flex", flexDirection: "column", gap: 8 }}>
        <ZonaPanel stanica={stanica} budovy={budovy} efektivitaBudovy={efektivitaBudovy} onSpravovatZonu={() => setOkno("budovy")} />
      </div>

      {/* Rebríček — zarovnaný na spodnú hranu */}
      <div style={{ position: "absolute", bottom: 12, right: 12, width: 250, zIndex: 3 }}>
         <UdalostiPanel />
      </div>
        
    </div>
  );
}
