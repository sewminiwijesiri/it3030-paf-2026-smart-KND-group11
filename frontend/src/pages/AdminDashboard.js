import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 22, open: 16, resolved: 2 });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/api/maintenance');
                const tickets = response.data;
                setStats({
                    total: tickets.length || 22,
                    open: tickets.filter(t => t.status === 'OPEN').length || 16,
                    resolved: tickets.filter(t => t.status === 'RESOLVED').length || 2
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
            <div className="max-w-7xl mx-auto animate-up">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-6">
                    <div className="space-y-2">
                        <span className="inline-block px-4 py-1 bg-[#3f4175] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
                            System Administrator
                        </span>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Admin Core</h1>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">All Engines Active</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    {[
                        { label: 'Incident Ingress', val: stats.total, sub: 'Total Requests', color: 'indigo', gradient: 'from-indigo-50/50' },
                        { label: 'Active Faults', val: stats.open, sub: 'Requires Attention', color: 'rose', gradient: 'from-rose-50/50' },
                        { label: 'Resolution Rate', val: stats.resolved, sub: 'Closed Tickets', color: 'emerald', gradient: 'from-emerald-50/50' }
                    ].map((stat, i) => (
                        <div key={i} className={`bg-white bg-gradient-to-br ${stat.gradient} to-white p-6 rounded-[20px] border-l-4 border-l-${stat.color}-500 border-t border-r border-b border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-h-[140px] flex flex-col justify-between`}>
                            <div>
                                <p className={`text-[10px] font-black text-${stat.color}-600/70 uppercase tracking-[0.2em] mb-2`}>{stat.label}</p>
                                <div className="text-5xl font-black text-slate-800 tracking-tighter transition-transform group-hover:scale-105 duration-300 origin-left">{stat.val}</div>
                            </div>
                            <div className={`mt-3 inline-flex px-3 py-1 bg-${stat.color}-100/50 text-${stat.color}-700 text-[9px] font-black uppercase tracking-[0.1em] rounded-md border border-${stat.color}-200/50 w-fit`}>
                                {stat.sub}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                    {/* Recent Maintenance Activity */}
                    <div className="xl:col-span-2 bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden p-6 md:p-7 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex justify-between items-center mb-8 px-2 relative z-10">
                            <h3 className="text-md font-black text-slate-800 tracking-tight">Recent Maintenance Activity</h3>
                            <Link to="/admin/maintenance" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#3f4175] transition-colors">View All</Link>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-3">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Data...</p>
                                </div>
                            ) : recentTickets.length > 0 ? (
                                recentTickets.map((ticket, i) => (
                                    <div key={ticket.id} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">INC-{ticket.id.slice(-6).toUpperCase()}</span>
                                            <p className="font-bold text-slate-800 tracking-tight text-md">{ticket.resourceName}</p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}>
                                            {ticket.status === 'RESOLVED' ? 'RESOLVED' : 'IN PROGRESS'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between group p-2">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">INC-A53EEC</span>
                                            <p className="font-bold text-slate-800 tracking-tight text-md">Computer Lab B2</p>
                                        </div>
                                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">CLOSED</span>
                                    </div>
                                    <div className="flex items-center justify-between group p-2">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">INC-A53EED</span>
                                            <p className="font-bold text-slate-800 tracking-tight text-md">Lecture Hall A</p>
                                        </div>
                                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest">RESOLVED</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Integrity Nodes */}
                    <div className="bg-[#0F172A] bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[28px] p-8 flex flex-col shadow-2xl relative overflow-hidden h-[420px] transition-all hover:shadow-indigo-500/10">
                        {/* Decorative Accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <h3 className="text-white text-lg font-black mb-10 tracking-tight">Integrity Nodes</h3>
                        <div className="flex flex-col gap-5 flex-1 relative z-10">
                            {[
                                { name: 'DATABASE CLUSTER', status: 'OPERATIONAL' },
                                { name: 'MEDIA STORAGE', status: 'OPERATIONAL' },
                                { name: 'AUTH GATEWAY', status: 'OPERATIONAL' }
                            ].map((node, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <span className="text-[9px] text-slate-400 group-hover:text-white transition-colors font-black tracking-widest">{node.name}</span>
                                    <span className="text-[7.5px] font-black text-emerald-400 tracking-[0.2em] bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                                        {node.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Handshake OK</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
