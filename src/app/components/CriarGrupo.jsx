"use client";

import { useState } from "react";
import "./criar-grupo.css";

export default function CriarGrupo({ onClose, onCreate }) {
  const [nome, setNome] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    const m = memberInput.trim();
    if (!m) return;
    setMembers([...members, m]);
    setMemberInput("");
  };

  const handleSubmit = () => {
    const nomeTrim = nome.trim();

    if (!nomeTrim) {
      alert("Digite um nome válido para o grupo.");
      return;
    }

    onCreate({
      nome: nomeTrim,
      membros: members
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <button className="popup-close" onClick={onClose}>✕</button>

        <h2 className="popup-title">Criar Grupo</h2>

        <input
          type="text"
          placeholder="Nome do grupo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="popup-input"
        />

        <div className="popup-row">
          <input
            type="text"
            placeholder="Adicionar membro"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
            className="popup-input"
          />

          <button className="popup-add-btn" onClick={handleAddMember}>
            Adicionar
          </button>
        </div>

        {members.length > 0 && (
          <ul className="member-list">
            {members.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}

        <button className="popup-main-btn" onClick={handleSubmit}>
          Criar
        </button>
      </div>
    </div>
  );
}
