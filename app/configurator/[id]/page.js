'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import API from '@/lib/api';
import { getFallbackVehicleById } from '@/lib/fallbackVehicles';
import useStore from '@/store/useStore';
import useToast from '@/store/useToast';
import { ArrowLeft, Check, ChevronRight, Loader2, Info, Wrench, Zap, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

const MULTI_SELECT_CATEGORIES = ['accessories', 'tyres', 'wrapping', 'services'];
const MAINTENANCE_CATEGORIES = ['services', 'maintenance', 'inspection', 'diagnostics'];
const CUSTOMIZE_CATEGORIES = ['color', 'exhaust', 'wrapping', 'accessories', 'tyres', 'alloys', 'sunroof', 'spoiler'];

function ConfiguratorContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') || 'all';

  const { user, fetchCartCount } = useStore();
  const { showError, showSuccess } = useToast();
  const [vehicle, setVehicle] = useState(null);
  const [selected, setSelected] = useState({});
  const [multiSelected, setMultiSelected] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [activeMode, setActiveMode] = useState(initialMode);

  useEffect(() => {
    API.get(`/vehicles/${id}`)
      .then(r => {
        if (r.data && (r.data._id || r.data.name)) {
          setVehicle(r.data);
        } else {
          const fb = getFallbackVehicleById(id);
          if (fb) setVehicle(fb);
          else showError('Could not load vehicle details.');
        }
      })
      .catch(() => {
        const fb = getFallbackVehicleById(id);
        if (fb) {
          setVehicle(fb);
        } else {
          showError('Could not load vehicle details.');
        }
      });
  }, [id]);

  const handleSingleSelect = (category, option) => {
    setSelected(prev => ({
      ...prev,
      [category]: prev[category]?.name === option.name ? null : option
    }));
  };

  const handleMultiSelect = (category, option) => {
    setMultiSelected(prev => {
      const current = prev[category] || [];
      const exists = current.find(o => o.name === option.name);
      return {
        ...prev,
        [category]: exists
          ? current.filter(o => o.name !== option.name)
          : [...current, option]
      };
    });
  };

  const isMultiCategory = (cat) => MULTI_SELECT_CATEGORIES.includes(cat);

  const isSelected = (category, option) => {
    if (isMultiCategory(category)) {
      return !!(multiSelected[category] || []).find(o => o.name === option.name);
    }
    return selected[category]?.name === option.name;
  };

  const totalPrice = vehicle ? (
    vehicle.basePrice
    + Object.values(selected).reduce((sum, opt) => sum + (opt?.price || 0), 0)
    + Object.values(multiSelected).flat().reduce((sum, opt) => sum + (opt?.price || 0), 0)
  ) : 0;

  const allChosenOptions = [
    ...Object.values(selected).filter(Boolean),
    ...Object.values(multiSelected).flat(),
  ];

  const maintenanceOptions = allChosenOptions.filter(o => MAINTENANCE_CATEGORIES.includes(o.category));
  const customizeOptions = allChosenOptions.filter(o => !MAINTENANCE_CATEGORIES.includes(o.category));

  const saveAndAddToCart = async () => {
    if (!user) return router.push('/auth/login');
    setSaving(true);
    try {
      const config = await API.post('/config', {
        vehicleId: id,
        selectedOptions: allChosenOptions,
        totalPrice
      });
      await API.post('/cart', { configId: config.data._id });
      fetchCartCount();
      showSuccess(activeMode === 'maintenance' ? 'Maintenance booking saved to cart!' : 'Build saved and added to cart!');
      router.push('/cart');
    } catch (err) {
      showError('Error saving build: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (!vehicle) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Assembling Workshop...</p>
    </div>
  );

  // Group vehicle options by category
  const allCategories = (vehicle.availableOptions || []).reduce((acc, opt) => {
    if (!acc[opt.category]) acc[opt.category] = [];
    acc[opt.category].push(opt);
    return acc;
  }, {});

  // Filter categories according to activeMode
  const displayedCategories = Object.entries(allCategories).filter(([category]) => {
    if (activeMode === 'maintenance') {
      return MAINTENANCE_CATEGORIES.includes(category);
    }
    if (activeMode === 'customize') {
      return !MAINTENANCE_CATEGORIES.includes(category);
    }
    return true; // 'all'
  });

  const images = vehicle.images || [];

  return (
    <main className="min-h-screen bg-background pb-36">
      {/* Top Navigation Bar */}
      <div className="glass sticky top-20 z-40 border-b border-white/5 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => {
              const params = new URLSearchParams();
              if (vehicle?.type) params.set('type', vehicle.type);
              if (activeMode !== 'all') params.set('mode', activeMode);
              const q = params.toString();
              router.push(q ? `/vehicles?${q}` : '/vehicles');
            }} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">
              Return to {vehicle?.type === 'car' ? 'Cars' : vehicle?.type === 'bike' ? 'Bikes' : 'Fleet'}
            </span>
          </button>
          <div className="text-right">
            <h1 className="font-orbitron text-xl font-bold uppercase tracking-tighter text-white">{vehicle.name}</h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">
              {activeMode === 'maintenance' ? '🔧 Maintenance Mode' : activeMode === 'customize' ? '⚡ Customization Mode' : 'Studio Mode'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Visual & Job Summary */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Main Vehicle Image */}
          <div className="relative aspect-video bg-black/40 rounded-3xl overflow-hidden border border-border group">
            <img 
              src={images[activeImage] || images[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'} 
              alt={vehicle.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = vehicle.type === 'bike'
                  ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'
                  : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';
              }}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
            <div className="absolute bottom-6 left-8 flex gap-2">
              <span className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                {vehicle.type}
              </span>
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-widest border border-white/10">
                4K Render
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? 'border-primary shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`${vehicle.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Mode Highlights Banner */}
          {activeMode === 'maintenance' && (
            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-3">
              <Wrench size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider text-white mb-1">Periodic Maintenance Track Active</p>
                <p className="leading-relaxed opacity-90">
                  Select the required routine maintenance items (multi-point health check, oil service, brake overhaul, etc.) to keep your warranty and vehicle in top shape.
                </p>
              </div>
            </div>
          )}

          {activeMode === 'customize' && (
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-emerald-300 flex items-start gap-3">
              <Zap size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider text-white mb-1">Customization & Parts Track Active</p>
                <p className="leading-relaxed opacity-90">
                  Select aftermarket exhausts, vinyl wraps, alloy wheels, spoilers, and performance parts to craft your custom build.
                </p>
              </div>
            </div>
          )}

          {/* Job Summary */}
          <div className="bg-surface/60 rounded-3xl p-8 border border-border">
            <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2"><Info size={16} /> Job Breakdown</span>
              <span className="text-[10px] text-gray-500 font-mono">{allChosenOptions.length} Items Selected</span>
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm pb-3 border-b border-border/50">
                <span className="text-gray-400 uppercase tracking-wide">Base Service Fee</span>
                <span className="text-white font-medium font-orbitron">₹{vehicle.basePrice.toLocaleString()}</span>
              </div>

              {/* Maintenance Services Summary */}
              {maintenanceOptions.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Wrench size={12} /> Maintenance Services ({maintenanceOptions.length})
                  </p>
                  {maintenanceOptions.map((opt, i) => (
                    <div key={i} className="flex justify-between items-center text-sm pl-3 border-l-2 border-blue-500/40">
                      <span className="text-gray-300 capitalize">{opt.name}</span>
                      <span className="text-white font-medium">
                        {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Customization Options Summary */}
              {customizeOptions.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Zap size={12} /> Custom Parts & Mods ({customizeOptions.length})
                  </p>
                  {customizeOptions.map((opt, i) => (
                    <div key={i} className="flex justify-between items-center text-sm pl-3 border-l-2 border-primary/40">
                      <span className="text-gray-300 capitalize">{opt.name}</span>
                      <span className="text-white font-medium">
                        {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {allChosenOptions.length === 0 && (
                <p className="text-gray-500 text-xs italic py-2">
                  No items selected yet. Choose from the available options on the right.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Track Switcher & Options Selection */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Prominent Track Switcher */}
          <div className="p-1.5 bg-surface border border-border rounded-2xl flex gap-1 shadow-lg">
            <button
              onClick={() => setActiveMode('maintenance')}
              className={`flex-1 py-3 px-3 rounded-xl font-orbitron text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                activeMode === 'maintenance'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench size={15} />
              <span>Maintenance ({maintenanceOptions.length})</span>
            </button>

            <button
              onClick={() => setActiveMode('customize')}
              className={`flex-1 py-3 px-3 rounded-xl font-orbitron text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
                activeMode === 'customize'
                  ? 'bg-primary text-background shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap size={15} />
              <span>Customize ({customizeOptions.length})</span>
            </button>

            <button
              onClick={() => setActiveMode('all')}
              className={`py-3 px-4 rounded-xl font-orbitron text-xs font-bold uppercase transition-all ${
                activeMode === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* Options Categories */}
          {displayedCategories.length === 0 ? (
            <div className="p-12 rounded-3xl bg-surface border border-dashed border-border text-center">
              <p className="text-gray-400 mb-2 font-medium">No options available under this category.</p>
              <button 
                onClick={() => setActiveMode('all')}
                className="text-xs text-primary font-bold uppercase tracking-wider underline mt-2"
              >
                Switch to All Options
              </button>
            </div>
          ) : (
            displayedCategories.map(([category, options], catIdx) => {
              const isMulti = isMultiCategory(category);
              const selectedCount = isMulti ? (multiSelected[category] || []).length : (selected[category] ? 1 : 0);
              const isMaintenanceCat = MAINTENANCE_CATEGORIES.includes(category);

              return (
                <div key={category} className="animate-fade-in space-y-4" style={{ animationDelay: `${catIdx * 0.05}s` }}>
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isMaintenanceCat ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
                        {isMaintenanceCat ? <Wrench size={16} /> : <Zap size={16} />}
                      </div>
                      <div>
                        <h3 className="font-orbitron text-base font-bold text-white uppercase tracking-tight">
                          {category}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {isMaintenanceCat ? 'Routine Service Scope' : 'Aftermarket Part & Modification'}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                      isMulti ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-gray-400'
                    }`}>
                      {isMulti ? `MULTI-SELECT (${selectedCount})` : 'SINGLE CHOICE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {options.map((opt, i) => {
                      const active = isSelected(category, opt);
                      return (
                        <button 
                          key={i}
                          onClick={() => isMulti ? handleMultiSelect(category, opt) : handleSingleSelect(category, opt)}
                          className={`group relative p-4 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[95px] ${
                            active 
                              ? isMaintenanceCat 
                                ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                : 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,255,136,0.15)]' 
                              : 'bg-surface border-border hover:border-gray-700 hover:bg-surface-hover'
                          }`}
                        >
                          <div className="flex justify-between items-start w-full gap-2">
                            <span className={`font-semibold text-sm leading-snug transition-colors ${
                              active ? (isMaintenanceCat ? 'text-blue-300' : 'text-primary') : 'text-gray-300'
                            }`}>
                              {opt.name}
                            </span>
                            {active && (
                              <div className={`rounded-full p-1 text-background flex-shrink-0 ${isMaintenanceCat ? 'bg-blue-400' : 'bg-primary'}`}>
                                <Check size={12} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className={`text-xs font-orbitron font-bold ${active ? 'text-white' : 'text-gray-500'}`}>
                              {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Standard / Included'}
                            </span>
                            {isMaintenanceCat && (
                              <span className="text-[9px] uppercase tracking-wider text-gray-500">Service</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Fixed Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-primary/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-0.5">
              {activeMode === 'maintenance' ? 'Total Service Estimate' : 'Total Build & Service Estimate'}
            </p>
            <p className="font-orbitron text-2xl font-black text-primary neon-glow">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={saveAndAddToCart} 
              disabled={saving}
              className={`group px-8 md:px-12 py-4 font-black uppercase tracking-widest text-xs md:text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${
                activeMode === 'maintenance'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
                  : 'bg-primary text-background shadow-[0_0_25px_rgba(0,255,136,0.3)]'
              }`}
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {activeMode === 'maintenance' 
                      ? 'Book Maintenance Service' 
                      : activeMode === 'customize' 
                      ? 'Save Custom Build' 
                      : 'Secure Build & Service'
                    }
                  </span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ConfiguratorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-orbitron tracking-widest uppercase animate-pulse">Initializing Studio...</p>
      </div>
    }>
      <ConfiguratorContent />
    </Suspense>
  );
}