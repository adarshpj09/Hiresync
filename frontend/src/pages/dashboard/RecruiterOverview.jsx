import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function RecruiterOverview() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/recruiter/mine').then(r => setJobs(r.data)).finally(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants || 0), 0);
  const totalViews      = jobs.reduce((sum, j) => sum + (j.views || 0), 0);
  const activeJobs       = jobs.filter(j => j.isActive).length;

  return (
    <div>
      <div className="page-header" style={{ padding: '0 0 24px' }}>
        <h1 className="page-title">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="page-sub">{user.company} · Recruiter dashboard</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-card-icon">📋</div>
          <div className="stat-card-val">{activeJobs}</div>
          <div className="stat-card-label">Active Listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👥</div>
          <div className="stat-card-val">{totalApplicants}</div>
          <div className="stat-card-label">Total Applicants</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">👁</div>
          <div className="stat-card-val">{totalViews}</div>
          <div className="stat-card-label">Total Views</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Your job listings</h2>
        <Link to="/dashboard/post" className="btn btn-primary btn-sm">+ Post a job</Link>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <h3>No jobs posted yet</h3>
          <p>Post your first job to start receiving applications</p>
          <Link to="/dashboard/post" className="btn btn-primary" style={{ marginTop: 16 }}>Post a job</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {jobs.slice(0, 5).map(j => (
            <Link key={j._id} to={`/dashboard/jobs/${j._id}/applicants`} className="app-card" style={{ textDecoration: 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{j.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{j.location} · {j.type}</div>
              </div>
              <span className="tag tag-violet">{j.applicants} applicant{j.applicants !== 1 ? 's' : ''}</span>
              <span className={`tag ${j.isActive ? 'tag-green' : 'tag-outline'}`}>{j.isActive ? 'Active' : 'Closed'}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
