import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Calendar, 
    ListTodo, 
    Bookmark, 
    AlertTriangle, 
    Bell, 
    User, 
    LogOut,
    ShieldCheck,
    Cpu
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Dashboard', path: '/user-dashboard', icon: LayoutDashboard },
        { label: 'Book Resources', path: '/book', icon: Calendar },
        { label: 'My Requests', path: '/my-tickets', icon: ListTodo },
        { label: 'My Bookings', path: '/my-bookings', icon: Bookmark },
        { label: 'Report Fault', path: '/report-incident', icon: AlertTriangle },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Profile', path: '/profile', icon: User },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <aside className="fixed left-0 top-[72px] bottom-0 w-64 bg-[#0F172A] hidden lg:flex flex-col z-[50] border-r border-white/5">
            <div className="flex-1 py-8 px-5 space-y-2 overflow-y-auto scrollbar-hide">
                <div className="px-4 mb-10">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Personal Terminal</p>
                    <div className="h-0.5 w-8 bg-[#FFD166] rounded-full"></div>
                </div>

                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black transition-all duration-500 group relative ${
                                isActive
                                    ? 'bg-gradient-to-r from-white/10 to-transparent text-[#FFD166] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-[18px] h-[18px] transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-xs uppercase tracking-widest">{item.label}</span>
                                {isActive && (
                                    <>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FFD166] rounded-r-full shadow-[0_0_15px_#FFD166]"></div>
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-pulse"></div>
                                    </>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-8 mt-auto border-t border-white/5 space-y-8">
                <div className="space-y-3 px-2">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-slate-600" />
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Core Engine V2.4</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Security Protocol ACTIVE</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5 group"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
