import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '', headline: user.headline || '',
    skills: user.skills?.join(', ') || '', experience: user.experience || '',
    location: user.location || '', company: user.company || '', companyWebsite: user.companyWebsite || '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      updateUser(data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not update profile');
    }
    setSaving(false);
  }

  async function handleResumeUpload() {
    if (!resumeFile) return toast.error('Choose a PDF first');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', resumeFile);
      const { data } = await api.post('/users/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ resume: data.resume, resumeName: data.resumeName });
      toast.success('Resume uploaded');
      setResumeFile(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    }
    setUploading(false);
  }

  return (
    <div className="page-wrap" style={{ paddingTop: 28, paddingBottom: 60, maxWidth: 700 }}>
      <div className="profile-header">
        <div className="profile-avatar">{user.name?.[0]?.toUpperCase()}</div>
        <div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-headline">{user.headline || (user.role === 'recruiter' ? user.company : 'No headline set')}</div>
          <span className="tag tag-violet">{user.role === 'recruiter' ? '🏢 Recruiter' : '👤 Job Seeker'}</span>
        </div>
      </div>

      {user.role === 'candidate' && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>Resume</h3>
          {user.resume && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: 12, background: 'var(--surface2)', borderRadius: 8 }}>
              <span>📄</span>
              <span style={{ flex: 1, fontSize: 13 }}>{user.resumeName || 'resume.pdf'}</span>
              <a href={user.resume} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View</a>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="file" accept=".pdf" className="form-input" onChange={e => setResumeFile(e.target.files[0])} />
            <button className="btn btn-primary btn-sm" onClick={handleResumeUpload} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      )}

      <form className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }} onSubmit={handleSave}>
        <h3 style={{ fontSize: 15 }}>Profile details</h3>

        <div className="form-group">
          <label className="form-label">Full name</label>
          <input className="form-input" value={form.name} onChange={set('name')} />
        </div>

        {user.role === 'candidate' ? (
          <>
            <div className="form-group">
              <label className="form-label">Headline</label>
              <input className="form-input" placeholder="e.g. Frontend Developer" value={form.headline} onChange={set('headline')} />
            </div>
            <div className="form-group">
              <label className="form-label">Skills <span style={{ fontWeight: 400, color: 'var(--text-lo)' }}>(comma separated)</span></label>
              <input className="form-input" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={set('skills')} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input className="form-input" placeholder="e.g. 2 years" value={form.experience} onChange={set('experience')} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Mumbai" value={form.location} onChange={set('location')} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Company name</label>
              <input className="form-input" value={form.company} onChange={set('company')} />
            </div>
            <div className="form-group">
              <label className="form-label">Company website</label>
              <input className="form-input" placeholder="https://…" value={form.companyWebsite} onChange={set('companyWebsite')} />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
