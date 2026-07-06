"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" alebo "register"
  const [message, setMessage] = useState("");
  const [stanica, setStanica] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadStanica();
    }
  }, [session]);

  async function loadStanica() {
    setLoading(true);
    const userId = session.user.id;

    let { data, error } = await supabase
      .from("stanice")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data && !error) {
      const { data: newData, error: insertError } = await supabase
        .from("stanice")
        .insert({ user_id: userId, nazov: "Moja prvá stanica", level: 1 })
        .select()
        .single();

      if (!insertError) data = newData;
    }

    setStanica(data);
    setLoading(false);
  }

  async function vylepsitStanicu() {
    if (!stanica) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("stanice")
      .update({ level: stanica.level + 1 })
      .eq("id", stanica.id)
      .select()
      .single();

    if (!error) setStanica(data);
    setLoading(false);
  }

  async function handleAuth(e) {
    e.preventDefault();
    setMessage("");

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage("Chyba: " + error.message);
      else setMessage("Účet vytvorený! Skontroluj email pre potvrdenie (ak je to nastavené), alebo sa rovno prihlás.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("Chyba: " + error.message);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setStanica(null);
  }

  if (!session) {
    return (
      <main style={{ maxWidth: 400, margin: "80px auto", padding: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>🚡 Lanovky Hra</h1>
        <p style={{ color: "#9fb0bf", marginBottom: 24 }}>Prototyp — prihlásenie / registrácia</p>

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Heslo (min. 6 znakov)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            {mode === "login" ? "Prihlásiť sa" : "Zaregistrovať sa"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ ...linkStyle, marginTop: 16 }}
        >
          {mode === "login" ? "Nemáš účet? Zaregistruj sa" : "Už máš účet? Prihlás sa"}
        </button>

        {message && <p style={{ marginTop: 16, color: "#f2c94c" }}>{message}</p>}
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 500, margin: "80px auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24 }}>🚡 Vitaj, {session.user.email}</h1>
        <button onClick={handleLogout} style={{ ...linkStyle }}>Odhlásiť sa</button>
      </div>

      {loading && <p style={{ color: "#9fb0bf" }}>Načítavam...</p>}

      {!loading && stanica && (
        <div style={cardStyle}>
          <h2 style={{ margin: 0 }}>{stanica.nazov}</h2>
          <p style={{ fontSize: 40, margin: "16px 0", fontWeight: 700 }}>Level {stanica.level}</p>
          <button onClick={vylepsitStanicu} style={buttonStyle} disabled={loading}>
            ⬆️ Vylepšiť stanicu
          </button>
        </div>
      )}
    </main>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #2a3744",
  background: "#151e27",
  color: "#e8edf2",
  fontSize: 16,
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  background: "#2f9e6e",
  color: "white",
  fontSize: 16,
  cursor: "pointer",
  fontWeight: 600,
};

const linkStyle = {
  background: "none",
  border: "none",
  color: "#7fb8e0",
  cursor: "pointer",
  fontSize: 14,
  padding: 0,
};

const cardStyle = {
  marginTop: 32,
  padding: 24,
  borderRadius: 12,
  background: "#151e27",
  border: "1px solid #2a3744",
  textAlign: "center",
};
