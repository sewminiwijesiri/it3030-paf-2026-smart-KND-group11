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
    <div style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'white', borderBottom: '1px solid var(--border)' }}>
      {/* Top Bar */}
      <div style={{ background: '#f8fafc', padding: '0.6rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>📧 info@uniflow.com</span>
          <span>📍 123 Main St, Tech City</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: '500' }}>
          {!token && <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>👤 Login</Link>}
          <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Contact Us</Link>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="container" style={{
        padding: '1.2rem 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3.5rem' }}>
          <Link to="/" style={{ 
            fontSize: '1.8rem', 
            fontWeight: '900', 
            color: 'var(--primary)', 
            textDecoration: 'none',
            letterSpacing: '-1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '4px' }}>U</span>
            UniFlow
          </Link>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            <Link to="/" className="nav-link" style={{ fontWeight: '600' }}>Home</Link>
            <Link to="/" className="nav-link" style={{ fontWeight: '600' }}>About</Link>
            <Link to="/" className="nav-link" style={{ fontWeight: '600' }}>Courses</Link>
            {token && (
              <Link 
                to={role === 'ADMIN' ? "/admin-dashboard" : role === 'TECHNICIAN' ? "/technician-dashboard" : "/user-dashboard"} 
                className="nav-link"
                style={{ fontWeight: '600', color: 'var(--primary)' }}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ padding: '0.6rem 1rem', paddingRight: '2.5rem', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.9rem', width: '220px' }} 
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
          </div>

          {!token ? (
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.8rem', borderRadius: '4px' }}>Register</Link>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong style={{ color: 'var(--primary)' }}>{role}</strong>
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: '4px' }}>
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
