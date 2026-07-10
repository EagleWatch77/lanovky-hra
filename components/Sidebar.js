"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Trophy, ClipboardList, Settings, Users, FlaskConical, PartyPopper, Handshake, ShieldAlert, Wallet, Bell } from "lucide-react";

const AKTIVNE = [
  { href: "/", label: "Prehľad", Icon: Home },
  { href: "/budovy", label: "Budovy", Icon: Building2 },
  { href: "/konkurencia", label: "Konkurencia", Icon: ShieldAlert },
  { href: "/financie", label: "Financie", Icon: Wallet },
  { href: "/rebricek", label: "Rebríček", Icon: Trophy },
  { href: "/co-je-hotove", label: "Info", Icon: ClipboardList },
  { href: "/nastavenia", label: "Nastavenia", Icon: Settings },
];

const COSKORO = [
  { label: "Turisti", Icon: Users },
  { label: "Výskum", Icon: FlaskConical },
  { label: "Eventy", Icon: PartyPopper },
  { label: "Aliancia", Icon: Handshake },
];

export default function Sidebar({ notifikacie = [] }) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 68,
      borderRadius: 16,
      background: "rgba(13,20,27,0.82)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
      padding: "14px 6px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignSelf: "stretch",
    }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {AKTIVNE.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            title={o.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "8px 2px",
              borderRadius: 10,
              textDecoration: "none",
              color: pathname === o.href ? "#e8edf2" : "#9fb0bf",
              background: pathname === o.href ? "#1c2833" : "transparent",
            }}
          >
            <o.Icon size={19} strokeWidth={1.8} />
            <span style={{ fontSize: 9.5, textAlign: "center", lineHeight: 1.1 }}>{o.label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ width: "70%", height: 1, background: "#223040", margin: "12px 0 8px" }} />

      <nav style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {COSKORO.map((o) => (
          <div
            key={o.label}
            title={o.label + " (čoskoro)"}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 2px", borderRadius: 10, color: "#4a5866" }}
          >
            <o.Icon size={17} strokeWidth={1.8} />
            <span style={{ fontSize: 9.5, textAlign: "center", lineHeight: 1.1 }}>{o.label}</span>
          </div>
        ))}
      </nav>

      {notifikacie.length > 0 && (
        <div style={{ marginTop: "auto", position: "relative" }} title={notifikacie.map((n) => n.text).join("\n")}>
          <Bell size={19} color="#f2994a" strokeWidth={1.8} />
          <span style={{
            position: "absolute", top: -4, right: -6, background: "#f2994a", color: "#0d141b",
            fontSize: 9, fontWeight: 700, borderRadius: 8, minWidth: 14, height: 14,
            display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
          }}>
            {notifikacie.length}
          </span>
        </div>
      )}
    </aside>
  );
}
