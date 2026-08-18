"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ShieldAlert, Wallet, Trophy, ClipboardList, Users, HardHat, Euro } from "lucide-react";

// ⚙️ PREPÍNAČ VZHĽADU MENU:
//   "stext"   = ikona + popisok pod ňou (ako v mockupe)
//   "kompakt" = len ikony s tooltipom (úspornejšie)
const VZHLAD_MENU = "stext";

const NAV = [
  { href: "/", label: "Prehľad", text: "Prehľad", Icon: Home },
  { href: "/konkurencia", label: "Konkurencia", text: "Súperi", Icon: ShieldAlert },
  { href: "/zamestnanci", label: "Zamestnanci", text: "Personál", Icon: HardHat },
  { href: "/ceny", label: "Ceny", text: "Ceny", Icon: Euro },
  { href: "/financie", label: "Financie", text: "Financie", Icon: Wallet },
  { href: "/rebricek", label: "Rebríček", text: "Rebríček", Icon: Trophy },
  { href: "/aliancia", label: "Ski konzorcium", text: "Konzorcium", Icon: Users },
  { href: "/co-je-hotove", label: "Info", text: "Info", Icon: ClipboardList },
];

function Polozka({ Icon, label, text, aktivny, onClick, href }) {
  const [hover, setHover] = useState(false);
  const zbaleny = VZHLAD_MENU === "kompakt";

  const styl = {
    display: "flex",
    flexDirection: zbaleny ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    gap: zbaleny ? 0 : 4,
    width: zbaleny ? 40 : 66,
    minHeight: zbaleny ? 40 : 52,
    padding: zbaleny ? 0 : "8px 4px",
    borderRadius: 13,
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    boxSizing: "border-box",
    background: aktivny
      ? "linear-gradient(160deg,#4aa3ee,#2f92e6)"
      : hover
      ? "rgba(120,175,235,0.16)"
      : "transparent",
    color: aktivny ? "#ffffff" : "#5a6f88",
    boxShadow: aktivny ? "0 8px 16px rgba(47,146,230,0.35)" : "none",
    transition: "background 0.15s",
  };

  const textStyl = {
    fontSize: 9.5,
    fontWeight: 600,
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    lineHeight: 1.15,
    textAlign: "center",
    color: aktivny ? "#ffffff" : "#5a6f88",
  };

  const obsah = (
    <>
      <Icon size={20} strokeWidth={2} />
      {!zbaleny && <span style={textStyl}>{text}</span>}
    </>
  );

  const spolocne = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    title: label,
    style: styl,
  };

  if (onClick) {
    return (
      <button onClick={onClick} {...spolocne}>
        {obsah}
      </button>
    );
  }
  return (
    <Link href={href} {...spolocne}>
      {obsah}
    </Link>
  );
}

export default function NavSide({
  onOtvorBudovy,
  onOtvorKonkurencia,
  onOtvorFinancie,
  onOtvorRebricek,
  onOtvorInfo,
  onOtvorAliancia,
  onOtvorZamestnanci,
  onOtvorCeny,
}) {
  const pathname = usePathname();
  const OKNA = {
    "/budovy": onOtvorBudovy,
    "/konkurencia": onOtvorKonkurencia,
    "/zamestnanci": onOtvorZamestnanci,
    "/ceny": onOtvorCeny,
    "/financie": onOtvorFinancie,
    "/rebricek": onOtvorRebricek,
    "/aliancia": onOtvorAliancia,
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
        gap: 5,
        padding: 8,
        borderRadius: 18,
        background: "rgba(255,255,255,0.74)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(120,160,205,0.22)",
        boxShadow: "0 10px 30px rgba(52,100,150,0.16)",
      }}
    >
      {NAV.map((n) => {
        const aktivny = pathname === n.href;
        const onOtvor = OKNA[n.href];
        return (
          <Polozka
            key={n.href}
            Icon={n.Icon}
            label={n.label}
            text={n.text}
            aktivny={aktivny}
            onClick={onOtvor}
            href={onOtvor ? undefined : n.href}
          />
        );
      })}
    </div>
  );
}
