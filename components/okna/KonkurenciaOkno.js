"use client";

import { useState } from "react";
import { KATEGORIE, KONKURENCIA_ZONY_KONFIG, ZONY } from "../../lib/katalog";
import { cardStyle, tileStyle } from "../../lib/styles";

function zostavaCasu(koniecVystavby) {
  const zostava = new Date(koniecVystavby) - new Date();
  if (zostava <= 0) return "Dokončuje sa...";
  const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
  return `${dni} ${dni === 1 ? "deň" : dni < 5 ? "dni" : "dní"}`;
}

export default function KonkurenciaOkno({ konkurenciaJednotky }) {
  const [aktivnaZona, setAktivnaZona] = useState("luka");
  const zonaConfig = KONKURENCIA_ZONY_KONFIG[aktivnaZona];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, borderBottom: "1px solid #223040", paddingBottom: 10 }}>
        {Object.keys(KONKURENCIA_ZONY_KONFIG).map((zk) => (
          <button
            key={zk}
            onClick={() => setAktivnaZona(zk)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: aktivnaZona === zk ? "rgba(47,158,110,0.25)" : "transparent",
              color: aktivnaZona === zk ? "#4ade80" : "#9fb0bf",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {ZONY[zk].ikona} {ZONY[zk].nazov}
          </button>
        ))}
      </div>

      <p style={{ color: "#657685", fontSize: 13, marginTop: 0 }}>
        Konkurencia sa objaví, ak niektorú z týchto kategórií v tejto zóne nemáš postavenú dlhší čas. Stavia rovnako dlho ako ty a znižuje ti dopyt, ale zvyšuje celkovú prestíž strediska.
      </p>

      {Object.keys(zonaConfig).map((kat) => {
        const jednotky = konkurenciaJednotky.filter((k) => k.kategoria === kat && k.zona === aktivnaZona);
        const cfg = zonaConfig[kat];
        const hotovoPocet = jednotky.filter((k) => k.stav === "hotovo").length;

        return (
          <div key={kat} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>{KATEGORIE[kat].ikona} {KATEGORIE[kat].nazov}</h3>
              <span style={{ color: "#9fb0bf", fontSize: 13 }}>
                {jednotky.length} / {cfg.max}
                {cfg.sezonne && " (len leto)"}
              </span>
            </div>

            {jednotky.length === 0 && (
              <p style={{ color: "#4a5866", fontSize: 13 }}>Zatiaľ žiadna konkurencia v tejto kategórii.</p>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {jednotky.map((k) => (
                <div key={k.id} style={{ ...tileStyle, cursor: "default", minWidth: 110 }}>
                  <div style={{ fontSize: 20 }}>{k.stav === "hotovo" ? "🏢" : "🚧"}</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    {k.stav === "hotovo" ? "Aktívna" : zostavaCasu(k.koniec_vystavby)}
                  </div>
                </div>
              ))}
            </div>

            {hotovoPocet > 0 && (
              <p style={{ color: "#9fb0bf", fontSize: 12, marginTop: 12 }}>
                Efekt: -{Math.round(cfg.stratapenazi * hotovoPocet * 100)}% dopytu v tejto kategórii a zóne, +{cfg.prestizBonus * hotovoPocet} prestíže strediska
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
