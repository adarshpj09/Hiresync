import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const STATUS_LABEL = { pending: 'Pending', reviewing: 'Reviewing', shortlisted: 'Shortlisted', rejected: 'Rejected', hired: 'Hired' };

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/applications/mine').then(r => setApps(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      <div className="page-header" style={{ padding: '0 0 20px' }}>
        <h1 className="page-title">My Applications</h1>
        <p className="page-sub">{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="filters">
        {['all', 'pending', 'reviewing', 'shortlisted', 'hired', 'rejected'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>No applications here</h3>
          <p>Try a different filter or browse new jobs</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map(a => (
            <Link key={a._id} to={a.job ? `/jobs/${a.job._id}` : '#'} className="app-card" style={{ textDecoration: 'none' }}>
              <div className="job-logo">{a.job?.companyLogo ? <img src={a.job.companyLogo} alt="" /> : a.job?.company?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{a.job?.title || 'Job removed'}</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{a.job?.company} · {a.job?.location}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-lo)', marginTop: 4 }}>
                  Applied {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <span className={`tag status-${a.status}`}>{STATUS_LABEL[a.status]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
