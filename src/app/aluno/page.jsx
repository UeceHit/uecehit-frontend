"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";
import CalendarViewSwitcher from "../components/CalendarViewSwitcher";

export default function AlunoDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Estado que controla o tipo de visualização
  const [view, setView] = useState("mês");

  return (
    <div>
      <Header />

      <div style={{ display: "flex" }}>
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          turmas={[
            "Inteligência Computacional",
            "Banco de Dados",
            "Organização de Computadores",
          ]}
          grupos={["Banca TCC", "PET"]}
        />

        {/* CONTEÚDO PRINCIPAL */}
        <div
          style={{
            flex: 1,
            padding: "2rem 3rem",
            marginLeft: isSidebarOpen ? "260px" : "80px",
            transition: "margin-left 0.3s ease",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* 📌 CALENDÁRIO (lado esquerdo) */}
          <div
            style={{
              width: "1220px",
              height: "710px",
            }}
          >
            <Calendar view={view} setView={setView} />
          </div>

          {/* 📌 SWITCHER (lado direito) */}
          <div
            style={{
              width: "250px",
              textAlign: "center",
              marginLeft: "20px",
            }}
          >
            <CalendarViewSwitcher currentView={view} setCurrentView={setView} />

            <div style={{ marginTop: "15px", fontSize: "16px" }}>
              Calendário Universitário{" "}
            <span style={{ fontSize: "24px", fontWeight: "bold" }}>
            <span style={{ color: "#26276B" }}>2</span>
            <span style={{ color: "#E1A919" }}>0</span>
            <span style={{ color: "#C64139" }}>2</span>
            <span style={{ color: "#26276B" }}>6</span>
            <span style={{ color: "#E1A919" }}>.</span>
            <span style={{ color: "#C64139" }}>1</span>
          </span>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
