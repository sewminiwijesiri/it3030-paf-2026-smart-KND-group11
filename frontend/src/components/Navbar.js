import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, Settings, X, ChevronRight } from 'lucide-react';
import logoIcon from '../assets/uniflow-icon.svg';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const isHome = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className={isHome ? "absolute top-0 left-0 right-0 z-[1000] bg-transparent pt-2" : "sticky top-0 z-[1000] bg-[#002147] border-b border-white/5 shadow-md"}>
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
                  className="text-[10px] font-black tracking-[0.2em] uppercase transition-colors hover:text-[#FF9F1C] text-slate-200"
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
                  <Link to="/login" className="hidden md:block text-[11px] font-black uppercase tracking-widest transition-colors hover:text-[#FF9F1C] no-underline text-white">
                    Login
                  </Link>
                  <Link to="/register" className="bg-[#FF9F1C] text-slate-900 px-6 py-2.5 rounded-full text-[11px] font-black shadow-lg shadow-orange-500/20 hover:scale-105 hover:bg-white transition-all no-underline uppercase tracking-widest">
                    Get Started
                  </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-5">
              {/* Notification Badge */}
              <div className="flex items-center gap-1 relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) markAllAsRead();
                  }}
                  className="relative p-2.5 rounded-xl transition-all group text-slate-300 hover:text-white hover:bg-white/10"
                >
                  <Bell size={20} className="transition-colors group-hover:text-[#FF9F1C]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full border-2 border-[#002147] flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-[#002147] border border-white/10 rounded-2xl shadow-2xl z-[1001] overflow-hidden animate-up">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Notifications</h3>
                        {notifications.length > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Clear all notifications?')) clearNotifications();
                            }}
                            className="text-[9px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-10 text-center">
                          <Bell size={32} className="mx-auto mb-3 text-slate-700" />
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No new alerts</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {notifications.map((notif, i) => (
                            <div 
                              key={notif.id || i} 
                              onClick={() => {
                                if (notif.targetUrl) navigate(notif.targetUrl);
                                setShowNotifications(false);
                              }}
                              className="p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                              <div className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[#FF9F1C] shrink-0 shadow-[0_0_8px_#FF9F1C]"></div>
                                <div className="space-y-1">
                                  <p className="text-[11px] font-black text-white leading-tight group-hover:text-[#FF9F1C] transition-colors">{notif.title}</p>
                                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>
                                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter mt-1">
                                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="p-3 bg-slate-900/50 border-t border-white/5 text-center">
                        <button 
                          onClick={() => navigate('/admin-dashboard')} // Or a dedicated notifications page
                          className="text-[9px] font-black text-[#FF9F1C] uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
                        >
                          View Activity Center <ChevronRight size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
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
