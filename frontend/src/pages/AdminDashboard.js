import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        resolved: 0
    });
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
            <div className="animate-up max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-[#3f4175] text-white text-[10px] font-bold uppercase tracking-widest rounded mb-4 shadow-sm">
                             System Administrator
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Admin Core</h1>
                    </div>
                    <div className="px-5 py-2.5 bg-white rounded border border-slate-200 text-[11px] font-semibold text-slate-700 uppercase tracking-wider shadow-sm flex items-center">
                        <span className="text-emerald-500 mr-2 animate-pulse text-sm">●</span> All Engines Active
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Incident Ingress', val: stats.total, inc: 'Total Requests', color: 'slate' },
                        { label: 'Active Faults', val: stats.open, inc: 'Requires Attention', color: 'rose' },
                        { label: 'Resolution Rate', val: stats.resolved, inc: 'Closed Tickets', color: 'emerald' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-4">{stat.label}</p>
                            <div className="text-5xl font-black text-slate-800 mb-2">{stat.val}</div>
                            <p className={`text-${stat.color}-600 text-[10px] font-bold uppercase tracking-widest bg-${stat.color}-50 inline-block px-2 py-1 rounded-sm`}>{stat.inc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Recent Maintenance Activity */}
                    <div className="xl:col-span-2 bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Maintenance Activity</h3>
                            <Link to="/admin/maintenance" className="text-[11px] font-bold text-[#3f4175] uppercase tracking-widest hover:underline">View All</Link>
                        </div>
                        <div className="p-2">
                            {loading ? (
                                <div className="h-64 flex items-center justify-center animate-pulse text-slate-400 font-semibold text-sm">Syncing Terminal...</div>
                            ) : recentTickets.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                    <span className="text-3xl mb-3 opacity-30">📁</span>
                                    <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400">No recent incidents detected</p>
                                </div>
                            ) : (
                                <div className="space-y-1 p-2">
                                    {recentTickets.map(ticket => (
                                        <div key={ticket.id} className="flex items-center justify-between p-4 rounded border border-transparent hover:border-slate-100 hover:bg-slate-50/80 transition-colors">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[#3f4175] mb-1 uppercase tracking-widest">INC-{ticket.id.slice(-6)}</span>
                                                <span className="font-semibold text-slate-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">{ticket.resourceName}</span>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                                                ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
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
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
