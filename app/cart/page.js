'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import useToast from '@/store/useToast';
import { ArrowLeft, Trash2, Edit3, ShoppingBag, Loader2, ChevronRight, Calendar, Phone, Mail, MapPin } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user, sessionLoading, fetchCartCount } = useStore();
  const { showError, showSuccess } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Default booking date to tomorrow
  useEffect(() => {
    if (!selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
    }
  }, []);

  // Sync customer details from authenticated user
  useEffect(() => {
    if (user) {
      if (!customerEmail && user.email) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Cart fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const res = await API.get('/auth/workshops');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setWorkshops(res.data);
        if (!selectedWorkshop) {
          setSelectedWorkshop(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch workshops:', err);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchCart();
    fetchWorkshops();
  }, [user, sessionLoading]);

  const handleRemove = async (configId) => {
    setRemoving(configId);
    try {
      await API.delete(`/cart/${configId}`);
      await fetchCart();
      fetchCartCount();
      showSuccess('Item removed from cart.');
    } catch (err) {
      showError('Could not remove item: ' + (err.response?.data?.message || err.message));
    } finally {
      setRemoving(null);
    }
  };

  const handleOrder = async () => {
    if (!cart?.configurations?.length) {
      return showError('Your cart is empty.');
    }
    if (!customerEmail || !customerEmail.includes('@')) {
      return showError('Please provide a valid email address.');
    }
    if (!customerPhone || customerPhone.trim().length < 7) {
      return showError('Please provide a valid contact phone number.');
    }
    if (!selectedDate) {
      return showError('Please select a preferred service date.');
    }

    const chosenWorkshopObj = workshops.find(w => w._id === selectedWorkshop);
    const chosenWorkshopId = selectedWorkshop || workshops[0]?._id;
    const serviceCenterName = chosenWorkshopObj?.name || 'GearLab Certified Center';

    setOrdering(true);
    try {
      const payload = {
        items: cart.configurations.map(c => c._id),
        totalPrice: grandTotal,
        workshopId: chosenWorkshopId,
        serviceCenter: serviceCenterName,
        bookingDate: selectedDate,
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim()
      };

      const res = await API.post('/orders', payload);
      fetchCartCount();
      showSuccess('Order placed successfully!');
      router.push(`/order-success/${res.data._id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.errors?.[0]?.msg || 
                       err.message || 
                       'Failed to place order.';
      showError('Order failed: ' + errorMsg);
    } finally {
      setOrdering(false);
    }
  };

  const grandTotal = cart?.configurations?.reduce(
    (sum, c) => sum + (c.totalPrice || 0), 0
  ) || 0;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="font-orbitron text-sm tracking-wider uppercase opacity-70">Syncing Inventory...</p>
    </div>
  );

  if (!cart?.configurations?.length) return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center bg-background relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-80 h-80 glow-orb-primary rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 glow-orb-secondary rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-surface/80 rounded-2xl flex items-center justify-center text-primary/60 mb-6 border border-primary/20 shadow-[0_0_30px_rgba(0,255,136,0.06)]">
          <ShoppingBag size={34} />
        </div>
        <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 max-w-sm mb-8 leading-relaxed text-sm">
          You haven&apos;t configured any vehicles yet. Start a new custom build or select maintenance to get started.
        </p>
        <button
          onClick={() => router.push('/category')}
          className="magnetic-btn px-8 py-3.5 bg-primary text-background font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 shadow-[0_0_24px_rgba(0,255,136,0.2)]"
        >
          Start Customizing
        </button>
      </div>
    </main>
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-14 min-h-screen pb-36 relative">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 right-0 w-96 h-96 glow-orb-primary rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 glow-orb-secondary rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10 relative z-10 animate-fade-in">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-surface border border-border text-gray-500 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold tracking-tight text-white">Your <span className="text-primary neon-glow">Cart</span></h1>
            <p className="text-gray-500 text-[11px] font-medium tracking-wide">{cart.configurations.length} build(s) ready</p>
          </div>
        </div>
      </div>

      {/* Cart items */}
      <div className="space-y-4">
        {cart.configurations.map((config, idx) => {
          const vehicle = config.vehicleId;
          const isRemoving = removing === config._id;

          return (
            <div key={config._id} className="group relative bg-surface border border-border rounded-2xl p-6 transition-all hover:border-primary/15 animate-fade-in card-glow" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Vehicle Image */}
                <div className="w-full md:w-44 aspect-video rounded-xl overflow-hidden bg-black/30 border border-white/[0.04] flex-shrink-0">
                  {vehicle?.images?.[0] ? (
                    <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <ShoppingBag size={22} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-orbitron text-lg font-bold text-white group-hover:text-primary transition-colors">{vehicle?.name || 'Vehicle'}</h3>
                      <p className="text-[11px] text-gray-500 font-medium tracking-wide">{vehicle?.brand || ''} {vehicle?.type ? `· ${vehicle.type}` : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-orbitron text-lg font-bold text-white">₹{config.totalPrice?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-600 font-medium tracking-wide">Build Total</p>
                    </div>
                  </div>

                  {/* Options Chips */}
                  {config.selectedOptions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {config.selectedOptions.map((opt, i) => (
                        <span key={i} className="px-2.5 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded-md text-[10px] text-gray-400 font-medium">
                          {opt.name} {opt.price > 0 && `(+₹${opt.price.toLocaleString()})`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-3 border-t border-white/[0.04]">
                    <button
                      onClick={() => handleRemove(config._id)}
                      disabled={isRemoving}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {isRemoving ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      Remove
                    </button>
                    <button
                      onClick={() => {
                        const hasCustomize = config.selectedOptions?.some(o => !['services', 'maintenance', 'inspection', 'diagnostics'].includes(o.category));
                        const editMode = hasCustomize ? 'customize' : 'maintenance';
                        router.push(`/configurator/${vehicle?._id || config.vehicleId}?mode=${editMode}`);
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
                    >
                      <Edit3 size={13} />
                      Edit Build
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Date & Workshop Selection */}
      <div className="mt-12 mb-10 space-y-6">
        <div className="bg-surface border border-border rounded-2xl p-8">
          <h3 className="font-orbitron text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/[0.08] text-primary flex items-center justify-center text-xs font-bold">02</span>
            Contact <span className="text-primary">Details</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="tel" 
                placeholder="Phone Number (e.g. 9876543210)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="email" 
                placeholder="Email Address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <h3 className="font-orbitron text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/[0.08] text-primary flex items-center justify-center text-xs font-bold">03</span>
            Service <span className="text-primary">Date</span>
          </h3>
          <div className="relative max-w-xs">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:border-primary/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <h3 className="font-orbitron text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/[0.08] text-primary flex items-center justify-center text-xs font-bold">04</span>
            Authorized <span className="text-primary">Workshop</span>
          </h3>
          
          {workshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {workshops.map((ws) => (
                <button
                  key={ws._id}
                  type="button"
                  onClick={() => setSelectedWorkshop(ws._id)}
                  className={`p-5 rounded-xl border text-left transition-all duration-300 group ${
                    selectedWorkshop === ws._id 
                      ? 'bg-primary/[0.06] border-primary/50 shadow-[0_0_20px_rgba(0,255,136,0.08)] scale-[1.01]' 
                      : 'bg-white/[0.02] border-white/[0.05] hover:border-white/15 hover:bg-white/[0.04]'
                  }`}
                >
                  <p className={`font-semibold tracking-tight transition-colors duration-300 ${selectedWorkshop === ws._id ? 'text-primary' : 'text-gray-300 group-hover:text-white'}`}>
                    {ws.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">{ws.email}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-white/[0.01] rounded-xl border border-dashed border-white/[0.06]">
              <MapPin size={24} className="text-primary/40 mx-auto mb-2" />
              <p className="text-gray-400 text-sm font-medium">GearLab Central Certified Workshop</p>
              <p className="text-gray-600 text-xs mt-1">Default workshop will be assigned automatically for your booking.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/[0.06] z-50">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide mb-0.5">Total Investment</p>
            <p className="font-orbitron text-2xl font-bold text-primary transition-all duration-300">
              ₹{grandTotal.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleOrder}
            disabled={ordering}
            className="magnetic-btn group px-8 py-3.5 bg-primary text-background font-bold uppercase tracking-wide text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center gap-2.5 shadow-[0_0_24px_rgba(0,255,136,0.2)]"
          >
            {ordering ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Confirm Order <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
