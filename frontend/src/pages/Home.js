import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={styles.container}>
        <style>{`
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
    100% { transform: translateY(0px); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .hero-title { animation: fadeInUp 0.7s ease forwards; }
  .hero-sub { animation: fadeInUp 0.7s ease 0.2s forwards; opacity: 0; }
  .hero-btns { animation: fadeInUp 0.7s ease 0.35s forwards; opacity: 0; }
  .float-card { animation: float 4s ease-in-out infinite; }
  .step-1 { animation: fadeInUp 0.6s ease 0.1s forwards; opacity: 0; }
  .step-2 { animation: fadeInUp 0.6s ease 0.25s forwards; opacity: 0; }
  .step-3 { animation: fadeInUp 0.6s ease 0.4s forwards; opacity: 0; }
`}</style>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge}>🌍 Supporting Charities Worldwide</div>
          <h1 style={styles.heroTitle} className="hero-title">
            Golf that gives<br />
            <span style={styles.highlight}>back to the world.</span>
          </h1>
          <p style={styles.heroSubtitle} className="hero-sub">
            Enter your scores. Support a cause you love. Win monthly prizes.
            It's golf with a purpose — and every round counts.
          </p>
          <div style={styles.heroButtons} className="hero-btns">
            <button style={styles.primaryBtn} onClick={() => navigate(user ? '/dashboard' : '/register')}>
              {user ? 'Go to Dashboard' : 'Start for Free →'}
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate('/charities')}>
              See Our Charities
            </button>
          </div>
          <div style={styles.socialProof}>
            <div style={styles.avatars}>
              {['🧑', '👩', '👨', '🧑‍🦱', '👩‍🦰'].map((a, i) => (
                <div key={i} style={{ ...styles.avatar, marginLeft: i > 0 ? '-10px' : '0' }}>{a}</div>
              ))}
            </div>
            <p style={styles.socialText}><strong>2,500+ golfers</strong> already making a difference</p>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.visualCard} className="float-card">
            <div style={styles.visualHeader}>
              <span style={styles.visualDot}></span>
              <span style={styles.visualTitle}>This Month's Draw</span>
            </div>
            <div style={styles.prizeAmount}>£50,000</div>
            <div style={styles.prizeLabel}>Total Prize Pool</div>
            <div style={styles.visualDivider}></div>
            <div style={styles.visualStats}>
              <div style={styles.visualStat}>
                <div style={styles.visualStatNum}>£120K+</div>
                <div style={styles.visualStatLabel}>Donated</div>
              </div>
              <div style={styles.visualStat}>
                <div style={styles.visualStatNum}>48</div>
                <div style={styles.visualStatLabel}>Charities</div>
              </div>
              <div style={styles.visualStat}>
                <div style={styles.visualStatNum}>312</div>
                <div style={styles.visualStatLabel}>Winners</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={styles.section}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionTag}>Simple & Transparent</p>
          <h2 style={styles.sectionTitle}>How GolfGive works</h2>
          <div style={styles.stepsGrid}>
            {[
              { num: '01', icon: '📋', title: 'Subscribe to play', desc: 'Pick a monthly or yearly plan. A minimum 10% goes directly to your chosen charity — you can give more.' },
              { num: '02', icon: '⛳', title: 'Log your scores', desc: 'Enter your last 5 Stableford scores (1–45). Your scores are your draw entries — the more you play, the better.' },
              { num: '03', icon: '🎉', title: 'Win & give back', desc: 'Each month we run a draw. Match 3, 4, or 5 numbers to win. Your charity gets your contribution regardless.' },
            ].map((step, i) => (
              <div key={i} style={styles.stepCard} className={`step-${i+1}`}>
                <div style={styles.stepNum}>{step.num}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prize Pool */}
      <div style={styles.prizeSection}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionTag}>Monthly Draws</p>
          <h2 style={styles.sectionTitle}>How prizes are split</h2>
          <div style={styles.prizeGrid}>
            {[
              { icon: '🥇', match: '5 Numbers', pct: '40%', note: 'Jackpot rolls over if unclaimed!', highlight: true },
              { icon: '🥈', match: '4 Numbers', pct: '35%', note: 'Split equally among winners' },
              { icon: '🥉', match: '3 Numbers', pct: '25%', note: 'Split equally among winners' },
            ].map((p, i) => (
              <div key={i} style={{ ...styles.prizeCard, ...(p.highlight ? styles.prizeCardHighlight : {}) }}>
                <div style={styles.prizeIcon}>{p.icon}</div>
                <div style={styles.prizeMatch}>{p.match}</div>
                <div style={{ ...styles.prizePct, ...(p.highlight ? { color: '#16a34a' } : {}) }}>{p.pct}</div>
                <div style={styles.prizeNote}>{p.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charity Impact */}
      <div style={styles.impactSection}>
        <div style={styles.sectionInner}>
          <div style={styles.impactGrid}>
            <div style={styles.impactText}>
              <p style={styles.sectionTag}>Real Impact</p>
              <h2 style={styles.impactTitle}>Your game. Their future.</h2>
              <p style={styles.impactDesc}>
                Every subscription automatically routes a portion to the charity you care about.
                Whether it's children's education, mental health, or environmental causes —
                your rounds on the course create real change in the world.
              </p>
              <div style={styles.impactStats}>
                {[
                  { value: '£120,000+', label: 'Donated to charities' },
                  { value: '48', label: 'Partner charities' },
                  { value: '10%+', label: 'Minimum contribution' },
                ].map((s, i) => (
                  <div key={i} style={styles.impactStat}>
                    <div style={styles.impactStatVal}>{s.value}</div>
                    <div style={styles.impactStatLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.impactVisual}>
              {[
                { name: 'Children\'s Education Fund', pct: 82, color: '#16a34a' },
                { name: 'Mental Health Alliance', pct: 65, color: '#22c55e' },
                { name: 'Ocean Conservation', pct: 54, color: '#4ade80' },
                { name: 'Local Food Banks', pct: 43, color: '#86efac' },
              ].map((c, i) => (
                <div key={i} style={styles.charityBar}>
                  <div style={styles.charityBarLabel}>
                    <span style={styles.charityBarName}>{c.name}</span>
                    <span style={styles.charityBarPct}>{c.pct}%</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div style={{ ...styles.barFill, width: `${c.pct}%`, background: c.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Every round you play<br />can change someone's life.</h2>
          <p style={styles.ctaSubtitle}>Join 2,500+ golfers who are making their game count.</p>
          <button style={styles.ctaBtn} onClick={() => navigate(user ? '/dashboard' : '/register')}>
            {user ? 'Go to Dashboard' : 'Join GolfGive Today →'}
          </button>
          <p style={styles.ctaNote}>No hidden fees. Cancel anytime. 100% transparent.</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerLogo}>⛳ GolfGive</div>
          <p style={styles.footerText}>Golf with purpose. Every score matters.</p>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink} onClick={() => navigate('/charities')}>Charities</span>
            <span style={styles.footerLink} onClick={() => navigate('/register')}>Sign Up</span>
            <span style={styles.footerLink} onClick={() => navigate('/login')}>Login</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

const styles = {
  container: { background: '#f8faf8', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  hero: { padding: '80px 6% 100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '60px', background: '#ffffff', flexWrap: 'wrap' },
  heroInner: { flex: '1', minWidth: '300px', maxWidth: '580px' },
  badge: { display: 'inline-block', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '6px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' },
  heroTitle: { fontSize: '56px', fontWeight: '900', lineHeight: '1.1', color: '#111827', marginBottom: '20px', letterSpacing: '-1.5px' },
  highlight: { color: '#16a34a' },
  heroSubtitle: { fontSize: '18px', color: '#6b7280', lineHeight: '1.7', marginBottom: '36px', maxWidth: '480px' },
  heroButtons: { display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' },
  primaryBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' },
  secondaryBtn: { background: '#fff', color: '#374151', border: '1.5px solid #d1d5db', padding: '16px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  socialProof: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatars: { display: 'flex' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#f0fdf4', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  socialText: { color: '#6b7280', fontSize: '14px' },
  heroVisual: { flex: '1', minWidth: '280px', maxWidth: '400px' },
  visualCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', animation: 'float 4s ease-in-out infinite' },
  visualHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' },
  visualDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' },
  visualTitle: { color: '#6b7280', fontSize: '14px', fontWeight: '500' },
  prizeAmount: { fontSize: '48px', fontWeight: '900', color: '#111827', letterSpacing: '-1px' },
  prizeLabel: { color: '#6b7280', fontSize: '14px', marginBottom: '24px' },
  visualDivider: { height: '1px', background: '#f3f4f6', marginBottom: '24px' },
  visualStats: { display: 'flex', justifyContent: 'space-between' },
  visualStat: { textAlign: 'center' },
  visualStatNum: { fontSize: '22px', fontWeight: '800', color: '#111827' },
  visualStatLabel: { fontSize: '12px', color: '#9ca3af', marginTop: '2px' },
  section: { padding: '100px 6%', background: '#f8faf8' },
  sectionInner: { maxWidth: '1100px', margin: '0 auto' },
  sectionTag: { color: '#16a34a', fontWeight: '600', fontSize: '14px', letterSpacing: '0.5px', marginBottom: '12px', textTransform: 'uppercase' },
  sectionTitle: { fontSize: '40px', fontWeight: '800', color: '#111827', marginBottom: '48px', letterSpacing: '-0.5px' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' },
  stepCard: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '36px 32px' },
  stepNum: { fontSize: '13px', fontWeight: '700', color: '#16a34a', marginBottom: '16px', letterSpacing: '1px' },
  stepIcon: { fontSize: '36px', marginBottom: '16px' },
  stepTitle: { fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' },
  stepDesc: { color: '#6b7280', lineHeight: '1.7', fontSize: '15px' },
  prizeSection: { padding: '100px 6%', background: '#fff' },
  prizeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' },
  prizeCard: { background: '#f8faf8', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '36px 28px', textAlign: 'center' },
  prizeCardHighlight: { background: '#f0fdf4', border: '1.5px solid #bbf7d0' },
  prizeIcon: { fontSize: '40px', marginBottom: '16px' },
  prizeMatch: { fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' },
  prizePct: { fontSize: '48px', fontWeight: '900', color: '#374151', marginBottom: '8px', letterSpacing: '-1px' },
  prizeNote: { color: '#9ca3af', fontSize: '13px' },
  impactSection: { padding: '100px 6%', background: '#f8faf8' },
  impactGrid: { display: 'flex', gap: '80px', alignItems: 'center', flexWrap: 'wrap' },
  impactText: { flex: '1', minWidth: '280px' },
  impactTitle: { fontSize: '40px', fontWeight: '800', color: '#111827', marginBottom: '20px', letterSpacing: '-0.5px' },
  impactDesc: { color: '#6b7280', lineHeight: '1.8', fontSize: '16px', marginBottom: '36px' },
  impactStats: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  impactStat: {},
  impactStatVal: { fontSize: '28px', fontWeight: '800', color: '#16a34a' },
  impactStatLabel: { color: '#9ca3af', fontSize: '13px', marginTop: '2px' },
  impactVisual: { flex: '1', minWidth: '280px' },
  charityBar: { marginBottom: '20px' },
  charityBarLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  charityBarName: { color: '#374151', fontSize: '14px', fontWeight: '500' },
  charityBarPct: { color: '#16a34a', fontSize: '14px', fontWeight: '700' },
  barTrack: { background: '#e5e7eb', borderRadius: '99px', height: '8px' },
  barFill: { height: '8px', borderRadius: '99px', transition: 'width 1s ease' },
  ctaSection: { padding: '120px 6%', background: '#16a34a' },
  ctaInner: { maxWidth: '680px', margin: '0 auto', textAlign: 'center' },
  ctaTitle: { fontSize: '48px', fontWeight: '900', color: '#fff', marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-1px' },
  ctaSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '18px', marginBottom: '36px' },
  ctaBtn: { background: '#fff', color: '#16a34a', border: 'none', padding: '18px 44px', borderRadius: '12px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', marginBottom: '16px' },
  ctaNote: { color: 'rgba(255,255,255,0.6)', fontSize: '14px' },
  footer: { background: '#111827', padding: '48px 6%' },
  footerInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' },
  footerLogo: { fontSize: '20px', fontWeight: '800', color: '#4ade80' },
  footerText: { color: '#6b7280', fontSize: '14px' },
  footerLinks: { display: 'flex', gap: '24px' },
  footerLink: { color: '#6b7280', fontSize: '14px', cursor: 'pointer' },
};

export default Home;