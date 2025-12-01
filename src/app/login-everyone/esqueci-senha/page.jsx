"use client";

import React from "react";
import Link from "next/link";
import "./style.css";

export default function EsqueciSenhaPage() {
  return (
    <div className="page-wrapper">
      <div className="outer-card">

        {/* LADO ESQUERDO */}
        <div className="left-panel">
          <div className="left-inner">

            {/* Título */}
            <h1 className="brand-title">
              Uece<span className="hit-h">H</span>
              <span className="hit-i">i</span>
              <span className="hit-t">t</span>
            </h1>

            <p className="brand-sub">A Uece no seu ritmo!</p>

            {/* espaço de 70px antes do título principal */}
            <h2 className="forgot-main">Esqueceu a senha?</h2>

            <p className="forgot-sub">
              Não se preocupe, iremos mandar instruções!
            </p>

            <div className="input-wrap">
              <input
                type="email"
                className="email-input"
                placeholder="Digite seu email"
              />
            </div>

            {/* botão com 80px de distância */}
            <button className="reset-button">Resetar Senha</button>

            <div className="back-wrap">
              {/* ✔ rota corrigida — App Router usa /login-everyone */}
              <Link href="/login-everyone" className="back-link">
                ‹ Voltar à tela de Login
              </Link>
            </div>
          </div>
        </div>

        {/* LADO DIREITO – reservado para imagem futura */}
        <div className="right-panel placeholder-panel"></div>

      </div>
    </div>
  );
}