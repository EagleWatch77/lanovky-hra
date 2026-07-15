"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ShieldAlert, Wallet, Trophy, ClipboardList } from "lucide-react";

const NAV = [
  { href: "/", label: "Prehľad", Icon: Home },
  { href: "/budovy", label: "Budovy", Icon: Building2 },
  { href: "/konkurencia", label: "Konkurencia", Icon: ShieldAlert },
  { href: "/financie", label: "Financie", Icon: Wallet },
  { href: "/rebricek", label: "Rebríček", Icon: Trophy },
  { href: "/co-je-hotove", label: "Info", Icon: ClipboardList },
];

export default function NavSide({ onOtvorBudovy, onOtvorKonkurencia, onOtvorFinancie, onOtvorRebricek, onOtvorInfo }) {
  const pathname = usePathname();

  const OKNA = {
    "/budovy": onOtvorBudovy,
    "/konkurencia": onOtvorKonkurencia,
    "/financie": onOtvorFinancie,
    "/rebricek": onOtvorRebricek,
    "/co-je-hotove": onOtvorInfo,
  };

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
        background: "rgba(255,255,255,0.25)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      {NAV.map((n) => {
        const aktivny = pathname === n.href;
        const onOtvor = OKNA[n.href];
        if (onOtvor) {
          return (
            <button
              key={n.href}
              onClick={onOtvor}
              title={n.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "transparent",
                border: "none",
                color: "#1e293b",
                cursor: "pointer",
              }}
            >
              <n.Icon size={17} strokeWidth={1.8} />
            </button>
          );
        }
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
              background: aktivny ? "rgba(255,255,255,0.6)" : "transparent",
              color: "#1e293b",
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
