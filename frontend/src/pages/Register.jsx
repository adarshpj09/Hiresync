import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

export default function Register() {
  const [role, setRole]     = useState('candidate');
  const [form, setForm]     = useState({ name: '', email: '', password: '', company: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ ...form, role });
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <div className="auth-wrap">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="auth-card">
          <div className="auth-logo">Hire<span>Sync</span></div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Free forever. No credit card needed.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Role toggle */}
            <div className="form-group">
              <label className="form-label">I am a</label>
              <div className="role-toggle">
                <button type="button" className={`role-btn ${role === 'candidate' ? 'active' : ''}`} onClick={() => setRole('candidate')}>
                  👤 Job Seeker
                </button>
                <button type="button" className={`role-btn ${role === 'recruiter' ? 'active' : ''}`} onClick={() => setRole('recruiter')}>
                  🏢 Recruiter
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" placeholder="Rahul Sharma" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} required />
            </div>
            {role === 'recruiter' && (
              <div className="form-group">
                <label className="form-label">Company name</label>
                <input className="form-input" placeholder="Acme Corp" value={form.company} onChange={set('company')} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login"><a>Log in</a></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
