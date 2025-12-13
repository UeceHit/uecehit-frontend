"use client";

import { useEffect, useState } from "react";

export default function CalendarViewSwitcher({ currentView, setCurrentView }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.body.classList.contains("dark-mode"));
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        background: isDark ? "#373636" : "#F5F5F5",
        padding: "8px 14px",
        borderRadius: "10px",
        alignItems: "center",
        boxShadow: isDark
          ? "0px 2px 6px rgba(0,0,0,0.6)"
          : "0px 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {["Dia", "Semana", "Mês"].map((view) => {
        const active = currentView === view.toLowerCase();

        return (
          <button
            key={view}
            onClick={() => setCurrentView(view.toLowerCase())}
            style={{
              padding: "6px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",

              background: active
                ? isDark
                  ? "#3B8CF6"
                  : "#E0E0E0"
                : "transparent",

              color: isDark ? "#FFFFFF" : "#000000",
              fontWeight: active ? "600" : "400",
              transition: "0.2s",
            }}
          >
            {view}
          </button>
        );
      })}
    </div>
  );
}