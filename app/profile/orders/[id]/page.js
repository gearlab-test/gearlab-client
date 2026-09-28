'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import { 
  ArrowLeft, Package, Calendar, Phone, Mail, MapPin, 
  Loader2, CheckCircle2, Clock, CircleDot, ChevronRight 
} from 'lucide-react';

const STATUS_STEPS = ['pending', 'confirmed', 'completed'];

function StatusTimeline({ currentStatus }) {
  const currentIdx = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-0 w-full">
      {STATUS_STEPS.map((step, i) => {
        const isComplete = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                isComplete
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-border text-gray-600'
              } ${isCurrent ? 'shadow-[0_0_15px_rgba(0,255,136,0.3)] scale-110' : ''}`}>
                {isComplete ? <CheckCircle2 size={20} /> : <CircleDot size={20} />}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                isComplete ? 'text-primary' : 'text-gray-600'
              }`}>{step}</span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                i < currentIdx ? 'bg-primary' : 'bg-border'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, sessionLoading } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await API.get('/orders');
        const found = res.data.find(o => o._id === id);
        setOrder(found);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, user, sessionLoading]);

  if (loading || sessionLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Loading Order Details...</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-background">
      <p className="text-gray-500 mb-4">Order not found.</p>
      <button onClick={() => router.push('/profile')} className="text-primary font-bold text-sm hover:underline">
        Return to Profile
      </button>
    </div>
  );

  return (
    <main className="min-h-screen py-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/profile')}
            className="p-3 rounded-full bg-surface border border-border text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white uppercase tracking-tight">
              Order <span className="text-primary">Details</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              REF: #{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-surface border border-border rounded-[2.5rem] p-10">
          <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider mb-8 flex items-center gap-3">
            <Clock className="text-primary" size={18} /> Order Status
          </h3>
          <StatusTimeline currentStatus={order.status} />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appointment */}
          <div className="bg-surface border border-border rounded-[2rem] p-8 space-y-6">
            <h3 className="font-orbitron text-sm font-bold text-white uppercase tracking-wider flex items-center gap-3">
              <Calendar className="text-primary" size={18} /> Appointment
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Scheduled Date</p>
                <p className="text-lg font-bold text-white">
                  {order.bookingDate
                    ? new Date(order.bookingDate).toLocaleDateString('en-IN', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                      })
                    : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Workshop Provider</p>
                <p className="text-lg font-bold text-primary uppercase">{order.workshopId?.name || 'Authorized Center'}</p>
              </div>
            </div>
          </div>

          {/* Contact */}
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
                  <p className="text-sm font-bold text-white">{order.customerEmail || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold text-white">{order.customerPhone || '—'}</p>
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
              <div key={i} className="bg-black/20 rounded-2xl border border-white/5 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-surface rounded-xl overflow-hidden border border-white/10">
                      <img src={item.vehicleId?.images?.[0]} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-white uppercase">{item.vehicleId?.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.vehicleId?.type}</p>
                    </div>
                  </div>
                  <p className="font-orbitron text-lg text-primary font-bold">₹{item.totalPrice?.toLocaleString()}</p>
                </div>

                {/* Selected options */}
                {item.selectedOptions?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {item.selectedOptions.map((opt, j) => (
                      <span key={j} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-gray-400 font-medium tracking-wide">
                        {opt.name} {opt.price > 0 && `(+₹${opt.price.toLocaleString()})`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total Investment</p>
                <p className="font-orbitron text-3xl font-black text-white">₹{order.totalPrice?.toLocaleString()}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                order.status === 'confirmed' ? 'bg-primary/10 text-primary border-primary/20' :
                'bg-secondary/10 text-secondary border-secondary/20'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button 
            onClick={() => router.push('/profile')}
            className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
          >
            Back to Profile <ArrowLeft size={14} />
          </button>
          <button 
            onClick={() => router.push('/category')}
            className="flex-1 py-5 bg-primary text-background rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.2)]"
          >
            Start New Build <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </main>
  );
}
