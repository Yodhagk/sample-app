import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './routes/Login.jsx';
import Dashboard from './routes/Dashboard.jsx';
import CADashboard from './routes/CADashboard.jsx';
import { getUser, clearAuth, setAuth } from './auth.js';

function App() {
  const [user, setUser] = useState(getUser());
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogin = (userData, token) => {
    setAuth(userData, token);
    setUser(userData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">GlassVault</div>
        {user ? (
          <div className="header-actions">
            <span>{user.name} ({user.role})</span>
            <button className="btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        ) : null}
      </header>

      <main className="app-content">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/ca"
            element={
              user && (user.role === 'admin' || user.role === 'ca_officer') ? (
                <CADashboard />
              ) : (
                <Navigate to={user ? '/dashboard' : '/login'} />
              )
            }
          />
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        </Routes>
      </main>

      <footer className="app-footer">
        Built for Hostinger deployment with secure JWT access.
      </footer>
    </div>
  );
}

export default App;
