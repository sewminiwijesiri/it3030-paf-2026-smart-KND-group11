import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { 
    Calendar, 
    CheckCircle, 
    AlertCircle, 
    Star, 
    Map, 
    Sparkles, 
    ArrowRight, 
    User, 
    Mail, 
    ChevronRight,
    Search,
    PlusCircle
} from 'lucide-react';

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

    const statsConfig = [
        { label: 'Active Bookings', value: stats.active, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' },
        { label: 'Success Actions', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
        { label: 'Pending Tasks', value: stats.pending, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100' },
        { label: 'Trust Score', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50/50', border: 'border-amber-100' },
    ];

    const role = localStorage.getItem('role') || 'USER';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-[#FFD166] selection:text-slate-900 overflow-hidden relative">
            {/* Immersive Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFD166]/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <Navbar />

            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                <Sidebar />

                <main className="flex-1 lg:ml-64 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth">

                    {/* Elite Header */}
                    <div className="bg-white border-b border-slate-200/60 py-10">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
                            <div className="inline-flex items-center gap-2 bg-[#FFD166]/10 px-3 py-1 rounded-full mb-6">
                                <Sparkles className="w-3 h-3 text-[#FFD166]" />
                                <p className="text-slate-900 font-black text-[9px] uppercase tracking-[0.3em]">
                                    Control Center
                                </p>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4">
                                        Welcome Back, <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-400">
                                            {userData.name?.split(' ')[0]}
                                        </span>
                                    </h1>
                                    <p className="text-slate-400 font-medium text-sm">Managing your campus logistics with UniFlow's precision engine.</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="group bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all">
                                        <Map className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                                    </button>
                                    <Link to="/book" className="flex items-center gap-3 bg-[#FFD166] text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_50px_-12px_rgba(255,209,102,0.4)] transition-all">
                                        Book Resource <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12 space-y-16">

                        {/* High-Fidelity Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {statsConfig.map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.border} border-2 rounded-2xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 duration-500`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter italic">{stat.value}</h3>
                                    <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest opacity-60">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                            {/* Refined Activity Tracker */}
                            <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
                                <div className="p-10 pb-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Recent Incidents</h3>
                                        <p className="text-[10px] font-black text-[#5B5FEF] uppercase tracking-widest mt-2">Active Maintenance Streams</p>
                                    </div>
                                    <Link to="/my-tickets" className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-widest">
                                        View History <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <div className="p-4 space-y-2">
                                    {loading ? (
                                        [1, 2, 3].map(n => (
                                            <div key={n} className="h-20 bg-slate-50 animate-pulse rounded-3xl mx-6 mb-4"></div>
                                        ))
                                    ) : recentTickets.length > 0 ? (
                                        recentTickets.map((ticket) => (
                                            <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="flex items-center justify-between p-6 hover:bg-slate-50 rounded-[32px] transition-all duration-300 group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-105">
                                                        <Search className="w-5 h-5 text-[#FFD166]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID: {ticket.id.slice(-6).toUpperCase()}</p>
                                                        <h4 className="font-black text-slate-900 tracking-tight text-lg leading-none">{ticket.resourceName}</h4>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                                        ticket.status === 'OPEN' ? 'bg-rose-500 text-white border-rose-400' :
                                                        ticket.status === 'IN_PROGRESS' ? 'bg-amber-400 text-slate-900 border-amber-300' :
                                                        'bg-emerald-500 text-white border-emerald-400'
                                                    }`}>
                                                        {ticket.status.replace('_', ' ')}
                                                    </span>
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-center py-24 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100 mx-6 mb-6">
                                            <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">No active request logs</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Luxury Identity Card */}
                            <div className="space-y-8">
                                <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl group">
                                    {/* Animated Inner Glow */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD166]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-transform duration-[2s] group-hover:scale-150"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-5 mb-10">
                                            <div className="w-16 h-16 bg-gradient-to-tr from-white/20 to-white/5 rounded-[24px] border border-white/20 flex items-center justify-center text-3xl font-black italic shadow-inner">
                                                {userData.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{role}</p>
                                                </div>
                                                <p className="font-black tracking-tighter text-2xl leading-none">{userData.name}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 mb-12">
                                            <div className="flex items-center gap-4 text-white/60">
                                                <Mail className="w-4 h-4 text-[#FFD166]" />
                                                <span className="text-xs font-bold tracking-tight">{userData.email}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-white/60">
                                                <User className="w-4 h-4 text-[#FFD166]" />
                                                <span className="text-xs font-bold tracking-tight">Verified Faculty Member</span>
                                            </div>
                                        </div>

                                        <Link to="/profile" className="group/link flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 hover:bg-white hover:text-slate-900 rounded-3xl transition-all duration-500">
                                            <span className="font-black text-[10px] uppercase tracking-widest pl-4 italic">Security Settings</span>
                                            <div className="w-10 h-10 rounded-2xl bg-white/10 group-hover/link:bg-slate-900 flex items-center justify-center transition-colors">
                                                <ArrowRight className="w-4 h-4 group-hover/link:text-[#FFD166]" />
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Modern Action Panel */}
                                <div className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                                        System Tools
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'File Incident', path: '/report-incident', icon: AlertCircle, color: 'text-rose-500' },
                                            { label: 'Asset Logs', path: '/my-tickets', icon: Layout, color: 'text-indigo-500' },
                                            { label: 'New Booking', path: '/book', icon: PlusCircle, color: 'text-emerald-500' }
                                        ].map((action, i) => (
                                            <Link key={i} to={action.path} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group/tool">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/tool:bg-white group-hover/tool:shadow-md transition-all">
                                                        <action.icon className={`w-5 h-5 ${action.color}`} />
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover/tool:text-slate-900 transition-colors">{action.label}</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-200 group-hover/tool:text-slate-900 transition-colors" />
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
