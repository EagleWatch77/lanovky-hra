"use client";
import { CalendarDays, Snowflake, Sun, CalendarOff } from "lucide-react";

const NAZVY_MESIACOV = [
  "januára", "februára", "marca", "apríla", "mája", "júna",
  "júla", "augusta", "septembra", "októbra", "novembra", "decembra",
];

function formatDatum(d) {
  return `${d.getDate()}. ${NAZVY_MESIACOV[d.getMonth()]} ${d.getFullYear()}`;
}

function fazaInfo(typ) {
  if (typ === "zima") return { Ikona: Snowflake, farba: "#2a9fd6", nazov: "Aktuálna zimná sezóna" };
  if (typ === "leto") return { Ikona: Sun, farba: "#e0a021", nazov: "Aktuálna letná sezóna" };
  return { Ikona: CalendarOff, farba: "#c9830f", nazov: "Práve prebieha medzisezóna" };
}

const popisok = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11.5,
  color: "#8a94a3",
  fontWeight: 600,
  marginBottom: 3,
};

const datumStyl = {
  fontFamily: "var(--font-sora), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: "#1b2c42",
};

export default function SezonaInfo({ prehlad, jeMedzisezonaTeraz }) {
  const { aktualna, medzisezona, dalsia } = prehlad;
  const faza = fazaInfo(aktualna.typ);
  const dalsiaInfo = fazaInfo(dalsia.typ);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(120,160,205,0.26)",
        borderRadius: 16,
        padding: 14,
        width: 300,
        boxSizing: "border-box",
        boxShadow: "0 14px 36px rgba(40,90,145,0.22)",
      }}
    >
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          margin: "0 0 11px 0",
          fontFamily: "var(--font-sora), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 13.5,
          color: "#1b2c42",
        }}
      >
        <CalendarDays size={15} color="#2f8ae0" strokeWidth={2.3} />
        Sezóna
      </h3>

      {jeMedzisezonaTeraz && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            background: "#fff7ea",
            border: "1px solid rgba(239,154,61,0.3)",
            borderRadius: 11,
            padding: "9px 11px",
            marginBottom: 11,
            fontSize: 11.5,
            color: "#c9830f",
            fontWeight: 600,
            lineHeight: 1.45,
          }}
        >
          <CalendarOff size={14} strokeWidth={2.3} style={{ flexShrink: 0, marginTop: 1 }} />
          Stredisko je zatvorené — žiadny príjem, mzdy a údržba bežia ďalej.
        </div>
      )}

      <div style={{ marginBottom: 11 }}>
        <div style={popisok}>
          <faza.Ikona size={13} color={faza.farba} strokeWidth={2.4} />
          {faza.nazov}
        </div>
        <div style={datumStyl}>
          {formatDatum(aktualna.zaciatok)} – {formatDatum(aktualna.koniec)}
        </div>
      </div>

      {aktualna.typ !== "medzisezona" && (
        <div style={{ marginBottom: 11, borderTop: "1px solid rgba(120,160,205,0.22)", paddingTop: 10 }}>
          <div style={popisok}>
            <CalendarOff size={13} color="#c9830f" strokeWidth={2.4} />
            Medzisezóna (stredisko zatvorené)
          </div>
          <div style={{ ...datumStyl, color: "#c9830f" }}>
            {formatDatum(medzisezona.zaciatok)} – {formatDatum(medzisezona.koniec)}
          </div>
        </div>
      )}

      <div style={{ borderTop: "1px solid rgba(120,160,205,0.22)", paddingTop: 10 }}>
        <div style={popisok}>
          <dalsiaInfo.Ikona size={13} color={dalsiaInfo.farba} strokeWidth={2.4} />
          {dalsia.typ === "zima" ? "Zimná sezóna začína" : "Letná sezóna začína"}
        </div>
        <div style={{ ...datumStyl, color: "#2ca24e" }}>{formatDatum(dalsia.zaciatok)}</div>
      </div>
    </div>
  );
}
