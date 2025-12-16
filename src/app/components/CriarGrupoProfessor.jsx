"use client";

import { useState } from "react";
import "./criar-grupo.css";

export default function CriarGrupoProfessor({ onClose, onCreate, turmas = [] }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const handleAddMember = () => {
    const m = memberInput.trim();
    if (!m) return;
    setMembers([...members, m]);
    setMemberInput("");
  };

  const handleSubmit = async () => {
    const nomeTrim = nome.trim();

    if (!nomeTrim) {
      return;
    }

    setSalvando(true);
    
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error('Token não encontrado - faça login novamente');
        setSalvando(false);
        onClose();
        return;
      }
      
      const response = await fetch('https://api.uecehit.com.br/api/grupos/', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nomeTrim,
          descricao: descricao.trim() || ""
        })
      });

      if (response.ok) {
        const novoGrupo = await response.json();
        onCreate({
          id: novoGrupo.id,
          nome: novoGrupo.nome,
          descricao: novoGrupo.descricao,
          membros: members,
          turma: turmaSelecionada
        });
      } else {
        const error = await response.json();
        console.error('Erro ao criar grupo:', error);
        
        if (response.status === 401) {
          console.error('Token inválido ou expirado - limpando localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          onClose();
        }
        
        setSalvando(false);
      }
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      setSalvando(false);
    }
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

        <textarea
          placeholder="Descrição do grupo (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="popup-input"
          style={{minHeight: 60, resize: 'vertical'}}
        />

        <select
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
          className="popup-input"
        >
          <option value="">Selecione grupo/turma</option>
          {turmas.map((turma, index) => (
            <option key={index} value={turma}>
              {turma}
            </option>
          ))}
        </select>

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

        <button className="popup-main-btn" onClick={handleSubmit} disabled={salvando}>
          {salvando ? 'Criando...' : 'Criar'}
        </button>
      </div>
    </div>
  );
}
