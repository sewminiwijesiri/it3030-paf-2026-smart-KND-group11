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
            <div className="animate-up">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
                    <div>
                        <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.25em] rounded-xl mb-4 border border-indigo-100 shadow-sm">
                             System Administrator
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">Admin Core</h1>
                    </div>
                    <div className="px-6 py-3 bg-white rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center">
                        <span className="text-emerald-500 mr-2 animate-pulse text-lg">●</span> All Engines Active
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {[
                        { label: 'Incident Ingress', val: stats.total, inc: 'Total Requests', color: 'indigo' },
                        { label: 'Active Faults', val: stats.open, inc: 'Requires Attention', color: 'rose' },
                        { label: 'Resolution Rate', val: stats.resolved, inc: 'Closed Tickets', color: 'emerald' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:scale-[1.02] transition-all cursor-default">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">{stat.label}</p>
                            <div className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">{stat.val}</div>
                            <p className={`text-${stat.color}-500 text-[9px] font-black uppercase tracking-widest bg-${stat.color}-50 inline-block px-2 py-0.5 rounded`}>{stat.inc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Recent Maintenance Activity */}
                    <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Recent Maintenance Activity</h3>
                            <Link to="/admin/maintenance" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
                        </div>
                        <div className="p-4">
                            {loading ? (
                                <div className="h-64 flex items-center justify-center animate-pulse text-slate-300 font-bold italic">Syncing Terminal...</div>
                            ) : recentTickets.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-300 italic">
                                    <span className="text-4xl mb-4 opacity-50">📁</span>
                                    <p className="text-xs uppercase font-black tracking-widest text-slate-400">No recent incidents detected</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {recentTickets.map(ticket => (
                                        <div key={ticket.id} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 grow shrink hover:scale-[1.01]">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-indigo-500 mb-1">INC-{ticket.id.slice(-6).toUpperCase()}</span>
                                                <span className="font-bold text-slate-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">{ticket.resourceName}</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                ticket.status === 'OPEN' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
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
                    <div className="xl:col-span-1 bg-slate-950 rounded-[3rem] p-10 flex flex-col shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                        <h3 className="text-white text-xl font-black mb-8 tracking-tighter uppercase italic">Integrity Nodes</h3>
                        <div className="flex flex-col gap-6 flex-1 relative z-10">
                            {['Database Cluster', 'Media Storage', 'Auth Gateway', 'Email Node'].map((service, i) => (
                                <div key={i} className="flex justify-between items-center group/item hover:bg-white/5 p-2 rounded-xl transition-all">
                                    <span className="text-xs text-white/50 group-hover/item:text-white transition-colors uppercase font-bold tracking-widest">{service}</span>
                                    <span className="text-[8px] font-black text-emerald-400 tracking-widest bg-emerald-400/10 px-2.5 py-1.5 rounded-lg border border-emerald-400/20 shadow-lg shadow-emerald-900/20">OPERATIONAL</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-12 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-400 hover:text-white transition-all transform active:scale-95 shadow-xl shadow-white/5">Full System Scan</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
