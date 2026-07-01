import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from '../../components/Toast';

const STATUSES = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];
const STATUS_LABEL = { pending: 'Pending', reviewing: 'Reviewing', shortlisted: 'Shortlisted', rejected: 'Rejected', hired: 'Hired' };

export default function JobApplicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get(`/applications/job/${jobId}`).then(r => setApps(r.data)).finally(() => setLoading(false));
  }, [jobId]);

  async function updateStatus(appId, status) {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApps(a => a.map(x => x._id === appId ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Could not update status'); }
  }

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      <Link to="/dashboard/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>← Back to jobs</Link>
      <div className="page-header" style={{ padding: '0 0 20px' }}>
        <h1 className="page-title">Applicants</h1>
        <p className="page-sub">{apps.length} candidate{apps.length !== 1 ? 's' : ''} applied</p>
      </div>

      <div className="filters">
        {['all', ...STATUSES].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">👥</div>
          <h3>No applicants here</h3>
          <p>Check back later or share the job listing</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(a => (
            <div key={a._id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div className="job-logo" style={{ borderRadius: '50%' }}>{a.applicant?.name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{a.applicant?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{a.applicant?.email}</div>
                  {a.applicant?.headline && <div style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 2 }}>{a.applicant.headline}</div>}
                  {a.applicant?.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                      {a.applicant.skills.map(s => <span key={s} className="tag tag-outline">{s}</span>)}
                    </div>
                  )}
                </div>
                <select
                  className="form-select"
                  style={{ width: 150 }}
                  value={a.status}
                  onChange={e => updateStatus(a._id, e.target.value)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>

              {a.coverLetter && (
                <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 14, padding: 14, background: 'var(--surface2)', borderRadius: 8, lineHeight: 1.6 }}>
                  {a.coverLetter}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-lo)' }}>
                  Applied {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <a href={a.resume} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">📄 View Resume</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
