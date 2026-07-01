import { useState, useEffect } from 'react';
import api from '../../utils/api';
import JobCard from '../../components/JobCard';
import { toast } from '../../components/Toast';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  function load() {
    setLoading(true);
    api.get('/auth/me').then(r => setJobs(r.data.savedJobs || [])).finally(() => setLoading(false));
  }

  async function handleUnsave(jobId) {
    try {
      await api.post(`/users/save-job/${jobId}`);
      setJobs(j => j.filter(job => job._id !== jobId));
      toast.success('Removed from saved');
    } catch { toast.error('Could not update'); }
  }

  return (
    <div>
      <div className="page-header" style={{ padding: '0 0 20px' }}>
        <h1 className="page-title">Saved Jobs</h1>
        <p className="page-sub">{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved for later</p>
      </div>

      {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔖</div>
          <h3>No saved jobs</h3>
          <p>Tap the bookmark icon on any job to save it here</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {jobs.map(job => (
            <JobCard key={job._id} job={job} onSave={handleUnsave} isSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
}
