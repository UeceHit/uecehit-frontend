"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./tabela-presencas.css";

export default function TabelaPresencas() {
  const [openIndex, setOpenIndex] = useState(null);

  // Popup data
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({
    index: null,
    presencas: 0,
    faltas: 0,
  });

  const MAX = 60;

  // Turmas
  const [turmas, setTurmas] = useState([
    {
      nome: "Inteligência Computacional",
      presencas: 26,
      faltas: 0,
    },
    {
      nome: "Banco de Dados",
      presencas: 15,
      faltas: 3,
    },
    {
      nome: "Organização de Computadores",
      presencas: 22,
      faltas: 1,
    },
  ]);

  const toggleCard = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const calcPct = (valor) => ((valor / MAX) * 100).toFixed(2);

  // Abre o popup para a turma clicada
  const abrirPopup = (i) => {
    const turma = turmas[i];
    setPopupData({
      index: i,
      presencas: turma.presencas,
      faltas: turma.faltas,
    });
    setPopupOpen(true);
  };

  // Altera valores dentro do popup
  const alterarValor = (tipo, novoValor) => {
    if (novoValor < 0 || novoValor > MAX) return;

    setPopupData((prev) => ({
      ...prev,
      [tipo]: novoValor,
    }));
  };

  // Salvar no vetor de turmas
  const salvarPresenca = () => {
    const i = popupData.index;

    const turmasAtualizadas = [...turmas];
    turmasAtualizadas[i].presencas = popupData.presencas;
    turmasAtualizadas[i].faltas = popupData.faltas;

    setTurmas(turmasAtualizadas);
    setPopupOpen(false);
  };

  return (
    <div className="tabela-container">
      <h1 className="titulo-consulta">
        Consulta de Presenças <span className="academicas">Acadêmicas</span>
      </h1>

      <div className="tabela-card-area">
        {turmas.map((turma, i) => (
          <div key={i} className="tabela-card">
            {/* Cabeçalho da disciplina */}
            <div className="tabela-header" onClick={() => toggleCard(i)}>
              <span>{turma.nome}</span>
              {openIndex === i ? (
                <ChevronUp className="tabela-icon" />
              ) : (
                <ChevronDown className="tabela-icon" />
              )}
            </div>

            {/* Área expandida */}
            <div className={`tabela-expand ${openIndex === i ? "open" : ""}`}>
              <p>
                Presença(s): {turma.presencas} ({calcPct(turma.presencas)}%)
              </p>
              <p>
                Falta(s): {turma.faltas} ({calcPct(turma.faltas)}%)
              </p>

              <button className="btn-gerenciar" onClick={() => abrirPopup(i)}>
                Gerenciar Presença
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- POPUP ---------------- */}
      {popupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>GERENCIAR PRESENÇA</h2>

            {/* Presenças */}
            <div className="linha-popup">
              <span>
                Presença(s): {popupData.presencas} (
                {calcPct(popupData.presencas)}%)
              </span>

              <div className="botoes-popup">
                <button
                  onClick={() =>
                    alterarValor("presencas", popupData.presencas + 1)
                  }
                >
                  +
                </button>
                <button
                  onClick={() =>
                    alterarValor("presencas", popupData.presencas - 1)
                  }
                >
                  -
                </button>
              </div>
            </div>

            {/* Faltas */}
            <div className="linha-popup">
              <span>
                Falta(s): {popupData.faltas} ({calcPct(popupData.faltas)}%)
              </span>

              <div className="botoes-popup">
                <button
                  onClick={() =>
                    alterarValor("faltas", popupData.faltas + 1)
                  }
                >
                  +
                </button>
                <button
                  onClick={() =>
                    alterarValor("faltas", popupData.faltas - 1)
                  }
                >
                  -
                </button>
              </div>
            </div>

            <div className="acoes-popup">
              <button className="btn-salvar-popup" onClick={salvarPresenca}>
                Salvar
              </button>
              <button
                className="btn-fechar-popup"
                onClick={() => setPopupOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ---------------------------------------- */}
    </div>
  );
}

