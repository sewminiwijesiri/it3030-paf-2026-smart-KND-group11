import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings } from 'lucide-react';
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
    <div className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center py-2.5">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="bg-primary/5 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <img src={logoIcon} alt="UniFlow Logo" className="w-[32px] md:w-[36px] h-auto" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">UniFlow</span>
          </Link>
          
          {token && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/50 w-80">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources, tasks..." 
                className="bg-transparent border-none outline-none text-xs font-semibold text-slate-600 w-full placeholder:text-slate-400"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          {!token ? (
            <div className="flex gap-3">
              <Link to="/login" className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors no-underline">Login</Link>
              <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-primary-dark transition-all no-underline">Get Started</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-5">
              {/* Notification Badge */}
              <div className="flex items-center gap-1">
                <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group">
                  <Bell size={20} className="group-hover:text-primary transition-colors" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-500/20"></span>
                </button>
                
                <button className="hidden sm:block p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group">
                  <Settings size={20} className="group-hover:text-primary transition-colors" />
                </button>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[11px] font-bold text-slate-800 leading-none mb-1">Authenticated</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md">{role}</span>
                </div>
                
                <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-100 uppercase">
                  {role ? role[0] : 'U'}
                </div>

                <button 
                  onClick={handleLogout} 
                  className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-rose-600 hover:text-white transition-all ml-2"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
