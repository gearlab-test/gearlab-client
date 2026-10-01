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
        try {
          const res = await API.get(`/orders/${id}`);
          if (res.data && res.data._id) {
            setOrder(res.data);
            return;
          }
        } catch (e) {
          // fallback to fetching all orders
        }
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
    <main className="min-h-screen py-20 px-6 bg-background relative overflow-hidden">
      {/* Ambient background glow elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-10 relative z-10 animate-hero-reveal">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl text-primary mb-2 border border-primary/30 shadow-[0_0_30px_rgba(0,255,136,0.15)] animate-pulse-glow">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="font-orbitron text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Booking <span className="text-primary neon-glow">Confirmed</span>
          </h1>
          <p className="text-gray-500 font-semibold tracking-wider text-xs">Reference ID: <span className="text-gray-300 font-mono">{order._id.toUpperCase()}</span></p>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment Details */}
          <div className="bg-surface border border-border rounded-2xl p-7 space-y-5 card-glow">
            <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
              <Calendar className="text-primary" size={17} /> Appointment
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Scheduled Date</p>
                <p className="text-base font-bold text-white">
                  {new Date(order.bookingDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Workshop Provider</p>
                <p className="text-base font-bold text-primary uppercase">{order.workshopId?.name || 'Authorized Center'}</p>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-surface border border-border rounded-2xl p-7 space-y-5 card-glow">
            <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2.5">
              <Phone className="text-primary" size={17} /> Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-white">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-gray-400">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-white">{order.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Build Specs */}
        <div className="bg-surface border border-border rounded-2xl p-7 md:p-8 card-glow">
          <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2.5">
            <Package className="text-primary" size={17} /> Configuration Details
          </h3>
          <div className="space-y-3.5">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={item.vehicleId?.images?.[0]} className="w-full h-full object-cover" alt={item.vehicleId?.name} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase">{item.vehicleId?.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{item.vehicleId?.brand}</p>
                  </div>
                </div>
                <p className="font-orbitron text-primary font-bold">₹{item.totalPrice?.toLocaleString()}</p>
              </div>
            ))}
            <div className="pt-6 border-t border-white/[0.05] flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Investment Total</p>
                <p className="font-orbitron text-2xl md:text-3xl font-extrabold text-white">₹{order.totalPrice?.toLocaleString()}</p>
              </div>
              <span className="px-3.5 py-1.5 bg-primary/[0.08] text-primary border border-primary/20 rounded-lg text-[10px] font-semibold uppercase tracking-wider">Payment at Workshop</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button 
            onClick={() => router.push('/profile')}
            className="magnetic-btn flex-1 py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl text-white font-semibold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2"
          >
            View Dashboard <ArrowRight size={15} />
          </button>
          <button 
            onClick={() => router.push('/category')}
            className="magnetic-btn flex-1 py-4 bg-primary text-background rounded-xl font-bold uppercase tracking-wider text-xs hover:brightness-110 active:scale-[0.98] transition-all duration-400 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,255,136,0.2)]"
          >
            Start New Build <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </main>
  );
}
