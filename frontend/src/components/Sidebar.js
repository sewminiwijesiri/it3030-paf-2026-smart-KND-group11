import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/user-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'My Requests', path: '/requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Book Resources', path: '/book', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Report Fault', path: '/report-incident', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Support Tickets', path: '/my-tickets', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { label: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Help / Support', path: '/support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-[50]">

      {/* Brand Tag */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
          <p className="text-[10px] font-black text-[#3f4175] uppercase tracking-[0.3em]">Campus Portal</p>
        </div>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-4">Student Panel</p>
      </div>

      {/* Divider */}
      <div className="mx-6 mb-4 h-px bg-slate-100"></div>

      {/* Nav Items */}
      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded font-bold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#FFD166] text-slate-900 shadow-md shadow-[#FFD166]/20'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-white/60' : 'bg-slate-100 group-hover:bg-slate-200'
                }`}>
                  <svg className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Footer */}
      <div className="p-5 space-y-3">
        {/* Brand Footer */}
        <div className="bg-[#0F172A] p-4 rounded border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD166]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">UniFlow v2.4</p>
              <p className="text-xs font-black text-white">Student Portal</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#FFD166] rounded-full"></span>
              <span className="text-[9px] font-black text-[#FFD166] uppercase tracking-widest">Live</span>
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

export default Sidebar;
