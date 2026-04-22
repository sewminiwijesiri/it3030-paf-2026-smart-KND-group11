import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Admin Core', path: '/admin-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Facilities', path: '/admin/resources', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'User Control', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Maintenance Hub', path: '/admin/maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'System Logs', path: '/admin/logs', icon: 'M9 17v-2m3 2v-4m3 2v-6m-8-4h8a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-72 bg-[#1E293B] border-r border-[#334155] hidden lg:flex flex-col z-[50]">
      <div className="flex-1 py-8 px-5 space-y-3 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Command Center</p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded font-bold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#FFD166] text-slate-900 shadow-md shadow-[#FFD166]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-white/60' : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <svg className={`w-4 h-4 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d={item.icon} />
                  </svg>
                </div>
                <span className="text-sm tracking-tight font-semibold">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-6 mt-4 h-px bg-slate-100"></div>

      {/* Sidebar Footer */}
      <div className="p-5 space-y-3">
        {/* System Status */}
        <div className="bg-[#0F172A] p-4 rounded border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD166]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">UniFlow v2.4</p>
              <p className="text-xs font-black text-white">Admin Portal</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded font-semibold text-sm transition-all border border-transparent hover:border-rose-100 group"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm uppercase tracking-widest font-black text-[10px]">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
