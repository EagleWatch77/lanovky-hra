// app/lib/theme.js
// Centrálne dizajnové tokeny pre svetlú "ľadovú" tému.
// Všetko odtiaľto — nikde inde nehardcoduj farby/tiene/rádiusy.

import {
  Mountain, MountainSnow, Snowflake, CableCar, TramFront, Tent,
  Trees, TreePine, Home, Trophy, Ticket, Flag, Wind, Compass, Medal,
} from "lucide-react";

export const LOGA = [
  { kluc: "hory",    Ikona: MountainSnow, popis: "Zasnežené hory" },
  { kluc: "vrchol",  Ikona: Mountain,     popis: "Štít" },
  { kluc: "vlocka",  Ikona: Snowflake,    popis: "Vločka" },
  { kluc: "lanovka", Ikona: CableCar,     popis: "Kabínková lanovka" },
  { kluc: "vlek",    Ikona: TramFront,    popis: "Vlek / sedačka" },
  { kluc: "chata",   Ikona: Home,         popis: "Chata" },
  { kluc: "stan",    Ikona: Tent,         popis: "Stan / kemp" },
  { kluc: "les",     Ikona: Trees,        popis: "Les" },
  { kluc: "strom",   Ikona: TreePine,     popis: "Smrek" },
  { kluc: "trofej",  Ikona: Trophy,       popis: "Trofej" },
  { kluc: "medaila", Ikona: Medal,        popis: "Medaila" },
  { kluc: "listok",  Ikona: Ticket,       popis: "Skipas" },
  { kluc: "zastava", Ikona: Flag,         popis: "Zástavka na trati" },
  { kluc: "vietor",  Ikona: Wind,         popis: "Vietor" },
  { kluc: "kompas",  Ikona: Compass,      popis: "Kompas" },
];

export const PREDVOLENE_LOGO = "hory";

export function ikonaPodlaKluca(kluc) {
  const najdene = LOGA.find((l) => l.kluc === kluc);
  if (najdene) return najdene.Ikona;
  return LOGA.find((l) => l.kluc === PREDVOLENE_LOGO).Ikona;
}

export const tokens = {
  color: {
    ink:      "#1b2c42", // hlavný text (nadpisy, čísla)
    ink2:     "#5a6f88", // sekundárny text
    dim:      "#90a4bd", // popisky, tlmené
    line:     "rgba(120,160,205,0.22)",  // jemné okraje
    lineHi:   "rgba(120,160,205,0.40)",  // výraznejšie okraje

    white:    "#ffffff",
    glass:    "rgba(255,255,255,0.74)",  // frostový panel (s blur)
    glass2:   "rgba(255,255,255,0.55)",

    blue:     "#2f92e6", // primárny akcent
    blueDeep: "#1c6fc4",
    blueSoft: "#eaf4fd", // svetlé pozadie akcentu
    green:    "#33bd63", // potvrdzovacie CTA
    greenHi:  "#42d675",
    gold:     "#efb23c", // peniaze / prestíž
    purple:   "#9b7fe8",
    amber:    "#efa64a",

    // farby zón (aury + labely na mape)
    zone: {
      z1: "#4ea3f0",
      z2: "#54c877",
      z3: "#a487ef",
      z4: "#f0ab54",
    },
  },

  shadow: {
    sm: "0 4px 14px rgba(60,110,160,0.12)",
    md: "0 10px 30px rgba(52,100,150,0.16)",
    lg: "0 18px 44px rgba(46,90,140,0.20)",
  },

  radius: { sm: 10, md: 14, lg: 18, xl: 22 },

  font: {
    display: "'Sora', system-ui, sans-serif", // nadpisy, čísla
    body:    "'Inter', system-ui, sans-serif", // bežný text
  },
};

// ---- Znovupoužiteľné štýly (rozbaľuj cez spread: style={{ ...glassPanel, ... }}) ----

export const glassPanel = {
  background: tokens.color.glass,
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: `1px solid ${tokens.color.line}`,
  borderRadius: tokens.radius.lg,
  boxShadow: tokens.shadow.md,
};

export const solidPanel = {
  background: tokens.color.white,
  border: `1px solid ${tokens.color.line}`,
  borderRadius: tokens.radius.md,
  boxShadow: tokens.shadow.sm,
};

export const chipStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  ...solidPanel,
  padding: "6px 12px 6px 8px",
  height: 46,
};

export const btn = {
  blue: {
    border: "none",
    borderRadius: tokens.radius.md,
    fontFamily: tokens.font.body,
    fontWeight: 700,
    fontSize: 12.5,
    cursor: "pointer",
    padding: "11px 14px",
    color: "#fff",
    background: `linear-gradient(180deg, #4aa3ee, ${tokens.color.blue})`,
    boxShadow: "0 8px 16px rgba(47,146,230,0.32)",
  },
  green: {
    border: "none",
    borderRadius: tokens.radius.md,
    fontFamily: tokens.font.display,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.03em",
    cursor: "pointer",
    padding: "13px 16px",
    color: "#fff",
    background: `linear-gradient(180deg, ${tokens.color.greenHi}, ${tokens.color.green})`,
    boxShadow: "0 10px 20px rgba(51,189,99,0.32)",
  },
  ghost: {
    borderRadius: tokens.radius.md,
    fontFamily: tokens.font.body,
    fontWeight: 700,
    fontSize: 12.5,
    cursor: "pointer",
    padding: "11px 14px",
    color: tokens.color.ink,
    background: tokens.color.white,
    border: `1px solid ${tokens.color.line}`,
    boxShadow: tokens.shadow.sm,
  },
};

// Svetlé pozadie celej hry (za mapu)
export const appBackground = {
  background:
    "radial-gradient(1100px 520px at 78% -8%, rgba(120,190,245,0.28), transparent 60%)," +
    "linear-gradient(180deg,#e7f2fb,#f3f9fe 60%)",
};
