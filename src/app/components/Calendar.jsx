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
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function nextMonth() {
    setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  const year = date.getFullYear();
  const month = date.getMonth();

  // 🔶 MENSAL
  const firstWeekday = new Date(year, month, 1).getDay();
  const adjustedFirstWeekday = (firstWeekday === 0 ? 6 : firstWeekday - 1);
  const lastDay = new Date(year, month + 1, 0).getDate();

  const daysMonth = [];
  for (let i = 0; i < adjustedFirstWeekday; i++) daysMonth.push("");
  for (let i = 1; i <= lastDay; i++) daysMonth.push(i);

  // 🔶 SEMANAL
  const weekDays = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

  function getCurrentWeek() {
    const current = new Date(date);
    const weekday = (current.getDay() === 0 ? 6 : current.getDay() - 1);
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

  // 🔶 DIÁRIO
  const hours = [];
  for (let h = 7; h <= 22; h++) {
    hours.push(`${String(h).padStart(2, "0")}:00`);
  }

  return (
    <div className="calendar-wrapper">

      {/* 🔵 Botões DIA / SEMANA / MÊS */}
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
      <div className="calendar-header">
        <button onClick={prevMonth} className="arrow-btn">
          <ChevronLeft size={30} strokeWidth={1.5} />
        </button>

        <h2>{monthNames[month]} {year}</h2>

        <button onClick={nextMonth} className="arrow-btn">
          <ChevronRight size={30} strokeWidth={1.5} />
        </button>
      </div>

      {/* 🔶 MÊS */}
      {view === "mês" && (
        <>
          <div className="calendar-weekdays">
            {weekDays.map((w, i) => <span key={i}>{w}</span>)}
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

      {/* 🔶 SEMANA */}
      {view === "semana" && (
        <>
          <div className="calendar-weekdays">
            {weekDays.map((w, i) => <span key={i}>{w}</span>)}
          </div>

          <div className="calendar-grid-week">
            {week.map((d, i) => (
              <div key={i} className="calendar-cell-week">
                <span className="day-number">
                  {String(d.getDate()).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔶 DIA */}
      {view === "dia" && (
        <div className="calendar-day-view">
          {hours.map((h, i) => (
            <div key={i} className="calendar-hour-row">
              <span className="hour-label">{h}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
