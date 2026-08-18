"use client";

import { useState } from "react";
import { KATEGORIE, zamestnanciPotrebni, PLAT_ZA_HODINU } from "../../lib/katalog";
import { hernyDatum } from "../../lib/hernyCas";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

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
      ikona: KATEGORIE[b.kategoria]?.ikona || "🏢",
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

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        <button
          onClick={() => setZalozka("prehlad")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "prehlad" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "prehlad" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          👷 Prehľad
        </button>
        <button
          onClick={() => setZalozka("odbory")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "odbory" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "odbory" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          🪧 Odbory{jeDecember && maNavrhTentoRok && !jeRozhodnute ? " ⚠️" : ""}
        </button>
      </div>

      {zalozka === "prehlad" && (
        <div>
          <div style={{ ...cardStyle, marginTop: 0, display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e8edf2" }}>{celkomZamestnancov}</div>
              <div style={{ fontSize: 12, color: "#9fb0bf" }}>zamestnancov</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#e8edf2" }}>{celkomNakladyHod.toFixed(2)} €/h</div>
              <div style={{ fontSize: 12, color: "#9fb0bf" }}>náklady na platy</div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: efektivitaBonus < 1 ? "#f2994a" : "#4ade80" }}>
                {Math.round(efektivitaBonus * 100)} %
              </div>
              <div style={{ fontSize: 12, color: "#9fb0bf" }}>efektivita</div>
            </div>
          </div>

          {riadky.length === 0 && (
            <p style={{ color: "#657685", fontSize: 13 }}>Zatiaľ nemáš žiadnu dokončenú budovu, takže nikoho nezamestnávaš.</p>
          )}

          {riadky.length > 0 && (
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Podľa budov</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {riadky.map((r) => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6, fontSize: 13 }}>
                    <span>{r.ikona} {r.nazov} <span style={{ color: "#657685", fontSize: 11 }}>({NAZOV_ZONY[r.zona] || r.zona})</span></span>
                    <span style={{ color: "#9fb0bf" }}>
                      👤 {r.pocetZamestnancov} · <strong style={{ color: "#e8edf2" }}>{r.nakladyHod.toFixed(2)} €/h</strong>
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
            <div style={cardStyle}>
              <p style={{ color: "#657685", fontSize: 13, margin: 0 }}>
                🔒 Odbory sa odomknú spolu s Údolím. Kým máš len Lúku, plat zostáva pevný na {PLAT_ZA_HODINU.toFixed(2)} €/h.
              </p>
            </div>
          )}

          {stanica.udolie_odomknute && (
            <>
              <div style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>Aktuálny stav miezd</h3>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #223040" }}>
                  <span style={{ color: "#9fb0bf" }}>Aktuálny plat</span>
                  <span style={{ color: "#e8edf2", fontWeight: 600 }}>{aktualnyPlat.toFixed(2)} €/h na zamestnanca</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ color: "#9fb0bf" }}>Efektivita zamestnancov</span>
                  <span style={{ color: efektivitaBonus < 1 ? "#f2994a" : "#4ade80", fontWeight: 600 }}>
                    {Math.round(efektivitaBonus * 100)} %
                  </span>
                </div>
              </div>

              {jeDecember && maNavrhTentoRok && (
                <div style={{ ...cardStyle, marginTop: 0, border: "1px solid rgba(242,153,74,0.4)" }}>
                  <h3 style={{ marginTop: 0 }}>📋 Požiadavka odborov na budúci rok</h3>
                  <p style={{ color: "#e8edf2", fontSize: 15, fontWeight: 700, margin: "4px 0 12px 0" }}>
                    +{stanica.odbory_navrh_percento}% k platu
                  </p>

                  {!jeRozhodnute && (
                    <>
                      <p style={{ color: "#657685", fontSize: 12, marginBottom: 10 }}>
                        Rozhodni sa kedykoľvek počas decembra. Efekt (aj prípadný postih) sa prejaví od 1.1.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <button onClick={() => odoslatRozhodnutie("prijat")} style={{ ...buttonStyle }}>
                          ✅ Prijať (+{stanica.odbory_navrh_percento}%)
                        </button>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Vlastný návrh %"
                            value={vlastnePercento}
                            onChange={(e) => setVlastnePercento(e.target.value)}
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <button onClick={() => odoslatRozhodnutie("vlastny")} style={{ ...buttonStyle, background: "#3a4753" }}>
                            Navrhnúť
                          </button>
                        </div>
                        <button onClick={() => odoslatRozhodnutie("zamietnut")} style={{ ...buttonStyle, background: "#c0392b" }}>
                          ❌ Odmietnuť
                        </button>
                      </div>
                    </>
                  )}

                  {jeRozhodnute && (
                    <p style={{ color: "#4ade80", fontSize: 13 }}>
                      {stanica.odbory_rozhodnutie === "prijat" && "✅ Prijaté – čaká na uplatnenie od 1.1."}
                      {stanica.odbory_rozhodnutie === "vlastny" && `📝 Navrhol si +${stanica.odbory_vlastne_percento}% – čaká na uplatnenie od 1.1.`}
                      {stanica.odbory_rozhodnutie === "zamietnut" && "❌ Odmietnuté – čaká na uplatnenie od 1.1."}
                    </p>
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
