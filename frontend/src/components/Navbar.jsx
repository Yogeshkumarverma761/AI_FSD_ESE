import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="navbar glass-card">
      <h2>🧠 AI HR Analytics</h2>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/add-employee" className="nav-link">Add Employee</Link>
            <Link to="/ai-recommendations" className="nav-link">AI Insights</Link>
            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '14px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
