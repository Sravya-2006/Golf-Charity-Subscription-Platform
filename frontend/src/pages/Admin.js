import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [draws, setDraws] = useState([]);
  const [charities, setCharities] = useState([]);
  const [winners, setWinners] = useState([]);
  const [message, setMessage] = useState('');
  const [newCharity, setNewCharity] = useState({ name: '', description: '', website: '', featured: false });
  const [newDraw, setNewDraw] = useState({ month: '', year: new Date().getFullYear(), drawType: 'random' });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchAll();
  // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    try {
      const [s, u, d, c, w] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/draws/admin/all'),
        API.get('/charities'),
        API.get('/admin/winners'),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setDraws(d.data);
      setCharities(c.data);
      setWinners(w.data);
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const createCharity = async () => {
    try {
      await API.post('/charities', newCharity);
      showMessage('Charity created!');
      setNewCharity({ name: '', description: '', website: '', featured: false });
      fetchAll();
    } catch (err) { showMessage('Error creating charity'); }
  };

  const deleteCharity = async (id) => {
    await API.delete(`/charities/${id}`);
    showMessage('Charity removed');
    fetchAll();
  };

  const createDraw = async () => {
    try {
      await API.post('/draws', newDraw);
      showMessage('Draw created!');
      fetchAll();
    } catch (err) { showMessage(err.response?.data?.message || 'Error creating draw'); }
  };

  const simulateDraw = async (id) => {
    try {
      await API.post(`/draws/${id}/simulate`);
      showMessage('Draw simulated!');
      fetchAll();
    } catch (err) { showMessage('Error simulating draw'); }
  };

  const publishDraw = async (id) => {
    try {
      await API.put(`/draws/${id}/publish`);
      showMessage('Draw published!');
      fetchAll();
    } catch (err) { showMessage('Error publishing draw'); }
  };

  const verifyWinner = async (drawId, winnerId) => {
    try {
      await API.put(`/admin/winners/${drawId}/${winnerId}/verify`);
      showMessage('Winner verified and paid!');
      fetchAll();
    } catch (err) { showMessage('Error verifying winner'); }
  };

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>⛳ Admin</div>
        <nav>
          {[
            { id: 'stats', label: '📊 Dashboard' },
            { id: 'users', label: '👥 Users' },
            { id: 'draws', label: '🎯 Draws' },
            { id: 'charities', label: '💚 Charities' },
            { id: 'winners', label: '🏆 Winners' },
          ].map(tab => (
            <button key={tab.id} style={{ ...styles.navItem, ...(activeTab === tab.id ? styles.navActive : {}) }}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>🚪 Logout</button>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {message && <div style={styles.message}>{message}</div>}

        {/* Stats */}
        {activeTab === 'stats' && (
          <div>
            <h2 style={styles.pageTitle}>Dashboard Overview</h2>
            <div style={styles.statsGrid}>
              {[
                { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥' },
                { label: 'Active Subscribers', value: stats.activeSubscribers || 0, icon: '✅' },
                { label: 'Total Charities', value: stats.totalCharities || 0, icon: '💚' },
                { label: 'Total Draws', value: stats.totalDraws || 0, icon: '🎯' },
                { label: 'Prize Pool', value: `₹${(stats.totalPrizePool || 0).toLocaleString()}`, icon: '🏆' },
                { label: 'Charity Donations', value: `₹${(stats.totalCharityContributions || 0).toLocaleString()}`, icon: '💰' },
                { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: '📈' },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div>
            <h2 style={styles.pageTitle}>User Management ({users.length})</h2>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Name', 'Email', 'Plan', 'Status', 'Scores', 'Winnings'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={styles.tr}>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.subscription?.plan || 'None'}</td>
                      <td style={styles.td}>
                        <span style={{ color: u.subscription?.status === 'active' ? '#22c55e' : '#ef4444' }}>
                          {u.subscription?.status || 'inactive'}
                        </span>
                      </td>
                      <td style={styles.td}>{u.scores?.length || 0}</td>
                      <td style={styles.td}>₹{u.totalWinnings || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Draws */}
        {activeTab === 'draws' && (
          <div>
            <h2 style={styles.pageTitle}>Draw Management</h2>
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Create New Draw</h3>
              <div style={styles.formRow}>
                <select style={styles.input} value={newDraw.month} onChange={e => setNewDraw({ ...newDraw, month: e.target.value })}>
                  <option value="">Select Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input style={styles.input} type="number" value={newDraw.year}
                  onChange={e => setNewDraw({ ...newDraw, year: Number(e.target.value) })} placeholder="Year" />
                <select style={styles.input} value={newDraw.drawType} onChange={e => setNewDraw({ ...newDraw, drawType: e.target.value })}>
                  <option value="random">Random Draw</option>
                  <option value="algorithmic">Algorithmic Draw</option>
                </select>
                <button style={styles.btn} onClick={createDraw}>Create Draw</button>
              </div>
            </div>
            {draws.map(draw => (
              <div key={draw._id} style={styles.drawCard}>
                <div style={styles.drawHeader}>
                  <h3 style={{ color: '#fff' }}>{draw.month} {draw.year}</h3>
                  <span style={{ ...styles.statusBadge, background: draw.status === 'published' ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)', color: draw.status === 'published' ? '#22c55e' : '#f59e0b' }}>
                    {draw.status}
                  </span>
                </div>
                {draw.winningNumbers?.length > 0 && (
                  <div style={styles.numbersRow}>
                    {draw.winningNumbers.map((n, i) => <div key={i} style={styles.numBall}>{n}</div>)}
                  </div>
                )}
                <div style={styles.drawActions}>
                  {draw.status === 'pending' && <button style={styles.actionBtn} onClick={() => simulateDraw(draw._id)}>🎲 Simulate</button>}
                  {draw.status === 'simulated' && <button style={{ ...styles.actionBtn, background: 'rgba(34,197,94,0.2)', color: '#22c55e' }} onClick={() => publishDraw(draw._id)}>📢 Publish</button>}
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>{draw.winners?.length || 0} winners</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charities */}
        {activeTab === 'charities' && (
          <div>
            <h2 style={styles.pageTitle}>Charity Management</h2>
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Add New Charity</h3>
              <input style={{ ...styles.input, width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}
                placeholder="Charity Name" value={newCharity.name} onChange={e => setNewCharity({ ...newCharity, name: e.target.value })} />
              <textarea style={{ ...styles.input, width: '100%', marginBottom: '12px', boxSizing: 'border-box', minHeight: '80px' }}
                placeholder="Description" value={newCharity.description} onChange={e => setNewCharity({ ...newCharity, description: e.target.value })} />
              <input style={{ ...styles.input, width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}
                placeholder="Website URL" value={newCharity.website} onChange={e => setNewCharity({ ...newCharity, website: e.target.value })} />
              <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <input type="checkbox" checked={newCharity.featured} onChange={e => setNewCharity({ ...newCharity, featured: e.target.checked })} />
                Featured Charity
              </label>
              <button style={styles.btn} onClick={createCharity}>Add Charity</button>
            </div>
            <div style={styles.charitiesList}>
              {charities.map(c => (
                <div key={c._id} style={styles.charityItem}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: '700' }}>{c.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>{c.description?.substring(0, 80)}...</div>
                  </div>
                  <button style={styles.deleteBtn} onClick={() => deleteCharity(c._id)}>🗑️ Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winners */}
        {activeTab === 'winners' && (
          <div>
            <h2 style={styles.pageTitle}>Winners & Verification</h2>
            {winners.length === 0 && <p style={{ color: '#94a3b8' }}>No winners yet.</p>}
            {winners.map((w, i) => (
              <div key={i} style={styles.winnerCard}>
                <div style={styles.winnerInfo}>
                  <div style={{ color: '#fff', fontWeight: '700' }}>{w.winner?.userId?.name || 'Unknown'}</div>
                  <div style={{ color: '#94a3b8', fontSize: '14px' }}>{w.winner?.userId?.email}</div>
                  <div style={{ color: '#22c55e', fontSize: '14px' }}>{w.month} {w.year} — {w.winner?.matchType}</div>
                  <div style={{ color: '#f59e0b' }}>₹{w.winner?.prizeAmount?.toLocaleString()}</div>
                </div>
                <div style={styles.winnerActions}>
                  <span style={{ color: w.winner?.verified ? '#22c55e' : '#f59e0b', fontSize: '14px' }}>
                    {w.winner?.verified ? '✅ Verified & Paid' : `💳 ${w.winner?.paymentStatus}`}
                  </span>
                  {!w.winner?.verified && (
                    <button style={styles.verifyBtn} onClick={() => verifyWinner(w.drawId, w.winner._id)}>
                      Verify & Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0a0f1a', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: '220px', background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '32px 16px', display: 'flex', flexDirection: 'column' },
  logo: { fontSize: '20px', fontWeight: '800', color: '#22c55e', marginBottom: '40px', paddingLeft: '12px' },
  navItem: { display: 'block', width: '100%', background: 'transparent', border: 'none', color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '14px', marginBottom: '4px' },
  navActive: { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  logoutBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', marginTop: 'auto' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  message: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '32px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' },
  statCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', textAlign: 'center' },
  statIcon: { fontSize: '28px', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '4px' },
  statLabel: { color: '#94a3b8', fontSize: '13px' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { color: '#94a3b8', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' },
  td: { color: '#fff', padding: '16px', fontSize: '14px' },
  formCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '24px' },
  formTitle: { color: '#fff', fontWeight: '700', marginBottom: '16px' },
  formRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  input: { background: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#111827', fontSize: '14px', flex: '1', minWidth: '120px' },
  btn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  drawCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '12px' },
  drawHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  numbersRow: { display: 'flex', gap: '10px', marginBottom: '12px' },
  numBall: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800' },
  drawActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  actionBtn: { background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  charitiesList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  charityItem: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  deleteBtn: { background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  winnerCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  winnerInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
  winnerActions: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' },
  verifyBtn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
};

export default Admin;