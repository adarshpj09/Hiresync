import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState(searchParams.get('search') || '');
  const [type, setType]       = useState('');
  const [experience, setExp]  = useState('');
  const [location, setLoc]    = useState('');
  const [page, setPage]       = useState(1);
  const { user } = useAuth();
  const [savedJobs, setSaved] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/auth/me').then(r => setSaved(r.data.savedJobs?.map(j => j._id || j) || []));
    }
  }, [user]);

  useEffect(() => {
    const s = searchParams.get('search') || '';
    setSearch(s);
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [search, type, experience, location, page]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)     params.set('search', search);
      if (type)       params.set('type', type);
      if (experience) params.set('experience', experience);
      if (location)   params.set('location', location);
      params.set('page', page);
      const { data } = await api.get(`/jobs?${params}`);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch { }
    setLoading(false);
  }

  async function handleSave(jobId) {
    if (!user) return toast.error('Log in to save jobs');
    try {
      const { data } = await api.post(`/users/save-job/${jobId}`);
      setSaved(data.savedJobs);
      const isSaved = data.savedJobs.includes(jobId);
      toast.success(isSaved ? 'Job saved' : 'Job removed from saved');
    } catch { toast.error('Could not save job'); }
  }

  return (
    <div className="page-wrap" style={{ paddingTop: 28, paddingBottom: 40 }}>
      {/* Search bar */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <input
          className="form-input"
          style={{ maxWidth: 400 }}
          placeholder="Search jobs, skills, companies…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <button className="btn btn-primary" onClick={fetchJobs}>Search</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <select className="form-select" value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
          <option value="">All types</option>
          {['Full-time','Part-time','Contract','Internship','Remote'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="form-select" value={experience} onChange={e => { setExp(e.target.value); setPage(1); }}>
          <option value="">All experience</option>
          {['Fresher','1-2 years','2-5 years','5+ years'].map(e => <option key={e}>{e}</option>)}
        </select>
        <input
          className="form-input"
          style={{ width: 180 }}
          placeholder="Location…"
          value={location}
          onChange={e => { setLoc(e.target.value); setPage(1); }}
        />
        {(type || experience || location || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setType(''); setExp(''); setLoc(''); setSearch(''); setPage(1); }}>
            Clear filters
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-lo)', alignSelf: 'center' }}>
          {total} result{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : jobs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try different keywords or clear your filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {jobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onSave={handleSave}
              isSaved={savedJobs.includes(job._id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
