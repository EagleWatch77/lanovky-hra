// app/lib/loga.js
// Katalóg log strediska ako Lucide ikony.
// Do databázy sa ukladá KĽÚČ (napr. "hory"), pri zobrazení sa podľa neho vykreslí ikona.

import {
  Mountain,
  MountainSnow,
  Snowflake,
  CableCar,
  TramFront,
  Tent,
  Trees,
  TreePine,
  Home,
  Trophy,
  Ticket,
  Flag,
  Wind,
  Compass,
  Medal,
} from "lucide-react";

// Poradie tu = poradie, v akom sa zobrazia pri výbere v registrácii.
export const LOGA = [
  { kluc: "hory",      Ikona: MountainSnow, popis: "Zasnežené hory" },
  { kluc: "vrchol",    Ikona: Mountain,     popis: "Štít" },
  { kluc: "vlocka",    Ikona: Snowflake,    popis: "Vločka" },
  { kluc: "lanovka",   Ikona: CableCar,     popis: "Kabínková lanovka" },
  { kluc: "vlek",      Ikona: TramFront,    popis: "Vlek / sedačka" },
  { kluc: "chata",     Ikona: Home,         popis: "Chata" },
  { kluc: "stan",      Ikona: Tent,         popis: "Stan / kemp" },
  { kluc: "les",       Ikona: Trees,        popis: "Les" },
  { kluc: "strom",     Ikona: TreePine,     popis: "Smrek" },
  { kluc: "trofej",    Ikona: Trophy,       popis: "Trofej" },
  { kluc: "medaila",   Ikona: Medal,        popis: "Medaila" },
  { kluc: "listok",    Ikona: Ticket,       popis: "Skipas" },
  { kluc: "zastava",   Ikona: Flag,         popis: "Zástavka na trati" },
  { kluc: "vietor",    Ikona: Wind,         popis: "Vietor" },
  { kluc: "kompas",    Ikona: Compass,      popis: "Kompas" },
];

// Predvolené logo, keď uložená hodnota nesedí na žiaden kľúč
// (napr. staré emoji logá z databázy).
export const PREDVOLENE_LOGO = "hory";

// Pomôcka: podľa uloženého kľúča vráti Lucide ikonu.
// Ak kľúč nepozná (staré emoji), vráti predvolenú ikonu.
export function ikonaPodlaKluca(kluc) {
  const najdene = LOGA.find((l) => l.kluc === kluc);
  if (najdene) return najdene.Ikona;
  const zaloha = LOGA.find((l) => l.kluc === PREDVOLENE_LOGO);
  return zaloha.Ikona;
}
