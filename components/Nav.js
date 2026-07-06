"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { linkStyle } from "../lib/styles";

const ODKAZY = [
  { href: "/", label: "🏠 Prehľad" },
  { href: "/budovy", label: "🏗️ Budovy" },
  { href: "/rebricek", label: "🏆 Rebríček" },
  { href: "/co-je-hotove", label: "📋 Čo je hotové" },
  { href: "/nastavenia", label: "⚙️ Nastavenia" },
];

export default function Nav({ email, onLogout }) {
  const pathname = usePathname();

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 20 }}>🚡 {email}</h1>
        <button onClick={onLogout} style={linkStyle}>Odhlásiť sa</button>
      </div>
      <nav style={{ display: "flex", gap: 4, borderBottom: "1px solid #2a3744", paddingBottom: 8, flexWrap: "wrap" }}>
        {ODKAZY.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              color: pathname === o.href ? "#e8edf2" : "#9fb0bf",
              background: pathname === o.href ? "#2a3744" : "transparent",
            }}
          >
            {o.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
