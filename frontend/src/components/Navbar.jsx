import React from 'react';
import { CheckSquare, Moon, Sun, Database } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, dbConnected }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-area">
          <div className="brand-icon">
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <p className="brand-subtitle">Full-Stack MERN Todo</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* MongoDB Connection Status Pill */}
          <div className="db-pill" title={dbConnected ? 'MongoDB Connected' : 'MongoDB Offline / Connecting'}>
            <span className={`db-dot ${dbConnected ? 'connected' : 'disconnected'}`}></span>
            <span>MongoDB: {dbConnected ? 'Online' : 'Offline'}</span>
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
