import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [userData, setUserData] = useState({
        name: localStorage.getItem('name') || 'User',
        email: localStorage.getItem('email') || 'user@uniflow.com'
    });
    const [stats, setStats] = useState({ active: 0, completed: 0, pending: 0 });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch User Data
                const userResponse = await api.get('/auth/me');
                setUserData({
                    name: userResponse.data.name,
                    email: userResponse.data.email
                });
                localStorage.setItem('name', userResponse.data.name);
                localStorage.setItem('email', userResponse.data.email);

                // 2. Fetch User Tickets (Maintenance/Incidents)
                const ticketsResponse = await api.get('/api/maintenance/my');
                const tickets = ticketsResponse.data;

                // 3. Fetch User Bookings
                const bookingsResponse = await api.get('/api/bookings/me');
                const bookings = bookingsResponse.data;

                setStats({
                    // Active Bookings = Approved Bookings
                    active: bookings.filter(b => b.status === 'APPROVED').length,
                    
                    // Completed Actions = Resolved Maintenance Tickets
                    completed: tickets.filter(t => t.status === 'RESOLVED').length,
                    
                    // Pending Requests = Pending Bookings + Pending Tickets
                    pending: bookings.filter(b => b.status === 'PENDING').length + 
                             tickets.filter(t => t.status === 'PENDING').length
                });

                setRecentTickets(tickets.slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch user dashboard data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statsConfig = [
        { label: 'Active Bookings', value: stats.active, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { label: 'Completed Actions', value: stats.completed, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Pending Requests', value: stats.pending, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        { label: 'Platform Rating', value: '4.9', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    ];



    const role = localStorage.getItem('role') || 'USER';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
            {/* Soft Background Accents - Matching Home Page Hero */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1E293B]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD166]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <Navbar />

            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                <Sidebar />

                <main className={`flex-1 lg:ml-64 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth`}>

                    {/* Header */}
                    <div className="bg-white border-b border-slate-200 py-6">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

                            <p className="text-[#1E293B] font-black text-[10px] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                Dashboard Portal
                            </p>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Welcome, <br />
                                    <span className="text-slate-500">
                                        {userData.name?.split(' ')[0]}
                                    </span>
                                </h1>

                                <div className="flex gap-3 mt-2 md:mt-0">
                                    <button className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">
                                        View Map
                                    </button>

                                    <button className="bg-[#FFD166] text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FFCC29] transition-all shadow-md shadow-[#FFD166]/20">
                                        Book Resource
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10 space-y-12">

                        {/* 1. STATISTICS BAR (Matched to Home.js Stats Bar) */}
                        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                            {/* Decorative Accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFCC29]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
                                    {statsConfig.map((stat, i) => (
                                        <div key={i} className="text-center px-4">
                                            <div className={`w-10 h-10 mx-auto ${stat.bg} ${stat.border} border rounded-full flex items-center justify-center mb-3`}>
                                                <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                                            </div>
                                            <h3 className={`text-3xl md:text-4xl font-black ${stat.color} mb-1 tracking-tighter italic`}>{stat.value}</h3>
                                            <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest opacity-80">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                            {/* Live Incident Tracker - Table style matched to modern lists */}
                            <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden p-10">
                                <div className="flex justify-between items-center mb-12 px-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Incidents</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live maintenance updates</p>
                                    </div>
                                    <Link to="/my-tickets" className="px-6 py-2.5 bg-[#FFD166] text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#FFD166]/20">
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="h-64 flex items-center justify-center text-slate-400 font-black text-xs uppercase tracking-widest">
                                            Synchronizing...
                                        </div>
                                    ) : recentTickets.length > 0 ? (
                                        recentTickets.map((ticket) => (
                                            <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="flex items-center justify-between p-6 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-[24px] transition-all group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:border-[#1E293B] transition-all">
                                                        <span className="text-[#1E293B] font-black italic text-xs">ID</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">#{ticket.id.slice(-6).toUpperCase()}</p>
                                                        <h4 className="font-bold text-slate-800 tracking-tight group-hover:text-[#1E293B] transition-colors">{ticket.resourceName}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                            ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        }`}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[32px]">
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No active requests found</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar Actions & Identity - Matching Home Page Footer/Nav */}
                            <div className="space-y-10">

                                {/* Identity Card */}
                                <div className="bg-[#1E293B] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-xl font-black italic">
                                                {userData.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Clearance: {role}</p>
                                                <p className="font-bold tracking-tight text-lg leading-none">{userData.name}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-10">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">System Email</p>
                                            <p className="text-xs font-bold text-white/80">{userData.email}</p>
                                        </div>
                                        <Link to="/profile" className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            Manage Profile
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </Link>
                                    </div>
                                </div>

                                {/* Quick Tools - Matching Home Feature Style */}
                                <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 px-2">Quick Actions</h3>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Report Incident', path: '/report-incident', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                                            { label: 'Browse Resources', path: '/book', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
                                        ].map((action, i) => (
                                            <Link key={i} to={action.path} className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#FFD166] group-hover:text-slate-900 transition-all">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={action.icon} /></svg>
                                                </div>
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{action.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
