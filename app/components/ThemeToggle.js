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
      <div className={`w-[70px] h-8 rounded-full bg-white/[0.04] border border-white/[0.08] animate-pulse ${className}`} />
    );
  }

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      title={`Currently in ${isLight ? 'Light' : 'Dark'} Mode — Click to switch`}
      className={`relative inline-flex items-center h-8 p-1 rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none cursor-pointer ${
        isLight
          ? 'bg-slate-200/90 border border-slate-300 shadow-inner'
          : 'bg-[#111111] border border-white/10 shadow-inner'
      } ${compact ? 'w-[64px]' : 'w-[70px]'} ${className}`}
    >
      {/* Active Sliding Capsule Highlight */}
      <span
        aria-hidden="true"
        className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-spring ${
          compact ? 'w-7' : 'w-7'
        } ${
          isLight
            ? 'translate-x-[30px] bg-white text-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.3)] border border-amber-400/40'
            : 'translate-x-0 bg-white/10 text-primary shadow-[0_0_12px_rgba(0,255,136,0.25)] border border-primary/30'
        }`}
      />

      {/* Left Icon: MOON (Dark Mode) */}
      <span
        className={`relative z-10 flex-1 flex items-center justify-center transition-all duration-300 ${
          !isLight
            ? 'text-primary font-bold scale-105'
            : 'text-slate-400 opacity-60 hover:opacity-90'
        }`}
      >
        <Moon
          size={14}
          className={`transition-transform duration-300 ${!isLight ? 'rotate-0' : '-rotate-12'}`}
        />
      </span>

      {/* Right Icon: SUN (Light Mode) */}
      <span
        className={`relative z-10 flex-1 flex items-center justify-center transition-all duration-300 ${
          isLight
            ? 'text-amber-500 font-bold scale-105'
            : 'text-gray-500 opacity-50 hover:opacity-80'
        }`}
      >
        <Sun
          size={14}
          className={`transition-transform duration-300 ${isLight ? 'rotate-0' : 'rotate-45'}`}
        />
      </span>
    </button>
  );
}
