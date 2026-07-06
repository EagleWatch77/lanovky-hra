"use client";

import { useState } from "react";
import { useGameState } from "../../lib/useGameState";
import AuthForm from "../../components/AuthForm";
import AppLayout from "../../components/AppLayout";
import VyjednavanieModal from "../../components/VyjednavanieModal";
import {
  KATEGORIE,
  vystavbaVRealnychDnoch,
  cenaBudovy,
  prestizBudovy,
  turistiZaHodinu,
  prijemZaHodinu,
  zamestnanciPotrebni,
  CENA_NAJATIA,
} from "../../lib/katalog";
import { inputStyle, buttonStyle, linkStyle, cardStyle, rowCardStyle, tileStyle, tileStyleActive } from "../../lib/styles";

export default function BudovyPage() {
  const {
    session,
    stanica,
    budovy,
    loading,
    ukazVyjednavanie,
    vyjednatPlat,
    handleLogout,
    postavitBudovu,
    zmenitCenu,
    najatPreBudovu,
    prepustitPreBudovu,
    efektivitaBudovy,
  } = useGameState();

  const [ukazStavbu, setUkazStavbu] = useState(false);
  const [vyberKategoria, setVyberKategoria] = useState("lanovka");
  const [vyberTyp, setVyberTyp] = useState("vlek");
  const [vyberZnacka, setVyberZnacka] = useState("montera");

  if (!session) return <AuthForm />;

  function zmenitKategoriu(novaKategoria) {
    const prvyTyp = Object.keys(KATEGORIE[novaKategoria].katalog)[0];
    const znackyKatalog = KATEGORIE[novaKategoria].znackyKatalog;
    const prvaZnacka = znackyKatalog ? Object.keys(znackyKatalog)[0] : null;
    setVyberKategoria(novaKategoria);
    setVyberTyp(prvyTyp);
    setVyberZnacka(prvaZnacka);
  }

  function zostavaCasu(koniecVystavby) {
    const zostava = new Date(koniecVystavby) - new Date();
    if (zostava <= 0) return "Dokončuje sa...";
    const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
    return
