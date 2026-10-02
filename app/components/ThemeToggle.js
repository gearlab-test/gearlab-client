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
      <div className={`w-[72px] h-[34px] rounded-full bg-white/[0.04] border border-white/[0.08] animate-pulse ${className}`} />
    );
  }

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch theme (currently ${isLight ? 'Light' : 'Dark'} mode)`}
      title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
      className={`group relative inline-flex items-center w-[72px] h-[34px] p-[3px] rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none cursor-pointer border ${
        isLight
          ? 'bg-slate-200/90 border-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]'
          : 'bg-[#0d0d0d] border-white/15 shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]'
      } ${className}`}
    >
      {/* ── LEFT SLOT: MOON (Dark Mode) ── */}
      <span className="w-7 h-7 flex items-center justify-center pointer-events-none z-0">
        {/* Only show background Moon when knob is on the RIGHT (Light mode) */}
        {isLight && (
          <Moon
            size={14}
            className="text-slate-400 opacity-60 transition-all duration-300 group-hover:opacity-90 -rotate-12"
          />
        )}
      </span>

      {/* ── RIGHT SLOT: SUN (Light Mode) ── */}
      <span className="w-7 h-7 flex items-center justify-center pointer-events-none z-0 ml-auto">
        {/* Only show background Sun when knob is on the LEFT (Dark mode) */}
        {!isLight && (
          <Sun
            size={14}
            className="text-amber-400/60 opacity-60 transition-all duration-300 group-hover:opacity-90"
          />
        )}
      </span>

      {/* ── SLIDING KNOB (Left = Moon, Right = Sun) ── */}
      <span
        aria-hidden="true"
        className={`absolute top-[3px] left-[3px] w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ease-spring pointer-events-none z-10 ${
          isLight
            ? 'translate-x-[38px] bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 shadow-[0_2px_10px_rgba(245,158,11,0.4)] border border-amber-300'
            : 'translate-x-0 bg-gradient-to-tr from-emerald-500 to-[#00ff88] text-black shadow-[0_0_14px_rgba(0,255,136,0.45)] border border-[#00ff88]/50'
        }`}
      >
        {isLight ? (
          <Sun size={14} className="stroke-[2.5] text-amber-950 animate-fade-in" />
        ) : (
          <Moon size={14} className="stroke-[2.5] text-black animate-fade-in" />
        )}
      </span>
    </button>
  );
}
