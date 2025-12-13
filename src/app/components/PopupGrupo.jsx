"use client";

import "./popup-grupo.css";
import { X } from "lucide-react";

export default function PopupGrupo({ grupo, onClose, onExcluir }) {
  if (!grupo) return null;

  return (
    <div className="popup-grupo-overlay">
      <div className="popup-grupo-container">

        <button className="popup-grupo-close" onClick={onClose}>
          <X size={26} />
        </button>

        <div className="popup-grupo-title">{grupo.nome}</div>

        <p className="popup-grupo-text">Você deseja sair do grupo?</p>

        <button className="popup-grupo-delete" onClick={onExcluir}>
          Sim, excluir grupo
        </button>
      </div>
    </div>
  );
}