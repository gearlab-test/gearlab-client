'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';

// ─── ADD OR REMOVE CATEGORY NAMES HERE TO CONTROL MULTI-SELECT ───
const MULTI_SELECT_CATEGORIES = ['accessories', 'tyres', 'wrapping'];
// ─────────────────────────────────────────────────────────────────

export default function ConfiguratorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useStore();
  const [vehicle, setVehicle] = useState(null);
  const [selected, setSelected] = useState({});
  const [multiSelected, setMultiSelected] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get(`/vehicles/${id}`)
      .then(r => setVehicle(r.data))
      .catch(() => alert('Could not load vehicle'));
  }, [id]);

  const handleSingleSelect = (category, option) => {
    setSelected(prev => ({
      ...prev,
      [category]: prev[category]?.name === option.name ? null : option
    }));
  };

  const handleMultiSelect = (category, option) => {
    setMultiSelected(prev => {
      const current = prev[category] || [];
      const exists = current.find(o => o.name === option.name);
      return {
        ...prev,
        [category]: exists
          ? current.filter(o => o.name !== option.name)
          : [...current, option]
      };
    });
  };

  const isMultiCategory = (cat) => MULTI_SELECT_CATEGORIES.includes(cat);

  const isSelected = (category, option) => {
    if (isMultiCategory(category)) {
      return !!(multiSelected[category] || []).find(o => o.name === option.name);
    }
    return selected[category]?.name === option.name;
  };

  const totalPrice = vehicle ? (
    vehicle.basePrice
    + Object.values(selected).reduce((sum, opt) => sum + (opt?.price || 0), 0)
    + Object.values(multiSelected).flat().reduce((sum, opt) => sum + (opt?.price || 0), 0)
  ) : 0;

  const allChosenOptions = [
    ...Object.values(selected).filter(Boolean),
    ...Object.values(multiSelected).flat(),
  ];

  const saveAndAddToCart = async () => {
    if (!user) return router.push('/auth/login');
    setSaving(true);
    try {
      const config = await API.post('/config', {
        vehicleId: id,
        selectedOptions: allChosenOptions,
        totalPrice
      });
      await API.post('/cart', { configId: config.data._id });
      router.push('/cart');
    } catch (err) {
      alert('Error saving build: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (!vehicle) return (
    <main style={{ background: '#111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#00ff88', fontFamily: 'Orbitron, sans-serif' }}>Loading...</p>
    </main>
  );

  const categories = vehicle.availableOptions.reduce((acc, opt) => {
    if (!acc[opt.category]) acc[opt.category] = [];
    acc[opt.category].push(opt);
    return acc;
  }, {});

  return (
    <main style={{ background: '#111', minHeight: '100vh', color: '#fff', padding: '2rem', paddingBottom: '120px' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => router.back()}
          style={{ background: 'none', border: '1px solid #333', color: '#aaa', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', marginBottom: '1rem' }}>
          ← Back
        </button>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', color: '#00ff88', margin: 0 }}>
          Customize: {vehicle.name}
        </h2>
        <p style={{ color: '#aaa', margin: '0.3rem 0 0' }}>
          Base price: ₹{vehicle.basePrice.toLocaleString()}
        </p>
      </div>

      {/* Vehicle image */}
      {vehicle.images?.[0] && (
        <img src={vehicle.images[0]} alt={vehicle.name}
          style={{ width: '100%', maxWidth: '520px', borderRadius: '12px', marginBottom: '2rem', display: 'block' }} />
      )}

      {/* Option categories */}
      {Object.entries(categories).map(([category, options]) => {
        const isMulti = isMultiCategory(category);
        const selectedCount = isMulti ? (multiSelected[category] || []).length : null;

        return (
          <div key={category} style={{ marginBottom: '2rem' }}>

            {/* Category label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <h3 style={{ color: '#fff', textTransform: 'capitalize', margin: 0, fontSize: '1rem' }}>
                {category}
              </h3>
              {isMulti ? (
                <span style={{
                  background: '#00ff8822', color: '#00ff88',
                  border: '1px solid #00ff8855', borderRadius: '20px',
                  padding: '0.15rem 0.6rem', fontSize: '0.72rem'
                }}>
                  pick any {selectedCount > 0 ? `· ${selectedCount} selected` : ''}
                </span>
              ) : (
                <span style={{
                  background: '#ffffff11', color: '#aaa',
                  border: '1px solid #333', borderRadius: '20px',
                  padding: '0.15rem 0.6rem', fontSize: '0.72rem'
                }}>
                  pick one
                </span>
              )}
            </div>

            {/* Option buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {options.map((opt, i) => {
                const active = isSelected(category, opt);
                return (
                  <button key={i}
                    onClick={() => isMulti
                      ? handleMultiSelect(category, opt)
                      : handleSingleSelect(category, opt)
                    }
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: active ? '#00ff88' : '#1a1a1a',
                      color: active ? '#111' : '#fff',
                      border: active ? '2px solid #00ff88' : '1px solid #444',
                      fontWeight: active ? 'bold' : 'normal',
                      transition: 'all 0.15s',
                      fontSize: '0.9rem',
                    }}>
                    {isMulti && (
                      <span style={{ marginRight: '0.4rem', fontSize: '0.8rem' }}>
                        {active ? '✓' : '○'}
                      </span>
                    )}
                    {opt.name}
                    {opt.price > 0 && (
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
                        +₹{opt.price.toLocaleString()}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Selections summary */}
      {allChosenOptions.length > 0 && (
        <div style={{
          background: '#1a1a1a', border: '1px solid #333',
          borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1rem'
        }}>
          <p style={{ color: '#aaa', margin: '0 0 0.5rem', fontSize: '0.85rem' }}>
            Your selections:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {allChosenOptions.map((opt, i) => (
              <span key={i} style={{
                background: '#00ff8822', color: '#00ff88',
                border: '1px solid #00ff8844', borderRadius: '20px',
                padding: '0.2rem 0.75rem', fontSize: '0.8rem'
              }}>
                {opt.name} {opt.price > 0 ? `+₹${opt.price.toLocaleString()}` : '(free)'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sticky bottom bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#151515', borderTop: '1px solid #00ff8844',
        padding: '1rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        zIndex: 100
      }}>
        <div>
          <p style={{ margin: 0, color: '#aaa', fontSize: '0.8rem' }}>Total price</p>
          <p style={{ margin: 0, fontSize: '1.4rem', color: '#00ff88', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold' }}>
            ₹{totalPrice.toLocaleString()}
          </p>
        </div>
        <button onClick={saveAndAddToCart} disabled={saving} style={{
          background: saving ? '#555' : '#00ff88',
          color: '#111', border: 'none',
          padding: '0.85rem 2.2rem', borderRadius: '8px',
          fontWeight: 'bold',
          cursor: saving ? 'not-allowed' : 'pointer',
          fontSize: '1rem'
        }}>
          {saving ? 'Saving...' : 'Add to Cart →'}
        </button>
      </div>

    </main>
  );
}