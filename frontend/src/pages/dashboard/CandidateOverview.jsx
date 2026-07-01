import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_LABEL = { pending: 'Pending', reviewing: 'Reviewing', shortlisted: 'Shortlisted', rejected: 'Rejected', hired: 'Hired' };

export default function CandidateOverview() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/mine').then(r => setApps(r.data)).finally(() => setLoading(false));
  }, []);

  const counts = apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div className="page-header" style={{ padding: '0 0 24px' }}>
        <h1 className="page-title">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="page-sub">Here's where things stand with your job search</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-icon">📄</div>
          <div className="stat-card-val">{apps.length}</div>
          <div className="stat-card-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👁</div>
          <div className="stat-card-val">{counts.reviewing || 0}</div>
          <div className="stat-card-label">Under Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">⭐</div>
          <div className="stat-card-val">{counts.shortlisted || 0}</div>
          <div className="stat-card-label">Shortlisted</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">🎉</div>
          <div className="stat-card-val">{counts.hired || 0}</div>
          <div className="stat-card-label">Offers</div>
        </div>
      </div>

      {!user.resume && (
        <div className="card" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--violet-lt)', borderColor: 'var(--violet-md)' }}>
          <span style={{ fontSize: 24 }}>📎</span>
          <div style={{ flex: 1 }}>
            <strong>Add a resume to your profile</strong>
            <p style={{ fontSize: 13, color: 'var(--text-mid)' }}>Speed up applying by saving your resume once.</p>
          </div>
          <Link to="/profile" className="btn btn-primary btn-sm">Add resume</Link>
        </div>
      )}

      <div className="section-header">
        <h2 className="section-title">Recent applications</h2>
        <Link to="/dashboard/applications" className="btn btn-ghost btn-sm">View all →</Link>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : apps.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>No applications yet</h3>
          <p>Browse jobs and apply to get started</p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 16 }}>Browse jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {apps.slice(0, 5).map(a => (
            <div key={a._id} className="app-card">
              <div className="job-logo">{a.job?.companyLogo ? <img src={a.job.companyLogo} alt="" /> : a.job?.company?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{a.job?.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{a.job?.company} · {a.job?.location}</div>
              </div>
              <span className={`tag status-${a.status}`}>{STATUS_LABEL[a.status]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
