import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-ticketBorder bg-parchment/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">✦</span>
          <span className="font-display text-xl font-semibold text-ink tracking-tight">
            Trao
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-inkMuted font-mono">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="text-sm font-medium px-4 py-2 rounded-full border border-ink text-ink hover:bg-ink hover:text-parchment transition-colors"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium px-4 py-2 rounded-full text-ink hover:bg-surfaceAlt transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium px-4 py-2 rounded-full bg-accent text-parchment hover:bg-accentDark transition-colors"
            >
              Get started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
