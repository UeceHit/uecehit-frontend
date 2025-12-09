"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import TabelaPresencas from "@/app/components/TabelaPresencas";
import "./styles.css";

export default function ConsultarPresencasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="main-content">
        <Header />
        <TabelaPresencas />
      </div>
    </div>
  );
}