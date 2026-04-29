'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import API from '@/lib/api';

// ── Inner component that uses useSearchParams ──
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
    <p style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', textAlign: 'center', marginTop: '4rem' }}>
      Loading vehicles...
    </p>
  );

  return (
    <>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00ff88', marginBottom: '2rem' }}>
        Available {type === 'bike' ? 'Bikes' : 'Cars'}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {vehicles.map(v => (
          <div key={v._id}
            style={{
              background: '#1a1a1a', border: '1px solid #333',
              borderRadius: '12px', padding: '1.5rem', cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff88'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
            onClick={() => router.push(`/configurator/${v._id}`)}>

            {v.images?.[0] && (
              <img src={v.images[0]} alt={v.name}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
            )}

            <h3 style={{ color: '#00ff88', margin: '0 0 0.5rem' }}>{v.name}</h3>
            <p style={{ color: '#aaa', margin: '0 0 1rem' }}>
              Base price: ₹{v.basePrice.toLocaleString()}
            </p>

            <button
              style={{
                background: '#00ff88', color: '#111', border: 'none',
                padding: '0.6rem 1.5rem', borderRadius: '6px',
                fontWeight: 'bold', cursor: 'pointer', width: '100%'
              }}>
              Customize →
            </button>
          </div>
        ))}

        {vehicles.length === 0 && (
          <p style={{ color: '#aaa' }}>
            No vehicles found. Run <code style={{ color: '#00ff88' }}>node seed.js</code> in your server folder.
          </p>
        )}
      </div>
    </>
  );
}

// ── Outer component wraps inner in Suspense (required by Next.js) ──
export default function VehiclesPage() {
  return (
    <main style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '3rem 2rem' }}>
      <Suspense fallback={
        <p style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', textAlign: 'center', marginTop: '4rem' }}>
          Loading...
        </p>
      }>
        <VehiclesList />
      </Suspense>
    </main>
  );
}