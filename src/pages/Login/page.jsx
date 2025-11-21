"use client";
import React from "react";
import "./style.css";

export default function LoginPage() {
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

          <input
            type="email"
            className="login-input"
            placeholder="Email institucional"
          />
          <input
            type="password"
            className="login-input"
            placeholder="Senha"
          />

          <div className="login-options">
            <label>
              <input type="checkbox" /> Lembre de mim
            </label>
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button className="login-button">Log In</button>

          <p className="login-register">
            Não tem uma conta? <a href="#">Crie sua conta</a>
          </p>
        </div>

        <div className="login-right">
          <img src="/assets/login-image.png" alt="Ilustração" />
        </div>
      </div>
    </div>
  );
}