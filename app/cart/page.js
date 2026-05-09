'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import { ArrowLeft, Trash2, Edit3, ShoppingBag, Loader2, ChevronRight } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { user, sessionLoading } = useStore();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [ordering, setOrdering] = useState(false);

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

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchCart();
  }, [user, sessionLoading]);


  const handleRemove = async (configId) => {
    setRemoving(configId);
    try {
      await API.delete(`/cart/${configId}`);
      await fetchCart();
    } catch (err) {
      alert('Could not remove item: ' + (err.response?.data?.message || err.message));
    } finally {
      setRemoving(null);
    }
  };

  const handleOrder = async () => {
    if (!cart?.configurations?.length) return;
    setOrdering(true);
    try {
      await API.post('/orders', {
        items: cart.configurations.map(c => c._id),
        totalPrice: grandTotal,
      });
      alert('🎉 Order placed successfully!');
      await fetchCart();
      router.push('/');
    } catch (err) {
      alert('Order failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setOrdering(false);
    }
  };

  const grandTotal = cart?.configurations?.reduce(
    (sum, c) => sum + (c.totalPrice || 0), 0
  ) || 0;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Syncing Inventory...</p>
    </div>
  );

  if (!cart?.configurations?.length) return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-background">
      <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-gray-700 mb-8 border border-border">
        <ShoppingBag size={40} />
      </div>
      <h2 className="font-orbitron text-3xl font-bold text-white mb-3">YOUR HANGAR IS EMPTY</h2>
      <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
        You haven't configured any vehicles yet. Start a new build to see it here.
      </p>
      <button
        onClick={() => router.push('/category')}
        className="px-8 py-4 bg-primary text-background font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all"
      >
        Start Customizing
      </button>
    </main>
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 min-h-screen pb-40">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-full bg-surface border border-border text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-orbitron text-3xl font-bold uppercase tracking-tight text-white">Your <span className="text-primary">Cart</span></h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{cart.configurations.length} BUILD(S) READY</p>
          </div>
        </div>
      </div>

      {/* Cart items */}
      <div className="space-y-6">
        {cart.configurations.map((config, idx) => {
          const vehicle = config.vehicleId;
          const isRemoving = removing === config._id;

          return (
            <div key={config._id} className="group relative bg-surface border border-border rounded-3xl p-8 transition-all hover:border-primary/20 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Vehicle Image */}
                <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex-shrink-0">
                  {vehicle?.images?.[0] ? (
                    <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-orbitron text-xl font-bold text-white group-hover:text-primary transition-colors">{vehicle?.name || 'Unknown Vehicle'}</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{vehicle?.brand} · {vehicle?.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-orbitron text-xl font-bold text-white">₹{config.totalPrice?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Build Total</p>
                    </div>
                  </div>

                  {/* Options Chips */}
                  {config.selectedOptions?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {config.selectedOptions.map((opt, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 font-medium tracking-wide">
                          {opt.name} {opt.price > 0 && `(+₹${opt.price.toLocaleString()})`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleRemove(config._id)}
                      disabled={isRemoving}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {isRemoving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Remove
                    </button>
                    <button
                      onClick={() => router.push(`/configurator/${vehicle?._id}`)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit3 size={14} />
                      Edit Build
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-primary/20 z-50">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Final Investment</p>
            <p className="font-orbitron text-3xl font-black text-primary neon-glow">
              ₹{grandTotal.toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleOrder}
            disabled={ordering}
            className="group px-12 py-4 bg-primary text-background font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
          >
            {ordering ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Confirm Order <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
