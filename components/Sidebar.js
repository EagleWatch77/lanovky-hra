"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AKTIVNE = [
  { href: "/", label: "Prehľad", icon: "🏠" },
  { href: "/budovy", label: "Budovy", icon: "🏗️" },
  { href: "/rebricek", label: "Rebríček", icon: "🏆" },
  { href: "/co-je-hotove", label: "Čo je hotové", icon: "📋" },
  { href: "/nastavenia", label: "Nastavenia", icon: "⚙️" },
];

const COSKORO = [
  { label: "Turisti", icon: "🧑‍🤝‍🧑" },
  { label: "Ekonomika", icon: "📈" },
  { label: "Výskum", icon: "🔬" },
  { label: "Eventy", icon: "🎉" },
  { label: "Aliancia", icon: "🤝" },
];

export default function Sidebar({ notifikacie = [] }) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 240,
      borderRadius: 16,
      background: "rgba(13,20,27,0.82)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
      padding: "20px 12px",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      alignSelf: "stretch",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, marginBottom: 24, paddingLeft: 8 }}>
        <div style={{ fontSize: 28, lineHeight: 1 }}>🏔️</div>
        <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1, marginTop: 4 }}>SNOWPEAK</div>
        <div style={{ fontSize: 10, color: "#9fb0bf", letterSpacing: 2 }}>RESORT</div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              fontSize: 14,
              color: pathname === o.href ? "#e8edf2" : "#9fb0bf",
              background: pathname === o.href ? "#1c2833" : "transparent",
            }}
          >
            <span>{o.icon}</span>{o.label}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 24, color: "#4a5866", fontSize: 11, textTransform: "uppercase", paddingLeft: 12, marginBottom: 6 }}>
        Čoskoro
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {COSKORO.map((o) => (
          <div
            key={o.label}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 14, color: "#4a5866" }}
          >
            <span>{o.icon}</span>{o.label}
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
                  fontSize: 12,
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
