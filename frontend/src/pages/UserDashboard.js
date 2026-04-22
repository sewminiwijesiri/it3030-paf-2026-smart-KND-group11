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
                // Fetch User Data
                const userResponse = await api.get('/auth/me');
                setUserData({
                    name: userResponse.data.name,
                    email: userResponse.data.email
                });
                localStorage.setItem('name', userResponse.data.name);
                localStorage.setItem('email', userResponse.data.email);

                // Fetch User Tickets for stats and recent activity
                const ticketsResponse = await api.get('/api/maintenance/my');
                const tickets = ticketsResponse.data;
                
                setStats({
                    active: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
                    completed: tickets.filter(t => t.status === 'RESOLVED').length,
                    pending: tickets.filter(t => t.status === 'PENDING').length
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

    const role = localStorage.getItem('role') || 'USER';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
            {/* Soft Background Accents - Matching Home Page Hero */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3f4175]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD166]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            
            <Navbar />
            
            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                <Sidebar />

                <main className="flex-1 lg:ml-72 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth">
                    <div className="p-6 md:p-10 lg:p-16 max-w-7xl mx-auto">
                        
                        {/* Page Header - Clean & Bold like Home Page */}
                        <div className="mb-16 animate-up">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                <span className="text-[10px] font-black text-[#3f4175] uppercase tracking-[0.4em]">Student Terminal</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div>
                                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                                        Welcome, <span className="text-[#3f4175]">{userData.name.split(' ')[0]}</span>
                                    </h1>
                                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest max-w-lg">
                                        Access and manage your campus resources, maintenance requests, and academic infrastructure from one secure hub.
                                    </p>
                                </div>
                                <div className="bg-white border border-slate-200 px-8 py-5 rounded-[24px] shadow-sm flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Node Status</p>
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Operational</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Grid - Card style matched to Home Page resources */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {[
                                { label: 'Pending Response', val: stats.active, color: '#3f4175', sub: 'Action Required', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { label: 'Verified Resolves', val: stats.completed, color: '#22C55E', sub: 'Registry Updated', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                                { label: 'In Queue', val: stats.pending, color: '#FFD166', sub: 'Awaiting Triage', icon: 'M12 8v4l3 3' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#FFD166] group-hover:text-slate-900 group-hover:border-transparent transition-all">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} />
                                            </svg>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic group-hover:text-slate-400">Stat • 0{i+1}</span>
                                    </div>
                                    <div className="mb-8">
                                        <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stat.color }}></span>
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.sub}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

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
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:border-[#3f4175] transition-all">
                                                        <span className="text-[#3f4175] font-black italic text-xs">ID</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">#{ticket.id.slice(-6).toUpperCase()}</p>
                                                        <h4 className="font-bold text-slate-800 tracking-tight group-hover:text-[#3f4175] transition-colors">{ticket.resourceName}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                        ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-100' :
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
                                <div className="bg-[#3f4175] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
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
                                            { label: 'Browse Resources', path: '/resources', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
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
