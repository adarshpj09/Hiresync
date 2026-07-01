import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const initial = user?.name?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Hire<span>Sync</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/jobs" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>
            Browse Jobs
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>
                Profile
              </NavLink>
              <div className="navbar-avatar" onClick={handleLogout} title="Click to log out">
                {initial}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
