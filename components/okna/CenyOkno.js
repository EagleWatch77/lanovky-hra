"use client";

import { useState } from "react";
import {
  KATEGORIE,
  ZONY,
  PORADIE_ZON,
  odhadovanaCena,
  skutocnaReferencnaCena,
  referencnaCenaSkipasu,
  globalnyCenovyMultiplikator,
  sezonaIndex,
  idealnaPrevadzkaHodin,
} from "../../lib/katalog";
import { hernyDatum } from "../../lib/hernyCas";
import { Euro, Clock, TrendingUp, TrendingDown, Ticket, Check, Car, BedDouble, Beer } from "lucide-react";

const NAZVY_MESIACOV = ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"];

const COOLDOWN_HODIN = 84; // 1 herný týždeň

// Koľko hodín ešte zostáva do ďalšej možnej zmeny (0 = môžeš meniť)
function zostavaHodin(zmeneneAt) {
  if (!zmeneneAt) return 0;
  const preslo = (new Date() - new Date(zmeneneAt)) / (1000 * 60 * 60);
  return Math.max(0, Math.ceil(COOLDOWN_HODIN - preslo));
}

function CooldownText({ hodin }) {
  if (hodin <= 0) return null;
  const dni = Math.floor(hodin / 24);
  const zvysok = hodin % 24;
  const text = dni > 0 ? `${dni} d ${zvysok} h` : `${hodin} h`;
  return (
    <div style={{ fontSize: 11, color: "#c9830f", fontWeight: 600, marginTop: 8 }}>
      Ďalšia zmena možná o {text}
    </div>
  );
}

const vstup = {
  padding: "9px 11px",
  borderRadius: 10,
  border: "1px solid rgba(120,160,205,0.28)",
  background: "#fff",
  color: "#1b2c42",
  fontSize: 13,
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 600,
  outline: "none",
};

const karta = {
  background: "#ffffff",
  border: "1px solid rgba(120,160,205,0.22)",
  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
  borderRadius: 14,
  padding: 14,
};

const nadpisKarty = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  margin: "0 0 3px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

function Odhad({ cena, odhad, dostupne, textAkNie }) {
  if (!dostupne) {
    return <div style={{ fontSize: 11.5, color: "#aebccd", marginTop: 8 }}>{textAkNie}</div>;
  }
  const drahsie = odhad && cena > odhad;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontWeight: 600,
        color: drahsie ? "#c9830f" : "#2ca24e",
        marginTop: 8,
      }}
    >
      {drahsie ? <TrendingUp size={13} strokeWidth={2.4} /> : <TrendingDown size={13} strokeWidth={2.4} />}
      odhadovaná cena ~{odhad} €
    </div>
  );
}

export default function CenyOkno({ stanica, budovy, zmenitCenu, zmenitPrevadzkovuDobu, zmenitCenuSkipasu, zmenitCenyStrediska }) {
  const [zalozka, setZalozka] = useState("ceny");
  const [zaciatok, setZaciatok] = useState(stanica.prevadzka_zaciatok || "08:30");
  const [koniec, setKoniec] = useState(stanica.prevadzka_koniec || "16:00");

  const [novySkipas, setNovySkipas] = useState(stanica.cena_skipasu ?? 15);
  const [skipasUlozeny, setSkipasUlozeny] = useState(false);

  const [parkLuka, setParkLuka] = useState(stanica.cena_parkovne_luka ?? 5);
  const [parkUdolie, setParkUdolie] = useState(stanica.cena_parkovne_udolie ?? 5);
  const [cenaPenzion, setCenaPenzion] = useState(stanica.cena_penzion ?? 25);
  const [cenaHotel, setCenaHotel] = useState(stanica.cena_hotel ?? 70);
  const [cenyUlozene, setCenyUlozene] = useState(false);
  const [dobaUlozena, setDobaUlozena] = useState(false);
  
  const hDatum = hernyDatum(new Date());
  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");
  const globalnyMult = globalnyCenovyMultiplikator(stanica, hotoveBudovy);
  const sezIndex = sezonaIndex(hDatum);
  const idealDoba = idealnaPrevadzkaHodin(hDatum.getMonth(), stanica.hory_odomknute);

  // --- Skipas ---
  const pocetLanoviek = hotoveBudovy.filter((b) => b.kategoria === "lanovka").length;
  const refSkipas = referencnaCenaSkipasu(hotoveBudovy, hDatum, globalnyMult);
  const odhadSkipas = odhadovanaCena(stanica.id, "lanovka", "skipas", sezIndex, refSkipas);

  // --- Odhady ostatných ---
  const refParkovne = skutocnaReferencnaCena("parkovisko", "parkovisko", hDatum, globalnyMult);
  const odhadParkovne = odhadovanaCena(stanica.id, "parkovisko", "parkovisko", sezIndex, refParkovne);
  const refPenzion = skutocnaReferencnaCena("penzion", "penzion", hDatum, globalnyMult);
  const odhadPenzion = odhadovanaCena(stanica.id, "penzion", "penzion", sezIndex, refPenzion);
  const refHotel = skutocnaReferencnaCena("hotel", "hotel", hDatum, globalnyMult);
  const odhadHotel = odhadovanaCena(stanica.id, "hotel", "hotel", sezIndex, refHotel);

  const maParkLuka = hotoveBudovy.some((b) => b.kategoria === "parkovisko" && b.zona === "luka");
  const maParkUdolie = hotoveBudovy.some((b) => b.kategoria === "parkovisko" && b.zona === "udolie");
  const maPenzion = hotoveBudovy.some((b) => b.kategoria === "penzion");
  const maHotel = hotoveBudovy.some((b) => b.kategoria === "hotel");
  const maBar = hotoveBudovy.some((b) => b.kategoria === "bar");
  const maServis = hotoveBudovy.some((b) => b.kategoria === "servis");

  function ulozitSkipas() {
    const cislo = Number(novySkipas);
    if (Number.isNaN(cislo) || cislo < 1) {
      alert("Zadaj platnú cenu (aspoň 1 €).");
      return;
    }
    zmenitCenuSkipasu(cislo);
    setSkipasUlozeny(true);
    setTimeout(() => setSkipasUlozeny(false), 2500);
  }

  function ulozitCeny() {
    const hodnoty = {
      cena_parkovne_luka: Number(parkLuka),
      cena_parkovne_udolie: Number(parkUdolie),
      cena_penzion: Number(cenaPenzion),
      cena_hotel: Number(cenaHotel),
    };
    for (const v of Object.values(hodnoty)) {
      if (Number.isNaN(v) || v < 1) {
        alert("Všetky ceny musia byť aspoň 1 €.");
        return;
      }
    }
    zmenitCenyStrediska(hodnoty);
    setCenyUlozene(true);
    setTimeout(() => setCenyUlozene(false), 2500);
  }

  // Bary a servisy si zatiaľ držia vlastnú cenu
  const ostatneBudovy = hotoveBudovy
    .filter((b) => b.kategoria === "bar" || b.kategoria === "servis")
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

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
      background: aktivna ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "rgba(120,160,205,0.10)",
      color: aktivna ? "#fff" : "#5a6f88",
      boxShadow: aktivna ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
    };
  }

  const poleRiadok = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "9px 0",
    borderBottom: "1px solid rgba(120,160,205,0.16)",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button onClick={() => setZalozka("ceny")} style={zalozkaStyl("ceny")}>
          <Euro size={14} strokeWidth={2.2} /> Ceny
        </button>
        <button onClick={() => setZalozka("prevadzka")} style={zalozkaStyl("prevadzka")}>
          <Clock size={14} strokeWidth={2.2} /> Prevádzková doba
        </button>
      </div>

      {zalozka === "ceny" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* SKIPAS */}
          <div style={karta}>
            <h3 style={nadpisKarty}>
              <Ticket size={15} color="#2f8ae0" strokeWidth={2.3} />
              Skipas
            </h3>
            <div style={{ fontSize: 11, color: "#aebccd", marginBottom: 11 }}>
              jedna cena pre všetky lanovky a vleky
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                min="1"
                value={novySkipas}
                onChange={(e) => setNovySkipas(e.target.value)}
                style={{ ...vstup, width: 92, textAlign: "right" }}
              />
              <span style={{ fontSize: 13, color: "#5a6f88", fontWeight: 600 }}>€</span>
              <button
                onClick={ulozitSkipas}
                style={{
                  marginLeft: "auto",
                  padding: "10px 15px",
                  borderRadius: 11,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 12.5,
                  color: "#fff",
                  background: skipasUlozeny
                    ? "linear-gradient(180deg,#42d675,#33bd63)"
                    : "linear-gradient(180deg,#4aa3ee,#2f92e6)",
                  boxShadow: "0 6px 14px rgba(47,146,230,0.26)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {skipasUlozeny ? (
                  <>
                    <Check size={14} strokeWidth={2.6} />
                    Uložené
                  </>
                ) : (
                  "Uložiť"
                )}
              </button>
            </div>

            <Odhad
              cena={stanica.cena_skipasu ?? 15}
              odhad={odhadSkipas}
              dostupne={pocetLanoviek > 0}
              textAkNie="Postav prvú lanovku, aby mal skipas zmysel."
            />
          </div>

          {/* PARKOVNÉ A UBYTOVANIE */}
          <div style={karta}>
            <h3 style={nadpisKarty}>
              <Car size={15} color="#2f8ae0" strokeWidth={2.3} />
              Parkovné
            </h3>
            <div style={{ fontSize: 11, color: "#aebccd", marginBottom: 8 }}>denné parkovné za miesto</div>

            <div style={poleRiadok}>
              <div>
                <div style={{ fontSize: 12.5, color: "#1b2c42", fontWeight: 600 }}>Lúka</div>
                {maParkLuka ? (
                  <div style={{ fontSize: 11, color: "#8a94a3", marginTop: 2 }}>odhad ~{odhadParkovne} €</div>
                ) : (
                  <div style={{ fontSize: 11, color: "#aebccd", marginTop: 2 }}>zatiaľ nepostavené</div>
                )}
              </div>
              <input
                type="number"
                min="1"
                value={parkLuka}
                onChange={(e) => setParkLuka(e.target.value)}
                style={{ ...vstup, width: 82, textAlign: "right" }}
              />
            </div>

            <div style={{ ...poleRiadok, borderBottom: "none" }}>
              <div>
                <div style={{ fontSize: 12.5, color: "#1b2c42", fontWeight: 600 }}>Údolie</div>
                {maParkUdolie ? (
                  <div style={{ fontSize: 11, color: "#8a94a3", marginTop: 2 }}>odhad ~{odhadParkovne} €</div>
                ) : (
                  <div style={{ fontSize: 11, color: "#aebccd", marginTop: 2 }}>zatiaľ nepostavené</div>
                )}
              </div>
              <input
                type="number"
                min="1"
                value={parkUdolie}
                onChange={(e) => setParkUdolie(e.target.value)}
                style={{ ...vstup, width: 82, textAlign: "right" }}
              />
            </div>
          </div>

          <div style={karta}>
            <h3 style={nadpisKarty}>
              <BedDouble size={15} color="#2f8ae0" strokeWidth={2.3} />
              Ubytovanie
            </h3>
            <div style={{ fontSize: 11, color: "#aebccd", marginBottom: 8 }}>cena za osobu a noc</div>

            <div style={poleRiadok}>
              <div>
                <div style={{ fontSize: 12.5, color: "#1b2c42", fontWeight: 600 }}>Penzióny</div>
                {maPenzion ? (
                  <div style={{ fontSize: 11, color: "#8a94a3", marginTop: 2 }}>odhad ~{odhadPenzion} €</div>
                ) : (
                  <div style={{ fontSize: 11, color: "#aebccd", marginTop: 2 }}>zatiaľ nepostavené</div>
                )}
              </div>
              <input
                type="number"
                min="1"
                value={cenaPenzion}
                onChange={(e) => setCenaPenzion(e.target.value)}
                style={{ ...vstup, width: 82, textAlign: "right" }}
              />
            </div>

            <div style={{ ...poleRiadok, borderBottom: "none" }}>
              <div>
                <div style={{ fontSize: 12.5, color: "#1b2c42", fontWeight: 600 }}>Hotely</div>
                {maHotel ? (
                  <div style={{ fontSize: 11, color: "#8a94a3", marginTop: 2 }}>odhad ~{odhadHotel} €</div>
                ) : (
                  <div style={{ fontSize: 11, color: "#aebccd", marginTop: 2 }}>zatiaľ nepostavené</div>
                )}
              </div>
              <input
                type="number"
                min="1"
                value={cenaHotel}
                onChange={(e) => setCenaHotel(e.target.value)}
                style={{ ...vstup, width: 82, textAlign: "right" }}
              />
            </div>
          </div>

          <button
            onClick={ulozitCeny}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#fff",
              background: cenyUlozene
                ? "linear-gradient(180deg,#42d675,#33bd63)"
                : "linear-gradient(180deg,#4aa3ee,#2f92e6)",
              boxShadow: "0 8px 18px rgba(47,146,230,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            {cenyUlozene ? (
              <>
                <Check size={15} strokeWidth={2.6} />
                Uložené
              </>
            ) : (
              "Uložiť parkovné a ubytovanie"
            )}
          </button>

          {/* BARY A SERVIS — vlastná cena na budovu */}
          {ostatneBudovy.length > 0 && (
            <div style={karta}>
              <h3 style={nadpisKarty}>
                <Beer size={15} color="#2f8ae0" strokeWidth={2.3} />
                Občerstvenie a služby
              </h3>
              <div style={{ fontSize: 11, color: "#aebccd", marginBottom: 8 }}>priemerná útrata na osobu</div>

              {ostatneBudovy.map((b, i) => {
                const zona = ZONY[b.zona];
                const nazov = zona?.popisky?.[b.kategoria] || KATEGORIE[b.kategoria]?.katalog[b.typ]?.nazov || KATEGORIE[b.kategoria]?.nazov;
                const refCena = skutocnaReferencnaCena(b.kategoria, b.typ, hDatum, globalnyMult);
                const odhad = odhadovanaCena(stanica.id, b.kategoria, b.typ, sezIndex, refCena);
                const drahsie = odhad && b.cena > odhad;

                return (
                  <div
                    key={b.id}
                    style={{ ...poleRiadok, borderBottom: i < ostatneBudovy.length - 1 ? poleRiadok.borderBottom : "none" }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12.5, color: "#1b2c42", fontWeight: 600 }}>{nazov}</span>
                        <span
                          style={{
                            fontSize: 9.5,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            color: "#8a94a3",
                            background: "rgba(120,160,205,0.12)",
                            padding: "2px 7px",
                            borderRadius: 7,
                            textTransform: "uppercase",
                          }}
                        >
                          {zona?.nazov}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: drahsie ? "#c9830f" : "#2ca24e",
                          marginTop: 3,
                        }}
                      >
                        odhad ~{odhad} €
                      </div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      defaultValue={b.cena}
                      onBlur={(e) => zmenitCenu(b, Number(e.target.value))}
                      style={{ ...vstup, width: 82, textAlign: "right" }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {zalozka === "prevadzka" && (
        <div>
          <div style={{ ...karta, marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, color: "#8a94a3", marginBottom: 5 }}>
              {NAZVY_MESIACOV[hDatum.getMonth()]} — tvoja prevádzková doba
            </div>
            <div
              style={{
                fontFamily: "var(--font-sora), system-ui, sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#1b2c42",
              }}
            >
              {zaciatok} – {koniec}
            </div>
            <div style={{ fontSize: 11.5, color: "#8a94a3", marginTop: 6 }}>
              Ideálna dĺžka pre tento mesiac: <strong style={{ color: "#2f8ae0" }}>{idealDoba} h</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11.5, color: "#5a6f88", display: "block", marginBottom: 5, fontWeight: 600 }}>
                Otvorenie
              </label>
              <input
                type="time"
                value={zaciatok}
                onChange={(e) => setZaciatok(e.target.value)}
                style={{ ...vstup, width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11.5, color: "#5a6f88", display: "block", marginBottom: 5, fontWeight: 600 }}>
                Zatvorenie
              </label>
              <input
                type="time"
                value={koniec}
                onChange={(e) => setKoniec(e.target.value)}
                style={{ ...vstup, width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              zmenitPrevadzkovuDobu(zaciatok, koniec);
              setDobaUlozena(true);
              setTimeout(() => setDobaUlozena(false), 2500);
            }}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              color: "#fff",
        background: "linear-gradient(180deg,#42d675,#33bd63)",
              boxShadow: "0 8px 18px rgba(51,189,99,0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            {dobaUlozena ? (
              <>
                <Check size={15} strokeWidth={2.6} />
                Uložené
              </>
            ) : (
              "Uložiť prevádzkovú dobu"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
