"use client";

import { useState } from "react";
import "./sidebar.css";

import { Menu, Users, Bell, ChevronDown, LogOut } from "lucide-react";

export default function Sidebar({ turmas = [], grupos = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      
      {/* BOTÃO MENU (DENTRO DA SIDEBAR) */}
      <div className="menu-btn" onClick={() => setOpen(!open)}>
        <Menu />
      </div>

      {/* PRIMEIRA SEÇÃO */}
      <div className="sidebar-section">
        {/* Criar Grupo */}
        <div className="sidebar-item" style={{ marginBottom: "50px" }}>
          <Users />
          {open && <span>Criar Grupo</span>}
        </div>

        {/* Notificação */}
        <div className="sidebar-item">
          <Bell />
          {open && <span>Notificação</span>}
        </div>
      </div>

      {/* TURMAS */}
      <div className="sidebar-section">
        <div className="sidebar-title">
          <ChevronDown />
          {open && <span>Turmas</span>}
        </div>

        {turmas.map((t, i) => (
          <div key={i} className="sidebar-subitem">
            <div className="sidebar-dot-blue"></div>
            {open && <span>{t}</span>}
          </div>
        ))}
      </div>

      {/* GRUPOS */}
      <div className="sidebar-section">
        <div className="sidebar-title">
          <ChevronDown />
          {open && <span>Grupos</span>}
        </div>

        {grupos.map((g, i) => (
          <div key={i} className="sidebar-subitem">
            <div className="sidebar-dot-yellow"></div>
            {open && <span>{g}</span>}
          </div>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="sidebar-footer">
        <LogOut />
        {open && <span>Logout</span>}
      </div>
    </aside>
  );
}
