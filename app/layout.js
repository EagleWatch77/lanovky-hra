import { Sora, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
});

export const metadata = {
  title: "Lanovky Hra",
  description: "Prototyp hry o budovaní lanoviek",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk" className={`${inter.variable} ${sora.variable}`}>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          background: "#0f1720",
          color: "#e8edf2",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
