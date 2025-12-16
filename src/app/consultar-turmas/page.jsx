"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import "./style.css";

export default function ConsultarTurmas({ onClose }) {
  const router = useRouter();
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [turmaEditando, setTurmaEditando] = useState(null);

  useEffect(() => {
    carregarTurmas();
  }, []);

  async function carregarTurmas() {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        alert('Você precisa estar logado');
        router.push('/login-everyone');
        return;
      }

      const response = await fetch('https://api.uecehit.com.br/api/turmas/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTurmas(data);
      } else {
        console.error('Erro ao carregar turmas');
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEditar(turma) {
    // normalize fields for editing
    setTurmaEditando({
      id: turma.id,
      nome: turma.nome || "",
      disciplina: turma.disciplina || "",
      curso: turma.curso || "",
      bloco: turma.bloco || "",
      horario: turma.horario || "",
      alunos: turma.alunos || [],
      professor_email: turma.professor_email || turma.professorEmail || ""
    });
    setShowEditPopup(true);
  }

  async function handleExcluir(turmaId) {
    if (!confirm('Tem certeza que deseja excluir esta turma?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`https://api.uecehit.com.br/api/turmas/${turmaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Turma excluída com sucesso!');
        carregarTurmas(); // Recarregar lista
      } else {
        alert('Erro ao excluir turma');
      }
    } catch (error) {
      console.error('Erro ao excluir turma:', error);
      alert('Erro ao excluir turma');
    }
  }

  async function handleSalvarEdicao(e) {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');

      const payload = {
        nome: turmaEditando.nome,
        disciplina: turmaEditando.disciplina,
        curso: turmaEditando.curso,
        bloco: turmaEditando.bloco,
        horario: turmaEditando.horario,
        alunos: turmaEditando.alunos,
        professor_email: turmaEditando.professor_email
      };

      const response = await fetch(`https://api.uecehit.com.br/api/turmas/${turmaEditando.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Turma atualizada com sucesso!');
        setShowEditPopup(false);
        setTurmaEditando(null);
        carregarTurmas();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(`Erro ao atualizar turma: ${err.detail || err.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      alert('Erro ao atualizar turma');
    }
  }

  function handleAddAlunoEdit(e) {
    e && e.preventDefault();
    if (!turmaEditando) return;
    const email = (turmaEditando._newAluno || "").trim();
    if (!email) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert('Email inválido');
      return;
    }
    setTurmaEditando((t) => ({ ...t, alunos: [...(t.alunos||[]), email], _newAluno: '' }));
  }

  return (
    <div className="consultar-turmas-container">
      <div className="consultar-panel">
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => onClose ? onClose() : router.back()} className="back-button">
              ← Voltar
            </button>
            <h1>Consulta de Turmas</h1>
          </div>
        </div>

        <div className="panel-body">
          {loading ? (
            <p className="loading-text">Carregando turmas...</p>
          ) : (
            <div className="turmas-list">
              {turmas.length === 0 ? (
                <p className="no-turmas">Nenhuma turma encontrada</p>
              ) : (
                turmas.map((turma) => (
                  <div key={turma.id} className="turma-card">
                    <div className="turma-info">
                      <h3>{turma.nome}</h3>
                      <p className="turma-details">
                        {turma.disciplina && <span>Disciplina: {turma.disciplina}</span>}
                        {turma.curso && <span>Curso: {turma.curso}</span>}
                      </p>
                    </div>
                    <div className="turma-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditar(turma)}
                        title="Editar turma"
                      >
                        <Pencil size={14} />
                        <span style={{ marginLeft: 8, fontSize: 13 }}>Editar</span>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleExcluir(turma.id)}
                        title="Excluir turma"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* POPUP DE EDIÇÃO */}
      {showEditPopup && turmaEditando && (
        <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup-criar-turma modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowEditPopup(false)}>✕</button>
            <h2>Editar Turma</h2>

            <form onSubmit={handleSalvarEdicao} className="modal-grid">
              <div className="modal-left">
                <div className="form-field">
                  <label>Nome da Turma:</label>
                  <input
                    type="text"
                    value={turmaEditando.nome}
                    onChange={(e) => setTurmaEditando({...turmaEditando, nome: e.target.value})}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Bloco:</label>
                  <input
                    type="text"
                    value={turmaEditando.bloco || ''}
                    onChange={(e) => setTurmaEditando({...turmaEditando, bloco: e.target.value})}
                  />
                </div>

                <div className="form-field select-large">
                  <label>Selecionar Curso:</label>
                  <select value={turmaEditando.curso || ''} onChange={(e) => setTurmaEditando({...turmaEditando, curso: e.target.value})}>
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
                      value={turmaEditando._newAluno || ''}
                      onChange={(e) => setTurmaEditando({...turmaEditando, _newAluno: e.target.value})}
                      placeholder="Escreva o email institucional do aluno:"
                    />
                    <button className="btn-add" onClick={handleAddAlunoEdit} title="Adicionar aluno">+</button>
                  </div>
                  <div className="alunos-list">
                    {(turmaEditando.alunos||[]).map((a, i) => (
                      <div key={i} className="aluno-chip">{a}</div>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label>Escreva o email institucional do professor:</label>
                  <input
                    type="email"
                    value={turmaEditando.professor_email || ''}
                    onChange={(e) => setTurmaEditando({...turmaEditando, professor_email: e.target.value})}
                    placeholder="Escreva o email institucional do professor:"
                  />
                </div>
              </div>

              <div className="modal-right">
                <div className="form-field">
                  <label>Horário da Turma</label>
                  <select value={turmaEditando.horario || ''} onChange={(e) => setTurmaEditando({...turmaEditando, horario: e.target.value})}>
                    <option value="">-- Selecione --</option>
                    <option>AB - Manhã</option>
                    <option>CD - Manhã</option>
                    <option>EF - Manhã</option>
                    <option>AB - Tarde</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditPopup(false)} className="btn-cancelar">Cancelar</button>
                <button type="submit" className="btn-criar">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
