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
      <div className="relative">
        <Loader2 className="animate-spin mb-4" size={40} />
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse-glow" />
      </div>
      <p className="font-orbitron text-sm tracking-wider uppercase opacity-70 mt-2">Assembling Workshop...</p>
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
    <main className="min-h-screen bg-background pb-32">
      {/* Top Navigation Bar */}
      <div className="glass sticky top-[72px] z-40 border-b border-white/[0.04] py-3.5 px-6 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => {
              const params = new URLSearchParams();
              if (vehicle?.type) params.set('type', vehicle.type);
              if (activeMode !== 'all') params.set('mode', activeMode);
              const q = params.toString();
              router.push(q ? `/vehicles?${q}` : '/vehicles');
            }} 
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">
              Return to {vehicle?.type === 'car' ? 'Cars' : vehicle?.type === 'bike' ? 'Bikes' : 'Fleet'}
            </span>
          </button>
          <div className="text-right">
            <h1 className="font-orbitron text-lg font-bold tracking-tight text-white">{vehicle.name}</h1>
            <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">
              {activeMode === 'maintenance' ? 'Maintenance Mode' : activeMode === 'customize' ? 'Customization Mode' : 'Studio Mode'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Visual & Job Summary */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Main Vehicle Image */}
          <div className="relative aspect-video bg-black/30 rounded-2xl overflow-hidden border border-border group">
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
            <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
            <div className="absolute bottom-5 left-6 flex gap-2">
              <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-semibold text-gray-300 uppercase tracking-wider border border-white/[0.06]">
                {vehicle.type}
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? 'border-primary/60'
                      : 'border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <img src={img} alt={`${vehicle.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Mode Highlights Banner */}
          {activeMode === 'maintenance' && (
            <div className="p-4 rounded-xl bg-blue-500/[0.06] border border-blue-500/15 text-[13px] text-blue-300/80 flex items-start gap-3">
              <Wrench size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-0.5 text-sm">Periodic Maintenance Track</p>
                <p className="leading-relaxed">
                  Select the required routine maintenance items to keep your warranty and vehicle in top shape.
                </p>
              </div>
            </div>
          )}

          {activeMode === 'customize' && (
            <div className="p-4 rounded-xl bg-primary/[0.06] border border-primary/15 text-[13px] text-emerald-300/80 flex items-start gap-3">
              <Zap size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white mb-0.5 text-sm">Customization & Parts Track</p>
                <p className="leading-relaxed">
                  Select aftermarket exhausts, vinyl wraps, alloy wheels, spoilers, and performance parts for your build.
                </p>
              </div>
            </div>
          )}

          {/* Job Summary */}
          <div className="bg-surface/50 rounded-2xl p-6 border border-border">
            <h3 className="font-orbitron text-xs font-semibold uppercase tracking-wider text-primary mb-5 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Info size={14} /> Job Breakdown</span>
              <span className="text-[10px] text-gray-500 font-mono">{allChosenOptions.length} Items</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm pb-2.5 border-b border-border/50">
                <span className="text-gray-500">Base Service Fee</span>
                <span className="text-white font-medium font-orbitron text-sm">₹{vehicle.basePrice.toLocaleString()}</span>
              </div>

              {/* Maintenance Services Summary */}
              {maintenanceOptions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench size={11} /> Maintenance ({maintenanceOptions.length})
                  </p>
                  {maintenanceOptions.map((opt, i) => (
                    <div key={i} className="flex justify-between items-center text-sm pl-3 border-l-2 border-blue-500/30">
                      <span className="text-gray-400 capitalize">{opt.name}</span>
                      <span className="text-white font-medium text-sm">
                        {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Customization Options Summary */}
              {customizeOptions.length > 0 && (
                <div className="space-y-1.5 pt-1.5">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={11} /> Custom Parts ({customizeOptions.length})
                  </p>
                  {customizeOptions.map((opt, i) => (
                    <div key={i} className="flex justify-between items-center text-sm pl-3 border-l-2 border-primary/30">
                      <span className="text-gray-400 capitalize">{opt.name}</span>
                      <span className="text-white font-medium text-sm">
                        {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {allChosenOptions.length === 0 && (
                <p className="text-gray-500 text-[13px] py-2">
                  No items selected yet. Choose from the available options on the right.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Track Switcher & Options */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Track Switcher */}
          <div className="p-1 bg-surface border border-border rounded-xl flex gap-0.5">
            <button
              onClick={() => setActiveMode('maintenance')}
              className={`flex-1 py-2.5 px-3 rounded-lg font-orbitron text-[11px] font-semibold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'maintenance'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Wrench size={13} />
              Maintenance ({maintenanceOptions.length})
            </button>

            <button
              onClick={() => setActiveMode('customize')}
              className={`flex-1 py-2.5 px-3 rounded-lg font-orbitron text-[11px] font-semibold uppercase transition-all flex items-center justify-center gap-1.5 ${
                activeMode === 'customize'
                  ? 'bg-primary text-background'
                  : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <Zap size={13} />
              Customize ({customizeOptions.length})
            </button>

            <button
              onClick={() => setActiveMode('all')}
              className={`py-2.5 px-3.5 rounded-lg font-orbitron text-[11px] font-semibold uppercase transition-all ${
                activeMode === 'all'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-gray-600 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* Options Categories */}
          {displayedCategories.length === 0 ? (
            <div className="p-10 rounded-2xl bg-surface border border-dashed border-border text-center">
              <p className="text-gray-500 mb-2 text-sm">No options available under this category.</p>
              <button 
                onClick={() => setActiveMode('all')}
                className="text-[11px] text-primary font-semibold uppercase tracking-wider underline mt-1"
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
                <div key={category} className="animate-fade-in space-y-3" style={{ animationDelay: `${catIdx * 0.04}s` }}>
                  <div className="flex items-center justify-between pb-2 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${isMaintenanceCat ? 'bg-blue-500/[0.08] text-blue-400' : 'bg-primary/[0.08] text-primary'}`}>
                        {isMaintenanceCat ? <Wrench size={14} /> : <Zap size={14} />}
                      </div>
                      <div>
                        <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-tight">
                          {category}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium tracking-wide">
                          {isMaintenanceCat ? 'Routine Service' : 'Aftermarket Mod'}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isMulti ? 'bg-primary/[0.06] text-primary border border-primary/15' : 'bg-white/[0.03] text-gray-500'
                    }`}>
                      {isMulti ? `MULTI (${selectedCount})` : 'SINGLE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {options.map((opt, i) => {
                      const active = isSelected(category, opt);
                      return (
                        <button 
                          key={i}
                          onClick={() => isMulti ? handleMultiSelect(category, opt) : handleSingleSelect(category, opt)}
                          className={`group relative p-3.5 rounded-xl border transition-all duration-400 text-left flex flex-col justify-between min-h-[85px] ${
                            active 
                              ? isMaintenanceCat 
                                ? 'bg-blue-500/[0.06] border-blue-500/40 shadow-[0_0_16px_rgba(59,130,246,0.06)]'
                                : 'bg-primary/[0.06] border-primary/40 shadow-[0_0_16px_rgba(0,255,136,0.06)]' 
                              : 'bg-surface border-border hover:border-white/10 hover:bg-surface-hover hover:scale-[1.01]'
                          }`}
                        >
                          <div className="flex justify-between items-start w-full gap-2">
                            <span className={`font-medium text-sm leading-snug transition-colors ${
                              active ? (isMaintenanceCat ? 'text-blue-300' : 'text-primary') : 'text-gray-300'
                            }`}>
                              {opt.name}
                            </span>
                            {active && (
                              <div className={`rounded-full p-0.5 text-background flex-shrink-0 ${isMaintenanceCat ? 'bg-blue-400' : 'bg-primary'}`}>
                                <Check size={11} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2.5 flex items-center justify-between">
                            <span className={`text-[11px] font-orbitron font-semibold ${active ? 'text-white' : 'text-gray-500'}`}>
                              {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Included'}
                            </span>
                            {isMaintenanceCat && (
                              <span className="text-[9px] uppercase tracking-wider text-gray-600">Service</span>
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
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/[0.06] z-50">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide mb-0.5">
              {activeMode === 'maintenance' ? 'Service Estimate' : 'Build Estimate'}
            </p>
            <p className="font-orbitron text-xl font-bold text-primary transition-all duration-300">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={saveAndAddToCart} 
              disabled={saving}
              className={`magnetic-btn group px-8 md:px-10 py-3.5 font-bold uppercase tracking-wide text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                activeMode === 'maintenance'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_24px_rgba(37,99,235,0.25)]'
                  : 'bg-primary text-background shadow-[0_0_24px_rgba(0,255,136,0.2)]'
              }`}
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {activeMode === 'maintenance' 
                      ? 'Book Service' 
                      : activeMode === 'customize' 
                      ? 'Save Build' 
                      : 'Add to Cart'
                    }
                  </span>
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
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
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-orbitron text-sm tracking-wider uppercase opacity-70">Initializing Studio...</p>
      </div>
    }>
      <ConfiguratorContent />
    </Suspense>
  );
}