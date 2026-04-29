'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ background: '#111', minHeight: '100vh', color: '#fff' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center', 
        minHeight: '80vh', 
        textAlign: 'center', 
        padding: '2rem'
      }}>
        <h1 style={{ 
          fontFamily: 'Orbitron, sans-serif', 
          fontSize: '3rem', 
          color: '#00ff88' 
        }}>
          GEARLAB
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa', margin: '1rem 0 2rem' }}>
          Customize. Price. Book. All in one place.
        </p>
        
        <Link href="/category">
          <button style={{
            background: '#00ff88', 
            color: '#111', 
            padding: '1rem 2.5rem',
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1.1rem',
            fontWeight: 'bold', 
            cursor: 'pointer'
          }}>
            Start Customizing →
          </button>
        </Link>
      </section>
    </main>
  );
}