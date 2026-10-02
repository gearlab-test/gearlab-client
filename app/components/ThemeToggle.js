'use client';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', compact = false }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('gearlab-theme') || 'dark';
    setTheme(saved);
    applyTheme(saved);

    const handleThemeChange = (e) => {
      if (e.detail && (e.detail === 'light' || e.detail === 'dark')) {
        setTheme(e.detail);
      }
    };

    window.addEventListener('gearlab-theme-change', handleThemeChange);
    return () => window.removeEventListener('gearlab-theme-change', handleThemeChange);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('gearlab-theme', nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new CustomEvent('gearlab-theme-change', { detail: nextTheme }));
  };

  if (!mounted) {
    return (
      <div className={`w-14 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] animate-pulse ${className}`} />
    );
  }

  const isLight = theme === 'light';

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label="Toggle Dark/Light Mode"
        className={`relative p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
          isLight
            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border border-amber-500/20'
            : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
        } ${className}`}
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {isLight ? (
          <Sun size={18} className="animate-spin-once text-amber-500" />
        ) : (
          <Moon size={18} className="text-primary" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      className={`group relative flex items-center justify-between w-16 h-8 p-1 rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isLight
          ? 'bg-gradient-to-r from-amber-100 to-sky-100 border border-amber-300/40 shadow-inner'
          : 'bg-[#121212] border border-white/10 shadow-inner'
      } ${className}`}
    >
      {/* Background Icons */}
      <span className="flex items-center justify-center w-6 h-6 text-amber-500 transition-opacity duration-300 z-0">
        <Sun size={13} className={isLight ? 'opacity-100' : 'opacity-30'} />
      </span>
      <span className="flex items-center justify-center w-6 h-6 text-primary transition-opacity duration-300 z-0">
        <Moon size={13} className={!isLight ? 'opacity-100' : 'opacity-30'} />
      </span>

      {/* Sliding Knob */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 ease-spring ${
          isLight
            ? 'translate-x-8 bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 shadow-amber-500/30'
            : 'translate-x-0 bg-gradient-to-tr from-emerald-500 to-primary text-black shadow-emerald-500/30'
        }`}
      >
        {isLight ? (
          <Sun size={12} className="text-amber-950 stroke-[2.5]" />
        ) : (
          <Moon size={12} className="text-black stroke-[2.5]" />
        )}
      </span>
    </button>
  );
}
