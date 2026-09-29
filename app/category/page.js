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
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Home</span>
        </button>

        {/* Track Pills */}
        <div className="flex p-0.5 bg-surface border border-border rounded-lg">
          {[
            { key: 'maintenance', label: 'Maintenance', icon: <Wrench size={12} /> },
            { key: 'customize', label: 'Customize', icon: <Zap size={12} /> },
            { key: 'all', label: 'All', icon: <Layers size={12} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => router.push(`/category?mode=${key}`)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
                mode === key ? 'bg-primary text-background' : 'text-gray-500 hover:text-white'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mb-10 animate-fade-in max-w-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-primary/[0.05] border border-primary/15 text-primary text-[11px] font-semibold uppercase tracking-wider mb-4">
          {isMaintenance && <><Wrench size={13} /> Maintenance & Service Track</>}
          {isCustomize && <><Zap size={13} /> Customization & Mods Track</>}
          {mode === 'all' && <><Layers size={13} /> All Automotive Services</>}
        </div>

        <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
          Select Vehicle <span className="text-primary">Type</span>
        </h2>
        
        <p className="text-gray-500 text-sm leading-relaxed">
          {isMaintenance 
            ? 'Choose your vehicle type to explore certified periodic servicing, oil flushes, and mechanical diagnostics.' 
            : isCustomize 
            ? 'Choose your vehicle type to explore performance exhausts, bespoke wraps, alloys, and styling modifications.'
            : 'Select a category to begin scheduling maintenance or designing custom modifications.'
          }
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 w-full max-w-4xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {[
          { 
            type: 'bike', 
            icon: <Bike size={52} />, 
            title: 'Motorcycles & Bikes', 
            subtitle: isMaintenance ? 'Chain lube, fluid change & engine diagnostics' : 'Performance exhausts, styling & accessories'
          },
          { 
            type: 'car', 
            icon: <Car size={52} />, 
            title: 'Performance Cars', 
            subtitle: isMaintenance ? 'Synthetic oil service, brake check & AC deep cleaning' : 'Custom vinyl wraps, diamond cut alloys & spoilers'
          }
        ].map(item => (
          <button 
            key={item.type} 
            onClick={() => router.push(`/vehicles?type=${item.type}&mode=${mode}`)}
            className="flex-1 group relative p-8 md:p-10 bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/30 hover:bg-surface-hover hover:-translate-y-1 text-left flex flex-col justify-between card-glow"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              {item.icon}
            </div>
            
            <div className="relative z-10 flex flex-col items-start">
              <div className="mb-6 p-5 rounded-xl bg-primary/[0.04] text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="font-orbitron text-xl font-bold mb-1.5 text-white group-hover:text-primary transition-colors capitalize">
                {item.type}s
              </h3>
              <p className="text-sm text-gray-400 font-medium mb-1">{item.title}</p>
              <p className="text-[13px] text-gray-500 leading-relaxed">{item.subtitle}</p>
            </div>

            <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between w-full">
              <span className="text-[11px] font-orbitron font-semibold uppercase tracking-wider text-primary">
                {isMaintenance ? 'View Maintenance Fleet' : isCustomize ? 'View Customizer Fleet' : 'Browse Inventory'}
              </span>
              <span className="text-primary text-base group-hover:translate-x-0.5 transition-transform">→</span>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
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
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-orbitron text-sm tracking-wider uppercase opacity-70">Loading Categories...</p>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}