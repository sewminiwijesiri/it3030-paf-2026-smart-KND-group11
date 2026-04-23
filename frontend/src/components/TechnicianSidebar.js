import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const TechnicianSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Technician Core', path: '/technician-dashboard', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Assigned Tasks', path: '/technician/tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { label: 'Reports', path: '/technician/reports', icon: 'M9 17v-2m3 2v-4m3 2v-6m-8-4h8a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
    { label: 'Profile Settings', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-72 bg-[#0F172A] hidden lg:flex flex-col z-[50] border-r border-white/5">
      <div className="flex-1 py-10 px-8 space-y-3 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-10 ml-1">Field Terminal</p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                isActive
                  ? 'bg-white/5 text-[#FFD166] border border-white/5 shadow-2xl'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FFD166]' : 'text-slate-700 group-hover:text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="text-sm tracking-tight font-bold">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFD166] shadow-[0_0_15px_#FFD166] shrink-0"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-10 space-y-8">
        <div className="space-y-1 ml-1">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Build V2.4.0</p>
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Node-Secure OK</span>
            </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-5 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5"
        >
          Disconnect Terminal
        </button>
      </div>
    </aside>
  );
};

export default TechnicianSidebar;
