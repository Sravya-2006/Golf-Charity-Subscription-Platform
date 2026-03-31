import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/charities').then(res => setCharities(res.data));
  }, []);

  const filtered = charities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.tag}>Making a difference</p>
          <h1 style={styles.title}>Our Charity Partners</h1>
          <p style={styles.subtitle}>
            Every GolfGive subscription automatically supports one of these incredible causes.
            Choose the one closest to your heart.
          </p>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input style={styles.search} placeholder="Search charities..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        {[
          { value: '48', label: 'Partner Charities' },
          { value: '£120K+', label: 'Total Donated' },
          { value: '2,500+', label: 'Supporters' },
          { value: '10%+', label: 'Min Contribution' },
        ].map((s, i) => (
          <div key={i} style={styles.statItem}>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={styles.section}>
        <div style={styles.sectionInner}>
          {filtered.length === 0 && (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>💚</div>
              <h3 style={styles.emptyTitle}>No charities found</h3>
              <p style={styles.emptyText}>Try a different search term or check back soon!</p>
            </div>
          )}
          <div style={styles.grid}>
            {filtered.map(charity => (
              <div key={charity._id} style={styles.card}>
                {charity.featured && (
                  <div style={styles.featuredBadge}>⭐ Featured</div>
                )}
                <div style={styles.cardTop}>
                  <div style={styles.charityIcon}>💚</div>
                  <div style={styles.cardMeta}>
                    {charity.featured && <span style={styles.featuredTag}>Featured Partner</span>}
                  </div>
                </div>
                <h3 style={styles.charityName}>{charity.name}</h3>
                <p style={styles.charityDesc}>{charity.description}</p>
                {charity.website && (
                  <a href={charity.website} target="_blank" rel="noreferrer" style={styles.websiteLink}>
                    Visit website →
                  </a>
                )}
                {charity.events?.length > 0 && (
                  <div style={styles.events}>
                    <p style={styles.eventsTitle}>📅 Upcoming Events</p>
                    {charity.events.slice(0, 2).map((e, i) => (
                      <div key={i} style={styles.eventItem}>
                        <span style={styles.eventDot}>•</span>
                        <span>{e.title} — {new Date(e.date).toLocaleDateString('en-GB')}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button style={styles.supportBtn} onClick={() => navigate('/subscribe')}>
                  Support This Charity →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to make your golf matter?</h2>
        <p style={styles.ctaSubtitle}>Subscribe to GolfGive and start supporting a charity you love today.</p>
        <button style={styles.ctaBtn} onClick={() => navigate('/register')}>
          Get Started Free →
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f8faf8', fontFamily: "'Inter', sans-serif" },
  hero: { background: '#fff', padding: '80px 6% 60px', borderBottom: '1px solid #e5e7eb' },
  heroInner: { maxWidth: '700px', margin: '0 auto', textAlign: 'center' },
  tag: { color: '#16a34a', fontWeight: '600', fontSize: '13px', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' },
  title: { fontSize: '48px', fontWeight: '900', color: '#111827', marginBottom: '16px', letterSpacing: '-1px' },
  subtitle: { color: '#6b7280', fontSize: '18px', lineHeight: '1.7', marginBottom: '32px' },
  searchWrap: { position: 'relative', maxWidth: '480px', margin: '0 auto' },
  searchIcon: { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' },
  search: { width: '100%', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '14px 16px 14px 44px', color: '#111827', fontSize: '15px', boxSizing: 'border-box' },
  statsBar: { background: '#16a34a', padding: '24px 6%', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' },
  statItem: { textAlign: 'center' },
  statValue: { fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-0.5px' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '2px' },
  section: { padding: '60px 6%' },
  sectionInner: { maxWidth: '1100px', margin: '0 auto' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  emptyTitle: { fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '8px' },
  emptyText: { color: '#9ca3af', fontSize: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', transition: 'all 0.2s ease' },
  featuredBadge: { display: 'none' },
  cardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  charityIcon: { fontSize: '40px' },
  cardMeta: {},
  featuredTag: { background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  charityName: { fontSize: '20px', fontWeight: '800', color: '#111827' },
  charityDesc: { color: '#6b7280', lineHeight: '1.7', fontSize: '14px', flex: 1 },
  websiteLink: { color: '#16a34a', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  events: { background: '#f8faf8', borderRadius: '10px', padding: '14px' },
  eventsTitle: { color: '#374151', fontWeight: '600', fontSize: '13px', marginBottom: '8px' },
  eventItem: { display: 'flex', gap: '8px', color: '#6b7280', fontSize: '13px', marginBottom: '4px' },
  eventDot: { color: '#16a34a' },
  supportBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginTop: 'auto' },
  cta: { background: '#111827', padding: '100px 6%', textAlign: 'center' },
  ctaTitle: { fontSize: '40px', fontWeight: '900', color: '#fff', marginBottom: '12px', letterSpacing: '-0.5px' },
  ctaSubtitle: { color: '#9ca3af', fontSize: '17px', marginBottom: '32px' },
  ctaBtn: { background: '#16a34a', color: '#fff', border: 'none', padding: '18px 44px', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: 'pointer' },
};

export default Charities;