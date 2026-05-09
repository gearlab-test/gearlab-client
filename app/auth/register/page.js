'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const { setUser } = useStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      setUser(res.data.user, res.data.token);
      router.push(res.data.user.role === 'workshop' ? '/workshop' : '/');
    } catch (err) {

      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main style={{ background: '#111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1a1a1a', padding: '2.5rem', borderRadius: '12px',
        width: '360px', border: '1px solid #333'
      }}>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00ff88', marginBottom: '1.5rem' }}>
          Create Account
        </h2>
        {error && <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</p>}
        
        {/* Role Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['customer', 'workshop'].map(role => (
            <button key={role} type="button" 
              onClick={() => setForm({ ...form, role })}
              style={{
                flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #333',
                background: form.role === role ? '#00ff88' : 'transparent',
                color: form.role === role ? '#111' : '#aaa',
                fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {['name', 'email', 'password'].map(field => (

          <input key={field}
            type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
            required
            style={{
              width: '100%', padding: '0.8rem', marginBottom: '1rem',
              background: '#111', border: '1px solid #333', color: '#fff',
              borderRadius: '6px', boxSizing: 'border-box'
            }}
          />
        ))}
        <button type="submit" style={{
          width: '100%', padding: '0.9rem', background: '#00ff88',
          color: '#111', border: 'none', borderRadius: '8px',
          fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem'
        }}>
          Register
        </button>
        <p style={{ color: '#aaa', marginTop: '1rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <a href="/auth/login" style={{ color: '#00ff88' }}>Login</a>
        </p>
      </form>
    </main>
  );
}