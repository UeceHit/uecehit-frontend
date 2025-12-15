"use client";
import React, { useState } from "react";
import "./style.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
      console.log('Tentando fazer login com:', username);
      
      const response = await fetch("https://api.uecehit.com.br/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.log('Erro da API:', errorData);
        } catch (jsonError) {
          console.log('Não foi possível parsear erro como JSON');
        }

        let errorMessage = ERROR_MESSAGES[response.status];

        if (!errorMessage) {
          errorMessage = errorData?.detail?.[0]?.msg
                       || errorData?.detail
                       || ERROR_MESSAGES.DEFAULT; 
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      console.log('Resposta completa da API:', data);
      
      // Extrair o token do objeto de resposta
      const token = data.access_token || data.token || data;
      
      console.log('Token extraído:', token);
      console.log('Tipo do token:', typeof token);
      
      if (!token || typeof token !== 'string') {
        console.error('Token inválido recebido:', token);
        throw new Error('Token inválido recebido do servidor');
      }
      
      // Salvar com a chave correta que o Calendar.jsx está buscando
      localStorage.setItem("access_token", token);
      
      console.log('Token salvo no localStorage');
      console.log('Verificando se foi salvo:', localStorage.getItem("access_token"));
      
      // Também manter a chave antiga por compatibilidade (opcional)
      localStorage.setItem("authToken", token);
      
      router.push("/aluno");

    } catch (err) {
      console.error('Erro no login:', err);
      if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
        setError(ERROR_MESSAGES.NETWORK);
      } else {
        setError(err.message || ERROR_MESSAGES.DEFAULT);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        
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

        <div className="login-right">
          <img src="/assets/login-image.png" alt="Ilustração de login" />
        </div>
      </div>
    </div>
  );
}