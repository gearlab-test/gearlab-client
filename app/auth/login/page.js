'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { setUser } = useStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      setUser(res.data.user, res.data.token);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main style={{ background: '#111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1a1a1a', padding: '2.5rem', borderRadius: '12px',
        width: '360px', border: '1px solid #333'
      }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00ff88', marginBottom: '1.5rem' }}>Login</h2>
        {error && <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</p>}
        {['email', 'password'].map(field => (
          <input key={field} type={field} placeholder={field}
            value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
            required style={{
              width: '100%', padding: '0.8rem', marginBottom: '1rem',
              background: '#111', border: '1px solid #333', color: '#fff',
              borderRadius: '6px', boxSizing: 'border-box'
            }}
          />
        ))}
        <button type="submit" style={{
          width: '100%', padding: '0.9rem', background: '#00ff88',
          color: '#111', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
        }}>Login</button>
        <p style={{ color: '#aaa', marginTop: '1rem', textAlign: 'center' }}>
          No account? <a href="/auth/register" style={{ color: '#00ff88' }}>Register</a>
        </p>
      </form>
    </main>
  );
}