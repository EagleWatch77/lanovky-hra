"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, Trophy, ClipboardList, Settings, Users, TrendingUp, FlaskConical, PartyPopper, Handshake } from "lucide-react";

const AKTIVNE = [
  { href: "/", label: "Prehľad", Icon: Home },
  { href: "/budovy", label: "Budovy", Icon: Building2 },
  { href: "/rebricek", label: "Rebríček", Icon: Trophy },
  { href: "/co-je-hotove", label: "Čo je hotové", Icon: ClipboardList },
  { href: "/nastavenia", label: "Nastavenia", Icon: Settings },
];

const COSKORO = [
  { label: "Turisti", Icon: Users },
  { label: "Ekonomika", Icon: TrendingUp },
  { label: "Výskum", Icon: FlaskConical },
  { label: "Eventy", Icon: PartyPopper },
  { label: "Aliancia", Icon: Handshake },
];

export default function Sidebar({ notifikacie = [] }) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 210,
      borderRadius: 16,
      background: "rgba(13,20,27,0.82)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
      padding: "18px 10px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignSelf: "stretch",
    }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {AKTIVNE.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 15,
              color: pathname === o.href ? "#e8edf2" : "#9fb0bf",
              background: pathname === o.href ? "#1c2833" : "transparent",
            }}
          >
            <o.Icon size={18} strokeWidth={1.8} />
            {o.label}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 20, color: "#4a5866", fontSize: 11, textTransform: "uppercase", paddingLeft: 12, marginBottom: 6 }}>
        Čoskoro
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {COSKORO.map((o) => (
          <div
            key={o.label}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 15, color: "#4a5866" }}
          >
            <o.Icon size={18} strokeWidth={1.8} />
            {o.label}
          </div>
        ))}
      </nav>

      {notifikacie.length > 0 && (
        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <div style={{ color: "#4a5866", fontSize: 11, textTransform: "uppercase", paddingLeft: 12, marginBottom: 6 }}>
            Notifikácie
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {notifikacie.map((n, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  color: n.typ === "varovanie" ? "#f2994a" : "#9fb0bf",
                  background: "#131c24",
                  borderRadius: 6,
                  padding: "8px 10px",
                }}
              >
                {n.typ === "varovanie" ? "⚠️ " : "ℹ️ "}{n.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
