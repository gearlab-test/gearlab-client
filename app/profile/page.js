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
    <main className="min-h-screen bg-background py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group bg-surface border border-border rounded-2xl p-8 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary/[0.06] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/80 to-secondary/60 p-[2px] mb-5">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-primary">
                  <User size={40} />
                </div>
              </div>
              
              <h2 className="font-orbitron text-xl font-bold text-white mb-1.5 tracking-tight">{user.name}</h2>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-6 bg-primary/[0.06] px-3 py-1 rounded-md">Member</p>
              
              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <Mail size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium tracking-wide">Email</p>
                    <p className="text-sm text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium tracking-wide">Member Since</p>
                    <p className="text-sm text-white">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="w-full pt-6 flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-semibold text-sm hover:bg-white/[0.06] transition-all">
                  <Settings size={15} /> Edit Profile
                </button>
                <button 
                  onClick={() => { logout(); router.push('/'); }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/15 text-red-400 font-semibold text-sm hover:bg-red-500 hover:text-white transition-all"
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
              Booking <span className="text-primary">History</span>
            </h3>
            <span className="text-[11px] font-semibold text-gray-500 tracking-wide bg-surface border border-border px-3.5 py-1.5 rounded-lg">
              {orders.length} Records
            </span>
          </div>

          {loadingOrders ? (
            <div className="p-16 text-center bg-surface border border-border rounded-2xl">
              <Loader2 className="animate-spin mx-auto mb-3 text-primary" size={28} />
              <p className="text-gray-500 text-sm">Loading order history...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div key={order._id} className="group bg-surface border border-border rounded-2xl p-6 transition-all hover:border-primary/15 animate-fade-in card-glow" style={{ animationDelay: `${idx * 0.08}s` }}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                    <div className="flex items-center gap-5">
                      <div className="w-13 h-13 rounded-xl bg-primary/[0.06] flex items-center justify-center text-primary border border-primary/15">
                        <Package size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium tracking-wide mb-0.5">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <h4 className="font-orbitron text-base font-bold text-white">{order.items?.length} Item(s) Configured</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()} · {order.status.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/[0.04] pt-4 md:pt-0">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-medium tracking-wide">Total</p>
                        <p className="font-orbitron text-lg font-bold text-white">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => router.push(`/profile/orders/${order._id}`)}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] text-gray-500 hover:text-primary hover:border-primary/20 transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-surface border border-border border-dashed rounded-2xl">
              <p className="text-gray-500 mb-5">No previous bookings found in your profile.</p>
              <button 
                onClick={() => router.push('/category')}
                className="px-6 py-3 bg-primary text-background font-bold text-sm rounded-xl hover:brightness-110 transition-all"
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
