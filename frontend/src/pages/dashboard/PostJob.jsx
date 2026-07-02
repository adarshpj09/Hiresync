import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from '../../components/Toast';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', location: '', type: 'Full-time', experience: 'Fresher',
    minSalary: '', maxSalary: '', description: '', requirements: '',
    skills: '', benefits: '', deadline: '', openings: 1,
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', {
        title: form.title,
        location: form.location,
        type: form.type,
        experience: form.experience,
        salary: { min: Number(form.minSalary) || 0, max: Number(form.maxSalary) || 0, currency: 'INR', period: 'year' },
        description: form.description,
        requirements: form.requirements,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        benefits: form.benefits.split(',').map(s => s.trim()).filter(Boolean),
        deadline: form.deadline || undefined,
        openings: Number(form.openings) || 1,
      });
      toast.success('Job posted!');
      navigate('/dashboard/jobs');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not post job');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header" style={{ padding: '0 0 20px' }}>
        <h1 className="page-title">Post a Job</h1>
        <p className="page-sub">Fill in the details — it'll be live immediately</p>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: 28, maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="form-group">
          <label className="form-label">Job title</label>
          <input className="form-input" placeholder="e.g. Frontend Developer" value={form.title} onChange={set('title')} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="e.g. Bengaluru / Remote" value={form.location} onChange={set('location')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Job type</label>
            <select className="form-select" value={form.type} onChange={set('type')}>
              {['Full-time','Part-time','Contract','Internship','Remote'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Experience level</label>
            <select className="form-select" value={form.experience} onChange={set('experience')}>
              {['Fresher','1-2 years','2-5 years','5+ years'].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Openings</label>
            <input className="form-input" type="number" min="1" value={form.openings} onChange={set('openings')} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Min salary (₹/year)</label>
            <input className="form-input" type="number" placeholder="600000" value={form.minSalary} onChange={set('minSalary')} />
          </div>
          <div className="form-group">
            <label className="form-label">Max salary (₹/year)</label>
            <input className="form-input" type="number" placeholder="1000000" value={form.maxSalary} onChange={set('maxSalary')} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" style={{ minHeight: 120 }} placeholder="What will they be doing?" value={form.description} onChange={set('description')} required />
        </div>

        <div className="form-group">
          <label className="form-label">Requirements</label>
          <textarea className="form-textarea" placeholder="What should they bring?" value={form.requirements} onChange={set('requirements')} />
        </div>

        <div className="form-group">
          <label className="form-label">Skills <span style={{ fontWeight: 400, color: 'var(--text-lo)' }}>(comma separated)</span></label>
          <input className="form-input" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={set('skills')} />
        </div>

        <div className="form-group">
          <label className="form-label">Benefits <span style={{ fontWeight: 400, color: 'var(--text-lo)' }}>(comma separated)</span></label>
          <input className="form-input" placeholder="Health insurance, Remote work, Stock options" value={form.benefits} onChange={set('benefits')} />
        </div>

        <div className="form-group">
          <label className="form-label">Application deadline <span style={{ fontWeight: 400, color: 'var(--text-lo)' }}>(optional)</span></label>
          <input className="form-input" type="date" value={form.deadline} onChange={set('deadline')} />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
          {loading ? 'Posting…' : 'Post Job'}
        </button>
      </form>
    </div>
  );
}
