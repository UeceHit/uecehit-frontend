"use client";

import { useState } from "react";
import "./CriarTurma.css";

export default function CriarTurma({ onClose, onCreate }) {
  const [nome, setNome] = useState("");
  const [bloco, setBloco] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [curso, setCurso] = useState("");
  const [horario, setHorario] = useState("");
  const [alunoEmail, setAlunoEmail] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [profEmail, setProfEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!nome.trim()) {
      alert("Por favor, preencha o nome da turma");
      return;
    }
    // Checar papel do usuário antes de tentar criar
    try {
      const storedRole = localStorage.getItem('user_papel') || (() => {
        const u = localStorage.getItem('user');
        if (!u) return null;
        try { return JSON.parse(u).papel; } catch { return null; }
      })();

      const allowed = ['professor', 'coordenador', 'administrador'];
      if (!storedRole || !allowed.includes(storedRole)) {
        alert('Acesso negado. Papéis permitidos: professor, coordenador, administrador. Faça login com uma conta adequada.');
        return;
      }
    } catch (err) {
      console.warn('Erro ao verificar papel do usuário', err);
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
          bloco: bloco.trim() || undefined,
          disciplina: disciplina.trim() || undefined,
          curso: curso.trim() || undefined,
          horario: horario || undefined,
          alunos: alunos.length ? alunos : undefined,
          professor_email: profEmail.trim() || undefined
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
        const msg = errorData?.detail || errorData?.message || (Object.keys(errorData).length ? JSON.stringify(errorData) : response.statusText);
        if (response.status === 403) {
          alert(`Acesso negado: ${msg}`);
        } else {
          alert(`Erro ao criar turma: ${msg}`);
        }
      }
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      alert('Erro de conexão ao criar turma');
    } finally {
      setLoading(false);
    }
  }

  function handleAddAluno(e) {
    e && e.preventDefault();
    const email = alunoEmail.trim();
    if (!email) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert('Email inválido');
      return;
    }
    setAlunos((s) => [...s, email]);
    setAlunoEmail("");
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-criar-turma modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Editar Turma</h2>

        <form onSubmit={handleSubmit} className="modal-grid">
          <div className="modal-left">
            <div className="form-field">
              <label>Nome da Turma:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da Turma:"
                required
              />
            </div>

            <div className="form-field">
              <label>Bloco:</label>
              <input
                type="text"
                value={bloco}
                onChange={(e) => setBloco(e.target.value)}
                placeholder="Bloco:"
              />
            </div>

            <div className="form-field select-large">
              <label>Selecionar Curso:</label>
              <select value={curso} onChange={(e) => setCurso(e.target.value)}>
                <option value="">-- Selecione --</option>
                <option>Ciência da Computação - Bacharelado - Diurno</option>
                <option>Medicina - Bacharelado - Integral</option>
                <option>Direito - Bacharelado - Noturno</option>
                <option>Matemática - Licenciatura - Noturno</option>
              </select>
            </div>

            <div className="form-field aluno-add">
              <label>Escreva o email institucional do aluno:</label>
              <div className="aluno-row">
                <input
                  type="email"
                  value={alunoEmail}
                  onChange={(e) => setAlunoEmail(e.target.value)}
                  placeholder="Escreva o email institucional do aluno:"
                />
                <button className="btn-add" onClick={handleAddAluno} title="Adicionar aluno">+</button>
              </div>
              <div className="alunos-list">
                {alunos.map((a, i) => (
                  <div key={i} className="aluno-chip">{a}</div>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label>Escreva o email institucional do professor:</label>
              <input
                type="email"
                value={profEmail}
                onChange={(e) => setProfEmail(e.target.value)}
                placeholder="Escreva o email institucional do professor:"
              />
            </div>
          </div>

          <div className="modal-right">
            <div className="form-field">
              <label>Horário da Turma</label>
              <select value={horario} onChange={(e) => setHorario(e.target.value)}>
                <option value="">-- Selecione --</option>
                <option>AB - Manhã</option>
                <option>CD - Manhã</option>
                <option>EF - Manhã</option>
                <option>AB - Tarde</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-criar" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
