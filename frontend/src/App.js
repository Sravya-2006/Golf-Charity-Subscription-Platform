import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Subscribe from './pages/Subscribe';
import Dashboard from './pages/Dashboard';
import Charities from './pages/Charities';
import Admin from './pages/Admin';
import './App.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoIcon}>⛳</span>
        <span>GolfGive</span>
      </Link>
      <div style={styles.navLinks}>
        <Link to="/charities" style={styles.link}>Charities</Link>
        {!user && <Link to="/login" style={styles.link}>Login</Link>}
        {!user && (
          <Link to="/register" style={styles.ctaLink}>Get Started</Link>
        )}
        {user && user.role !== 'admin' && (
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        )}
        {user && user.role === 'admin' && (
          <Link to="/admin" style={styles.link}>Admin Panel</Link>
        )}
        {user && (
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 6%',
    background: '#ffffff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #e8f0e8',
    boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '22px',
    fontWeight: '800',
    color: '#16a34a',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  },
  logoIcon: { fontSize: '24px' },
  navLinks: { display: 'flex', gap: '32px', alignItems: 'center' },
  link: {
    color: '#4b5563',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  ctaLink: {
    background: '#16a34a',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '15px',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #d1d5db',
    color: '#6b7280',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ backgroundColor: '#f8faf8', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;