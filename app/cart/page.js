'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';

export default function CartPage() {
  const router = useRouter();
  const { user } = useStore();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [ordering, setOrdering] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Cart fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchCart();
  }, [user]);

  const handleRemove = async (configId) => {
    setRemoving(configId);
    try {
      await API.delete(`/cart/${configId}`);
      await fetchCart();
    } catch (err) {
      alert('Could not remove item: ' + (err.response?.data?.message || err.message));
    } finally {
      setRemoving(null);
    }
  };

  const handleOrder = async () => {
    if (!cart?.configurations?.length) return;
    setOrdering(true);
    try {
      await API.post('/orders', {
        items: cart.configurations.map(c => c._id),
        totalPrice: grandTotal,
      });
      alert('🎉 Order placed successfully!');
      await fetchCart();
      router.push('/');
    } catch (err) {
      alert('Order failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setOrdering(false);
    }
  };

  const grandTotal = cart?.configurations?.reduce(
    (sum, c) => sum + (c.totalPrice || 0), 0
  ) || 0;

  // ─── Loading ───
  if (loading) return (
    <main style={{ background: '#111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem' }}>
        Loading your cart...
      </p>
    </main>
  );

  // ─── Empty ───
  if (!cart?.configurations?.length) return (
    <main style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
      <div style={{ fontSize: '4rem' }}>🛒</div>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00ff88', margin: 0 }}>Your Cart is Empty</h2>
      <p style={{ color: '#aaa', margin: 0 }}>Build your dream ride and add it here.</p>
      <button
        onClick={() => router.push('/category')}
        style={{ background: '#00ff88', color: '#111', border: 'none', padding: '0.85rem 2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
        Browse Vehicles →
      </button>
    </main>
  );

  return (
    <main style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '2rem', paddingBottom: '140px' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: '1px solid #333', color: '#aaa', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', marginBottom: '1rem' }}>
          ← Back
        </button>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00ff88', margin: 0 }}>
          Your Cart
        </h1>
        <p style={{ color: '#aaa', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
          {cart.configurations.length} {cart.configurations.length === 1 ? 'build' : 'builds'} saved
        </p>
      </div>

      {/* Cart items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '720px' }}>
        {cart.configurations.map((config) => {
          const vehicle = config.vehicleId;
          const isRemoving = removing === config._id;

          return (
            <div key={config._id} style={{
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '14px',
              padding: '1.5rem',
              transition: 'border-color 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#00ff8844'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            >
              {/* Green left accent */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#00ff88', borderRadius: '4px 0 0 4px' }} />

              {/* Vehicle info */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                {vehicle?.images?.[0] && (
                  <img src={vehicle.images[0]} alt={vehicle.name}
                    style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#00ff88', margin: '0 0 0.2rem', fontFamily: 'Orbitron, sans-serif', fontSize: '1rem' }}>
                    {vehicle?.name || 'Unknown Vehicle'}
                  </h3>
                  <p style={{ color: '#aaa', margin: 0, fontSize: '0.82rem' }}>
                    {vehicle?.brand} · {vehicle?.type}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>
                    ₹{config.totalPrice?.toLocaleString()}
                  </p>
                  <p style={{ color: '#555', fontSize: '0.75rem', margin: '0.2rem 0 0' }}>total price</p>
                </div>
              </div>

              {/* Selected options */}
              {config.selectedOptions?.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ color: '#555', fontSize: '0.75rem', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Customizations
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {config.selectedOptions.map((opt, i) => (
                      <span key={i} style={{
                        background: '#00ff8815', color: '#00ff88',
                        border: '1px solid #00ff8830', borderRadius: '20px',
                        padding: '0.15rem 0.65rem', fontSize: '0.78rem'
                      }}>
                        {opt.name}
                        {opt.price > 0 && (
                          <span style={{ opacity: 0.7, marginLeft: '0.3rem' }}>
                            +₹{opt.price.toLocaleString()}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => handleRemove(config._id)}
                  disabled={isRemoving}
                  style={{
                    background: 'transparent',
                    border: '1px solid #ff444455',
                    color: isRemoving ? '#555' : '#ff4444',
                    padding: '0.4rem 1rem', borderRadius: '6px',
                    cursor: isRemoving ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem', transition: 'all 0.15s'
                  }}>
                  {isRemoving ? 'Removing...' : '✕ Remove'}
                </button>
                <button
                  onClick={() => router.push(`/configurator/${vehicle?._id}`)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #00ff8844',
                    color: '#00ff88',
                    padding: '0.4rem 1rem', borderRadius: '6px',
                    cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.15s'
                  }}>
                  ✎ Edit Build
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#151515', borderTop: '1px solid #00ff8844',
        padding: '1rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', zIndex: 100
      }}>
        <div>
          <p style={{ margin: 0, color: '#aaa', fontSize: '0.8rem' }}>Grand Total</p>
          <p style={{ margin: 0, fontSize: '1.5rem', color: '#00ff88', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            ₹{grandTotal.toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleOrder}
          disabled={ordering}
          style={{
            background: ordering ? '#555' : 'linear-gradient(135deg, #00ff88, #00cc6a)',
            color: '#111', border: 'none',
            padding: '0.9rem 2.5rem', borderRadius: '8px',
            fontWeight: 'bold', cursor: ordering ? 'not-allowed' : 'pointer',
            fontSize: '1rem', transition: 'opacity 0.2s'
          }}>
          {ordering ? 'Placing Order...' : 'Place Order →'}
        </button>
      </div>

    </main>
  );
}
