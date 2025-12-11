"use client";
import React, { useState } from "react";
import "./style.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterSelectAffiliation() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleNext() {
    if (!value) {
      alert("Por favor, selecione um vínculo universitário");
      return;
    }
    // Redirecionar baseado na seleção
    const routes = {
      "aluno": "/register-aluno",
      "professor": "/register-teacher",
      "administrador": "/register-administrador"
    };
    router.push(routes[value]);
  }

  return (
    <div className="login-container">
      <div className="login-box">

        {/* LADO ESQUERDO - gradiente conforme pedido */}
        <div className="login-left rsa-left">
          <h1 className="login-title">
            Uece
            <span className="hit-h">H</span>
            <span className="hit-i">i</span>
            <span className="hit-t">t</span>
          </h1>

          <h2 className="login-subtitle">A Uece no seu ritmo!</h2>

          <p className="login-welcome">
            Bem-vindo(a)! Selecione o seu vínculo universitário
          </p>

          <div className="login-field">
            <select
              aria-label="Selecione o vínculo universitário"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="login-input rsa-select"
            >
              <option value="">Selecione o Vínculo Universitário:</option>
              <option value="aluno">Aluno(a)</option>
              <option value="professor">Professor(a)</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <button className="login-button rsa-button" onClick={handleNext}>
            Próximo
          </button>

          <p className="login-register">
            Já tem uma conta?{" "}
            <Link href="/login-everyone">Faça seu Login</Link>
          </p>

        </div>

        {/* LADO DIREITO - imagem */}
        <div className="login-right">
          <img src="/assets/student.svg" alt="Ilustração" />
        </div>
      </div>
    </div>
  );
}
