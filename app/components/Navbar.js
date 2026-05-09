'use client';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import useStore from '@/store/useStore';
import { User, LogOut, ShoppingCart, Menu, X, Package } from 'lucide-react';

export default function Navbar() {
  const { user, logout, initialize } = useStore();
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
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/category" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold">Vehicles</Link>
          <Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold">
            <ShoppingCart size={16} />
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
          <div className="flex flex-col p-6 gap-4">
            <Link 
              href="/category" 
              onClick={closeMobileMenu}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs"
            >
              <Package size={18} /> Vehicles
            </Link>
            <Link 
              href="/cart" 
              onClick={closeMobileMenu}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-gray-300 hover:text-primary transition-all font-bold uppercase tracking-widest text-xs"
            >
              <ShoppingCart size={18} /> Cart
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
                  <User size={18} /> {user.name}'s Profile
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

