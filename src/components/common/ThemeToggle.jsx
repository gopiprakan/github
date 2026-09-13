import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label="Toggle dark/light mode"
      className={`p-2 rounded-lg transition-colors border border-gh-lightBorder dark:border-gh-darkBorder 
        bg-gh-lightPanel dark:bg-gh-darkPanel hover:bg-gray-100 dark:hover:bg-gh-darkCard text-gh-lightMuted dark:text-gh-darkMuted 
        hover:text-gh-lightText dark:hover:text-gh-darkText ${className}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600" />
      )}
    </button>
  );
}
