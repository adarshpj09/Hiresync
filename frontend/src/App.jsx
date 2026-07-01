import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toast />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/jobs"       element={<Jobs />} />
          <Route path="/jobs/:id"   element={<JobDetail />} />
          <Route path="/login"      element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register"   element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
