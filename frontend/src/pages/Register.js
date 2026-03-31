import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      navigate('/subscribe');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.brand}>⛳ GolfGive</div>
          <h2 style={styles.tagline}>Start making your game matter.</h2>
          <div style={styles.steps}>
            {[
              { num: '1', text: 'Create your free account' },
              { num: '2', text: 'Choose a charity to support' },
              { num: '3', text: 'Enter your scores & win prizes' },
            ].map((s, i) => (
              <div key={i} style={styles.step}>
                <div style={styles.stepNum}>{s.num}</div>
                <span style={styles.stepText}>{s.text}</span>
              </div>
            ))}
          </div>
          <div style={styles.trustBadge}>
            🔒 Secure • No spam • Cancel anytime
          </div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Join thousands of golfers making a difference</p>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} type="text" value={name}
                onChange={e => setName(e.target.value)} placeholder="Your full name" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input style={styles.input} type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>
          <p style={styles.terms}>By signing up you agree to our Terms of Service</p>
          <p style={styles.link}>Already have an account? <Link to="/login" style={styles.linkText}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  left: { flex: '1', background: '#111827', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  leftInner: { maxWidth: '380px' },
  brand: { fontSize: '24px', fontWeight: '800', color: '#4ade80', marginBottom: '40px' },
  tagline: { fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '40px', letterSpacing: '-0.5px' },
  steps: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' },
  step: { display: 'flex', alignItems: 'center', gap: '16px' },
  stepNum: { width: '32px', height: '32px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: 0 },
  stepText: { color: 'rgba(255,255,255,0.85)', fontSize: '16px' },
  trustBadge: { color: '#6b7280', fontSize: '13px' },
  right: { flex: '1', background: '#f8faf8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  card: { background: '#fff', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
  title: { fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px', letterSpacing: '-0.5px' },
  subtitle: { color: '#6b7280', marginBottom: '32px', fontSize: '15px' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', color: '#374151', marginBottom: '8px', fontSize: '14px', fontWeight: '500' },
  input: { width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '10px', padding: '14px 16px', color: '#111827', fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#16a34a', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  terms: { color: '#9ca3af', textAlign: 'center', marginTop: '16px', fontSize: '12px' },
  link: { color: '#6b7280', textAlign: 'center', marginTop: '12px', fontSize: '14px' },
  linkText: { color: '#16a34a', textDecoration: 'none', fontWeight: '600' },
};

export default Register;