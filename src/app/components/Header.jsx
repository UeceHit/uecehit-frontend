"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import "./header.css";

export default function Header() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    setDark(!dark);
    document.body.classList.toggle("dark-mode");
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
        <button className="theme-btn" onClick={toggleTheme}>
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}