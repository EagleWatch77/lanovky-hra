export const metadata = {
  title: "Lanovky Hra",
  description: "Prototyp hry o budovaní lanoviek",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
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
