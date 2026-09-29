'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import useToast from '@/store/useToast';
import { ArrowLeft, Trash2, Edit3, ShoppingBag, Loader2, ChevronRight, Calendar, Phone, Mail } from 'lucide-react';

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
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');


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
      setWorkshops(res.data);
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
    if (!cart?.configurations?.length) return;
    if (!selectedWorkshop) return showError('Please select a workshop for your build.');
    if (!selectedDate) return showError('Please select a preferred service date.');
    if (!customerPhone) return showError('Please provide a contact phone number for the workshop.');
    
    setOrdering(true);
    try {
      const res = await API.post('/orders', {
        items: cart.configurations.map(c => c._id),
        totalPrice: grandTotal,
        workshopId: selectedWorkshop,
        bookingDate: selectedDate,
        customerEmail,
        customerPhone
      });
      fetchCartCount();
      router.push(`/order-success/${res.data._id}`);
    } catch (err) {
      showError('Order failed: ' + (err.response?.data?.message || err.message));
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
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-gray-700 mb-6 border border-border">
        <ShoppingBag size={36} />
      </div>
      <h2 className="font-orbitron text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed text-sm">
        You haven&apos;t configured any vehicles yet. Start a new build to see it here.
      </p>
      <button
        onClick={() => router.push('/category')}
        className="px-6 py-3.5 bg-primary text-background font-bold text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all"
      >
        Start Customizing
      </button>
    </main>
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-14 min-h-screen pb-36">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-surface border border-border text-gray-500 hover:text-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-orbitron text-2xl font-bold tracking-tight text-white">Your <span className="text-primary">Cart</span></h1>
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
            <div key={config._id} className="group relative bg-surface border border-border rounded-2xl p-6 transition-all hover:border-primary/15 animate-fade-in card-glow" style={{ animationDelay: `${idx * 0.08}s` }}>
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
                      <h3 className="font-orbitron text-lg font-bold text-white group-hover:text-primary transition-colors">{vehicle?.name || 'Unknown Vehicle'}</h3>
                      <p className="text-[11px] text-gray-500 font-medium tracking-wide">{vehicle?.brand} · {vehicle?.type}</p>
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
                        router.push(`/configurator/${vehicle?._id}?mode=${editMode}`);
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
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="tel" 
                placeholder="Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:border-primary/50 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
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
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-11 pr-5 text-sm text-white focus:border-primary/50 outline-none transition-all appearance-none"
            />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <h3 className="font-orbitron text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/[0.08] text-primary flex items-center justify-center text-xs font-bold">04</span>
            Authorized <span className="text-primary">Workshop</span>
          </h3>
          
          {workshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workshops.map((ws) => (
                <button
                  key={ws._id}
                  onClick={() => setSelectedWorkshop(ws._id)}
                  className={`p-5 rounded-xl border text-left transition-all ${
                    selectedWorkshop === ws._id 
                      ? 'bg-primary/[0.04] border-primary/40' 
                      : 'bg-white/[0.02] border-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <p className={`font-semibold tracking-tight transition-colors ${selectedWorkshop === ws._id ? 'text-primary' : 'text-gray-300'}`}>
                    {ws.name}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">{ws.email}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-white/[0.01] rounded-xl border border-dashed border-white/[0.04]">
              <p className="text-gray-500 text-sm">No authorized workshops available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/[0.06] z-50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide mb-0.5">Total Investment</p>
            <p className="font-orbitron text-2xl font-bold text-primary">
              ₹{grandTotal.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleOrder}
            disabled={ordering}
            className="group px-8 py-3.5 bg-primary text-background font-bold uppercase tracking-wide text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2.5"
          >
            {ordering ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Confirm Order <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
