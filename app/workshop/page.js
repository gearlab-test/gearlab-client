'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import { 
  Package, Clock, CheckCircle, RefreshCw, 
  Search, User as UserIcon, Loader2, AlertCircle, ExternalLink, Calendar, Phone, Mail
} from 'lucide-react';

export default function WorkshopPage() {
  const router = useRouter();
  const { user, sessionLoading } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/workshop');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user || user.role !== 'workshop') {
      router.push('/');
      return;
    }
    fetchOrders();
  }, [user, sessionLoading]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (sessionLoading || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Connecting to Core...</p>
    </div>
  );

  return (
    <main className="max-w-[1600px] mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-orbitron text-4xl font-black text-white tracking-tighter uppercase mb-2">
            Workshop <span className="text-primary">Control</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Operational Command Center</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-surface border border-border p-4 rounded-2xl flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Jobs</p>
              <p className="font-orbitron text-lg font-bold text-white">{orders.filter(o => o.status !== 'completed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-surface border border-border p-6 rounded-[2rem]">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Customer or ID..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-sm text-white focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {['all', 'pending', 'confirmed', 'completed'].map(s => (
              <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filter === s ? 'bg-primary text-background border-primary' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={fetchOrders}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-border">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer / ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Service Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Build Specs</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Value</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-8">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-orbitron text-xs font-bold text-white tracking-widest">#{order._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-200">{order.userId?.name}</p>
                            <div className="flex flex-col gap-1 mt-1">
                              <p className="text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
                                <Mail size={10} className="text-primary" /> {order.customerEmail || order.userId?.email}
                              </p>
                              {order.customerPhone && (
                                <p className="text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
                                  <Phone size={10} className="text-primary" /> {order.customerPhone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar size={16} />
                        <p className="font-orbitron text-sm font-bold">
                          {order.bookingDate ? new Date(order.bookingDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }).toUpperCase() : 'NOT SET'}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5">
                            <div className="w-10 h-10 bg-surface rounded-lg overflow-hidden">
                              <img src={item.vehicleId?.images?.[0]} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[10px] font-bold text-white uppercase">{item.vehicleId?.name}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="font-orbitron text-xl font-bold text-white">₹{order.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        order.status === 'confirmed' ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-secondary/10 text-secondary border-secondary/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'confirmed')}
                            className="px-6 py-2 bg-primary text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                          >
                            Confirm Job
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button 
                            onClick={() => updateStatus(order._id, 'completed')}
                            className="px-6 py-2 bg-secondary text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                          >
                            Mark Complete
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Archive Only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-40 text-center">
            <AlertCircle className="mx-auto mb-4 text-gray-700" size={48} />
            <p className="text-gray-500 font-orbitron text-sm font-bold uppercase tracking-widest">No matching configurations found</p>
          </div>
        )}
      </div>
    </main>
  );
}
