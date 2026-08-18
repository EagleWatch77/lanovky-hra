"use client";

import { useState } from "react";
import { KATEGORIE, zamestnanciPotrebni, PLAT_ZA_HODINU } from "../../lib/katalog";
import { hernyDatum } from "../../lib/hernyCas";
import { HardHat, Users, Lock, Check, X, FileText, TrendingUp } from "lucide-react";

const karta = {
  background: "#ffffff",
  border: "1px solid rgba(120,160,205,0.22)",
  borderRadius: 14,
  boxShadow: "0 4px 14px rgba(60,110,160,0.10)",
  padding: 14,
  marginTop: 12,
};

const nadpisKarty = {
  margin: "0 0 10px 0",
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13.5,
  color: "#1b2c42",
};

const btn = {
  border: "none",
  borderRadius: 11,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 12.5,
  cursor: "pointer",
  padding: "11px 14px",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
};

const vstup = {
  padding: "10px 12px",
  borderRadius: 11,
  border: "1px solid rgba(120,160,205,0.28)",
  background: "#fff",
  color: "#1b2c42",
  fontSize: 13,
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  outline: "none",
};

export default function ZamestnanciOkno({ stanica, budovy, rozhodnutieOdbory, uvodnaZalozka = "prehlad" }) {
  const [zalozka, setZalozka] = useState(uvodnaZalozka);
  const [vlastnePercento, setVlastnePercento] = useState("");

  const hotoveBudovy = budovy.filter((b) => b.stav === "hotovo");
  const platMultiplikator = stanica.plat_multiplikator ?? 1;
  const efektivnyBonusAktivny = new Date(stanica.efektivita_bonus_do) >= new Date();
  const efektivitaBonus = efektivnyBonusAktivny ? (stanica.efektivita_bonus ?? 1) : 1;
  const aktualnyPlat = PLAT_ZA_HODINU * platMultiplikator;

  const hDatum = hernyDatum(new Date());
  const jeDecember = hDatum.getMonth() === 11;
  const maNavrhTentoRok = stanica.odbory_navrh_rok === hDatum.getFullYear();
  const jeRozhodnute = !!stanica.odbory_rozhodnutie;

  const riadky = hotoveBudovy.map((b) => {
    const info = KATEGORIE[b.kategoria]?.katalog[b.typ];
    const pocetZamestnancov = zamestnanciPotrebni(b.kategoria, b.typ);
    const nakladyHod = pocetZamestnancov * aktualnyPlat;
    return {
      id: b.id,
      nazov: info?.nazov || b.typ,
      zona: b.zona,
      pocetZamestnancov,
      nakladyHod,
    };
  });

  const celkomZamestnancov = riadky.reduce((s, r) => s + r.pocetZamestnancov, 0);
  const celkomNakladyHod = riadky.reduce((s, r) => s + r.nakladyHod, 0);

  const NAZOV_ZONY = { luka: "Lúka", udolie: "Údolie", hory: "Hory", ladovec: "Ľadovec" };

  function odoslatRozhodnutie(typ) {
    if (typ === "vlastny") {
      const cislo = Number(vlastnePercento);
      if (Number.isNaN(cislo) || cislo < 0) {
        alert("Zadaj platné percento (0 alebo viac).");
        return;
      }
      rozhodnutieOdbory("vlastny", cislo);
    } else {
      rozhodnutieOdbory(typ);
    }
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
      background: aktivna ? "linear-gradient(160deg,#4aa3ee,#2f92e6)" : "rgba(120,160,205,0.10)",
      color: aktivna ? "#fff" : "#5a6f88",
      boxShadow: aktivna ? "0 6px 14px rgba(47,146,230,0.28)" : "none",
    };
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
        <button onClick={() => setZalozka("prehlad")} style={zalozkaStyl("prehlad")}>
          <HardHat size={14} strokeWidth={2.2} /> Prehľad
        </button>
        <button onClick={() => setZalozka("odbory")} style={zalozkaStyl("odbory")}>
          <Users size={14} strokeWidth={2.2} /> Odbory
          {jeDecember && maNavrhTentoRok && !jeRozhodnute && (
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: zalozka === "odbory" ? "#fff" : "#ef9a3d" }} />
          )}
        </button>
      </div>

      {zalozka === "prehlad" && (
        <div>
          <div style={{ ...karta, display: "flex", justifyContent: "space-around", textAlign: "center", gap: 10 }}>
            <div>
              <div style={{ fontFamily: "var(--font-sora), system-ui, sans-serif", fontSize: 21, fontWeight: 800, color: "#1b2c42" }}>
                {celkomZamestnancov}
              </div>
              <div style={{ fontSize: 11, color: "#8a94a3", marginTop: 2 }}>zamestnancov</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-sora), system-ui, sans-serif", fontSize: 21, fontWeight: 800, color: "#c9930f" }}>
                {celkomNakladyHod.toFixed(2)} €
              </div>
              <div style={{ fontSize: 11, color: "#8a94a3", marginTop: 2 }}>platy za hodinu</div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sora), system-ui, sans-serif",
                  fontSize: 21,
                  fontWeight: 800,
                  color: efektivitaBonus < 1 ? "#d64545" : "#2ca24e",
                }}
              >
                {Math.round(efektivitaBonus * 100)} %
              </div>
              <div style={{ fontSize: 11, color: "#8a94a3", marginTop: 2 }}>efektivita</div>
            </div>
          </div>

          {riadky.length === 0 && (
            <div style={{ ...karta, fontSize: 12.5, color: "#8a94a3", lineHeight: 1.5 }}>
              Zatiaľ nemáš žiadnu dokončenú budovu, takže nikoho nezamestnávaš.
            </div>
          )}

          {riadky.length > 0 && (
            <div style={karta}>
              <h3 style={nadpisKarty}>Podľa budov</h3>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {riadky.map((r, i) => (
                  <div
                    key={r.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 0",
                      borderBottom: i < riadky.length - 1 ? "1px solid rgba(120,160,205,0.16)" : "none",
                      fontSize: 12.5,
                    }}
                  >
                    <span style={{ color: "#1b2c42", fontWeight: 500 }}>
                      {r.nazov}{" "}
                      <span style={{ color: "#aebccd", fontSize: 11 }}>({NAZOV_ZONY[r.zona] || r.zona})</span>
                    </span>
                    <span style={{ color: "#5a6f88", whiteSpace: "nowrap" }}>
                      {r.pocetZamestnancov} os. ·{" "}
                      <strong style={{ fontFamily: "var(--font-sora), system-ui, sans-serif", color: "#1b2c42" }}>
                        {r.nakladyHod.toFixed(2)} €/h
                      </strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {zalozka === "odbory" && (
        <div>
          {!stanica.udolie_odomknute && (
            <div style={{ ...karta, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(120,160,205,0.14)",
                  color: "#8a94a3",
                  flexShrink: 0,
                }}
              >
                <Lock size={14} strokeWidth={2.2} />
              </span>
              <p style={{ color: "#5a6f88", fontSize: 12.5, margin: 0, lineHeight: 1.5 }}>
                Odbory sa odomknú spolu s Údolím. Kým máš len Lúku, plat zostáva pevný na{" "}
                {PLAT_ZA_HODINU.toFixed(2)} €/h.
              </p>
            </div>
          )}

          {stanica.udolie_odomknute && (
            <>
              <div style={karta}>
                <h3 style={nadpisKarty}>Aktuálny stav miezd</h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid rgba(120,160,205,0.16)",
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ color: "#5a6f88" }}>Aktuálny plat</span>
                  <span style={{ fontFamily: "var(--font-sora), system-ui, sans-serif", color: "#1b2c42", fontWeight: 700 }}>
                    {aktualnyPlat.toFixed(2)} €/h
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 12.5 }}>
                  <span style={{ color: "#5a6f88" }}>Efektivita zamestnancov</span>
                  <span
                    style={{
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontWeight: 700,
                      color: efektivitaBonus < 1 ? "#d64545" : "#2ca24e",
                    }}
                  >
                    {Math.round(efektivitaBonus * 100)} %
                  </span>
                </div>
              </div>

              {jeDecember && maNavrhTentoRok && (
                <div style={{ ...karta, border: "1px solid rgba(239,154,61,0.45)", background: "#fffaf2" }}>
                  <h3 style={{ ...nadpisKarty, display: "flex", alignItems: "center", gap: 7 }}>
                    <FileText size={15} color="#c9830f" strokeWidth={2.2} />
                    Požiadavka odborov na budúci rok
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--font-sora), system-ui, sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#c9830f",
                      margin: "2px 0 12px 0",
                    }}
                  >
                    <TrendingUp size={20} strokeWidth={2.4} />
                    +{stanica.odbory_navrh_percento} % k platu
                  </div>

                  {!jeRozhodnute && (
                    <>
                      <p style={{ color: "#8a94a3", fontSize: 11.5, marginBottom: 12, lineHeight: 1.5, marginTop: 0 }}>
                        Rozhodni sa kedykoľvek počas decembra. Efekt (aj prípadný postih) sa prejaví od 1. 1.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button
                          onClick={() => odoslatRozhodnutie("prijat")}
                          style={{
                            ...btn,
                            background: "linear-gradient(180deg,#42d675,#33bd63)",
                            boxShadow: "0 8px 16px rgba(51,189,99,0.30)",
                          }}
                        >
                          <Check size={15} strokeWidth={2.6} />
                          Prijať (+{stanica.odbory_navrh_percento} %)
                        </button>

                        <div style={{ display: "flex", gap: 7 }}>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Vlastný návrh %"
                            value={vlastnePercento}
                            onChange={(e) => setVlastnePercento(e.target.value)}
                            style={{ ...vstup, flex: 1, minWidth: 0 }}
                          />
                          <button
                            onClick={() => odoslatRozhodnutie("vlastny")}
                            style={{
                              ...btn,
                              background: "linear-gradient(180deg,#4aa3ee,#2f92e6)",
                              boxShadow: "0 8px 16px rgba(47,146,230,0.28)",
                              flexShrink: 0,
                            }}
                          >
                            Navrhnúť
                          </button>
                        </div>

                        <button
                          onClick={() => odoslatRozhodnutie("zamietnut")}
                          style={{
                            ...btn,
                            background: "#fff",
                            color: "#d64545",
                            border: "1px solid rgba(214,69,69,0.35)",
                          }}
                        >
                          <X size={15} strokeWidth={2.6} />
                          Odmietnuť
                        </button>
                      </div>
                    </>
                  )}

                  {jeRozhodnute && (
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "#1f8a49",
                        background: "#e3f6ea",
                        border: "1px solid rgba(51,189,99,0.3)",
                        borderRadius: 11,
                        padding: "10px 12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {stanica.odbory_rozhodnutie === "prijat" && "Prijaté — čaká na uplatnenie od 1. 1."}
                      {stanica.odbory_rozhodnutie === "vlastny" &&
                        `Navrhol si +${stanica.odbory_vlastne_percento} % — čaká na uplatnenie od 1. 1.`}
                      {stanica.odbory_rozhodnutie === "zamietnut" && "Odmietnuté — čaká na uplatnenie od 1. 1."}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
