import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import {
    Bell, LogOut, User, AlertTriangle, ClipboardList,
    Activity, ChevronRight, Plus, CheckCircle2, Clock,
    AlertCircle, FileText, Calendar, BookOpen, Settings
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: localStorage.getItem('name') || 'User',
        email: localStorage.getItem('email') || 'user@uniflow.com'
    });
    const [stats, setStats] = useState({ active: 0, completed: 0, pending: 0, total: 0 });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { unreadCount } = useNotifications();

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    // Palette Colors
    const colors = {
        navy: '#002147',
        orange: '#FF9F1C',
        lightBlue: '#4DA8DA',
        white: '#FFFFFF',
        slate: '#F1F5F9'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get('/auth/me');
                setUserData({ name: userRes.data.name, email: userRes.data.email });
                localStorage.setItem('name', userRes.data.name);
                localStorage.setItem('email', userRes.data.email);

                const ticketsRes = await api.get('/api/maintenance/my');
                const tickets = ticketsRes.data;
                setStats({
                    active: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
                    completed: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
                    pending: tickets.filter(t => t.status === 'PENDING').length,
                    total: tickets.length
                });
                setRecentTickets(tickets.slice(0, 4));
            } catch (err) {
                console.error('Dashboard fetch error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'OPEN': return { label: 'Open', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', Icon: AlertCircle };
            case 'IN_PROGRESS': return { label: 'In Progress', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', Icon: Clock };
            case 'RESOLVED': return { label: 'Resolved', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', Icon: CheckCircle2 };
            case 'CLOSED': return { label: 'Closed', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', Icon: CheckCircle2 };
            default: return { label: status, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100', Icon: FileText };
        }
    };

    const quickActions = [
        {
            id: 'report',
            title: 'Report a Fault',
            desc: 'Submit a new maintenance or technical issue',
            path: '/report-incident',
            icon: AlertTriangle,
            accent: colors.orange,
            accentText: '#FFFFFF',
            bg: 'bg-[#002147]',
            textMain: 'text-white',
            textSub: 'text-blue-200',
            cta: 'Submit Request'
        },
        {
            id: 'requests',
            title: 'My Requests',
            desc: 'View and track all your submitted tickets',
            path: '/my-tickets',
            icon: ClipboardList,
            accent: colors.orange,
            accentText: '#FFFFFF',
            bg: 'bg-[#FF9F1C]',
            textMain: 'text-white',
            textSub: 'text-orange-50',
            cta: 'View Tickets'
        },
        {
            id: 'bookings',
            title: 'My Bookings',
            desc: 'Manage your resource and facility bookings',
            path: '/my-bookings',
            icon: BookOpen,
            accent: colors.lightBlue,
            accentText: '#FFFFFF',
            bg: 'bg-white',
            textMain: 'text-slate-900',
            textSub: 'text-slate-500',
            cta: 'View Bookings'
        },
        {
            id: 'resources',
            title: 'Browse Resources',
            desc: 'Explore and book available university resources',
            path: '/book',
            icon: Activity,
            accent: colors.navy,
            accentText: '#FFFFFF',
            bg: 'bg-white',
            textMain: 'text-slate-900',
            textSub: 'text-slate-500',
            cta: 'Explore'
        },
    ];

    const initials = userData.name ? userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans flex flex-col">

            {/* ── TOP NAV ── */}
            <header className="sticky top-0 z-[60] bg-[#002147] border-b border-white/10 shadow-md h-16 flex items-center shrink-0">
                <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/user-dashboard" className="flex items-center gap-2 no-underline">
                        <div className="w-8 h-8 bg-[#FF9F1C] rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-xs">UF</span>
                        </div>
                        <span className="text-white font-black text-lg tracking-tight">UniFlow</span>
                    </Link>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {/* Notification */}
                        <Link to="/my-tickets" className="relative p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all no-underline">
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF9F1C] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-[#002147]">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* Profile */}
                        <Link to="/profile" className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all no-underline">
                            <Settings size={18} />
                        </Link>

                        <div className="h-6 w-[1px] bg-white/20 mx-2 hidden sm:block"></div>

                        {/* Avatar */}
                        <div className="flex items-center gap-3 pl-1">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] font-bold text-white/70 leading-none mb-1 uppercase tracking-wider">User Portal</span>
                                <span className="text-xs font-black text-white leading-none">{userData.name?.split(' ')[0]}</span>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-[#4DA8DA] text-white font-black text-sm flex items-center justify-center shadow-lg">
                                {initials}
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-white/80 hover:text-white hover:bg-red-500/20 transition-all ml-1"
                        >
                            <LogOut size={14} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* ── SIDEBAR ── */}
                <Sidebar />

                {/* ── MAIN CONTENT ── */}
                <main className="flex-1 lg:ml-72 flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden">
                    
                    {/* ── HERO WELCOME BANNER ── */}
                    <div className="bg-[#002147] relative overflow-hidden shrink-0">
                        {/* Decorative blobs */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9F1C]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#4DA8DA]/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-[#4DA8DA] font-black text-[10px] uppercase tracking-[0.4em] mb-2">{greeting}</p>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                                        Welcome, {userData.name?.split(' ')[0]}<br />
                                        <span className="text-blue-200 text-2xl font-bold">How can we assist you today?</span>
                                    </h1>
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">
                                            Authenticated User
                                        </span>
                                        <span className="text-blue-300 text-[11px] font-medium opacity-80">{userData.email}</span>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="flex gap-4 flex-wrap">
                                    {[
                                        { label: 'Active', value: stats.active, color: 'text-orange-400' },
                                        { label: 'Resolved', value: stats.completed, color: 'text-emerald-400' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center min-w-[110px] backdrop-blur-sm">
                                            <p className={`text-3xl font-black ${s.color} leading-none`}>{loading ? '—' : s.value}</p>
                                            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mt-2">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">

                        {/* ── QUICK ACTION CARDS ── */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-[#002147] tracking-tight">System Navigation</h2>
                                <Link to="/report-incident" className="flex items-center gap-2 bg-[#FF9F1C] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all no-underline shadow-lg shadow-orange-500/20">
                                    <Plus size={14} />
                                    New Incident
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                        <Link
                                            key={action.id}
                                            to={action.path}
                                            className={`group relative ${action.bg} rounded-3xl p-7 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline overflow-hidden border border-slate-100`}
                                        >
                                            {/* BG Decoration */}
                                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl"
                                                style={{ backgroundColor: action.accent }} />

                                            <div className="relative z-10">
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md"
                                                    style={{ backgroundColor: action.accent }}>
                                                    <Icon size={22} style={{ color: action.accentText }} />
                                                </div>
                                                <h3 className={`font-black text-base tracking-tight leading-tight ${action.textMain}`}>
                                                    {action.title}
                                                </h3>
                                                <p className={`text-xs font-medium mt-1.5 leading-relaxed ${action.textSub}`}>
                                                    {action.desc}
                                                </p>
                                            </div>

                                            <div className={`relative z-10 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-auto ${action.textMain} opacity-70 group-hover:opacity-100 transition-opacity`}>
                                                {action.cta}
                                                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ── RECENT TICKETS + PROFILE CARD ── */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                            {/* Recent Tickets */}
                            <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                                    <div>
                                        <h2 className="text-base font-black text-[#002147] tracking-tight">Recent Activity</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Your submission registry</p>
                                    </div>
                                    <Link to="/my-tickets" className="text-[10px] font-black text-[#002147] uppercase tracking-widest hover:text-[#FF9F1C] transition-colors no-underline flex items-center gap-1">
                                        View All Reports <ChevronRight size={12} />
                                    </Link>
                                </div>

                                <div className="divide-y divide-slate-50">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <div className="w-10 h-10 border-4 border-slate-100 border-t-[#002147] rounded-full animate-spin" />
                                        </div>
                                    ) : recentTickets.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
                                                <FileText size={32} className="text-slate-300" />
                                            </div>
                                            <h3 className="font-black text-[#002147] text-sm mb-1 uppercase tracking-tight">Registry Empty</h3>
                                            <p className="text-slate-400 text-[11px] font-medium">You have no active maintenance records at this time.</p>
                                            <Link to="/report-incident" className="mt-6 px-6 py-3 bg-[#002147] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#003166] transition-all no-underline shadow-md">
                                                Start New Report
                                            </Link>
                                        </div>
                                    ) : (
                                        recentTickets.map((ticket) => {
                                            const s = getStatusConfig(ticket.status);
                                            const SIcon = s.Icon;
                                            return (
                                                <Link
                                                    key={ticket.id}
                                                    to={`/tickets/${ticket.id}`}
                                                    className="flex items-center gap-4 px-8 py-6 hover:bg-slate-50 transition-all group no-underline"
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.border} border flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                                                        <SIcon size={20} className={s.color} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ref: #{ticket.id?.slice(-6).toUpperCase()}</span>
                                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                                                                <Calendar size={9} />
                                                                {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <p className="font-black text-[#002147] text-sm truncate group-hover:text-[#FF9F1C] transition-colors uppercase tracking-tight">
                                                            {ticket.resourceName || 'Unnamed Request'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${s.bg} ${s.color} ${s.border} shrink-0`}>
                                                            {s.label}
                                                        </span>
                                                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 group-hover:text-[#002147] transition-colors">
                                                            VIEW <ChevronRight size={10} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="flex flex-col gap-6">

                                {/* Profile card */}
                                <div className="bg-[#4DA8DA] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl border border-blue-300/30">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="w-16 h-16 bg-[#002147] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl border border-white/10">
                                                {initials}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Active Session</p>
                                                <h3 className="font-black text-lg leading-tight uppercase tracking-tight">{userData.name}</h3>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-8">
                                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                <p className="text-[9px] font-black text-blue-50 uppercase tracking-widest mb-1 opacity-70">User Handle</p>
                                                <p className="text-xs font-bold truncate">{userData.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Link to="/profile" className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#002147] text-white hover:bg-[#003166] rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all no-underline shadow-lg border border-[#002147]">
                                                <User size={14} />
                                                Edit Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-transparent hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/20"
                                            >
                                                <LogOut size={14} />
                                                Terminate Session
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Status legend */}
                                <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Status Definitions</h3>
                                    <div className="space-y-5">
                                        {[
                                            { label: 'Open', desc: 'Request submitted to system', color: 'bg-rose-500' },
                                            { label: 'In Progress', desc: 'Technician assigned & working', color: 'bg-amber-400' },
                                            { label: 'Resolved', desc: 'Solution verified by team', color: 'bg-emerald-500' },
                                            { label: 'Closed', desc: 'Request archived', color: 'bg-slate-400' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${item.color} shrink-0 shadow-sm`} />
                                                <div>
                                                    <p className="text-[11px] font-black text-[#002147] leading-none uppercase tracking-tight">{item.label}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
