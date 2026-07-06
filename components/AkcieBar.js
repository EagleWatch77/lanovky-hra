"use client";

import Link from "next/link";

const AKCIE = [
  { href: "/budovy", label: "Postaviť", icon: "🏗️" },
  { href: "/rebricek", label: "Rebríček", icon: "🏆" },
  { href: "/nastavenia", label: "Nastavenia", icon: "⚙️" },
];

const COSKORO = [
  { label: "Eventy", icon: "🎉" },
  { label: "Aliancia", icon: "🤝" },
  { label: "Správy", icon: "✉️" },
];

export default function AkcieBar() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 32, paddingTop: 20, borderTop: "1px solid #1f2b36" }}>
      {AKCIE.map((a) => (
        <Link
          key={a.href}
          href={a.href}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "12px 20px",
            borderRadius: 10,
            background: "#131c24",
            border: "1px solid #223040",
            color: "#e8edf2",
            textDecoration: "none",
            fontSize: 12,
            minWidth: 80,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontSize: 20 }}>{a.icon}</span>
          {a.label}
        </Link>
      ))}
      {COSKORO.map((a) => (
        <div
          key={a.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "12px 20px",
            borderRadius: 10,
            background: "#0f1720",
            border: "1px solid #1a2632",
            color: "#4a5866",
            fontSize: 12,
            minWidth: 80,
          }}
        >
          <span style={{ fontSize: 20 }}>{a.icon}</span>
          {a.label}
        </div>
      ))}
    </div>
  );
}
