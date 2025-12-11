"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./style.css";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("https://api.uecehit.com.br/api/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao enviar email");
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Erro ao enviar email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <div className="outer-card">

        <div className="left-panel">
          <div className="left-inner">

            <h1 className="brand-title">
              Uece<span className="hit-h">H</span>
              <span className="hit-i">i</span>
              <span className="hit-t">t</span>
            </h1>

            <p className="brand-sub">A Uece no seu ritmo!</p>

            <h2 className="forgot-main">Esqueceu a senha?</h2>

            <p className="forgot-sub">
              Não se preocupe, iremos mandar instruções!
            </p>

            <form onSubmit={handleSubmit}>
              {success && <div style={{ color: "green", marginBottom: "10px" }}>Email enviado com sucesso!</div>}
              {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

              <div className="input-wrap">
                <input
                  type="email"
                  className="email-input"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="reset-button" disabled={loading}>
                {loading ? "Enviando..." : "Resetar Senha"}
              </button>
            </form>

            <div className="back-wrap">
              <Link href="/login-everyone" className="back-link">
                ‹ Voltar à tela de Login
              </Link>
            </div>
          </div>
        </div>

        <div className="right-panel placeholder-panel"></div>

      </div>
    </div>
  );
}