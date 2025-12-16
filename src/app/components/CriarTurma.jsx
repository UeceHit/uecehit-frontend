"use client";

import { useState } from "react";
import "./CriarTurma.css";

export default function CriarTurma({ onClose, onCreate }) {
  const [nome, setNome] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [curso, setCurso] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert("Por favor, preencha o nome da turma");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        alert('Você precisa estar logado');
        onClose();
        return;
      }

      const response = await fetch('https://api.uecehit.com.br/api/turmas/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nome.trim(),
          disciplina: disciplina.trim() || undefined,
          curso: curso.trim() || undefined
        })
      });

      if (response.ok) {
        const novaTurma = await response.json();
        alert('Turma criada com sucesso!');
        if (onCreate) {
          onCreate(novaTurma);
        }
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Erro ao criar turma: ${errorData.detail || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      alert('Erro de conexão ao criar turma');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-criar-turma" onClick={(e) => e.stopPropagation()}>
        <h2>Criar Nova Turma</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Nome da Turma *</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Turma A - 2026.1"
              required
            />
          </div>

          <div className="form-field">
            <label>Disciplina</label>
            <input
              type="text"
              value={disciplina}
              onChange={(e) => setDisciplina(e.target.value)}
              placeholder="Ex: Banco de Dados"
            />
          </div>

          <div className="form-field">
            <label>Curso</label>
            <input
              type="text"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              placeholder="Ex: Ciência da Computação"
            />
          </div>

          <div className="popup-buttons">
            <button type="button" onClick={onClose} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-criar" disabled={loading}>
              {loading ? "Criando..." : "Criar Turma"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
