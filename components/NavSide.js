"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ShieldAlert, Wallet, Trophy, ClipboardList, Settings } from "lucide-react";

const NAV = [
  { href: "/", label: "Prehľad", Icon: Home },
  { href: "/budovy", label: "Budovy", Icon: Building2 },
  { href: "/konkurencia", label: "Konkurencia", Icon: ShieldAlert },
  { href: "/financie", label: "Financie", Icon: Wallet },
  { href: "/rebricek", label: "Rebríček", Icon: Trophy },
  { href: "/co-je-hotove", label: "Info", Icon: ClipboardList },
  { href: "/nastavenia", label: "Nastavenia", Icon: Settings },
];

export default function NavSide() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: 6,
        borderRadius: 14,
        background: "rgba(13,20,27,0.55)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {NAV.map((n) => {
        const aktivny = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            title={n.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 9,
              background: aktivny ? "rgba(255,255,255,0.16)" : "transparent",
              color: aktivny ? "#e8edf2" : "rgba(232,237,242,0.65)",
              textDecoration: "none",
            }}
          >
            <n.Icon size={17} strokeWidth={1.8} />
          </Link>
        );
      })}
    </div>
  );
}
