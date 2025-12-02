"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./calendar.css";

export default function Calendar({ view = "mês", setView }) {
  const [date, setDate] = useState(new Date());

  const monthNames = [
    "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
  ];

  function prevMonth() {
  if (view === "dia") {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
  } else if (view === "semana") {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
  } else {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }
}

function nextMonth() {
  if (view === "dia") {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
  } else if (view === "semana") {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
  } else {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }
}

  const year = date.getFullYear();
  const month = date.getMonth();

  // --- MENSAL ---
  const firstWeekday = new Date(year, month, 1).getDay();
  const adjustedFirstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1;
  const lastDay = new Date(year, month + 1, 0).getDate();

  const daysMonth = [];
  for (let i = 0; i < adjustedFirstWeekday; i++) daysMonth.push("");
  for (let i = 1; i <= lastDay; i++) daysMonth.push(i);

  // --- SEMANAL ---
  const weekDays = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

  function getCurrentWeek() {
    const current = new Date(date);
    const weekday = current.getDay() === 0 ? 6 : current.getDay() - 1;
    const monday = new Date(current);
    monday.setDate(current.getDate() - weekday);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  }

  const week = getCurrentWeek();

  // --- DIÁRIO ---
  const hours = [];
  for (let h = 6; h <= 21; h++) {
    hours.push(`${String(h).padStart(2, "0")}:00`);
  }

  return (
    <div className="calendar-wrapper">
      
      {/* 🔵 Switch DIA / SEMANA / MÊS */}
      <div className="calendar-mode-selector">
        {["dia", "semana", "mês"].map((m) => (
          <button
            key={m}
            className={`mode-btn ${view === m ? "selected" : ""}`}
            onClick={() => setView && setView(m)}
          >
            {m.toUpperCase()}
            {view === m && <div className="selected-indicator" />}
          </button>
        ))}
      </div>

      {/* Cabeçalho */}
      <div
        className="calendar-header"
        style={{ flexDirection: "column", gap: "4px", textAlign: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "40px", justifyContent: "center" }}>
          <button onClick={prevMonth} className="arrow-btn">
            <ChevronLeft size={30} strokeWidth={1.5} />
          </button>

          <h2>{monthNames[month]} {year}</h2>

          <button onClick={nextMonth} className="arrow-btn">
            <ChevronRight size={30} strokeWidth={1.5} />
          </button>
        </div>

        {/* Número do dia (somente no modo DIA) */}
        {view === "dia" && (
          <div
            style={{
              fontFamily: "Noto Sans Gujarati",
              fontSize: "28px",
              fontWeight: 600,
              color: "#424040",
              marginTop: "-6px",
            }}
          >
            {String(date.getDate()).padStart(2, "0")}
          </div>
        )}
      </div>

      {/* 🟦 MÊS */}
      {view === "mês" && (
        <>
          <div className="calendar-weekdays">
            {weekDays.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {daysMonth.map((day, i) => (
              <div key={i} className="calendar-cell">
                {day && <span className="day-number">{day}</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🟩 SEMANA */}
      {view === "semana" && (
        <div style={{ width: "100%", height: "100%" }}>

          {/* Cabeçalho dos dias */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px repeat(7, 1fr)",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div></div> {/* coluna vazia */}

            {week.map((d, i) => (
              <div key={i} style={{ textAlign: "center", color: "#424040" }}>
                
                <div
                  style={{
                    fontFamily: "Nova Flat",
                    fontSize: "24px",
                    fontWeight: 400,
                  }}
                >
                  {weekDays[i]}
                </div>

                <div
                  style={{
                    fontFamily: "Noto Sans Gujarati",
                    fontSize: "16px",
                    fontWeight: 600,
                    marginTop: "-4px",
                  }}
                >
                  {String(d.getDate()).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>

          {/* Corpo: SOMENTE LINHAS VERTICAIS */}
          <div style={{ display: "flex", width: "100%" }}>
            
            {/* horários */}
            <div style={{ width: "120px" }}>
              {hours.map((hr, index) => (
                <div
                  key={index}
                  style={{
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    color: "#424040",
                  }}
                >
                  {hr}
                </div>
              ))}
            </div>

            {/* Linhas verticais */}
            <div
              style={{
                flex: 1,
                position: "relative",
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
              }}
            >
              {Array.from({ length: 7 }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    borderLeft: "1px solid #d9d9d9",
                    height: "100%",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🟥 DIA */}
      {view === "dia" && (
        <div
          style={{
            width: "100%",
            paddingLeft: "10px",
            position: "relative",
            fontFamily: "Noto Sans Gujarati",
          }}
        >
          {hours.map((hour, index) => (
            <div
              key={index}
              style={{
                height: "50px",
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <span
                style={{
                  width: "60px",
                  fontSize: "14px",
                  color: "#424040",
                  fontWeight: 600,
                }}
              >
                {hour}
              </span>

              <div
                style={{
                  flex: 1,
                  height: "1px",
                  backgroundColor: "#d9d9d9",
                  marginLeft: "10px",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



