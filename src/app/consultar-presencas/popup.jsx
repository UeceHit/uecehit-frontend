"use client";
import React from "react";
import "./styles.css";

export default function PopupPresencas({
  presencas,
  faltas,
  onChange,
  onClose,
  onSave
}) {
  const max = 60;

  const calcPct = (valor) => ((valor / max) * 100).toFixed(2);

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>GERENCIAR PRESENÇA</h2>

        {/* Presenças */}
        <div className="linha-presenca">
          <span>Presença(s): {presencas} ({calcPct(presencas)}%)</span>

          <div className="botoes">
            <button onClick={() => onChange("presencas", presencas + 1)}>+</button>
            <button onClick={() => onChange("presencas", presencas - 1)}>-</button>
          </div>
        </div>

        {/* Faltas */}
        <div className="linha-presenca">
          <span>Falta(s): {faltas} ({calcPct(faltas)}%)</span>

          <div className="botoes">
            <button onClick={() => onChange("faltas", faltas + 1)}>+</button>
            <button onClick={() => onChange("faltas", faltas - 1)}>-</button>
          </div>
        </div>

        <div className="acoes">
          <button onClick={onSave} className="btn-salvar">Salvar</button>
          <button onClick={onClose} className="btn-fechar">Fechar</button>
        </div>
      </div>
    </div>
  );
}