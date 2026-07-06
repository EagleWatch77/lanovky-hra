"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { inputStyle, buttonStyle, linkStyle } from "../lib/styles";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  async function handleAuth(e) {
    e.preventDefault();
    setMessage("");
    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Chyba: " + error.message);
      else setMessage("Účet vytvorený! Skús sa rovno prihlásiť.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("Chyba: " + error.message);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>🚡 Lanovky Hra</h1>
      <p style={{ color: "#9fb0bf", marginBottom: 24 }}>Prototyp — prihlásenie / registrácia</p>
      <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Heslo (min. 6 znakov)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
        <button type="submit" style={buttonStyle}>{mode === "login" ? "Prihlásiť sa" : "Zaregistrovať sa"}</button>
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ ...linkStyle, marginTop: 16 }}>
        {mode === "login" ? "Nemáš účet? Zaregistruj sa" : "Už máš účet? Prihlás sa"}
      </button>
      {message && <p style={{ marginTop: 16, color: "#f2c94c" }}>{message}</p>}
    </main>
  );
}
