"use client";

export default function CalendarViewSwitcher({ currentView, setCurrentView }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        background: "#F5F5F5",
        padding: "8px 14px",
        borderRadius: "10px",
        alignItems: "center",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {["Dia", "Semana", "Mês"].map((view) => (
        <button
          key={view}
          onClick={() => setCurrentView(view.toLowerCase())}
          style={{
            padding: "6px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: currentView === view.toLowerCase() ? "#E0E0E0" : "transparent",
            fontWeight: currentView === view.toLowerCase() ? "600" : "400",
          }}
        >
          {view}
        </button>
      ))}
    </div>
  );
}