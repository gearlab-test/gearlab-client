'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import { ArrowLeft, Check, ChevronRight, Loader2, Info } from 'lucide-react';

const MULTI_SELECT_CATEGORIES = ['accessories', 'tyres', 'wrapping', 'services'];

export default function ConfiguratorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [vehicle, setVehicle] = useState(null);
  const [selected, setSelected] = useState({});
  const [multiSelected, setMultiSelected] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get(`/vehicles/${id}`)
      .then(r => setVehicle(r.data))
      .catch(() => alert('Could not load vehicle'));
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
      router.push('/cart');
    } catch (err) {
      alert('Error saving build: ' + (err.response?.data?.message || err.message));
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

  const categories = vehicle.availableOptions.reduce((acc, opt) => {
    if (!acc[opt.category]) acc[opt.category] = [];
    acc[opt.category].push(opt);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-background pb-32">
      {/* Top Navigation Bar */}
      <div className="glass sticky top-20 z-40 border-b border-white/5 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Return to Fleet</span>
          </button>
          <div className="text-right">
            <h1 className="font-orbitron text-xl font-bold uppercase tracking-tighter">{vehicle.name}</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Customization & Service Mode</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Visual & Summary */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="relative aspect-video bg-black/40 rounded-3xl overflow-hidden border border-border group">
            <img 
              src={vehicle.images?.[0]} 
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
            <div className="absolute bottom-6 left-8 flex gap-3">
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-widest border border-white/10">
                4K Render
              </span>
            </div>
          </div>

          <div className="bg-surface/50 rounded-3xl p-8 border border-border">
            <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
              <Info size={16} /> Job Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 uppercase tracking-wide">Base Service Fee</span>
                <span className="text-white font-medium font-orbitron">₹{vehicle.basePrice.toLocaleString()}</span>
              </div>
              {allChosenOptions.map((opt, i) => (
                <div key={i} className="flex justify-between items-center text-sm animate-fade-in">
                  <span className="text-gray-400 capitalize">{opt.name}</span>
                  <span className="text-white font-medium">
                    {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Standard'}
                  </span>
                </div>
              ))}
              {allChosenOptions.length === 0 && (
                <p className="text-gray-600 text-xs italic">Select options below to begin customizing your {vehicle.name}.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Options Selection */}
        <div className="lg:col-span-5 space-y-12">
          {Object.entries(categories).map(([category, options], catIdx) => {
            const isMulti = isMultiCategory(category);
            const selectedCount = isMulti ? (multiSelected[category] || []).length : null;

            return (
              <div key={category} className="animate-fade-in" style={{ animationDelay: `${catIdx * 0.1}s` }}>
                <div className="flex items-end justify-between mb-6">
                  <h3 className="font-orbitron text-lg font-bold text-white uppercase tracking-tight">
                    {category}
                  </h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isMulti ? 'bg-primary/10 text-primary' : 'bg-white/5 text-gray-500'}`}>
                    {isMulti ? `MULTI-SELECT (${selectedCount})` : 'SINGLE CHOICE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {options.map((opt, i) => {
                    const active = isSelected(category, opt);
                    return (
                      <button 
                        key={i}
                        onClick={() => isMulti ? handleMultiSelect(category, opt) : handleSingleSelect(category, opt)}
                        className={`group relative p-4 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[100px] ${
                          active 
                            ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(0,255,136,0.1)]' 
                            : 'bg-surface border-border hover:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className={`font-medium text-sm transition-colors ${active ? 'text-primary' : 'text-gray-400'}`}>
                            {opt.name}
                          </span>
                          {active && (
                            <div className="bg-primary text-background rounded-full p-0.5">
                              <Check size={12} strokeWidth={4} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-orbitron mt-2 ${active ? 'text-white' : 'text-gray-600'}`}>
                            {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : 'Included'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-primary/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Total Job Estimate</p>
            <p className="font-orbitron text-2xl font-black text-primary neon-glow">
              ₹{totalPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 sm:flex-none flex gap-4">
            <button 
              onClick={saveAndAddToCart} 
              disabled={saving}
              className="flex-1 sm:flex-none group px-12 py-4 bg-primary text-background font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Secure Build <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}