'use client';
import { useRouter } from 'next/navigation';

export default function CategoryPage() {
  const router = useRouter();

  return (
    <main style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '4rem 2rem' }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', textAlign: 'center', color: '#00ff88' }}>
        Choose Your Vehicle
      </h2>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem' }}>
        {['bike', 'car'].map(type => (
          <button key={type} onClick={() => router.push(`/vehicles?type=${type}`)}
            style={{
              width: '200px', height: '200px', background: '#1a1a1a',
              border: '2px solid #00ff88', borderRadius: '12px', color: '#00ff88',
              fontSize: '1.5rem', fontFamily: 'Orbitron, sans-serif',
              textTransform: 'uppercase', cursor: 'pointer'
            }}>
            {type === 'bike' ? '🏍️' : '🚗'}
            <br/>{type}
          </button>
        ))}
      </div>
    </main>
  );
}