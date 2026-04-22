import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/api/maintenance');
                const tickets = response.data;
                setStats({
                    total: tickets.length,
                    open: tickets.filter(t => t.status === 'OPEN').length,
                    resolved: tickets.filter(t => t.status === 'RESOLVED').length
                });
                setRecentTickets(tickets.slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 py-10 mb-10">
                <p className="text-[#3f4175] font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                    System Administrator
                </p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
                            Admin Control Hub
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                            Platform-wide operations and oversight dashboard.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-5 py-3 rounded shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">All Engines Active</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                {[
                    { label: 'Total Incidents', val: stats.total, sub: 'All Requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', accent: 'bg-[#3f4175] text-white' },
                    { label: 'Active Faults', val: stats.open, sub: 'Requires Attention', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', accent: 'bg-rose-50 text-rose-600 border border-rose-100' },
                    { label: 'Resolved', val: stats.resolved, sub: 'Closed Tickets', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'bg-[#FFD166] text-slate-900 border border-[#FFCC29]' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`w-10 h-10 flex items-center justify-center rounded ${stat.accent}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-1 rounded">{stat.sub}</span>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Maintenance Activity */}
                <div className="xl:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Maintenance Activity</h3>
                        <Link to="/admin/maintenance" className="text-[10px] font-black text-[#3f4175] uppercase tracking-widest hover:text-[#FFD166] transition-colors">View All →</Link>
                    </div>
                    <div>
                        {loading ? (
                            <div className="h-64 flex flex-col items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#0F172A]"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Terminal...</p>
                            </div>
                        ) : recentTickets.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                <span className="text-4xl mb-3">📁</span>
                                <p className="text-xs font-black uppercase tracking-widest">No recent incidents detected</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentTickets.map(ticket => (
                                    <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[#3f4175] group-hover:bg-[#3f4175] group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-[#3f4175] block mb-0.5">INC-{ticket.id.slice(-6).toUpperCase()}</span>
                                                <span className="font-bold text-slate-800 text-sm">{ticket.resourceName}</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                                            ticket.status === 'OPEN' ? 'bg-[#FFD166] text-slate-900 border-[#FFCC29]' :
                                            ticket.status === 'IN_PROGRESS' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                            'bg-[#3f4175] text-white border-transparent'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* System Integrity Panel */}
                <div className="xl:col-span-1 bg-[#0F172A] rounded border border-slate-800 p-8 flex flex-col shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD166]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <h3 className="text-white text-sm font-black uppercase tracking-widest mb-8 relative z-10">Integrity Nodes</h3>
                    <div className="flex flex-col gap-5 flex-1 relative z-10">
                        {['Database Cluster', 'Media Storage', 'Auth Gateway', 'Email Node'].map((service, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded bg-white/5 border border-white/10">
                                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{service}</span>
                                <span className="text-[8px] font-black text-emerald-400 tracking-widest bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">OPERATIONAL</span>
                            </div>
                        ))}
                    
                    {/* System Integrity */}
                    <div className="xl:col-span-1 bg-[#0F172A] rounded p-8 flex flex-col shadow-lg relative overflow-hidden group">
                        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#3f4175]/30 rounded-full blur-3xl transition-all group-hover:bg-[#3f4175]/40"></div>
                        <h3 className="text-white text-lg font-bold mb-8 tracking-tight">Integrity Nodes</h3>
                        <div className="flex flex-col gap-5 flex-1 relative z-10">
                            {['Database Cluster', 'Media Storage', 'Auth Gateway', 'Email Node'].map((service, i) => (
                                <div key={i} className="flex justify-between items-center group/item hover:bg-white/5 p-2.5 rounded transition-colors">
                                    <span className="text-[11px] text-slate-300 group-hover/item:text-white transition-colors uppercase font-semibold tracking-wider">{service}</span>
                                    <span className="text-[9px] font-bold text-emerald-400 tracking-widest bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">OPERATIONAL</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-3 bg-[#FFD166] text-slate-900 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-[#FFC033] transition-all hover:-translate-y-0.5 shadow-md">
                            Full System Scan
                        </button>
                    </div>
                    <button className="w-full mt-8 py-4 bg-[#FFD166] text-slate-900 rounded font-black text-[10px] uppercase tracking-widest hover:bg-[#FFCC29] transition-colors shadow-lg relative z-10">
                        Full System Scan
                    </button>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                {[
                    { label: 'Manage Users', desc: 'Add, remove & configure user roles', to: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
                    { label: 'Resources', desc: 'Facilities, labs & equipment management', to: '/admin/resources', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1' },
                    { label: 'Maintenance', desc: 'Review and assign incident tickets', to: '/admin/maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
                ].map((item, i) => (
                    <Link key={i} to={item.to} className="bg-white border border-slate-200 rounded p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-500 group-hover:bg-[#FFD166] group-hover:border-[#FFCC29] group-hover:text-slate-900 transition-colors shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-[#3f4175] transition-colors">{item.label}</p>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-snug">{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
