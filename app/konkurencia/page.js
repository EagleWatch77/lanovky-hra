"use client";

import { useGameState } from "../../lib/useGameState";
import AuthForm from "../../components/AuthForm";
import AppLayout from "../../components/AppLayout";
import { KATEGORIE, KONKURENCIA_KONFIG } from "../../lib/katalog";
import { cardStyle, tileStyle } from "../../lib/styles";

const NAZVY = { hotel: "Hotely", bar: "Bary", parkovisko: "Parkoviská", servis: "Servis a požičovňa" };

function zostavaCasu(koniecVystavby) {
  const zostava = new Date(koniecVystavby) - new Date();
  if (zostava <= 0) return "Dokončuje sa...";
  const dni = Math.ceil(zostava / (1000 * 60 * 60 * 24));
  return `${dni} ${dni === 1 ? "deň" : dni < 5 ? "dni" : "dní"}`;
}

export default function KonkurenciaPage() {
  const { session, stanica, budovy, handleLogout, efektivitaBudovy, konkurenciaJednotky, pocetKonkurencie } = useGameState();

  if (!session) return <AuthForm />;

  return (
    <AppLayout session={session} stanica={stanica} budovy={budovy} handleLogout={handleLogout} efektivitaBudovy={efektivitaBudovy} pocetKonkurencie={pocetKonkurencie}>
      <h2 style={{ fontSize: 20 }}>🛡️ Konkurencia</h2>
      <p style={{ color: "#657685", fontSize: 13, marginTop: -8 }}>
        Konkurencia sa objaví, ak niektorú z týchto 4 kategórií nemáš postavenú dlhší čas. Stavia rovnako dlho ako ty a znižuje ti dopyt, ale zvyšuje celkovú prestíž strediska.
      </p>

      {Object.keys(NAZVY).map((kat) => {
        const jednotky = konkurenciaJednotky.filter((k) => k.kategoria === kat);
        const cfg = KONKURENCIA_KONFIG[kat];
        const hotovoPocet = jednotky.filter((k) => k.stav === "hotovo").length;

        return (
          <div key={kat} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>{KATEGORIE[kat].ikona} {NAZVY[kat]}</h3>
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
                Efekt: -{Math.round(cfg.stratapenazi * hotovoPocet * 100)}% dopytu v tejto kategórii, +{cfg.prestizBonus * hotovoPocet} prestíže strediska
              </p>
            )}
          </div>
        );
      })}
    </AppLayout>
  );
}
