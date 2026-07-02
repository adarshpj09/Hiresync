import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const TYPE_COLORS = {
  'Full-time': 'tag-violet', 'Part-time': 'tag-amber',
  'Contract': 'tag-sky', 'Internship': 'tag-green', 'Remote': 'tag-navy',
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [applying, setApplying]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCover]   = useState('');
  const [resumeFile, setResume]   = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => setJob(r.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));

    if (user?.role === 'candidate') {
      api.get('/applications/mine')
        .then(r => setHasApplied(r.data.some(a => a.job?._id === id)))
        .catch(() => {});
    }
  }, [id, user]);

  async function handleApply(e) {
    e.preventDefault();
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('jobId', id);
      fd.append('coverLetter', coverLetter);
      if (resumeFile) fd.append('resume', resumeFile);

      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted!');
      setShowModal(false);
      setHasApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not apply');
    }
    setApplying(false);
  }

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!job) return null;

  const salary = job.salary?.min
    ? `₹${(job.salary.min / 100000).toFixed(1)}L – ₹${(job.salary.max / 100000).toFixed(1)}L / year`
    : 'Not disclosed';

  return (
    <div className="page-wrap" style={{ paddingTop: 28, paddingBottom: 60 }}>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="job-detail">
        {/* Header */}
        <div className="job-detail-header">
          <div className="job-detail-logo">
            {job.companyLogo ? <img src={job.companyLogo} alt={job.company} /> : job.company?.[0]}
          </div>
          <h1 className="job-detail-title">{job.title}</h1>
          <div className="job-detail-company">{job.company}</div>
          <div className="job-detail-meta">
            <span className={`tag ${TYPE_COLORS[job.type] || 'tag-outline'}`}>{job.type}</span>
            <span className="tag tag-outline">📍 {job.location}</span>
            <span className="tag tag-outline">👤 {job.experience}</span>
            <span className="tag tag-green">💰 {salary}</span>
            <span className="tag tag-outline">👁 {job.views} views</span>
            <span className="tag tag-outline">👥 {job.applicants} applied</span>
          </div>

          {job.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {job.skills.map(s => <span key={s} className="tag tag-violet">{s}</span>)}
            </div>
          )}

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            {user?.role === 'candidate' ? (
              hasApplied ? (
                <button className="btn btn-secondary" disabled>✓ Applied</button>
              ) : (
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Apply Now</button>
              )
            ) : !user ? (
              <button className="btn btn-primary" onClick={() => navigate('/login')}>Log in to Apply</button>
            ) : null}
          </div>
        </div>

        {/* Body */}
        <div className="job-detail-body">
          {job.description && (
            <div className="job-section">
              <h3>About this role</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>
          )}
          {job.requirements && (
            <div className="job-section">
              <h3>Requirements</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
            </div>
          )}
          {job.benefits?.length > 0 && (
            <div className="job-section">
              <h3>Benefits</h3>
              <ul>{job.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          )}
          {job.deadline && (
            <div className="job-section">
              <h3>Application Deadline</h3>
              <p>{new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Apply — {job.title}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleApply}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Resume (PDF)</label>
                  <input
                    type="file" accept=".pdf"
                    className="form-input"
                    onChange={e => setResume(e.target.files[0])}
                  />
                  {user?.resume && !resumeFile && (
                    <p style={{ fontSize: 12, color: 'var(--text-lo)' }}>
                      Using saved resume: {user.resumeName || 'your resume'}. Upload a new one to override.
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Cover letter <span style={{ fontWeight: 400, color: 'var(--text-lo)' }}>(optional)</span></label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: 140 }}
                    placeholder="Tell the recruiter why you're a great fit…"
                    value={coverLetter}
                    onChange={e => setCover(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={applying}>
                  {applying ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
