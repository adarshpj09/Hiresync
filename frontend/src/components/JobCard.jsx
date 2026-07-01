import { useNavigate } from 'react-router-dom';

const TYPE_COLORS = {
  'Full-time': 'tag-violet', 'Part-time': 'tag-amber',
  'Contract': 'tag-sky', 'Internship': 'tag-green', 'Remote': 'tag-navy',
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function JobCard({ job, onSave, isSaved }) {
  const navigate = useNavigate();

  const salary = job.salary?.min
    ? `₹${(job.salary.min / 100000).toFixed(1)}L – ₹${(job.salary.max / 100000).toFixed(1)}L`
    : null;

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
      <div className="job-card-header">
        <div className="job-logo">
          {job.companyLogo
            ? <img src={job.companyLogo} alt={job.company} />
            : job.company?.[0]?.toUpperCase()}
        </div>
        <div className="job-card-info">
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.company} · {job.location}</div>
        </div>
        {onSave && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 18 }}
            onClick={e => { e.stopPropagation(); onSave(job._id); }}
            title={isSaved ? 'Unsave' : 'Save job'}
          >
            {isSaved ? '🔖' : '🏷'}
          </button>
        )}
      </div>

      <div className="job-card-meta">
        <span className={`tag ${TYPE_COLORS[job.type] || 'tag-outline'}`}>{job.type}</span>
        <span className="tag tag-outline">📍 {job.location}</span>
        {job.experience && <span className="tag tag-outline">👤 {job.experience}</span>}
        {salary && <span className="tag tag-green">💰 {salary}</span>}
        {job.skills?.slice(0, 3).map(s => (
          <span key={s} className="tag tag-outline">{s}</span>
        ))}
      </div>

      <div className="job-card-footer">
        <span className="job-time">{timeAgo(job.createdAt)}</span>
        <span className="tag tag-outline">{job.applicants || 0} applicants</span>
      </div>
    </div>
  );
}
