import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoIcon from '../assets/uniflow-icon.svg';

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
    <div className="navbar" style={{ 
      background: 'rgba(240, 247, 255, 0.95)', 
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Main Nav */}
      <nav className="container" style={{
        padding: '0.75rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link to="/" style={{ 
            fontSize: '1.6rem', 
            fontWeight: '800', 
            color: '#1e3a8a', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <img src={logoIcon} alt="UniFlow Logo" style={{ width: '55px', height: 'auto' }} />
            <span className="grad-text" style={{ letterSpacing: '-0.5px' }}>UniFlow</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Home</Link>
            <a href="#features" className="nav-link" style={{ textDecoration: 'none', color: '#475569', fontWeight: '600', fontSize: '0.9rem' }}>Features</a>
            {token && (
              <Link 
                to={role === 'ADMIN' ? "/admin-dashboard" : role === 'TECHNICIAN' ? "/technician-dashboard" : "/user-dashboard"} 
                className="nav-link"
                style={{ textDecoration: 'none', fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}
              >
                My Dashboard
              </Link>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {!token ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', color: '#1e3a8a', borderColor: 'rgba(30, 58, 138, 0.2)' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Register</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--primary)', background: 'rgba(59, 130, 246, 0.1)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>{role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#1e3a8a', borderColor: 'rgba(30, 58, 138, 0.2)' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
