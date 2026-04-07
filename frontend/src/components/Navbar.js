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
    <div className="navbar glass" style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Top Bar - Simplified */}
      <div style={{ 
        background: 'rgba(59, 130, 246, 0.03)', 
        padding: '0.5rem 2rem', 
        borderBottom: '1px solid var(--border)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)',
        fontWeight: '500'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>📧 support@uniflow.edu</span>
          <span>📍 Global Tech Campus</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {!token && <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Student Portal</Link>}
          <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Quick Help</Link>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="container" style={{
        padding: '1rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link to="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            color: 'var(--text-main)', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ 
              background: 'var(--primary)', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.1rem'
            }}>U</div>
            <span className="grad-text">UniFlow</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem' }}>Programs</Link>
            <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem' }}>Research</Link>
            <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem' }}>Innovation</Link>
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
          <div style={{ position: 'relative', display: 'none' }}> {/* Hidden for clean UI unless needed */}
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="input-field"
              style={{ padding: '0.5rem 1rem', width: '180px', fontSize: '0.85rem' }} 
            />
          </div>

          {!token ? (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Join Now</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="glass" style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--primary-light)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>{role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>
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
