import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Subscribe = () => {
  const [plan, setPlan] = useState('monthly');
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [contribution, setContribution] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/charities').then(res => setCharities(res.data));
  }, []);

  const handleSubscribe = async () => {
    if (!selectedCharity) return setError('Please select a charity to support');
    setLoading(true);
    setError('');
    try {
      await API.post('/subscriptions', {
        plan,
        charityId: selectedCharity,
        contributionPercentage: contribution,
      });
      const { data } = await API.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed');
    }
    setLoading(false);
  };

  const amount = plan === 'monthly' ? 999 : 9999;
  const charityAmount = Math.round(amount * contribution / 100);
  const prizeAmount = amount - charityAmount;

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.header}>
          <p style={styles.tag}>Simple & Transparent</p>
          <h1 style={styles.title}>Choose your plan</h1>
          <p style={styles.subtitle}>Every subscription enters you into monthly draws and supports a charity you love</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Plan Selection */}
        <div style={styles.planGrid}>
          <div style={{ ...styles.planCard, ...(plan === 'monthly' ? styles.planActive : {}) }}
            onClick={() => setPlan('monthly')}>
            {plan === 'monthly' && <div style={styles.selectedBadge}>✓ Selected</div>}
            <div style={styles.planName}>Monthly</div>
            <div style={styles.planPrice}>₹999</div>
            <div style={styles.planPer}>per month</div>
            <div style={styles.planDesc}>Flexible, cancel anytime</div>
            <ul style={styles.planFeatures}>
              {['Monthly draw entry', 'Score tracking', 'Charity contribution', 'Winner certificate'].map((f, i) => (
                <li key={i} style={styles.planFeature}>✓ {f}</li>
              ))}
            </ul>
          </div>

          <div style={{ ...styles.planCard, ...(plan === 'yearly' ? styles.planActive : {}), position: 'relative' }}
            onClick={() => setPlan('yearly')}>
            <div style={styles.saveBadge}>Save 17%</div>
            {plan === 'yearly' && <div style={styles.selectedBadge}>✓ Selected</div>}
            <div style={styles.planName}>Yearly</div>
            <div style={styles.planPrice}>₹9,999</div>
            <div style={styles.planPer}>per year</div>
            <div style={styles.planDesc}>Best value for committed players</div>
            <ul style={styles.planFeatures}>
              {['12 draw entries', 'Score tracking', 'Charity contribution', 'Priority support', 'Annual report'].map((f, i) => (
                <li key={i} style={styles.planFeature}>✓ {f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Charity + Contribution */}
        <div style={styles.configCard}>
          <h3 style={styles.configTitle}>Customise your impact</h3>

          <div style={styles.field}>
            <label style={styles.label}>Choose a charity to support</label>
            <select style={styles.select} value={selectedCharity}
              onChange={e => setSelectedCharity(e.target.value)}>
              <option value="">-- Select a charity --</option>
              {charities.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Your charity contribution: <strong style={{ color: '#16a34a' }}>{contribution}%</strong>
            </label>
            <input type="range" min="10" max="50" value={contribution}
              onChange={e => setContribution(Number(e.target.value))}
              style={styles.slider} />
            <div style={styles.sliderLabels}>
              <span>10% (minimum)</span>
              <span>50% (maximum)</span>
            </div>
          </div>

          <div style={styles.breakdown}>
            <div style={styles.breakdownRow}>
              <div style={styles.breakdownItem}>
                <div style={styles.breakdownIcon}>💚</div>
                <div>
                  <div style={styles.breakdownLabel}>Charity receives</div>
                  <div style={styles.breakdownValue}>₹{charityAmount.toLocaleString()}</div>
                </div>
              </div>
              <div style={styles.breakdownDivider}></div>
              <div style={styles.breakdownItem}>
                <div style={styles.breakdownIcon}>🏆</div>
                <div>
                  <div style={styles.breakdownLabel}>Prize pool contribution</div>
                  <div style={styles.breakdownValue}>₹{prizeAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button style={styles.btn} onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Processing...' : `Subscribe for ₹${amount.toLocaleString()}/${plan === 'monthly' ? 'month' : 'year'} →`}
        </button>
        <p style={styles.note}>🔒 Secure payment • Cancel anytime • 100% transparent</p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f8faf8', fontFamily: "'Inter', sans-serif", padding: '60px 20px' },
  inner: { maxWidth: '800px', margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: '48px' },
  tag: { color: '#16a34a', fontWeight: '600', fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' },
  title: { fontSize: '40px', fontWeight: '900', color: '#111827', marginBottom: '12px', letterSpacing: '-1px' },
  subtitle: { color: '#6b7280', fontSize: '17px', lineHeight: '1.6' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' },
  planGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' },
  planCard: { background: '#fff', border: '2px solid #e5e7eb', borderRadius: '16px', padding: '32px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease' },
  planActive: { border: '2px solid #16a34a', background: '#f0fdf4' },
  selectedBadge: { position: 'absolute', top: '16px', right: '16px', background: '#16a34a', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  saveBadge: { position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: '#fff', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  planName: { color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  planPrice: { fontSize: '42px', fontWeight: '900', color: '#111827', letterSpacing: '-1px' },
  planPer: { color: '#9ca3af', fontSize: '14px', marginBottom: '8px' },
  planDesc: { color: '#6b7280', fontSize: '14px', marginBottom: '20px' },
  planFeatures: { listStyle: 'none', padding: 0 },
  planFeature: { color: '#374151', fontSize: '14px', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' },
  configCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '32px', marginBottom: '24px' },
  configTitle: { fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px' },
  field: { marginBottom: '24px' },
  label: { display: 'block', color: '#374151', marginBottom: '10px', fontSize: '14px', fontWeight: '500' },
  select: { width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '14px 16px', color: '#111827', fontSize: '15px', boxSizing: 'border-box' },
  slider: { width: '100%', accentColor: '#16a34a', marginBottom: '8px' },
  sliderLabels: { display: 'flex', justifyContent: 'space-between', color: '#9ca3af', fontSize: '12px' },
  breakdown: { background: '#f8faf8', borderRadius: '12px', padding: '20px' },
  breakdownRow: { display: 'flex', alignItems: 'center', gap: '20px' },
  breakdownItem: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px' },
  breakdownIcon: { fontSize: '28px' },
  breakdownLabel: { color: '#6b7280', fontSize: '13px', marginBottom: '4px' },
  breakdownValue: { color: '#111827', fontSize: '22px', fontWeight: '800' },
  breakdownDivider: { width: '1px', height: '48px', background: '#e5e7eb' },
  btn: { width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer' },
  note: { textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '16px' },
};

export default Subscribe;