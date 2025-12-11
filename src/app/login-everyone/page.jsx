"use client";
import React, { useState } from "react";
import "./style.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define um mapa para associar códigos de status HTTP a mensagens de erro
const ERROR_MESSAGES = {
  401: "Email ou senha incorretos. Por favor, tente novamente.",
  404: "Conta não cadastrada. Por favor, crie uma conta primeiro.",
  422: "Dados inválidos. Verifique seu email e senha.",
  DEFAULT: "Erro ao fazer login. Tente novamente ou entre em contato com o suporte.",
  NETWORK: "Erro de conexão. Verifique sua internet ou tente novamente mais tarde."
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://api.uecehit.com.br/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Se a resposta não for bem-sucedida (status 4xx ou 5xx)
      if (!response.ok) {
        // Tenta obter os dados de erro (que podem conter mais detalhes)
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // Ignora erro se a resposta não puder ser convertida para JSON
        }

        // 1. Tratamento de Erros Específicos com o mapa
        let errorMessage = ERROR_MESSAGES[response.status];

        // 2. Se a mensagem não estiver no mapa, usa a mensagem de detalhe da API (se existir) ou a mensagem DEFAULT
        if (!errorMessage) {
          errorMessage = errorData?.detail?.[0]?.msg // Para erros 422 de validação
                       || errorData?.detail          // Para outros erros detalhados
                       || ERROR_MESSAGES.DEFAULT; 
        }

        throw new Error(errorMessage);
      }

      // Fluxo de sucesso (response.ok)
      const authToken = await response.json();
      
      // Observação: Para melhor segurança, considere usar Cookies HTTP-Only
      localStorage.setItem("authToken", authToken);
      router.push("/aluno");

    } catch (err) {
      // Tratamento para erros de rede (ex: 'Failed to fetch')
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError(ERROR_MESSAGES.NETWORK);
      } else {
        // Erro lançado pelo bloco 'if (!response.ok)' ou outro erro inesperado
        setError(err.message || ERROR_MESSAGES.DEFAULT);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        
        {/* LADO ESQUERDO */}
        <div className="login-left">
          <h1 className="login-title">
            Uece
            <span className="hit-h">H</span>
            <span className="hit-i">i</span>
            <span className="hit-t">t</span>
          </h1>

          <h2 className="login-subtitle">A Uece no seu ritmo!</h2>

          <p className="login-welcome">
            Bem-vindo de volta! Por favor, faça login na sua conta
          </p>

          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ 
                color: "#721c24", 
                backgroundColor: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "5px",
                padding: "12px",
                marginBottom: "15px",
                fontSize: "14px",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}
            
            <input
              type="email"
              className="login-input"
              placeholder="Email institucional"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input 
              type="password" 
              className="login-input" 
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-options">
              <label>
                <input type="checkbox" /> Lembre de mim
              </label>

              {/* ROTA CORRETA NO APP ROUTER */}
              <Link href="/login-everyone/esqueci-senha">
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Entrando..." : "Log In"}
            </button>
          </form>

          <p className="login-register">
            Não tem uma conta?{" "}
            <Link href="/register-select-affiliation">Crie sua conta</Link>
          </p>
        </div>

        {/* LADO DIREITO */}
        <div className="login-right">
          {/* Certifique-se de que a imagem '/assets/login-image.png' existe na pasta public */}
          <img src="/assets/login-image.png" alt="Ilustração de login" />
        </div>
      </div>
    </div>
  );
}