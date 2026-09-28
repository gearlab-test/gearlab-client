'use client';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import useStore from '@/store/useStore';
import { User, LogOut, ShoppingCart, Menu, X, Package, ShieldCheck, Wrench, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout, initialize, cartCount } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-orbitron text-2xl font-bold text-primary tracking-tighter hover:opacity-80 transition-opacity">
          GEARLAB
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link href="/category?mode=maintenance" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold flex items-center gap-1.5 text-gray-300">
            <Wrench size={12} className="text-primary" /> Maintenance
          </Link>
          <Link href="/category?mode=customize" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold flex items-center gap-1.5 text-gray-300">
            <Zap size={12} className="text-primary" /> Customize
          </Link>
          <Link href="/vehicles" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold text-gray-400">Fleet</Link>
          <Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold relative">
            <div className="relative">
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-primary text-background text-[9px] font-black rounded-full flex items-center justify-center animate-count-up shadow-[0_0_8px_rgba(0,255,136,0.4)]">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>

          {user?.role === 'workshop' && (
            <Link href="/workshop" className="px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-background transition-all uppercase tracking-widest text-[10px] font-black">
              Workshop
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/admin" className="px-4 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-[10px] font-black">
              Admin
            </Link>
          )}


          
          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/profile" className="flex items-center gap-2 text-primary hover:opacity-80 transition-all">
                <User size={16} />
                <span className="font-orbitron text-[10px] font-bold uppercase tracking-widest">{user.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="p-2 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="px-6 py-2 rounded-xl border border-primary text-primary hover:bg-primary hover:text-background font-bold uppercase tracking-widest text-[10px] transition-all">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-400 hover:text-primary transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass absolute top-20 left-0 w-full border-b border-border animate-fade-in">
          <div className="flex flex-col p-6 gap-3">
            <Link 
              href="/category?mode=maintenance" 
              onClick={closeMobileMenu}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs"
            >
              <Wrench size={18} className="text-primary" /> Maintenance Service
            </Link>
            <Link 
              href="/category?mode=customize" 
              onClick={closeMobileMenu}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs"
            >
              <Zap size={18} className="text-primary" /> Vehicle Customizer
            </Link>
            <Link 
              href="/vehicles" 
              onClick={closeMobileMenu}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs"
            >
              <Package size={18} /> All Fleet
            </Link>
            <Link 
              href="/cart" 
              onClick={closeMobileMenu}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-background text-[9px] font-black rounded-full flex items-center justify-center">
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
                className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest text-xs"
              >
                <Package size={18} /> Workshop Control
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link 
                href="/admin" 
                onClick={closeMobileMenu}
                className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase tracking-widest text-xs"
              >
                <ShieldCheck size={18} /> Admin Core
              </Link>
            )}


            
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-widest text-xs"
                >
                  <User size={18} /> {user.name}&apos;s Profile
                </Link>
                <button 
                  onClick={() => { logout(); closeMobileMenu(); }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase tracking-widest text-xs text-left"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                onClick={closeMobileMenu}
                className="flex items-center justify-center p-4 rounded-2xl bg-primary text-background font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                Login to GearLab
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

