import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.brand}>⛳ GolfGive</div>
          <h2 style={styles.tagline}>Golf with purpose.<br />Every round counts.</h2>
          <div style={styles.features}>
            {['Monthly prize draws', 'Support your favourite charity', 'Simple score tracking', 'Join 2,500+ golfers'].map((f, i) => (
              <div key={i} style={styles.feature}>
                <span style={styles.featureIcon}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to your GolfGive account</p>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p style={styles.link}>Don't have an account? <Link to="/register" style={styles.linkText}>Create one free</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  left: { flex: '1', background: '#16a34a', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  leftInner: { maxWidth: '380px' },
  brand: { fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '40px' },
  tagline: { fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '40px', letterSpacing: '-0.5px' },
  features: { display: 'flex', flexDirection: 'column', gap: '16px' },
  feature: { display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.9)', fontSize: '16px' },
  featureIcon: { width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', flexShrink: 0 },
  right: { flex: '1', background: '#f8faf8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  card: { background: '#fff', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
  title: { fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px', letterSpacing: '-0.5px' },
  subtitle: { color: '#6b7280', marginBottom: '32px', fontSize: '15px' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', color: '#374151', marginBottom: '8px', fontSize: '14px', fontWeight: '500' },
  input: { width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '14px 16px', color: '#111827', fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  link: { color: '#6b7280', textAlign: 'center', marginTop: '24px', fontSize: '14px' },
  linkText: { color: '#16a34a', textDecoration: 'none', fontWeight: '600' },
};

export default Login;