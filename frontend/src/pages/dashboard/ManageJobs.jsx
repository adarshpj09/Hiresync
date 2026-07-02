import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from '../../components/Toast';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    api.get('/jobs/recruiter/mine').then(r => setJobs(r.data)).finally(() => setLoading(false));
  }

  async function toggleActive(job) {
    try {
      await api.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      setJobs(js => js.map(j => j._id === job._id ? { ...j, isActive: !j.isActive } : j));
      toast.success(job.isActive ? 'Job closed' : 'Job reopened');
    } catch { toast.error('Could not update job'); }
  }

  async function handleDelete(jobId) {
    if (!confirm('Delete this job permanently? This cannot be undone.')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(js => js.filter(j => j._id !== jobId));
      toast.success('Job deleted');
    } catch { toast.error('Could not delete job'); }
  }

  return (
    <div>
      <div className="page-header" style={{ padding: '0 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Manage Jobs</h1>
          <p className="page-sub">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/dashboard/post" className="btn btn-primary">+ Post a job</Link>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3>No jobs yet</h3>
          <p>Post your first job listing</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {jobs.map(j => (
            <div key={j._id} className="app-card">
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/dashboard/jobs/${j._id}/applicants`)}>
                <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{j.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{j.location} · {j.type} · {j.experience}</div>
              </div>
              <span className="tag tag-violet">{j.applicants} applicant{j.applicants !== 1 ? 's' : ''}</span>
              <span className={`tag ${j.isActive ? 'tag-green' : 'tag-outline'}`}>{j.isActive ? 'Active' : 'Closed'}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/dashboard/jobs/${j._id}/applicants`)}>View</button>
              <button className="btn btn-ghost btn-sm" onClick={() => toggleActive(j)}>{j.isActive ? 'Close' : 'Reopen'}</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(j._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
