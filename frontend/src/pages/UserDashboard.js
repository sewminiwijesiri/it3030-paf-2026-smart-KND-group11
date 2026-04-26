import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import {
    Bell, LogOut, User, AlertTriangle, ClipboardList,
    Activity, ChevronRight, Plus, CheckCircle2, Clock,
    AlertCircle, FileText, Calendar, BookOpen, Settings,
    Edit
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import Navbar from '../components/Navbar';


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
                const userResponse = await api.get('/auth/me');
                setUserData({
                    name: userResponse.data.name,
                    email: userResponse.data.email
                });
                localStorage.setItem('name', userResponse.data.name);
                localStorage.setItem('email', userResponse.data.email);

                const ticketsResponse = await api.get('/api/maintenance/my');
                const tickets = ticketsResponse.data;

                const bookingsResponse = await api.get('/api/bookings/me');
                const bookings = bookingsResponse.data;

                setStats({
                    active: bookings.filter(b => b.status === 'APPROVED').length,
                    completed: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
                    pending: bookings.filter(b => b.status === 'PENDING').length +
                             tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
                    total: tickets.length + bookings.length
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
        { id: 'report', title: 'Report a Fault', desc: 'Submit a new maintenance issue', path: '/report-incident', icon: AlertTriangle, accent: colors.orange, accentText: '#FFFFFF', bg: 'bg-[#002147]', textMain: 'text-white', textSub: 'text-blue-200', cta: 'Submit' },
        { id: 'requests', title: 'My Requests', desc: 'Track your submitted tickets', path: '/my-tickets', icon: ClipboardList, accent: colors.orange, accentText: '#FFFFFF', bg: 'bg-[#FF9F1C]', textMain: 'text-white', textSub: 'text-orange-50', cta: 'View' },
        { id: 'bookings', title: 'My Bookings', desc: 'Manage facility bookings', path: '/my-bookings', icon: BookOpen, accent: colors.lightBlue, accentText: '#FFFFFF', bg: 'bg-white', textMain: 'text-slate-900', textSub: 'text-slate-500', cta: 'View' },
        { id: 'resources', title: 'Catalogue', desc: 'Browse available resources', path: '/resource-catalogue', icon: Activity, accent: colors.navy, accentText: '#FFFFFF', bg: 'bg-white', textMain: 'text-slate-900', textSub: 'text-slate-500', cta: 'Explore' }
    ];

    const initials = userData.name ? userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

    return (
        <div className="min-h-screen bg-[#F1F5F9] font-sans flex flex-col">
            <Navbar />
            <div className="flex flex-1 pt-[72px]">
                <Sidebar />
                <main className="flex-1 lg:ml-72 flex flex-col min-h-[calc(100vh-72px)] overflow-x-hidden">
                    
                    <div className="bg-[#002147] relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9F1C]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-[#4DA8DA] font-black text-[10px] uppercase tracking-[0.4em] mb-2">{greeting}</p>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                                        Welcome, {userData.name?.split(' ')[0]}<br />
                                        <span className="text-blue-200 text-2xl font-bold">How can we assist you today?</span>
                                    </h1>
                                </div>
                                <div className="flex gap-4">
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

                    <div className="max-w-7xl mx-auto w-full px-6 py-10 space-y-10">
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-[#002147] tracking-tight">System Navigation</h2>
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
                                            <div className="relative z-10">
                                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: action.accent }}>
                                                    <Icon size={22} style={{ color: action.accentText }} />
                                                </div>
                                                <h3 className={`font-black text-base tracking-tight leading-tight ${action.textMain}`}>{action.title}</h3>
                                                <p className={`text-xs font-medium mt-1.5 leading-relaxed ${action.textSub}`}>{action.desc}</p>
                                            </div>
                                            <div className={`relative z-10 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-auto ${action.textMain} opacity-70 group-hover:opacity-100 transition-opacity`}>
                                                {action.cta} <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                                    <h2 className="text-lg font-black text-[#002147] tracking-tight flex items-center gap-2">
                                        <span className="w-1 h-4 bg-[#FF9F1C] rounded-full"></span> Recent Activity
                                    </h2>
                                    <Link to="/my-tickets" className="text-[10px] font-black uppercase tracking-widest text-[#002147] hover:text-[#FF9F1C] transition-colors no-underline">View All</Link>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {loading ? (
                                        <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-slate-100 border-t-[#002147] rounded-full animate-spin" /></div>
                                    ) : recentTickets.length === 0 ? (
                                        <div className="py-20 text-center px-8 text-slate-400 font-bold uppercase tracking-widest text-[10px]">No active records found</div>
                                    ) : (
                                        recentTickets.map((ticket) => {
                                            const s = getStatusConfig(ticket.status);
                                            const Icon = s.Icon;
                                            return (
                                                <div key={ticket.id} className="flex items-center justify-between px-8 py-5 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group">
                                                    <Link to={`/tickets/${ticket.id}`} className="flex items-center gap-4 no-underline flex-1">
                                                        <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><Icon size={18} className={s.color} /></div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-300 uppercase mb-1">#{ticket.id.slice(-6).toUpperCase()}</p>
                                                            <p className="font-black text-[#002147] text-sm group-hover:text-[#FF9F1C] transition-colors">{ticket.resourceName}</p>
                                                        </div>
                                                    </Link>
                                                    
                                                    <div className="flex items-center gap-4">
                                                        {ticket.status === 'OPEN' && (
                                                            <Link 
                                                                to={`/edit-ticket/${ticket.id}`}
                                                                className="p-2 text-slate-400 hover:text-[#FF9F1C] hover:bg-orange-50 rounded-lg transition-all"
                                                                title="Edit Request"
                                                            >
                                                                <Edit size={16} />
                                                            </Link>
                                                        )}
                                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${s.bg} ${s.color} ${s.border}`}>{s.label}</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#4DA8DA] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl border border-blue-300/30">
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 bg-[#002147] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl">{initials}</div>
                                        <div>
                                            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Active Session</p>
                                            <h3 className="font-black text-lg tracking-tight uppercase">{userData.name}</h3>
                                        </div>
                                    </div>
                                    <div className="mt-auto space-y-3">
                                        <Link to="/profile" className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#002147] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest no-underline border border-[#002147] shadow-lg">
                                            <User size={14} /> Profile Settings
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3.5 bg-transparent hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/20 transition-all">
                                            <LogOut size={14} /> Terminate Session
                                        </button>
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
