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
    <div className={isHome ? "absolute top-0 left-0 right-0 z-[1000] bg-transparent pt-2" : "sticky top-0 z-[1000] bg-[#0F172A] border-b border-white/5 shadow-md"}>
      <nav className="container mx-auto px-4 md:px-8 flex justify-between items-center py-4">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="p-2 rounded-xl transition-colors bg-white/10 group-hover:bg-white/20">
              <img src={logoIcon} alt="UniFlow Logo" className="w-[32px] md:w-[36px] h-auto" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">UniFlow</span>
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
                  className="text-[10px] font-black tracking-[0.2em] uppercase transition-colors hover:text-[#FFD166] text-slate-200"
                >
                  {item}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 w-80 backdrop-blur-md focus-within:bg-white/10 transition-colors">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resources, tasks..." 
              className="bg-transparent border-none outline-none text-xs font-semibold w-full text-white placeholder:text-slate-400"
            />
          </div>
        )}
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
          {!token ? (
            <div className="flex items-center gap-4 md:gap-6">
              <button aria-label="Search" className="p-2 rounded-full transition-colors hidden sm:block text-slate-300 hover:text-white hover:bg-white/10">
                <Search size={18} />
              </button>
              <div className="flex items-center gap-4">
                  <Link to="/login" className="hidden md:block text-[11px] font-black uppercase tracking-widest transition-colors hover:text-[#FFD166] no-underline text-white">
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
                <button className="relative p-2.5 rounded-xl transition-all group text-slate-300 hover:text-white hover:bg-white/10">
                  <Bell size={20} className="transition-colors group-hover:text-[#FFD166]" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-transparent"></span>
                </button>
                
                <button className="hidden sm:block p-2.5 rounded-xl transition-all group text-slate-300 hover:text-white hover:bg-white/10">
                  <Settings size={20} className="transition-colors group-hover:text-[#FFD166]" />
                </button>
              </div>

              <div className="h-8 w-[1px] hidden sm:block bg-white/20"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[11px] font-bold leading-none mb-1 text-white">Authenticated</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-[#FFD166] bg-[#FFD166]/10 border border-[#FFD166]/20">{role}</span>
                </div>
                
                <div className="w-9 h-9 bg-[#FFD166] text-slate-900 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-[#FFD166]/20 uppercase">
                  {role ? role[0] : 'U'}
                </div>

                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 rounded-xl text-[11px] font-bold transition-all ml-2 bg-transparent border border-white/20 text-slate-200 hover:bg-rose-500 hover:text-white hover:border-transparent"
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
