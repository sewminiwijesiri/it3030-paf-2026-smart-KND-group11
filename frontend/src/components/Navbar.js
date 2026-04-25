import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    Bell, 
    Search, 
    Settings, 
    X, 
    ChevronRight, 
    Command, 
    LogOut, 
    User,
    Sparkles,
    Shield
} from 'lucide-react';
import logoIcon from '../assets/uniflow-icon.svg';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className={`fixed top-0 left-0 right-0 h-[72px] z-[1000] transition-all duration-700 ${
        scrolled || !isHome 
            ? "bg-[#0F172A]/85 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)]" 
            : "bg-transparent border-b border-white/0"
    }`}>
      <nav className="container mx-auto px-6 md:px-12 h-full flex justify-between items-center">
        {/* Left: Elite Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center gap-4 no-underline group">
            <div className="relative">
                <div className="absolute inset-0 bg-[#FFD166] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                <div className="relative p-2.5 rounded-[14px] bg-white/10 border border-white/10 group-hover:bg-[#FFD166] group-hover:border-[#FFD166] transition-all duration-500 shadow-2xl">
                    <img src={logoIcon} alt="UniFlow Logo" className="w-[28px] md:w-[32px] h-auto group-hover:invert transition-all duration-500" />
                </div>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-[#FFD166] transition-colors">UniFlow</span>
          </Link>
        </div>
        
        {/* Center: Command Bar / Nav */}
        {!token ? (
           <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {['HOME', 'CATALOGUE', 'ECOSYSTEM', 'RESOURCES'].map((item, i) => {
              const targetId = item === 'HOME' ? 'hero' : item.toLowerCase().replace(' ', '-');
              const dest = item === 'HOME' ? '/' : `/#${targetId}`;
              
              return (
                <Link 
                  key={i} 
                  to={dest}
                  className="text-[10px] font-black tracking-[0.4em] uppercase transition-all hover:text-[#FFD166] text-slate-400 relative group/nav"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#FFD166] transition-all duration-500 group-hover/nav:w-full"></span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-3 bg-white/5 px-6 py-2.5 rounded-[20px] border border-white/10 w-[400px] backdrop-blur-md focus-within:bg-white/10 focus-within:border-[#FFD166]/50 transition-all duration-500 group/search">
            <Search size={16} className="text-slate-500 group-focus-within/search:text-[#FFD166] transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets, maintenance, team..." 
              className="bg-transparent border-none outline-none text-[11px] font-bold w-full text-white placeholder:text-slate-500"
            />
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                <Command size={10} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase">K</span>
            </div>
          </div>
        )}
        
        {/* Right: Actions */}
        <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
          {!token ? (
            <div className="flex items-center gap-8">
              <Link to="/login" className="hidden md:block text-[11px] font-black uppercase tracking-widest transition-all hover:text-[#FFD166] text-white">
                Log In
              </Link>
              <Link to="/register" className="bg-white text-slate-900 px-8 py-3.5 rounded-[18px] text-[11px] font-black shadow-2xl hover:bg-[#FFD166] hover:scale-[1.02] transition-all no-underline uppercase tracking-[0.2em]">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 md:gap-6">
              {/* Notification Badge */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) markAllAsRead();
                  }}
                  className={`p-3 rounded-2xl transition-all duration-500 border group ${
                      showNotifications ? 'bg-white border-white text-slate-900 shadow-2xl' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Bell size={18} className="transition-transform group-hover:rotate-12" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full border-4 border-[#0F172A] flex items-center justify-center shadow-2xl">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-5 w-[360px] bg-[#0F172A] border border-white/10 rounded-[32px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] z-[1001] overflow-hidden animate-fade-in-up">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-white/5 to-transparent">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Inbox</h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{unreadCount} New Alerts</p>
                      </div>
                      <button 
                        onClick={() => clearNotifications()} 
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="max-h-[440px] overflow-y-auto scrollbar-hide py-4 px-2">
                      {notifications.length === 0 ? (
                        <div className="py-20 text-center px-10">
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <Bell size={24} className="text-slate-700" />
                          </div>
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zero Frequency</h4>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {notifications.map((notif, i) => (
                            <div 
                              key={notif.id || i} 
                              onClick={() => {
                                if (notif.targetUrl) navigate(notif.targetUrl);
                                setShowNotifications(false);
                              }}
                              className="p-6 hover:bg-white/5 rounded-[24px] transition-all cursor-pointer group flex gap-5 items-start mx-2"
                            >
                              <div className="w-10 h-10 rounded-[14px] bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 shadow-xl group-hover:bg-[#FFD166] group-hover:border-[#FFD166] transition-all duration-500">
                                <Sparkles size={16} className="text-[#FFD166] group-hover:text-slate-900 transition-colors" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-[11px] font-black text-white leading-tight group-hover:text-[#FFD166] transition-colors">{notif.title}</p>
                                <p className="text-[10px] font-medium text-slate-500 leading-relaxed line-clamp-2">{notif.message}</p>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-tight mt-2 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-[#FFD166] rounded-full"></span>
                                    {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 bg-white/5 border-t border-white/5 text-center">
                        <Link 
                          to="/notifications" 
                          onClick={() => setShowNotifications(false)}
                          className="text-[10px] font-black text-[#FFD166] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                        >
                          System Activity <ChevronRight size={12} />
                        </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-1.5 pr-6 rounded-[22px] border border-white/10 hover:bg-white/10 transition-all duration-500">
                <div className="w-9 h-9 bg-gradient-to-tr from-[#FFD166] to-[#FFCC29] text-slate-900 rounded-[16px] flex items-center justify-center font-black text-xs shadow-2xl uppercase border-2 border-white/20">
                  {role ? role[0] : 'U'}
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className="text-[10px] font-black text-white leading-none mb-1 tracking-tight">{role === 'ADMIN' ? 'Administrator' : 'Verified User'}</span>
                  <div className="flex items-center gap-1.5">
                    <Shield size={8} className="text-[#FFD166]" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Security Active</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-4 p-2 text-slate-500 hover:text-rose-500 transition-colors"
                >
                  <LogOut size={16} />
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
