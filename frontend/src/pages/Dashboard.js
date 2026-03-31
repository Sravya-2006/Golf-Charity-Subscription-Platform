import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState('');
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchScores();
    fetchDraws();
  // eslint-disable-next-line
  }, []);

  const fetchScores = async () => {
    const { data } = await API.get('/scores');
    setScores(data);
  };

  const fetchDraws = async () => {
    const { data } = await API.get('/draws');
    setDraws(data);
  };

  const addScore = async () => {
    if (!newScore) return;
    setLoading(true);
    try {
      await API.post('/scores', { score: Number(newScore), date: newDate || new Date() });
      setMessage('Score added successfully!');
      setNewScore('');
      setNewDate('');
      fetchScores();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding score');
    }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteScore = async (id) => {
    await API.delete(`/scores/${id}`);
    fetchScores();
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  const isSubscribed = user.subscription?.status === 'active';

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>⛳ GolfGive</div>
        <nav style={styles.nav}>
          {['overview', 'scores', 'draws', 'charity'].map(tab => (
            <button key={tab} style={{ ...styles.navItem, ...(activeTab === tab ? styles.navActive : {}) }}
              onClick={() => setActiveTab(tab)}>
              {tab === 'overview' && '📊'} {tab === 'scores' && '⛳'} {tab === 'draws' && '🎯'} {tab === 'charity' && '💚'}
              {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Welcome back, {user.name}! 👋</h1>
          <div style={{ ...styles.subBadge, background: isSubscribed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: isSubscribed ? '#22c55e' : '#ef4444' }}>
            {isSubscribed ? '✅ Active Subscriber' : '❌ No Active Subscription'}
          </div>
        </div>

        {!isSubscribed && (
          <div style={styles.subscribeBanner}>
            <p>You need an active subscription to enter draws!</p>
            <button style={styles.subscribeBtn} onClick={() => navigate('/subscribe')}>Subscribe Now</button>
          </div>
        )}

        {message && <div style={styles.message}>{message}</div>}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>⛳</div>
                <div style={styles.statValue}>{scores.length}/5</div>
                <div style={styles.statLabel}>Scores Entered</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🏆</div>
                <div style={styles.statValue}>₹{user.totalWinnings || 0}</div>
                <div style={styles.statLabel}>Total Winnings</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>🎯</div>
                <div style={styles.statValue}>{draws.length}</div>
                <div style={styles.statLabel}>Draws This Month</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📅</div>
                <div style={styles.statValue}>{user.subscription?.plan || 'None'}</div>
                <div style={styles.statLabel}>Current Plan</div>
              </div>
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div>
            <h2 style={styles.tabTitle}>My Golf Scores</h2>
            <p style={styles.tabSubtitle}>Enter your last 5 Stableford scores (1-45). Newest scores replace oldest automatically.</p>
            <div style={styles.scoreForm}>
              <input style={styles.input} type="number" min="1" max="45" value={newScore}
                onChange={e => setNewScore(e.target.value)} placeholder="Score (1-45)" />
              <input style={styles.input} type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              <button style={styles.addBtn} onClick={addScore} disabled={loading}>
                {loading ? 'Adding...' : '+ Add Score'}
              </button>
            </div>
            <div style={styles.scoresList}>
              {scores.length === 0 && <p style={{ color: '#94a3b8' }}>No scores yet. Add your first score!</p>}
              {scores.map((s, i) => (
                <div key={s._id} style={styles.scoreItem}>
                  <div style={styles.scoreRank}>#{i + 1}</div>
                  <div style={styles.scoreValue}>{s.score} pts</div>
                  <div style={styles.scoreDate}>{new Date(s.date).toLocaleDateString()}</div>
                  <button style={styles.deleteBtn} onClick={() => deleteScore(s._id)}>🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Draws Tab */}
        {activeTab === 'draws' && (
          <div>
            <h2 style={styles.tabTitle}>Monthly Draws</h2>
            {draws.length === 0 && <p style={{ color: '#94a3b8' }}>No draws published yet. Check back soon!</p>}
            {draws.map(draw => (
              <div key={draw._id} style={styles.drawCard}>
                <div style={styles.drawHeader}>
                  <h3 style={{ color: '#fff' }}>{draw.month} {draw.year} Draw</h3>
                  <span style={styles.drawStatus}>✅ Published</span>
                </div>
                <div style={styles.drawNumbers}>
                  <p style={{ color: '#94a3b8', marginBottom: '12px' }}>Winning Numbers:</p>
                  <div style={styles.numbersRow}>
                    {draw.winningNumbers.map((n, i) => (
                      <div key={i} style={styles.numberBall}>{n}</div>
                    ))}
                  </div>
                </div>
                <div style={styles.prizeBreakdown}>
                  <div style={styles.prizeItem}><span>🥇 5-Match Pool</span><span style={{ color: '#22c55e' }}>₹{draw.prizePool?.fiveMatch?.toLocaleString()}</span></div>
                  <div style={styles.prizeItem}><span>🥈 4-Match Pool</span><span style={{ color: '#22c55e' }}>₹{draw.prizePool?.fourMatch?.toLocaleString()}</span></div>
                  <div style={styles.prizeItem}><span>🥉 3-Match Pool</span><span style={{ color: '#22c55e' }}>₹{draw.prizePool?.threeMatch?.toLocaleString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charity Tab */}
        {activeTab === 'charity' && (
          <div>
            <h2 style={styles.tabTitle}>My Charity</h2>
            {user.charity?.charityId ? (
              <div style={styles.charityCard}>
                <div style={styles.charityIcon}>💚</div>
                <h3 style={{ color: '#fff', fontSize: '24px', marginBottom: '8px' }}>
                  {user.charity.charityId.name || 'Your Selected Charity'}
                </h3>
                <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
                  You're contributing <span style={{ color: '#22c55e', fontWeight: '700' }}>{user.charity.contributionPercentage}%</span> of your subscription
                </p>
                <button style={styles.changeBtn} onClick={() => navigate('/subscribe')}>Change Charity</button>
              </div>
            ) : (
              <div style={styles.charityCard}>
                <p style={{ color: '#94a3b8' }}>No charity selected yet.</p>
                <button style={styles.changeBtn} onClick={() => navigate('/subscribe')}>Select a Charity</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0a0f1a', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: '240px', background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '32px 16px', display: 'flex', flexDirection: 'column' },
  sidebarLogo: { fontSize: '22px', fontWeight: '800', color: '#22c55e', marginBottom: '40px', paddingLeft: '12px' },
  nav: { flex: 1 },
  navItem: { display: 'block', width: '100%', background: 'transparent', border: 'none', color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', marginBottom: '4px', textTransform: 'capitalize' },
  navActive: { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  logoutBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' },
  headerTitle: { fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 },
  subBadge: { padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' },
  subscribeBanner: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  subscribeBtn: { background: '#22c55e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  message: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' },
  statCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', textAlign: 'center' },
  statIcon: { fontSize: '32px', marginBottom: '12px' },
  statValue: { fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '4px' },
  statLabel: { color: '#94a3b8', fontSize: '14px' },
  tabTitle: { fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '8px' },
  tabSubtitle: { color: '#94a3b8', marginBottom: '24px' },
  scoreForm: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  input: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '15px', flex: '1', minWidth: '120px' },
  addBtn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' },
  scoresList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  scoreItem: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' },
  scoreRank: { color: '#94a3b8', fontSize: '14px', width: '30px' },
  scoreValue: { color: '#22c55e', fontWeight: '800', fontSize: '22px', flex: 1 },
  scoreDate: { color: '#94a3b8', fontSize: '14px' },
  deleteBtn: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' },
  drawCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', marginBottom: '16px' },
  drawHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  drawStatus: { background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' },
  drawNumbers: { marginBottom: '16px' },
  numbersRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  numberBall: { width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '18px' },
  prizeBreakdown: { borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' },
  prizeItem: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '8px' },
  charityCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', textAlign: 'center' },
  charityIcon: { fontSize: '48px', marginBottom: '16px' },
  changeBtn: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', marginTop: '16px' },
};

export default Dashboard;