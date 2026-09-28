'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bike, Car, Wrench, Zap, Layers, ArrowLeft, Loader2 } from 'lucide-react';

function CategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'all';

  const isMaintenance = mode === 'maintenance';
  const isCustomize = mode === 'customize';

  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center p-6 bg-background">
      {/* Back button */}
      <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Home</span>
        </button>

        {/* Track Pills */}
        <div className="flex p-1 bg-surface border border-border rounded-xl">
          <button
            onClick={() => router.push('/category?mode=maintenance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isMaintenance ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wrench size={13} /> Maintenance
          </button>
          <button
            onClick={() => router.push('/category?mode=customize')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              isCustomize ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap size={13} /> Customize
          </button>
          <button
            onClick={() => router.push('/category?mode=all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              mode === 'all' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={13} /> All
          </button>
        </div>
      </div>

      <div className="text-center mb-12 animate-fade-in max-w-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-4">
          {isMaintenance && <><Wrench size={14} /> Maintenance & Service Track</>}
          {isCustomize && <><Zap size={14} /> Customization & Mods Track</>}
          {mode === 'all' && <><Layers size={14} /> All Automotive Services</>}
        </div>

        <h2 className="font-orbitron text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
          Select Vehicle <span className="text-primary">Type</span>
        </h2>
        
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          {isMaintenance 
            ? 'Choose your vehicle type to explore certified periodic servicing, oil flushes, and mechanical diagnostics.' 
            : isCustomize 
            ? 'Choose your vehicle type to explore performance exhausts, bespoke wraps, alloys, and styling modifications.'
            : 'Select a category to begin scheduling maintenance or designing custom modifications.'
          }
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {[
          { 
            type: 'bike', 
            icon: <Bike size={64} />, 
            title: 'Motorcycles & Bikes', 
            subtitle: isMaintenance ? 'Chain lube, fluid change & engine diagnostics' : 'Performance exhausts, styling & accessories'
          },
          { 
            type: 'car', 
            icon: <Car size={64} />, 
            title: 'Performance Cars', 
            subtitle: isMaintenance ? 'Synthetic oil service, brake check & AC deep cleaning' : 'Custom vinyl wraps, diamond cut alloys & spoilers'
          }
        ].map(item => (
          <button 
            key={item.type} 
            onClick={() => router.push(`/vehicles?type=${item.type}&mode=${mode}`)}
            className="flex-1 group relative p-10 md:p-12 bg-surface border border-border rounded-[2.5rem] overflow-hidden transition-all hover:border-primary/50 hover:bg-surface-hover hover:-translate-y-2 text-left flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              {item.icon}
            </div>
            
            <div className="relative z-10 flex flex-col items-start">
              <div className="mb-8 p-6 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="font-orbitron text-2xl font-bold mb-2 uppercase text-white group-hover:text-primary transition-colors">
                {item.type}s
              </h3>
              <p className="text-sm text-gray-400 font-medium tracking-wide mb-2">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed font-light">{item.subtitle}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between w-full">
              <span className="text-xs font-orbitron font-bold uppercase tracking-widest text-primary">
                {isMaintenance ? 'View Maintenance Fleet' : isCustomize ? 'View Customizer Fleet' : 'Browse Inventory'}
              </span>
              <span className="text-primary font-bold text-lg group-hover:translate-x-1 transition-transform">→</span>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        ))}
      </div>
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-primary">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-orbitron tracking-widest uppercase animate-pulse">Loading Categories...</p>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}