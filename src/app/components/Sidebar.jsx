"use client";

import { useState } from "react";
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

export default function Sidebar({ turmas = [], grupos = [] }) {
  const [open, setOpen] = useState(false);

  const [showTurmas, setShowTurmas] = useState(false);
  const [showGrupos, setShowGrupos] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    router.push("/login-everyone");
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>

      {/* Botão Menu */}
      <div className="menu-btn" onClick={() => setOpen(!open)}>
        <Menu />
      </div>

      {/* PRIMEIRA SEÇÃO */}
      <div className="sidebar-section">
        <div className="sidebar-item" style={{ marginBottom: "50px" }}>
          <Users />
          {open && <span>Criar Grupo</span>}
        </div>

        <div className="sidebar-item">
          <Bell />
          {open && <span>Notificação</span>}
        </div>
      </div>

      {/* TURMAS */}
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

      {/* GRUPOS */}
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
            <div key={i} className="sidebar-subitem">
              <div className="sidebar-dot-yellow"></div>
              {open && <span>{g}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* CONSULTAR PRESENÇAS */}
      <div
        className="sidebar-footer consult-center"
        onClick={() => router.push("/consultar-presencas")}
      >
        {open && <span>Consultar Presenças</span>}
      </div>

      {/* LOGOUT */}
      <div className="sidebar-footer logout-center" onClick={handleLogout}>
        <LogOut />
        {open && <span>Logout</span>}
      </div>
    </aside>
  );
}
