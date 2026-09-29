'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from '@/store/useStore';
import { User, LogOut, ShoppingCart, Menu, X, Package, ShieldCheck, Wrench, Zap, Car, Bike } from 'lucide-react';

export default function Navbar() {
  const { user, logout, initialize, cartCount } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  // Track scroll for subtle navbar elevation change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'glass border-b border-white/[0.04] shadow-[0_1px_24px_rgba(0,0,0,0.4)]'
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <Link href="/" className="font-orbitron text-xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">
          GEARLAB
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/category?mode=maintenance" className="px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-all text-[11px] font-semibold tracking-wide uppercase text-gray-400 hover:text-white flex items-center gap-1.5">
            <Wrench size={13} className="text-primary/70" /> Maintenance
          </Link>
          <Link href="/category?mode=customize" className="px-3.5 py-2 rounded-lg hover:bg-white/[0.04] transition-all text-[11px] font-semibold tracking-wide uppercase text-gray-400 hover:text-white flex items-center gap-1.5">
            <Zap size={13} className="text-primary/70" /> Customize
          </Link>

          <div className="w-px h-5 bg-white/[0.06] mx-1.5" />

          <Link href="/vehicles?type=car" className="px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all text-[11px] font-semibold tracking-wide uppercase text-gray-400 hover:text-white flex items-center gap-1.5">
            <Car size={13} /> Cars
          </Link>
          <Link href="/vehicles?type=bike" className="px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all text-[11px] font-semibold tracking-wide uppercase text-gray-400 hover:text-white flex items-center gap-1.5">
            <Bike size={13} /> Bikes
          </Link>

          <div className="w-px h-5 bg-white/[0.06] mx-1.5" />

          <Link href="/cart" className="px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-all flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-gray-400 hover:text-white relative">
            <div className="relative">
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-[18px] h-[18px] bg-primary text-background text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_6px_rgba(0,255,136,0.3)]">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>

          {user?.role === 'workshop' && (
            <Link href="/workshop" className="ml-1 px-4 py-1.5 rounded-lg bg-primary/[0.08] border border-primary/15 text-primary hover:bg-primary hover:text-background transition-all text-[11px] font-bold tracking-wide uppercase">
              Workshop
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/admin" className="ml-1 px-4 py-1.5 rounded-lg bg-red-500/[0.08] border border-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[11px] font-bold tracking-wide uppercase">
              Admin
            </Link>
          )}

          <div className="w-px h-5 bg-white/[0.06] mx-1.5" />

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/[0.06] text-primary transition-all">
                <User size={15} />
                <span className="font-orbitron text-[11px] font-bold tracking-wide">{user.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="ml-1 px-5 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-background font-semibold text-[11px] tracking-wide uppercase transition-all">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2.5 rounded-lg hover:bg-white/[0.04] text-gray-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-[72px] left-0 w-full border-b border-white/[0.04] transition-all duration-300 overflow-hidden ${
        isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="glass p-5 space-y-2">
          <Link 
            href="/category?mode=maintenance" 
            onClick={closeMobileMenu}
            className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/[0.04] text-gray-300 hover:text-white transition-all text-sm font-medium"
          >
            <Wrench size={18} className="text-primary/70" /> Maintenance Service
          </Link>
          <Link 
            href="/category?mode=customize" 
            onClick={closeMobileMenu}
            className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/[0.04] text-gray-300 hover:text-white transition-all text-sm font-medium"
          >
            <Zap size={18} className="text-primary/70" /> Vehicle Customizer
          </Link>

          <div className="grid grid-cols-2 gap-2 py-1">
            <Link 
              href="/vehicles?type=car" 
              onClick={closeMobileMenu}
              className="flex items-center gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-300 hover:text-white transition-all text-sm font-medium justify-center"
            >
              <Car size={18} className="text-primary/70" /> Cars
            </Link>
            <Link 
              href="/vehicles?type=bike" 
              onClick={closeMobileMenu}
              className="flex items-center gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-gray-300 hover:text-white transition-all text-sm font-medium justify-center"
            >
              <Bike size={18} className="text-primary/70" /> Bikes
            </Link>
          </div>

          <Link 
            href="/cart" 
            onClick={closeMobileMenu}
            className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-white/[0.04] text-gray-300 hover:text-white transition-all text-sm font-medium"
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
            <Link 
              href="/workshop" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-primary/[0.06] border border-primary/15 text-primary text-sm font-medium"
            >
              <Package size={18} /> Workshop Control
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3.5 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/15 text-red-400 text-sm font-medium"
            >
              <ShieldCheck size={18} /> Admin Panel
            </Link>
          )}

          <div className="h-px bg-white/[0.04] my-1" />

          {user ? (
            <>
              <Link 
                href="/profile" 
                onClick={closeMobileMenu}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-primary/[0.06] border border-primary/15 text-primary text-sm font-medium"
              >
                <User size={18} /> {user.name}&apos;s Profile
              </Link>
              <button 
                onClick={() => { logout(); closeMobileMenu(); }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/10 text-red-400 text-sm font-medium w-full text-left"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <Link 
              href="/auth/login" 
              onClick={closeMobileMenu}
              className="flex items-center justify-center p-3.5 rounded-xl bg-primary text-background font-bold text-sm"
            >
              Login to GearLab
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
