import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { icon: '💻', label: 'Engineering' },
  { icon: '🎨', label: 'Design' },
  { icon: '📊', label: 'Marketing' },
  { icon: '💼', label: 'Management' },
  { icon: '📱', label: 'Mobile' },
  { icon: '🔒', label: 'Cybersecurity' },
  { icon: '☁️', label: 'Cloud & DevOps' },
  { icon: '🤖', label: 'AI / ML' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-eyebrow">Job Portal · 2025</div>
        <h1>Find work that<br /><em>actually fits</em></h1>
        <p>Thousands of roles from companies that care about craft. Apply in minutes, track in real time.</p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            placeholder="Job title, skill, or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search Jobs</button>
        </form>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-val">2,400+</div>
            <div className="hero-stat-label">Open Roles</div>
          </div>
          <div>
            <div className="hero-stat-val">800+</div>
            <div className="hero-stat-label">Companies</div>
          </div>
          <div>
            <div className="hero-stat-val">94%</div>
            <div className="hero-stat-label">Hire Rate</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '52px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 22, marginBottom: 6 }}>Browse by category</h2>
        <p style={{ color: 'var(--text-mid)', marginBottom: 28 }}>Jump straight to what you know</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => navigate(`/jobs?search=${cat.label}`)}
              style={{
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '20px 12px',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.background = 'var(--violet-lt)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-mid)' }}>{cat.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '52px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, marginBottom: 10 }}>Ready to find your next role?</h2>
          <p style={{ color: 'var(--text-mid)', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
            Create a free account, upload your resume, and start applying in under 5 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Create free account</Link>
            <Link to="/jobs" className="btn btn-secondary">Browse jobs</Link>
          </div>
        </section>
      )}
    </div>
  );
}
