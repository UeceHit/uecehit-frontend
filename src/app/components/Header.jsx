"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun, Bell } from "lucide-react";
import "./header.css";

export default function Header() {
  const [dark, setDark] = useState(() => {
    try {
      return typeof document !== "undefined" && document.body.classList.contains("dark-mode");
    } catch {
      return false;
    }
  });

  const [showNotifications, setShowNotifications] = useState(false);

  // Notificações de exemplo
  const notifications = [
    {
      id: 1,
      title: "Nova atividade em APS",
      message: "Apresentação de projeto agendada para 16/12",
      time: "2 horas atrás",
      unread: true
    },
    {
      id: 2,
      title: "Lembrete de prova",
      message: "Prova de OC amanhã às 10h",
      time: "5 horas atrás",
      unread: true
    },
    {
      id: 3,
      title: "Reunião confirmada",
      message: "Reunião do grupo PET confirmada",
      time: "1 dia atrás",
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    setDark(document.body.classList.contains("dark-mode"));
  }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">
          Uece
          <span className="hit-h">H</span>
          <span className="hit-i">i</span>
          <span className="hit-t">t</span>
        </h1>
      </div>

      <div className="header-right">
        <div className="notification-container">
          <button 
            className="notification-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="notification-overlay" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="notification-popup">
                <div className="notification-header">
                  <h3>Notificações</h3>
                  <button 
                    className="notification-close"
                    onClick={() => setShowNotifications(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${notif.unread ? 'unread' : ''}`}
                      >
                        <div className="notification-content">
                          <h4>{notif.title}</h4>
                          <p>{notif.message}</p>
                          <span className="notification-time">{notif.time}</span>
                        </div>
                        {notif.unread && <div className="notification-dot" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button className="theme-btn" onClick={toggleTheme}>
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}