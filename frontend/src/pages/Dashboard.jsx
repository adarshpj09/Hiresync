import { Routes, Route, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CandidateOverview from './dashboard/CandidateOverview';
import MyApplications from './dashboard/MyApplications';
import SavedJobs from './dashboard/SavedJobs';
import RecruiterOverview from './dashboard/RecruiterOverview';
import PostJob from './dashboard/PostJob';
import ManageJobs from './dashboard/ManageJobs';
import JobApplicants from './dashboard/JobApplicants';

const CANDIDATE_LINKS = [
  { to: '/dashboard',             label: 'Overview',         icon: '🏠', end: true },
  { to: '/dashboard/applications',label: 'My Applications',  icon: '📄' },
  { to: '/dashboard/saved',       label: 'Saved Jobs',       icon: '🔖' },
];

const RECRUITER_LINKS = [
  { to: '/dashboard',          label: 'Overview',    icon: '🏠', end: true },
  { to: '/dashboard/post',     label: 'Post a Job',  icon: '➕' },
  { to: '/dashboard/jobs',     label: 'Manage Jobs', icon: '📋' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const links = user.role === 'recruiter' ? RECRUITER_LINKS : CANDIDATE_LINKS;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-section">{user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}</div>
        {links.map(l => (
          <NavLink
            key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            <span>{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </aside>

      <div className="main-content">
        <Routes>
          {user.role === 'recruiter' ? (
            <>
              <Route index element={<RecruiterOverview />} />
              <Route path="post" element={<PostJob />} />
              <Route path="jobs" element={<ManageJobs />} />
              <Route path="jobs/:jobId/applicants" element={<JobApplicants />} />
            </>
          ) : (
            <>
              <Route index element={<CandidateOverview />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="saved" element={<SavedJobs />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}
