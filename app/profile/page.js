'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import { User, Mail, Calendar, Package, LogOut, Loader2, ChevronRight, Settings } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, sessionLoading, logout } = useStore();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user, sessionLoading]);

  if (sessionLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-orbitron text-sm tracking-wider uppercase opacity-70">Accessing Profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-14 px-6 relative overflow-hidden">
      {/* Ambient background glow elements */}
      <div className="absolute top-20 right-10 w-96 h-96 glow-orb-primary rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 glow-orb-accent rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 animate-fade-in">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group bg-surface border border-border rounded-2xl p-8 overflow-hidden card-glow">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.08] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-[2px] mb-5 shadow-[0_0_24px_rgba(0,255,136,0.15)] group-hover:shadow-[0_0_35px_rgba(0,255,136,0.25)] transition-all duration-500">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-primary">
                  <User size={38} />
                </div>
              </div>
              
              <h2 className="font-orbitron text-xl font-bold text-white mb-1.5 tracking-tight">{user.name}</h2>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-6 bg-primary/[0.08] border border-primary/20 px-3.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,255,136,0.1)]">Member</p>
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors duration-300">
                  <Mail size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium tracking-wide">Email</p>
                    <p className="text-sm text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors duration-300">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium tracking-wide">Member Since</p>
                    <p className="text-sm text-white">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="w-full pt-6 flex flex-col gap-3">
                <button className="magnetic-btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-semibold text-sm hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300">
                  <Settings size={15} /> Edit Profile
                </button>
                <button 
                  onClick={() => { logout(); router.push('/'); }}
                  className="magnetic-btn flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.08)]"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-orbitron text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <Package className="text-primary" size={24} />
              Booking <span className="text-primary neon-glow">History</span>
            </h3>
            <span className="text-[11px] font-semibold text-gray-400 tracking-wide bg-surface border border-border px-3.5 py-1.5 rounded-lg shadow-sm">
              {orders.length} Records
            </span>
          </div>

          {loadingOrders ? (
            <div className="p-16 text-center bg-surface border border-border rounded-2xl">
              <div className="relative inline-block mb-3">
                <Loader2 className="animate-spin text-primary" size={32} />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse-glow" />
              </div>
              <p className="text-gray-500 text-sm">Loading order history...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const isCompleted = order.status?.toLowerCase() === 'completed';
                const isConfirmed = order.status?.toLowerCase() === 'confirmed';
                const isPending = order.status?.toLowerCase() === 'pending';

                return (
                  <div key={order._id} className="group bg-surface border border-border rounded-2xl p-6 transition-all duration-400 hover:border-primary/30 card-glow" style={{ animationDelay: `${idx * 0.08}s` }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                      <div className="flex items-center gap-5">
                        <div className="w-13 h-13 rounded-xl bg-primary/[0.06] flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform duration-400">
                          <Package size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-medium tracking-wide mb-0.5">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <h4 className="font-orbitron text-base font-bold text-white group-hover:text-primary transition-colors duration-300">{order.items?.length} Item(s) Configured</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className="text-gray-600">·</span>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              isCompleted || isConfirmed 
                                ? 'bg-primary/[0.08] text-primary border-primary/20' 
                                : isPending 
                                ? 'bg-amber-500/[0.08] text-amber-400 border-amber-500/20'
                                : 'bg-blue-500/[0.08] text-blue-400 border-blue-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/[0.04] pt-4 md:pt-0">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500 font-medium tracking-wide">Total</p>
                          <p className="font-orbitron text-lg font-bold text-white">₹{order.totalPrice?.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => router.push(`/profile/orders/${order._id}`)}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] text-gray-500 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center bg-surface border border-border border-dashed rounded-2xl">
              <p className="text-gray-500 mb-5">No previous bookings found in your profile.</p>
              <button 
                onClick={() => router.push('/category')}
                className="magnetic-btn px-6 py-3 bg-primary text-background font-bold text-sm uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-400 shadow-[0_0_24px_rgba(0,255,136,0.2)]"
              >
                Create Your First Build
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
