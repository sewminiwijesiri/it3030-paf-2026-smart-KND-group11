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
    <div className="sticky top-0 z-[1000] bg-blue-50/95 backdrop-blur-md border-b border-blue-500/10 shadow-sm">
      <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center py-3">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img src={logoIcon} alt="UniFlow Logo" className="w-[45px] md:w-[55px] h-auto" />
            <span className="grad-text text-2xl font-extrabold tracking-tighter">UniFlow</span>
          </Link>
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-slate-600 font-semibold text-sm hover:text-primary transition-colors no-underline">Home</Link>
            <a href="#features" className="text-slate-600 font-semibold text-sm hover:text-primary transition-colors no-underline">Features</a>
            {token && (
              <Link 
                to={role === 'ADMIN' ? "/admin-dashboard" : role === 'TECHNICIAN' ? "/technician-dashboard" : "/user-dashboard"} 
                className="text-primary font-bold text-sm hover:text-primary-dark transition-colors no-underline"
              >
                My Dashboard
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          {!token ? (
            <div className="flex gap-3">
              <Link to="/login" className="btn btn-outline !px-5 !py-2 !text-xs !rounded-lg border-blue-900/20 text-blue-900">Login</Link>
              <Link to="/register" className="btn btn-primary !px-5 !py-2 !text-xs !rounded-lg">Register</Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="px-4 py-1.5 rounded-full border border-primary bg-primary/10">
                <span className="text-xs font-bold text-primary tracking-wide">{role}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline !px-4 !py-1.5 !text-xs !rounded-lg border-blue-900/20 text-blue-900"
              >
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
