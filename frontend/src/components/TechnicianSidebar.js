import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const TechnicianSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Technician Core', path: '/technician-dashboard', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Assigned Tasks', path: '/technician/tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { label: 'Notifications', path: '/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { label: 'Reports', path: '/technician/reports', icon: 'M9 17v-2m3 2v-4m3 2v-6m-8-4h8a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
    { label: 'Profile Settings', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-72 bg-[#002147] hidden lg:flex flex-col z-[50] border-r border-white/5">
      <div className="flex-1 py-10 px-6 space-y-1 overflow-y-auto scroll-smooth">
        
        {/* Branding Area */}
        <div className="mb-10 pl-4">
          <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-[0.4em] mb-1">Field Terminal</p>
          <h2 className="text-white text-lg font-black tracking-tight">Technician <span className="text-[#FF9F1C]">Hub</span></h2>
        </div>

        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 group mb-2 ${
                isActive
                  ? 'bg-white/10 text-white shadow-xl shadow-black/20'
                  : 'text-blue-100/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-5 h-5 transition-all duration-500 ${isActive ? 'text-[#FF9F1C] scale-110' : 'text-blue-100/30 group-hover:text-blue-100/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="text-sm tracking-tight font-black">{item.label}</span>
                {isActive && (
                  <div className="ml-auto flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C] shadow-[0_0_15px_#FF9F1C]"></div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-8 space-y-6 bg-black/10 border-t border-white/5">
        <div className="space-y-1.5 ml-1">
            <p className="text-[8px] font-black text-blue-200/30 uppercase tracking-[0.3em]">System Build V2.4.0</p>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">Telemetry Secure</span>
            </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 border border-rose-500/20"
        >
          Disconnect Terminal
        </button>
      </div>
    </aside>
  );
};

export default TechnicianSidebar;
