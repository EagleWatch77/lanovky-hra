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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: 220, minHeight: "100vh", background: "#0d141b", borderRight: "1px solid #1f2b36", padding: "20px 12px", flexShrink: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 24, paddingLeft: 8 }}>🚡 Lanovky Hra</div>

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
    </aside>
  );
}
