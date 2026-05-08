'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';

function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    API.get(`/vehicles?type=${type}`)
      .then(r => setVehicles(r.data))
      .catch(err => console.error('Could not fetch vehicles:', err.message))
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-primary">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Scanning Inventory...</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => router.back()}
          className="p-3 rounded-full bg-surface border border-border text-gray-400 hover:text-primary hover:border-primary/50 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-orbitron text-3xl font-bold uppercase tracking-tight text-white">
            Available <span className="text-primary">{type === 'bike' ? 'Bikes' : 'Cars'}</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">{vehicles.length} Models Found</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((v, idx) => (
          <div key={v._id}
            className="group bg-surface border border-border rounded-3xl overflow-hidden transition-all hover:border-primary/40 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="aspect-video overflow-hidden bg-black/40 relative">
              {v.images?.[0] ? (
                <img src={v.images[0]} alt={v.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700">
                  <Plus size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 bg-primary text-background text-[10px] font-black uppercase tracking-widest rounded-full">
                  Service Ready
                </span>
              </div>
            </div>

            <div className="p-8">
              <h3 className="font-orbitron text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{v.name}</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Professional maintenance and premium customization for your {v.name}.
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Base Service Fee</p>
                  <p className="font-orbitron text-lg font-bold text-white">₹{v.basePrice.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => router.push(`/configurator/${v._id}`)}
                  className="px-6 py-3 bg-white/5 hover:bg-primary hover:text-background text-white text-sm font-bold rounded-xl transition-all border border-white/10 hover:border-primary"
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="col-span-full p-20 rounded-3xl border border-dashed border-border text-center">
            <p className="text-gray-500 mb-4 text-lg">No vehicles currently available in this category.</p>
            <p className="text-sm text-gray-600">Tip: Run <code className="bg-primary/10 text-primary px-2 py-1 rounded">node seed.js</code> in your server folder to populate data.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="font-orbitron tracking-widest uppercase animate-pulse">Initializing Interface...</p>
        </div>
      }>
        <VehiclesList />
      </Suspense>
    </main>
  );
}