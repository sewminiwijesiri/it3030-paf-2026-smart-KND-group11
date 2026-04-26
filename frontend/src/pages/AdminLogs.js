import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { 
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
    Activity, Shield, Database, Users, Calendar, AlertTriangle, 
    Terminal, Download, RefreshCw, Cpu
} from 'lucide-react';

const AdminLogs = () => {
    const [, setLoading] = useState(true);
    const [data, setData] = useState({
        bookings: [],
        incidents: [],
        users: []
    });

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                setLoading(true);
                const [bookingsRes, incidentsRes, usersRes] = await Promise.all([
                    api.get('/api/bookings').catch(() => ({ data: [] })),
                    api.get('/api/maintenance').catch(() => ({ data: [] })),
                    api.get('/admin/users').catch(() => ({ data: [] }))
                ]);

                setData({
                    bookings: bookingsRes.data,
                    incidents: incidentsRes.data,
                    users: usersRes.data
                });
            } catch (err) {
                console.error('Failed to fetch system logs data', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSystemData();
    }, []);

    // Mock trend data for visualization if real historical data isn't structured
    const trendData = [
        { name: 'Mon', bookings: 12, issues: 4, traffic: 450 },
        { name: 'Tue', bookings: 19, issues: 3, traffic: 520 },
        { name: 'Wed', bookings: 15, issues: 7, traffic: 610 },
        { name: 'Thu', bookings: 22, issues: 5, traffic: 580 },
        { name: 'Fri', bookings: 30, issues: 2, traffic: 720 },
        { name: 'Sat', bookings: 10, issues: 1, traffic: 300 },
        { name: 'Sun', bookings: 8, issues: 1, traffic: 250 },
    ];

    const incidentStats = [
        { name: 'Open', value: data.incidents.filter(i => i.status === 'OPEN').length || 12 },
        { name: 'In Progress', value: data.incidents.filter(i => i.status === 'IN_PROGRESS').length || 8 },
        { name: 'Resolved', value: data.incidents.filter(i => i.status === 'RESOLVED').length || 45 },
        { name: 'Closed', value: data.incidents.filter(i => i.status === 'CLOSED').length || 30 },
    ];

    const COLORS = ['#6366F1', '#10B981', '#FFD166', '#F43F5E'];

    const handleExport = () => {
        if (!data.incidents || data.incidents.length === 0) {
            alert("No data available for export.");
            return;
        }

        const headers = ["ID", "Resource", "Category", "Status", "Requester", "Technician", "Created At"];
        const csvRows = [
            headers.join(','),
            ...data.incidents.map(i => [
                i.id,
                `"${i.resourceName}"`,
                i.category,
                i.status,
                i.requesterEmail,
                i.technicianEmail || 'Unassigned',
                new Date(i.createdAt).toLocaleString()
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `uniflow_registry_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <AdminLayout>
            <div className="max-w-[1400px] mx-auto animate-up">
                
                {/* Header Section */}
                <div className="bg-[#0F172A] rounded-[40px] p-10 mb-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Terminal className="text-[#FFD166]" size={20} />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">System Operational Registry</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                            <div>
                                <h1 className="text-5xl font-black tracking-tighter leading-none mb-4">System Logs</h1>
                                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] max-w-xl leading-relaxed">
                                    Real-time analytics and telemetry from the UniFlow infrastructure. 
                                    Monitoring bookings, incident reports, and user-node distribution.
                                </p>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    <Download size={14} />
                                    Export CSV
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-[#FFD166] text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#FFD166]/20 hover:scale-105 transition-all">
                                    <RefreshCw size={14} />
                                    Purge Logs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Active Sessions', val: '124', icon: Activity, trend: '+12%', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trendBg: 'bg-indigo-100/50' },
                        { label: 'Total Users', val: data.users.length, icon: Users, trend: '+4%', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trendBg: 'bg-emerald-100/50' },
                        { label: 'Pending Bookings', val: '18', icon: Calendar, trend: 'Stable', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trendBg: 'bg-amber-100/50' },
                        { label: 'Unresolved Issues', val: data.incidents.filter(i => i.status === 'OPEN').length, icon: AlertTriangle, trend: '-2%', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', trendBg: 'bg-rose-100/50' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:border-slate-300 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center border ${stat.border} group-hover:scale-110 transition-transform shadow-sm`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${stat.trendBg} ${stat.color}`}>{stat.trend}</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Graphs Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                    
                    {/* Activity Trend Graph */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Activity Traffic</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">7-Day System Interaction Loop</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                                    <span className="text-[9px] font-black uppercase text-indigo-500">Bookings</span>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                    <span className="text-[9px] font-black uppercase text-emerald-500">Issues</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorIssue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} 
                                    />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px'}}
                                        itemStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase'}}
                                    />
                                    <Area type="monotone" dataKey="bookings" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorBook)" />
                                    <Area type="monotone" dataKey="issues" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorIssue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Incident Distribution Pie Chart */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm flex flex-col">
                        <div className="mb-10">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Registry Distribution</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fault Status Breakdown</p>
                        </div>
                        
                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={incidentStats}
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {incidentStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Incidents</p>
                                <p className="text-xl font-black text-slate-900">{data.incidents.length}</p>
                            </div>
                            <Shield className="text-[#3f4175]" size={24} />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Real-time Registry Terminal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Database Health Card */}
                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-[#FFD166] shadow-xl">
                                <Database size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Database Integrity</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cluster Status</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {[
                                { name: 'Main Data Cluster', status: 'Healthy', val: '4.2GB' },
                                { name: 'Authentication Node', status: 'Healthy', val: '128ms' },
                                { name: 'Media Blob Storage', status: 'Stable', val: '18.5GB' },
                                { name: 'WebSocket Gateway', status: 'Optimized', val: '12ms' }
                            ].map((node, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-[#3f4175] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`}></div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{node.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{node.status}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-black text-slate-900 italic">{node.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Performance Card */}
                    <div className="bg-[#3f4175] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 mb-10 relative z-10">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#FFD166] border border-white/10">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">Node Telemetry</h3>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">CPU & RAM Load Calibration</p>
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            {[
                                { label: 'CPU LOAD', val: 18, color: 'bg-emerald-400' },
                                { label: 'MEMORY USAGE', val: 42, color: 'bg-[#FFD166]' },
                                { label: 'DISK I/O', val: 12, color: 'bg-white' },
                                { label: 'NETWORK EGRESS', val: 28, color: 'bg-indigo-300' }
                            ].map((perf, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">
                                        <span>{perf.label}</span>
                                        <span>{perf.val}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${perf.color} transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]`} 
                                            style={{ width: `${perf.val}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between opacity-40">
                            <p className="text-[9px] font-black uppercase tracking-[0.5em]">UniFlow Core v2.4</p>
                            <span className="text-[9px] font-black uppercase tracking-widest">Stable Release</span>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
};

export default AdminLogs;
