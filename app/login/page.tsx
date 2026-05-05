"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      setError("Email y password son requeridos");
      return;
    }

    setLoading(true);
    setError("");

    const data = isLogin
      ? await login(email, password)
      : await register(email, password);

    setLoading(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    if (isLogin) {
      // guardar token y redirigir al juego
      localStorage.setItem("chess-token", data.token);
      localStorage.setItem("chess-user", JSON.stringify(data.user));
      router.push("/");
    } else {
      // después de registrarse, ir al login
      setIsLogin(true);
      setError("");
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <h1 style={{
        color: "#f0d9b5",
        fontSize: "32px",
        fontWeight: "bold",
        letterSpacing: "4px",
        textTransform: "uppercase",
        marginBottom: "4px",
        textAlign: "center",
      }}>
        ♔ 36 Chambers Chess 
      </h1>
      <p style={{ color: "#b58863", fontSize: "13px", letterSpacing: "2px", marginBottom: "10px" }}>
        Powered by Stockfish
      </p>
        <p style={{ color: "rgba(240,217,181,0.4)", fontSize: "12px", letterSpacing: "1px", marginBottom: "10px" }}>
            Created by bzilla
        </p>

      <div style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(240,217,181,0.2)",
        borderRadius: "12px",
        padding: "32px",
        width: "100%",
        maxWidth: "380px",
        backdropFilter: "blur(10px)",
      }}>
        {/* tabs */}
        <div style={{ display: "flex", marginBottom: "24px", gap: "8px" }}>
          {["Iniciar sesión", "Registrarse"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setIsLogin(i === 0); setError(""); }}
              style={{
                flex: 1,
                padding: "8px",
                background: isLogin === (i === 0) ? "#b58863" : "transparent",
                color: isLogin === (i === 0) ? "#1a1a2e" : "#b58863",
                border: "1px solid #b58863",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(240,217,181,0.3)",
              borderRadius: "6px",
              color: "#f0d9b5",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              padding: "12px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(240,217,181,0.3)",
              borderRadius: "6px",
              color: "#f0d9b5",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <p style={{ color: "#e74c3c", fontSize: "13px", marginTop: "12px" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: loading ? "#555" : "#b58863",
            color: "#1a1a2e",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {loading ? "Cargando..." : isLogin ? "Entrar" : "Registrarse"}
        </button>
      </div>
    </div>
  );
}