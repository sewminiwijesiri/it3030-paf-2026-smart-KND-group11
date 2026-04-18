import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { label: 'Admin Core', path: '/admin-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Facilities', path: '/admin/resources', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'User Control', path: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'System Logs', path: '/admin/logs', icon: 'M9 17v-2m3 2v-4m3 2v-6m-8-4h8a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
    { label: 'Support Queue', path: '/admin/support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col z-[50]">
      <div className="flex-1 py-10 px-6 space-y-4 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Command Center</p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-900'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Build v2.4.0</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
            <p className="text-xs font-bold text-slate-900">Node-Secure OK</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
