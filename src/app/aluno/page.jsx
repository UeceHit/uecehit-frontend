"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AlunoDashboard() {
  return (
    <div>
      <Header />

      <Sidebar
        turmas={[
          "Inteligência Computacional",
          "Banco de Dados",
          "Organização de Computadores",
        ]}
        grupos={[
          "Banca TCC",
          "PET",
        ]}
      />

      <h1 style={{ padding: "2rem" }}>Dashboard do Aluno</h1>
    </div>
  );
}