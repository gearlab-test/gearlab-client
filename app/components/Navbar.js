'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '@/store/useStore';
import { User, LogOut, ShoppingCart, Menu, X, Package, ShieldCheck, Wrench, Zap, Car, Bike } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function NavLink({ href, children, icon, className = '' }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href?.split('?')[0]);

  return (
    <Link 
      href={href} 
      className={`relative px-3 py-2 rounded-lg transition-all duration-300 ease-out text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1.5 group ${
        isActive 
          ? 'text-primary bg-primary/[0.06]' 
          : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
      } ${className}`}
    >
      {icon}
      {children}
      {/* Active indicator dot */}
      <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
      }`} />
    </Link>
  );
}

export default function Navbar() {
  const { user, logout, initialize, cartCount } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressBarRef = useRef(null);
  const scrolledRef = useRef(false);

  useEffect(() => {
    initialize();
  }, []);

  // Track scroll for navbar elevation + page progress without frequent re-renders
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isOver = window.scrollY > 10;
          if (scrolledRef.current !== isOver) {
            scrolledRef.current = isOver;
            setScrolled(isOver);
          }

          if (progressBarRef.current) {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
            progressBarRef.current.style.width = `${progress}%`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? 'glass shadow-[0_2px_32px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}>
        {/* Scroll progress bar with multi-color gradient */}
        <div ref={progressBarRef} className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 via-purple-500 to-amber-400 pointer-events-none" style={{ width: '0%' }} />

        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-orbitron text-xl font-bold tracking-tight hover:opacity-80 transition-all duration-300 group flex items-center gap-2">
            <span className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.3)] transition-all duration-500">GEAR</span>
            <span className="text-white">LAB</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            <NavLink href="/category?mode=maintenance" icon={<Wrench size={13} className="text-primary/60 group-hover:text-primary transition-colors" />}>
              Maintenance
            </NavLink>
            <NavLink href="/category?mode=customize" icon={<Zap size={13} className="text-primary/60 group-hover:text-primary transition-colors" />}>
              Customize
            </NavLink>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            <NavLink href="/vehicles?type=car" icon={<Car size={13} />}>Cars</NavLink>
            <NavLink href="/vehicles?type=bike" icon={<Bike size={13} />}>Bikes</NavLink>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            <Link href="/cart" className="relative px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-all duration-300 flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-gray-400 hover:text-white">
              <div className="relative">
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] bg-primary text-background text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,255,136,0.4)] animate-fade-in px-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
            </Link>

            {user?.role === 'workshop' && (
              <Link href="/workshop" className="ml-1 px-4 py-1.5 rounded-lg bg-primary/[0.06] border border-primary/15 text-primary hover:bg-primary hover:text-background transition-all duration-300 text-[11px] font-bold tracking-wide uppercase magnetic-btn">
                Workshop
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link href="/admin" className="ml-1 px-4 py-1.5 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 text-[11px] font-bold tracking-wide uppercase magnetic-btn">
                Admin
              </Link>
            )}

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            {user ? (
              <div className="flex items-center gap-1">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/[0.05] text-primary transition-all duration-300 group">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <User size={13} />
                  </div>
                  <span className="font-orbitron text-[11px] font-bold tracking-wide">{user.name}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="ml-1.5 px-5 py-2 rounded-lg bg-primary/[0.08] border border-primary/25 text-primary hover:bg-primary hover:text-background font-semibold text-[11px] tracking-wide uppercase transition-all duration-300 magnetic-btn">
                Sign In
              </Link>
            )}
            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            {/* Dark / Light Mode Switch */}
            <ThemeToggle className="ml-1" />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compact />
            <button 
              onClick={toggleMobileMenu}
              className="p-2.5 rounded-lg hover:bg-white/[0.04] text-gray-400 hover:text-white transition-all duration-300"
            >
              <div className="relative w-5 h-5">
                <Menu size={20} className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
                <X size={20} className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-500 ease-out md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileMenu}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Mobile Menu Panel */}
      <div className={`fixed top-[72px] left-0 right-0 z-50 md:hidden transition-all duration-500 ease-out ${
        isMobileMenuOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="glass mx-4 mt-2 rounded-2xl border border-white/[0.04] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
          <div className={`space-y-1 ${isMobileMenuOpen ? 'stagger-children' : ''}`}>
            <Link 
              href="/category?mode=maintenance" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/[0.04] text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <Wrench size={18} className="text-primary/60" /> Maintenance Service
            </Link>
            <Link 
              href="/category?mode=customize" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/[0.04] text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <Zap size={18} className="text-primary/60" /> Vehicle Customizer
            </Link>

            <div className="grid grid-cols-2 gap-2 py-1">
              <Link 
                href="/vehicles?type=car" 
                onClick={closeMobileMenu}
                className="flex items-center gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium justify-center hover:border-primary/20"
              >
                <Car size={18} className="text-primary/60" /> Cars
              </Link>
              <Link 
                href="/vehicles?type=bike" 
                onClick={closeMobileMenu}
                className="flex items-center gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium justify-center hover:border-primary/20"
              >
                <Bike size={18} className="text-primary/60" /> Bikes
              </Link>
            </div>

            <Link 
              href="/cart" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/[0.04] text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-background text-[8px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
            </Link>

            {user?.role === 'workshop' && (
              <Link href="/workshop" onClick={closeMobileMenu} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-primary/[0.04] border border-primary/10 text-primary text-sm font-medium">
                <Package size={18} /> Workshop Control
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link href="/admin" onClick={closeMobileMenu} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-red-500/[0.04] border border-red-500/10 text-red-400 text-sm font-medium">
                <ShieldCheck size={18} /> Admin Panel
              </Link>
            )}

            {/* Theme Toggle Row in Mobile */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Appearance</span>
              <ThemeToggle />
            </div>

            <div className="h-px bg-white/[0.04] my-1" />

            {user ? (
              <>
                <Link href="/profile" onClick={closeMobileMenu} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-primary/[0.04] border border-primary/10 text-primary text-sm font-medium">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  {user.name}&apos;s Profile
                </Link>
                <button 
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-red-500/[0.04] border border-red-500/10 text-red-400 text-sm font-medium w-full text-left transition-all duration-300 hover:bg-red-500/10"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                onClick={closeMobileMenu}
                className="flex items-center justify-center p-3.5 rounded-xl bg-primary text-background font-bold text-sm transition-all duration-300 magnetic-btn"
              >
                Sign In to GearLab
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
