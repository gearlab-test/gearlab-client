'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import { 
  CheckCircle2, Calendar, MapPin, Package, 
  ArrowRight, Mail, Phone, ShoppingBag, Loader2 
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get('/orders');
        const found = res.data.find(o => o._id === id);
        setOrder(found);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Confirming Reservation...</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-background">
      <p>Order not found.</p>
      <button onClick={() => router.push('/')} className="mt-4 text-primary">Return Home</button>
    </div>
  );

  return (
    <main className="min-h-screen py-20 px-6 bg-background">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full text-primary mb-4 border border-primary/20">
            <CheckCircle2 size={40} className="animate-bounce" />
          </div>
          <h1 className="font-orbitron text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Booking <span className="text-primary">Confirmed</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Reference ID: {order._id.toUpperCase()}</p>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Details */}
          <div className="bg-surface border border-border rounded-[2rem] p-8 space-y-6">
            <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3">
              <Calendar className="text-primary" size={18} /> Appointment
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Scheduled Date</p>
                <p className="text-lg font-bold text-white">
                  {new Date(order.bookingDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Workshop Provider</p>
                <p className="text-lg font-bold text-primary uppercase">{order.workshopId?.name || 'Authorized Center'}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-surface border border-border rounded-[2rem] p-8 space-y-6">
            <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3">
              <Phone className="text-primary" size={18} /> Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold text-white">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold text-white">{order.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Build Specs */}
        <div className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-10">
          <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider mb-8 flex items-center gap-3">
            <Package className="text-primary" size={18} /> Configuration Details
          </h3>
          <div className="space-y-4">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface rounded-xl overflow-hidden border border-white/10">
                    <img src={item.vehicleId?.images?.[0]} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase">{item.vehicleId?.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.vehicleId?.brand}</p>
                  </div>
                </div>
                <p className="font-orbitron text-primary font-bold">₹{item.totalPrice?.toLocaleString()}</p>
              </div>
            ))}
            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Investment Total</p>
                <p className="font-orbitron text-3xl font-black text-white uppercase">₹{order.totalPrice?.toLocaleString()}</p>
              </div>
              <span className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest">Payment at Workshop</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            onClick={() => router.push('/profile')}
            className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
          >
            View Dashboard <ArrowRight size={14} />
          </button>
          <button 
            onClick={() => router.push('/category')}
            className="flex-1 py-5 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.2)]"
          >
            Start New Build <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}
