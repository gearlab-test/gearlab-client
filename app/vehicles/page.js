'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import API from '@/lib/api';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const router = useRouter();

 useEffect(() => {
  API.get(`/vehicles?type=${type}`)
    .then(r => setVehicles(r.data))
    .catch(err => console.error('Could not fetch vehicles:', err.message));
}, [type]);

  return (
    <main style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '3rem 2rem' }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00ff88' }}>
        Available {type === 'bike' ? 'Bikes' : 'Cars'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {vehicles.map(v => (
          <div key={v._id} style={{
            background: '#1a1a1a', border: '1px solid #333',
            borderRadius: '12px', padding: '1.5rem', cursor: 'pointer'
          }} onClick={() => router.push(`/configurator/${v._id}`)}>
            {v.images?.[0] && <img src={v.images[0]} alt={v.name} style={{ width: '100%', borderRadius: '8px' }}/>}
            <h3 style={{ color: '#00ff88', marginTop: '1rem' }}>{v.name}</h3>
            <p style={{ color: '#aaa' }}>Base price: ₹{v.basePrice.toLocaleString()}</p>
            <button style={{ marginTop: '1rem', background: '#00ff88', color: '#111', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer' }}>
              Customize
            </button>
          </div>
        ))}
        {vehicles.length === 0 && <p style={{ color: '#aaa' }}>No vehicles found. Add some via the backend!</p>}
      </div>
    </main>
  );
}