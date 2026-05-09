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
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-orbitron tracking-widest uppercase animate-pulse">Accessing Secure Vault...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: User Profile Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="relative group bg-surface border border-border rounded-[2.5rem] p-10 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 mb-6">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-primary">
                  <User size={48} />
                </div>
              </div>
              
              <h2 className="font-orbitron text-2xl font-black text-white mb-2 uppercase tracking-tight">{user.name}</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8 bg-primary/10 px-3 py-1 rounded-full">Elite Member</p>
              
              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Mail size={18} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Email Address</p>
                    <p className="text-sm text-white font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Calendar size={18} className="text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Member Since</p>
                    <p className="text-sm text-white font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="w-full pt-8 flex flex-col gap-4">
                <button className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                  <Settings size={16} /> Edit Profile
                </button>
                <button 
                  onClick={() => { logout(); router.push('/'); }}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-orbitron text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-4">
              <Package className="text-primary" size={28} />
              Booking <span className="text-primary">History</span>
            </h3>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-surface border border-border px-4 py-2 rounded-xl">
              {orders.length} TOTAL RECORDS
            </span>
          </div>

          {loadingOrders ? (
            <div className="p-20 text-center bg-surface border border-border rounded-[2.5rem]">
              <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
              <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Retrieving Archive...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div key={order._id} className="group bg-surface border border-border rounded-[2rem] p-8 transition-all hover:border-primary/20 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <h4 className="font-orbitron text-lg font-bold text-white uppercase">{order.items?.length} Item(s) Configured</h4>
                        <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()} · {order.status.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Value</p>
                        <p className="font-orbitron text-xl font-bold text-white">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      <button className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-primary hover:border-primary/50 transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center bg-surface border border-border border-dashed rounded-[2.5rem]">
              <p className="text-gray-500 mb-6">No previous bookings found in your profile.</p>
              <button 
                onClick={() => router.push('/category')}
                className="px-8 py-4 bg-primary text-background font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all"
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
