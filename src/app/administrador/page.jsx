"use client";

import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";
import CalendarViewSwitcher from "../components/CalendarViewSwitcher";
import ConsultarTurmas from "../consultar-turmas/page";
import "./administrador.css";

export default function AdministradorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showConsultarTurmas, setShowConsultarTurmas] = useState(false);

  // Estado que controla o tipo de visualização
  const [view, setView] = useState("mês");

  return (
    <div>
      <Header />

      {/* CONTAINER DO LAYOUT (AJUSTA AUTOMATICAMENTE COM SIDEBAR) */}
      <div
        className={`layout-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          turmas={[]}
          grupos={[]}
          showConsultarPresenca={false}
          showTurmasGrupos={false}
          showConsultarTurmas={true}
          onConsultarTurmas={() => setShowConsultarTurmas(true)}
          isAdmin={true}
        />


        {/* CONTEÚDO PRINCIPAL */}
        <div className="main-content">
          {showConsultarTurmas ? (
            <div style={{ flex: 1 }}>
              <ConsultarTurmas onClose={() => setShowConsultarTurmas(false)} />
            </div>
          ) : (
            <>
              {/* CALENDÁRIO */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: "calc(100vw - 400px)",
                  height: "auto",
                  minHeight: "710px",
                }}
              >
                <Calendar view={view} setView={setView} />
              </div>

              {/* SWITCHER E INFO */}
              <div
                style={{
                  width: "250px",
                  textAlign: "center",
                  marginLeft: "20px",
                  flexShrink: 0,
                }}
              >
                <CalendarViewSwitcher
                  currentView={view}
                  setCurrentView={setView}
                />

                <div className="calendar-info" style={{ marginTop: "15px", fontSize: "16px" }}>
                  Calendário Universitário{" "}
                  <span
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ color: "#26276B" }}>2</span>
                    <span style={{ color: "#E1A919" }}>0</span>
                    <span style={{ color: "#C64139" }}>2</span>
                    <span style={{ color: "#26276B" }}>6</span>
                    <span style={{ color: "#E1A919" }}>.</span>
                    <span style={{ color: "#C64139" }}>1</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
