"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./sidebar.css";

import {
  Menu,
  Users,
  Bell,
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react";

import CriarGrupo from "./CriarGrupo";
import CriarTurma from "./CriarTurma";
import PopupGrupo from "./PopupGrupo";

export default function Sidebar({ 
  turmas = [], 
  gruposInicial = [], 
  showConsultarPresenca = true,
  showTurmasGrupos = true,
  showConsultarTurmas = false,
  isAdmin = false,
  onConsultarTurmas = null, // optional callback when clicking Consultar Turmas
  onCriarGrupoClick = null // Nova prop opcional para customizar comportamento
}) {
  const [open, setOpen] = useState(false);

  const [showTurmas, setShowTurmas] = useState(false);
  const [showGrupos, setShowGrupos] = useState(false);

  const [showCriarGrupo, setShowCriarGrupo] = useState(false);
  const [showCriarTurma, setShowCriarTurma] = useState(false);

  const [grupos, setGrupos] = useState(gruposInicial);
  const [loadingGrupos, setLoadingGrupos] = useState(false);

  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const loadGrupos = async () => {
      try {
        setLoadingGrupos(true);
        
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setLoadingGrupos(false);
          return;
        }
        
        const response = await fetch('https://api.uecehit.com.br/api/grupos/', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setGrupos(data.map(g => ({
            id: g.id,
            nome: g.nome,
            descricao: g.descricao || '',
            membros: [] // membros podem ser carregados separadamente se necessário
          })));
        }
      } catch (error) {
        console.error('Erro ao carregar grupos:', error);
      } finally {
        setLoadingGrupos(false);
      }
    };

    loadGrupos();
  }, []);

  const handleLogout = () => {
    router.push("/login-everyone");
  };

  const handleCreateGrupo = (grupoObj) => {
    if (!grupoObj || typeof grupoObj !== "object") {
      alert("Erro interno ao criar o grupo.");
      return;
    }

    if (!grupoObj.nome || grupoObj.nome.trim() === "") {
      alert("Digite um nome válido para o grupo.");
      return;
    }

    const novoGrupo = {
      id: grupoObj.id,
      nome: grupoObj.nome.trim(),
      descricao: grupoObj.descricao || '',
      membros: grupoObj.membros || []
    };

    setGrupos([...grupos, novoGrupo]);
    setShowCriarGrupo(false);
  };

  const handleCreateTurma = (novaTurma) => {
    // Callback quando uma turma é criada com sucesso
    console.log('Turma criada:', novaTurma);
    setShowCriarTurma(false);
  };

  const handleExcluirGrupo = () => {
    if (!grupoSelecionado) return;

    setGrupos(grupos.filter((g) => g.nome !== grupoSelecionado.nome));
    setGrupoSelecionado(null);
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="menu-btn" onClick={() => setOpen(!open)}>
          <Menu />
        </div>

        {/* CREATE GROUP / CREATE TURMA */}
        <div className="sidebar-section">
          <div
            className="sidebar-item"
            style={{ marginBottom: "50px" }}
            onClick={() => {
              if (onCriarGrupoClick) {
                onCriarGrupoClick();
              } else if (isAdmin) {
                setShowCriarTurma(true);
              } else {
                setShowCriarGrupo(true);
              }
            }}
          >
            <Users />
            {open && <span>{isAdmin ? "Criar Turma" : "Criar Grupo"}</span>}
          </div>

          <div className="sidebar-item">
            <Bell />
            {open && <span>Notificação</span>}
          </div>
        </div>

        {/* TURMAS - Apenas se showTurmasGrupos for true */}
        {showTurmasGrupos && (
          <div className="sidebar-section">
            <div
              className="sidebar-title toggle-title"
              onClick={() => setShowTurmas(!showTurmas)}
            >
              {showTurmas ? <ChevronDown /> : <ChevronRight />}
              {open && <span>Turmas</span>}
            </div>

            <div className={`sidebar-collapse ${showTurmas ? "open" : ""}`}>
              {turmas.map((t, i) => (
                <div key={i} className="sidebar-subitem">
                  <div className="sidebar-dot-blue"></div>
                  {open && <span>{t}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GRUPOS - Apenas se showTurmasGrupos for true */}
        {showTurmasGrupos && (
          <div className="sidebar-section">
            <div
              className="sidebar-title toggle-title"
              onClick={() => setShowGrupos(!showGrupos)}
            >
              {showGrupos ? <ChevronDown /> : <ChevronRight />}
              {open && <span>Grupos</span>}
            </div>

            <div className={`sidebar-collapse ${showGrupos ? "open" : ""}`}>
              {grupos.map((g, i) => (
                <div
                  key={i}
                  className="sidebar-subitem"
                  onClick={() => setGrupoSelecionado(g)}
                >
                  <div className="sidebar-dot-yellow"></div>
                  {open && <span>{g.nome}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONSULTAR PRESENÇAS - Apenas se showConsultarPresenca for true */}
        {showConsultarPresenca && (
          <div
            className="sidebar-footer consult-center"
            onClick={() => router.push("/consultar-presencas")}
          >
            {open && <span>Consultar Presenças</span>}
          </div>
        )}

        {/* CONSULTAR TURMAS - Apenas se showConsultarTurmas for true */}
        {showConsultarTurmas && (
          <div
            className="sidebar-footer consult-center"
            onClick={() => onConsultarTurmas ? onConsultarTurmas() : router.push("/consultar-turmas")}
          >
            {open && <span>Consultar Turmas</span>}
          </div>
        )}

        {/* LOGOUT */}
        <div className="sidebar-footer logout-center" onClick={handleLogout}>
          <LogOut />
          {open && <span>Logout</span>}
        </div>
      </aside>

      {/* POPUP CRIAR GRUPO */}
      {showCriarGrupo && (
        <CriarGrupo
          onClose={() => setShowCriarGrupo(false)}
          onCreate={handleCreateGrupo}
        />
      )}

      {/* POPUP CRIAR TURMA */}
      {showCriarTurma && (
        <CriarTurma
          onClose={() => setShowCriarTurma(false)}
          onCreate={handleCreateTurma}
        />
      )}

      {/* POPUP DO GRUPO */}
      {grupoSelecionado && (
        <PopupGrupo
          grupo={grupoSelecionado}
          onClose={() => setGrupoSelecionado(null)}
          onExcluir={handleExcluirGrupo}
        />
      )}
    </>
  );
}