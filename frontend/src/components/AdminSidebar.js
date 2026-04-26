import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Admin Core', path: '/admin-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Facilities', path: '/admin/resources', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Bookings', path: '/admin-bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'User Control', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'Maintenance Hub', path: '/admin/maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Notifications', path: '/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { label: 'System Logs', path: '/admin/logs', icon: 'M9 17v-2m3 2v-4m3 2v-6m-8-4h8a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-64 bg-[#1E293B] hidden lg:flex flex-col z-[50]">
      <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 ml-2">Command Center</p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all duration-300 group ${
                isActive
                  ? 'bg-[#0F172A] text-[#FFD166] border border-white/5 shadow-xl'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-4 h-4 transition-colors ${isActive ? 'text-[#FFD166]' : 'text-slate-600 group-hover:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="text-[13px] tracking-tight font-bold">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1 h-1 rounded-full bg-[#FFD166] shadow-[0_0_10px_#FFD166] shrink-0"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 space-y-4">
        <div className="space-y-1 ml-2">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Build V2.4.0</p>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">Node-Secure OK</span>
            </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
