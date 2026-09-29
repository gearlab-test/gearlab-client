'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import { getFallbackVehicles } from '@/lib/fallbackVehicles';
import { ArrowLeft, Loader2, Plus, Wrench, Zap, Layers, Car, Bike } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center py-20 text-primary">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Scanning Inventory...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(mode !== 'all' ? `/category?mode=${mode}` : '/category')}
            className="p-3 rounded-full bg-surface border border-border text-gray-400 hover:text-primary hover:border-primary/50 transition-all flex-shrink-0"
            title="Back to Categories"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {isMaintenance ? 'Maintenance Track' : isCustomize ? 'Customization Track' : 'Full Catalog'}
              </span>
              {type && (
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                  {type === 'car' ? '🚗 Cars Only' : '🏍️ Bikes Only'}
                </span>
              )}
            </div>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
              {isMaintenance ? 'Periodic Service' : isCustomize ? 'Custom Studio' : 'Available'} <span className="text-primary">{categoryTitle}</span>
            </h2>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-0.5">{vehicles.length} Models Ready</p>
          </div>
        </div>

        {/* Filter Controls: Vehicle Type & Service Mode */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Vehicle Type Switcher */}
          <div className="flex p-1 bg-surface border border-border rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                !type || type === 'all' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} /> All
            </button>
            <button
              onClick={() => setTypeFilter('car')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                type === 'car' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Car size={13} /> Cars
            </button>
            <button
              onClick={() => setTypeFilter('bike')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                type === 'bike' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bike size={13} /> Bikes
            </button>
          </div>

          {/* Mode Switcher Filter */}
          <div className="flex p-1 bg-surface border border-border rounded-xl">
            <button
              onClick={() => setModeFilter('customize')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                isCustomize ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap size={13} /> Customize
            </button>
            <button
              onClick={() => setModeFilter('maintenance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                isMaintenance ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wrench size={13} /> Maintenance
            </button>
            <button
              onClick={() => setModeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                mode === 'all' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} /> All
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((v, idx) => (
          <div key={v._id}
            className="group bg-surface border border-border rounded-3xl overflow-hidden transition-all hover:border-primary/40 hover:-translate-y-1 animate-fade-in flex flex-col justify-between"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <div>
              <div className="aspect-video overflow-hidden bg-black/40 relative">
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <Plus size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest rounded-full border border-primary/20">
                    {v.type === 'car' ? '🚗 Car' : '🏍️ Bike'}
                  </span>
                </div>
                <div className="absolute bottom-4 left-6">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                    isMaintenance 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : isCustomize 
                      ? 'bg-primary text-background shadow-[0_0_12px_rgba(0,255,136,0.3)]' 
                      : 'bg-primary text-background'
                  }`}>
                    {isMaintenance ? '🔧 Service Ready' : isCustomize ? '⚡ Mod Ready' : 'Verified Model'}
                  </span>
                </div>
              </div>

              <div className="p-8 pb-4">
                <h3 className="font-orbitron text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{v.name}</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                  {isMaintenance 
                    ? `Periodic servicing, synthetic oil replacement, multi-point diagnostics & mechanical health check for your ${v.name}.`
                    : isCustomize
                    ? `Aftermarket performance exhausts, custom color wraps, alloy wheels & aerodynamic styling for your ${v.name}.`
                    : `Complete maintenance and bespoke aftermarket customization packages available for your ${v.name}.`
                  }
                </p>
              </div>
            </div>

            <div className="p-8 pt-0">
              <div className="flex items-center justify-between py-4 border-t border-border">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    {isMaintenance ? 'Service Base' : 'Base Rate'}
                  </p>
                  <p className="font-orbitron text-lg font-bold text-white">₹{v.basePrice.toLocaleString()}</p>
                </div>

                {isMaintenance && (
                  <button
                    onClick={() => router.push(`/configurator/${v._id}?mode=maintenance`)}
                    className="px-5 py-2.5 bg-primary/10 hover:bg-primary hover:text-background text-primary text-xs font-bold rounded-xl transition-all border border-primary/30 flex items-center gap-1.5"
                  >
                    <Wrench size={14} />
                    <span>Book Service</span>
                  </button>
                )}

                {isCustomize && (
                  <button
                    onClick={() => router.push(`/configurator/${v._id}?mode=customize`)}
                    className="px-5 py-2.5 bg-primary text-background hover:brightness-110 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,136,0.25)] flex items-center gap-1.5"
                  >
                    <Zap size={14} />
                    <span>Customize</span>
                  </button>
                )}

                {mode === 'all' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/configurator/${v._id}?mode=maintenance`)}
                      className="px-3.5 py-2 bg-white/5 hover:bg-primary/10 hover:text-primary text-gray-300 text-xs font-bold rounded-xl transition-all border border-white/10 hover:border-primary/30 flex items-center gap-1"
                      title="Maintenance"
                    >
                      <Wrench size={13} className="text-primary" />
                      <span>Service</span>
                    </button>
                    <button
                      onClick={() => router.push(`/configurator/${v._id}?mode=customize`)}
                      className="px-3.5 py-2 bg-primary text-background hover:brightness-110 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_10px_rgba(0,255,136,0.2)] flex items-center gap-1"
                      title="Customize"
                    >
                      <Zap size={13} />
                      <span>Modify</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="col-span-full p-20 rounded-3xl border border-dashed border-border text-center">
            <p className="text-gray-500 mb-4 text-lg">No vehicles currently available in this category.</p>
            <p className="text-sm text-gray-600">Tip: Run <code className="bg-primary/10 text-primary px-2 py-1 rounded">node seed.js</code> in your server folder to populate data.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-orbitron tracking-widest uppercase animate-pulse">Initializing Interface...</p>
        </div>
      }>
        <VehiclesList />
      </Suspense>
    </main>
  );
}