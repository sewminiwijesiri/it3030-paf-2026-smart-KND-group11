import React from 'react';
import { NavLink } from 'react-router-dom';

const TechnicianSidebar = () => {
  const menuItems = [
    { label: 'Technician Core', path: '/technician-dashboard', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { label: 'Assigned Tasks', path: '/technician/tasks', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { label: 'Reports', path: '/technician/reports', icon: 'M9 17v-2m3 2v-4m3 2v-6m-8-4h8a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
    { label: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col z-[50]">
      <div className="flex-1 py-10 px-6 space-y-4 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Technician Panel</p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d={item.icon} />
                </svg>
                <span className="text-sm tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-8">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl text-center">
          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Service Status</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-bold text-emerald-900">Online & Ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TechnicianSidebar;
