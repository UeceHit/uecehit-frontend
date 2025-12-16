"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./style.css";
import Link from "next/link";

export default function RegisterAluno() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cursoSelecionado, setCursoSelecionado] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Aplicar classe ao body quando o componente montar
  useEffect(() => {
    document.body.classList.add('register-aluno-active');
    return () => {
      document.body.classList.remove('register-aluno-active');
    };
  }, []);

  const cursos = [
    "Ciência da Computação - Bacharelado - Diurno",
    "Ciência da Computação - Bacharelado - Noturno",
    "Sistemas de Informação - Bacharelado - Noturno",
    "Engenharia de Software - Bacharelado - Diurno",
    "Matemática - Licenciatura - Noturno",
    "Física - Licenciatura - Noturno",
    "Química - Licenciatura - Noturno",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.uecehit.com.br/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          papel: "aluno",
          curso: cursoSelecionado,
          senha,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 422) {
          setError("Dados inválidos. Verifique todos os campos.");
        } else {
          setError(data?.detail || "Erro ao criar conta. Tente novamente.");
        }
        setLoading(false);
        return;
      }

      // Cadastro bem-sucedido, redireciona para login
      router.push("/login-everyone");
    } catch (err) {
      setError("Erro de conexão. Verifique sua internet.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h1 className="register-title">
            Uece
            <span className="hit-h">H</span>
            <span className="hit-i">i</span>
            <span className="hit-t">t</span>
          </h1>

          <h2 className="register-subtitle">A Uece no seu ritmo!</h2>

          <p className="register-welcome">
            Crie sua conta de aluno e comece sua jornada
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                color: "#721c24", 
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "5px",
                padding: "12px",
                marginBottom: "15px",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            <input
              type="text"
              className="register-input"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
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

            <select
              className="register-input"
              value={cursoSelecionado}
              onChange={(e) => setCursoSelecionado(e.target.value)}
              required
            >
              <option value="">Selecione seu curso</option>
              {cursos.map((curso) => (
                <option key={curso} value={curso}>
                  {curso}
                </option>
              ))}
            </select>

            <button className="register-button" type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Criar Conta"}
            </button>
          </form>

          <p className="register-login">
            Já tem uma conta?{" "}
            <Link href="/login-everyone">Faça login</Link>
          </p>
        </div>

        <div className="register-right">
          <img src="/assets/student.svg" alt="Ilustração" />
        </div>
      </div>
    </div>
  );
}
