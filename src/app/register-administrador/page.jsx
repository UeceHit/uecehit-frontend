"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";
import Link from "next/link";

export default function RegisterAdministrador() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const papel = "administrador";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          papel,
          senha,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.detail || data?.message || "Erro no registro");
        setLoading(false);
        return;
      }

      router.push("/aluno");
    } catch (err) {
      setError("Erro de rede");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* LADO ESQUERDO */}
        <div className="register-left">
          <h1 className="register-title">
            Uece
            <span className="hit-h">H</span>
            <span className="hit-i">i</span>
            <span className="hit-t">t</span>
          </h1>

          <h2 className="register-subtitle">A Uece no seu ritmo!</h2>

          <p className="register-welcome">
            Crie sua conta de administrador
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="register-input"
              placeholder="Email institucional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              type="password"
              className="register-input"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="new-password"
            />

            <button className="register-button" type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Criar Conta"}
            </button>

            {error && <p className="error-text">{String(error)}</p>}
          </form>

          <p className="register-login">
            Já tem uma conta?{" "}
            <Link href="/login-everyone">Faça login</Link>
          </p>
        </div>

        {/* LADO DIREITO */}
        <div className="register-right">
          <img src="/assets/admin.svg" alt="Ilustração" />
        </div>
      </div>
    </div>
  );
}
