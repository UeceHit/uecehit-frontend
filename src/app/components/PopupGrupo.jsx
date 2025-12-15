"use client";

import { useState } from "react";
import "./popup-grupo.css";
import { X } from "lucide-react";

export default function PopupGrupo({ grupo, onClose, onExcluir }) {
  const [excluindo, setExcluindo] = useState(false);

  const handleExcluir = () => {
    onExcluir();
  };

  if (!grupo) return null;

  return (
    <div className="popup-grupo-overlay">
      <div className="popup-grupo-container">

        <button className="popup-grupo-close" onClick={onClose}>
          <X size={26} />
        </button>

        <div className="popup-grupo-title">{grupo.nome}</div>

        {grupo.descricao && (
          <p style={{fontSize: 14, color: '#666', marginTop: -8, marginBottom: 12}}>
            {grupo.descricao}
          </p>
        )}

        <div style={{marginBottom: 16}}>
          <h3 style={{fontSize: 16, fontWeight: 600, marginBottom: 8}}>Membros:</h3>
          {grupo.membros && grupo.membros.length > 0 ? (
            <ul style={{listStyle: 'none', padding: 0, maxHeight: 200, overflowY: 'auto'}}>
              {grupo.membros.map((m, i) => (
                <li key={i} style={{padding: '8px', borderBottom: '1px solid #eee'}}>
                  {m}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{fontSize: 14, color: '#999'}}>Nenhum membro neste grupo</p>
          )}
        </div>

        <p className="popup-grupo-text">Você deseja sair do grupo?</p>

        <button 
          className="popup-grupo-delete" 
          onClick={handleExcluir}
        >
          Sim, excluir grupo
        </button>
      </div>
    </div>
  );
}