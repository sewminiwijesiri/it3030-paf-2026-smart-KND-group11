import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          color: 'var(--primary)', 
          textDecoration: 'none',
          letterSpacing: '-1px'
        }}>
          UniFlow
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" className="nav-link">Home</Link>
          {token && <Link to="/admin" className="nav-link">Admin Panel</Link>}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        {!token ? (
          <>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Register</Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Logged in as <strong style={{ color: 'var(--primary)' }}>{role}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
