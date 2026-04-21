import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { label: 'Dashboard', path: '/user-dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'My Requests', path: '/requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { label: 'Book Resources', path: '/book', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Report Fault', path: '/report-incident', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { label: 'Support Tickets', path: '/my-tickets', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { label: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Help / Support', path: '/support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <aside className="fixed left-0 top-18 bottom-0 w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-[500]">
      <div className="flex-1 py-8 px-4 space-y-3.5 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#5B5FEF] text-white shadow-lg shadow-indigo-100 translate-x-1'
                  : 'text-[#64748B] hover:bg-[#E0E7FF] hover:text-[#0F172A] hover:translate-x-1'
              }`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d={item.icon} />
            </svg>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>
      
      {/* Sidebar Footer */}
      <div className="p-6">
        <div className="bg-indigo-600 p-4 rounded-2xl text-center shadow-lg shadow-indigo-100">
          <p className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.3em] mb-1">UniFlow v1.0</p>
          <p className="text-xs font-black text-white">Student Portal</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
