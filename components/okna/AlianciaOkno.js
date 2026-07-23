"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { cardStyle, buttonStyle, inputStyle } from "../../lib/styles";

export default function AlianciaOkno({
  stanica,
  aliancie,
  vytvoritAlianciu,
  pripojitSaKAlliancii,
  opustitAllianciu,
  upravitPopisKonzorcia,
  poziadatOVstup,
  mojeZiadosti,
  prijateZiadosti,
  schvalitZiadost,
  zamietnutZiadost,
  prijatePozvanky,
  prijatPozvanku,
  odmietnutPozvanku,
  poslatSpravu,
}) {
  const [zalozka, setZalozka] = useState("konzorcium");
  const [novyNazov, setNovyNazov] = useState("");
  const [hladat, setHladat] = useState("");
  const [clenovia, setClenovia] = useState([]);
  const [popisText, setPopisText] = useState("");
  const [popisUlozeny, setPopisUlozeny] = useState(false);
  const [rozbaleneId, setRozbaleneId] = useState(null);
  const [spravaPreId, setSpravaPreId] = useState(null);
  const [textSpravy, setTextSpravy] = useState("");
  const [odoslaneId, setOdoslaneId] = useState(null);

  const mojeKonzorcium = aliancie.find((a) => a.id === stanica.aliancia_id);
  const somZakladatel = mojeKonzorcium && mojeKonzorcium.zakladatel_stanica_id === stanica.id;
  const filtrovaneKonzorcia = aliancie.filter((a) => a.nazov.toLowerCase().includes(hladat.toLowerCase()));

  useEffect(() => {
    if (mojeKonzorcium) {
      nacitajClenov();
      setPopisText(mojeKonzorcium.popis || "");
    }
  }, [mojeKonzorcium?.id]);

  async function nacitajClenov() {
    const { data } = await supabase
      .from("stanice")
      .select("id, nazov, meno_hraca, prestiz")
      .eq("aliancia_id", mojeKonzorcium.id)
      .order("prestiz", { ascending: false });
    setClenovia(data || []);
  }

  async function odoslatPopis() {
    await upravitPopisKonzorcia(mojeKonzorcium.id, popisText.trim());
    setPopisUlozeny(true);
    setTimeout(() => setPopisUlozeny(false), 2000);
  }

  function odoslatSpravu(komuId) {
    if (!textSpravy.trim()) return;
    poslatSpravu(komuId, textSpravy);
    setTextSpravy("");
    setSpravaPreId(null);
    setOdoslaneId(komuId);
    setTimeout(() => setOdoslaneId(null), 3000);
  }

  const jeUzPoziadany = (alianciaId) =>
    mojeZiadosti.some((z) => z.aliancia_id === alianciaId && z.typ !== "pozvanka" && z.stav === "cakajuca");

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        <button
          onClick={() => setZalozka("konzorcium")}
          style={{
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "konzorcium" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "konzorcium" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          {mojeKonzorcium ? "🤝 Moje konzorcium" : "🔍 Hľadať / Vytvoriť"}
        </button>
        <button
          onClick={() => setZalozka("pozvanky")}
          style={{
            position: "relative",
            padding: "6px 14px", borderRadius: 8, border: "none",
            background: zalozka === "pozvanky" ? "rgba(47,158,110,0.25)" : "transparent",
            color: zalozka === "pozvanky" ? "#4ade80" : "#9fb0bf", fontSize: 13, cursor: "pointer",
          }}
        >
          📨 Pozvánky {prijatePozvanky.length > 0 && `(${prijatePozvanky.length})`}
        </button>
        {mojeKonzorcium && (
          <button
            onClick={() => setZalozka("opustit")}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "none",
              background: zalozka === "opustit" ? "rgba(242,73,73,0.2)" : "transparent",
              color: zalozka === "opustit" ? "#f28b8b" : "#9fb0bf", fontSize: 13, cursor: "pointer",
            }}
          >
            🚪 Opustiť
          </button>
        )}
      </div>

      {zalozka === "opustit" && mojeKonzorcium && (
        <div style={{ ...cardStyle, marginTop: 0, textAlign: "center" }}>
          <p style={{ color: "#9fb0bf", fontSize: 13 }}>
            Naozaj chceš opustiť konzorcium <strong>{mojeKonzorcium.nazov}</strong>?
          </p>
          <button onClick={opustitAllianciu} style={{ ...buttonStyle, background: "#c0392b" }}>
            Opustiť Ski konzorcium
          </button>
        </div>
      )}

      {zalozka === "pozvanky" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {prijatePozvanky.length === 0 && <p style={{ color: "#657685", fontSize: 13 }}>Nemáš žiadne čakajúce pozvánky.</p>}
          {prijatePozvanky.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#0f1720", border: "1px solid #2a3744", borderRadius: 8 }}>
              <span>🤝 Pozvánka do <strong>{p.aliancia?.nazov}</strong></span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => prijatPozvanku(p.id, p.aliancia_id)} style={{ ...buttonStyle, padding: "4px 12px", fontSize: 13 }}>Prijať</button>
                <button onClick={() => odmietnutPozvanku(p.id)} style={{ ...buttonStyle, padding: "4px 12px", fontSize: 13, background: "#3a4753" }}>Odmietnuť</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {zalozka === "konzorcium" && mojeKonzorcium && (
        <div>
          <div style={{ ...cardStyle, marginTop: 0, textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>🤝</div>
            <h3 style={{ margin: "8px 0 4px" }}>{mojeKonzorcium.nazov}</h3>
            <p style={{ color: "#9fb0bf", fontSize: 13, marginBottom: 0 }}>
              {somZakladatel ? "Si zakladateľ tohto Ski konzorcia." : "Si členom tohto Ski konzorcia."}
            </p>
          </div>

          <div style={{ ...cardStyle, marginTop: 0 }}>
            <h3 style={{ marginTop: 0 }}>O konzorciu</h3>
            {somZakladatel ? (
              <>
                <textarea
                  placeholder="Napíš niečo o vašom konzorciu (napr. čo hľadáte, ciele, trofeje...)"
                  value={popisText}
                  onChange={(e) => setPopisText(e.target.value)}
                  maxLength={500}
                  rows={4}
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }}
                />
