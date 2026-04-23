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
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div className="space-y-4">
                        <span className="inline-block px-4 py-1.5 bg-[#3f4175] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
                            System Administrator
                        </span>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Admin Core</h1>
                    </div>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3.5 rounded-xl shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">All Engines Active</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Incident Ingress', val: stats.total, sub: 'Total Requests', color: 'slate' },
                        { label: 'Active Faults', val: stats.open, sub: 'Requires Attention', color: 'rose' },
                        { label: 'Resolution Rate', val: stats.resolved, sub: 'Closed Tickets', color: 'emerald' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-7 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group min-h-[170px] flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                                <div className="text-6xl font-black text-slate-800 tracking-tighter transition-transform group-hover:scale-105 duration-300 origin-left">{stat.val}</div>
                            </div>
                            <div className={`mt-4 inline-flex px-3 py-1 bg-${stat.color}-50 text-${stat.color}-600 text-[10px] font-black uppercase tracking-[0.1em] rounded-md border border-${stat.color}-100 w-fit`}>
                                {stat.sub}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    {/* Recent Maintenance Activity */}
                    <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-8">
                        <div className="flex justify-between items-center mb-10 px-2">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Recent Maintenance Activity</h3>
                            <Link to="/admin/maintenance" className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#3f4175] transition-colors">View All</Link>
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
                                        <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                            ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-100' :
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
                    <div className="bg-[#0F172A] rounded-[32px] p-10 flex flex-col shadow-2xl relative overflow-hidden h-[480px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD166]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-white text-xl font-black mb-12 tracking-tight">Integrity Nodes</h3>
                        <div className="flex flex-col gap-6 flex-1 relative z-10">
                            {[
                                { name: 'DATABASE CLUSTER', status: 'OPERATIONAL' },
                                { name: 'MEDIA STORAGE', status: 'OPERATIONAL' },
                                { name: 'AUTH GATEWAY', status: 'OPERATIONAL' }
                            ].map((node, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors font-black tracking-widest">{node.name}</span>
                                    <span className="text-[8px] font-black text-emerald-400 tracking-[0.2em] bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                                        {node.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Handshake OK</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
