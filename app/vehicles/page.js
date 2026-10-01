'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import { getFallbackVehicles } from '@/lib/fallbackVehicles';
import { ArrowLeft, Loader2, Plus, Wrench, Zap, Layers, Car, Bike } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const mode = searchParams.get('mode') || 'all';
  const router = useRouter();

  const isMaintenance = mode === 'maintenance';
  const isCustomize = mode === 'customize';

  useEffect(() => {
    setLoading(true);
    const url = type ? `/vehicles?type=${type}` : '/vehicles';
    API.get(url)
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setVehicles(r.data);
        } else {
          setVehicles(getFallbackVehicles(type));
        }
      })
      .catch(err => {
        console.warn('Could not fetch vehicles from API, using catalog fallback:', err.message);
        setVehicles(getFallbackVehicles(type));
      })
      .finally(() => setLoading(false));
  }, [type]);

  const categoryTitle = type ? (type === 'bike' ? 'Bikes' : 'Cars') : 'All Models';

  const setModeFilter = (newMode) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newMode === 'all') params.delete('mode');
    else params.set('mode', newMode);
    router.push(`/vehicles?${params.toString()}`);
  };

  const setTypeFilter = (newType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!newType || newType === 'all') params.delete('type');
    else params.set('type', newType);
    router.push(`/vehicles?${params.toString()}`);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-primary">
      <div className="relative">
        <Loader2 className="animate-spin mb-4" size={40} />
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse-glow" />
      </div>
      <p className="font-orbitron text-sm tracking-wider uppercase opacity-70 mt-2">Scanning Inventory...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(mode !== 'all' ? `/category?mode=${mode}` : '/category')}
            className="p-2.5 rounded-xl bg-surface border border-border text-gray-500 hover:text-white hover:border-white/10 transition-all flex-shrink-0"
            title="Back to Categories"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-primary/[0.06] text-primary border border-primary/15">
                {isMaintenance ? 'Maintenance Track' : isCustomize ? 'Customization Track' : 'Full Catalog'}
              </span>
              {type && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/[0.03] text-gray-400 border border-white/[0.06]">
                  {type === 'car' ? 'Cars Only' : 'Bikes Only'}
                </span>
              )}
            </div>
            <h2 className="font-orbitron text-xl md:text-2xl font-bold tracking-tight text-white">
              {isMaintenance ? 'Periodic Service' : isCustomize ? 'Custom Studio' : 'Available'} <span className="text-primary">{categoryTitle}</span>
            </h2>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide mt-0.5">{vehicles.length} Models Ready</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Vehicle Type Switcher */}
          <div className="flex p-0.5 bg-surface border border-border rounded-lg">
            {[
              { key: 'all', label: 'All', icon: <Layers size={12} />, active: !type || type === 'all' },
              { key: 'car', label: 'Cars', icon: <Car size={12} />, active: type === 'car' },
              { key: 'bike', label: 'Bikes', icon: <Bike size={12} />, active: type === 'bike' },
            ].map(({ key, label, icon, active }) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-all duration-300 ${
                  active ? 'bg-primary text-background' : 'text-gray-500 hover:text-white'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="flex p-0.5 bg-surface border border-border rounded-lg">
            {[
              { key: 'customize', label: 'Customize', icon: <Zap size={12} />, active: isCustomize },
              { key: 'maintenance', label: 'Maintenance', icon: <Wrench size={12} />, active: isMaintenance },
              { key: 'all', label: 'All', icon: <Layers size={12} />, active: mode === 'all' },
            ].map(({ key, label, icon, active }) => (
              <button
                key={key}
                onClick={() => setModeFilter(key)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-all duration-300 ${
                  active ? 'bg-primary text-background' : 'text-gray-500 hover:text-white'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v, idx) => (
          <div key={v._id}
            className="group bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/15 animate-fade-in flex flex-col justify-between card-glow"
            style={{ animationDelay: `${idx * 0.06}s` }}
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-black/30 relative">
                {v.images?.[0] ? (
                  <img 
                    src={v.images[0]} 
                    alt={v.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = v.type === 'bike'
                        ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'
                        : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';
                    }}
                    className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <Plus size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-[10px] font-semibold text-gray-300 uppercase tracking-wider rounded-md border border-white/[0.06]">
                    {v.type === 'car' ? 'Car' : 'Bike'}
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-5">
                  <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md ${
                    isMaintenance 
                      ? 'bg-blue-500/80 text-white' 
                      : isCustomize 
                      ? 'bg-primary/90 text-background' 
                      : 'bg-primary/90 text-background'
                  }`}>
                    {isMaintenance ? 'Service Ready' : isCustomize ? 'Mod Ready' : 'Verified'}
                  </span>
                </div>
              </div>

              <div className="p-6 pb-3">
                <h3 className="font-orbitron text-lg font-bold text-white mb-1.5 group-hover:text-primary transition-colors">{v.name}</h3>
                <p className="text-gray-500 text-[13px] mb-3 leading-relaxed line-clamp-2">
                  {isMaintenance 
                    ? `Periodic servicing, synthetic oil replacement, multi-point diagnostics & mechanical health check for your ${v.name}.`
                    : isCustomize
                    ? `Aftermarket performance exhausts, custom color wraps, alloy wheels & aerodynamic styling for your ${v.name}.`
                    : `Complete maintenance and bespoke aftermarket customization packages available for your ${v.name}.`
                  }
                </p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="flex items-center justify-between py-3.5 border-t border-border/50">
                <div>
                  <p className="text-[10px] text-gray-500 tracking-wide font-medium">
                    {isMaintenance ? 'Service Base' : 'Base Rate'}
                  </p>
                  <p className="font-orbitron text-base font-bold text-white">₹{v.basePrice.toLocaleString()}</p>
                </div>

                {isMaintenance && (
                  <button
                    onClick={() => router.push(`/configurator/${v._id}?mode=maintenance`)}
                    className="px-4 py-2 bg-primary/[0.08] hover:bg-primary hover:text-background text-primary text-[11px] font-semibold rounded-lg transition-all duration-400 border border-primary/20 flex items-center gap-1.5 magnetic-btn hover:shadow-[0_0_16px_rgba(0,255,136,0.15)]"
                  >
                    <Wrench size={13} />
                    Book Service
                  </button>
                )}

                {isCustomize && (
                  <button
                    onClick={() => router.push(`/configurator/${v._id}?mode=customize`)}
                    className="px-4 py-2 bg-primary text-background hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all duration-400 flex items-center gap-1.5 magnetic-btn"
                  >
                    <Zap size={13} />
                    Customize
                  </button>
                )}

                {mode === 'all' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/configurator/${v._id}?mode=maintenance`)}
                      className="px-3 py-2 bg-white/[0.03] hover:bg-primary/10 hover:text-primary text-gray-400 text-[11px] font-semibold rounded-lg transition-all duration-400 border border-white/[0.05] hover:border-primary/20 flex items-center gap-1 magnetic-btn"
                      title="Maintenance"
                    >
                      <Wrench size={12} className="text-primary/60" />
                      Service
                    </button>
                    <button
                      onClick={() => router.push(`/configurator/${v._id}?mode=customize`)}
                      className="px-3 py-2 bg-primary text-background hover:shadow-[0_0_16px_rgba(0,255,136,0.2)] text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all duration-400 flex items-center gap-1 magnetic-btn"
                      title="Customize"
                    >
                      <Zap size={12} />
                      Modify
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="col-span-full p-16 rounded-2xl border border-dashed border-border text-center">
            <p className="text-gray-500 mb-3 text-base">No vehicles currently available in this category.</p>
            <p className="text-sm text-gray-600">Tip: Run <code className="bg-primary/[0.08] text-primary px-2 py-0.5 rounded text-xs">node seed.js</code> in your server folder to populate data.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-14 min-h-screen">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-24 text-primary">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-orbitron text-sm tracking-wider uppercase opacity-70">Initializing Interface...</p>
        </div>
      }>
        <VehiclesList />
      </Suspense>
    </main>
  );
}