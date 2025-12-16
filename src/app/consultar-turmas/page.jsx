"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import "./style.css";

export default function ConsultarTurmas() {
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
    setTurmaEditando(turma);
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
      
      const response = await fetch(`https://api.uecehit.com.br/api/turmas/${turmaEditando.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: turmaEditando.nome,
          disciplina: turmaEditando.disciplina,
          curso: turmaEditando.curso
        })
      });

      if (response.ok) {
        alert('Turma atualizada com sucesso!');
        setShowEditPopup(false);
        setTurmaEditando(null);
        carregarTurmas();
      } else {
        alert('Erro ao atualizar turma');
      }
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      alert('Erro ao atualizar turma');
    }
  }

  return (
    <div className="consultar-turmas-container">
      <div className="consultar-turmas-header">
        <button onClick={() => router.back()} className="back-button">
          ← Voltar
        </button>
        <h1>Consultar Turmas</h1>
      </div>

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
                    <Pencil size={18} />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleExcluir(turma.id)}
                    title="Excluir turma"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* POPUP DE EDIÇÃO */}
      {showEditPopup && turmaEditando && (
        <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Turma</h2>
            <form onSubmit={handleSalvarEdicao}>
              <div className="form-group">
                <label>Nome da Turma</label>
                <input
                  type="text"
                  value={turmaEditando.nome}
                  onChange={(e) => setTurmaEditando({...turmaEditando, nome: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Disciplina</label>
                <input
                  type="text"
                  value={turmaEditando.disciplina || ''}
                  onChange={(e) => setTurmaEditando({...turmaEditando, disciplina: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Curso</label>
                <input
                  type="text"
                  value={turmaEditando.curso || ''}
                  onChange={(e) => setTurmaEditando({...turmaEditando, curso: e.target.value})}
                />
              </div>
              <div className="popup-buttons">
                <button type="button" onClick={() => setShowEditPopup(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
