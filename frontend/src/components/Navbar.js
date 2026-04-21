import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Settings } from 'lucide-react';
import logoIcon from '../assets/uniflow-icon.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const isHome = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className={isHome ? "absolute top-0 left-0 right-0 z-[1000] bg-transparent" : "sticky top-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm"}>
      <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center py-4">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className={`p-2 rounded-xl transition-colors ${isHome ? 'bg-white/10' : 'bg-primary/5 group-hover:bg-primary/10'}`}>
              <img src={logoIcon} alt="UniFlow Logo" className="w-[32px] md:w-[36px] h-auto" />
            </div>
            <span className={`text-xl font-black tracking-tighter ${isHome ? 'text-white' : 'text-slate-800'}`}>UniFlow</span>
          </Link>
        </div>
        
        {/* Center: Navigation Links */}
        {!token ? (
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {['HOME', 'CATALOGUE', 'ABOUT US', 'CONTACT'].map((item, i) => {
              const targetId = item === 'HOME' ? 'hero' : item.toLowerCase().replace(' ', '-');
              const dest = item === 'HOME' ? '/' : `/#${targetId}`;
              
              const handleClick = (e) => {
                if (isHome && item !== 'HOME') {
                  e.preventDefault();
                  const el = document.getElementById(targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                } else if (isHome && item === 'HOME') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              };

              return (
                <Link 
                  key={i} 
                  to={dest}
                  onClick={handleClick}
                  className={`text-[10px] font-black tracking-[0.2em] uppercase transition-colors hover:text-[#FFD166] ${isHome ? 'text-white' : 'text-slate-600'}`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 bg-slate-50/10 px-4 py-2 rounded-2xl border border-slate-200/20 w-80 backdrop-blur-md">
            <Search size={16} className={isHome ? "text-slate-300" : "text-slate-400"} />
            <input 
              type="text" 
              placeholder="Search resources, tasks..." 
              className={`bg-transparent border-none outline-none text-xs font-semibold w-full placeholder:opacity-70 ${isHome ? 'text-white placeholder:text-slate-300' : 'text-slate-600 placeholder:text-slate-400'}`}
            />
          </div>
        )}
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
          {!token ? (
            <div className="flex items-center gap-4 md:gap-6">
              <button aria-label="Search" className={`p-2 rounded-full transition-colors hidden sm:block ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Search size={18} />
              </button>
              <div className="flex items-center gap-4">
                  <Link to="/login" className={`hidden md:block text-[11px] font-black uppercase tracking-widest transition-colors hover:text-[#FFD166] no-underline ${isHome ? 'text-white' : 'text-slate-600'}`}>
                    Login
                  </Link>
                  <Link to="/register" className="bg-[#FFD166] text-slate-900 px-6 py-2.5 rounded-full text-[11px] font-black shadow-lg shadow-[#FFD166]/20 hover:scale-105 hover:bg-white transition-all no-underline uppercase tracking-widest">
                    Get Started
                  </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-5">
              {/* Notification Badge */}
              <div className="flex items-center gap-1">
                <button className={`relative p-2.5 rounded-xl transition-all group ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Bell size={20} className={`transition-colors ${isHome ? 'group-hover:text-[#FFD166]' : 'group-hover:text-primary'}`} />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-transparent"></span>
                </button>
                
                <button className={`hidden sm:block p-2.5 rounded-xl transition-all group ${isHome ? 'text-white hover:bg-white/10' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <Settings size={20} className={`transition-colors ${isHome ? 'group-hover:text-[#FFD166]' : 'group-hover:text-primary'}`} />
                </button>
              </div>

              <div className={`h-8 w-[1px] hidden sm:block ${isHome ? 'bg-white/20' : 'bg-slate-200'}`}></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className={`text-[11px] font-bold leading-none mb-1 ${isHome ? 'text-white' : 'text-slate-800'}`}>Authenticated</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isHome ? 'text-[#FFD166] bg-white/10' : 'text-primary bg-primary/5'}`}>{role}</span>
                </div>
                
                <div className="w-9 h-9 bg-[#FFD166] text-slate-900 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-[#FFD166]/20 uppercase">
                  {role ? role[0] : 'U'}
                </div>

                <button 
                  onClick={handleLogout} 
                  className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ml-2 ${isHome ? 'bg-white/10 text-white hover:bg-rose-500' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
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
