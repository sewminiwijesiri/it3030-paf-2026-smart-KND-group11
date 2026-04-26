import React, { useState, useEffect } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { FileText, Download, TrendingUp, Clock, Target } from 'lucide-react';

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const techName = localStorage.getItem('name') || 'Technician';

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get('/api/technician/tasks');
                setTasks(response.data);
            } catch (err) {
                console.error('Error fetching technician tasks', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const resolvedTasks = tasks.filter(t => t.status === 'RESOLVED');
    const openTasks = tasks.filter(t => t.status === 'OPEN');
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');

    const stats = [
        { label: 'Total Assigned', val: tasks.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', accent: 'bg-[#0F172A] text-white shadow-slate-900/20' },
        { label: 'Pending', val: openTasks.length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'bg-[#FFD166] text-slate-900 border border-[#FFCC29] shadow-amber-500/20' },
        { label: 'In Progress', val: inProgressTasks.length, icon: 'M13 10V3L4 14h7v7l9-11h-7z', accent: 'bg-white text-slate-600 border border-slate-200' },
        { label: 'Completed', val: resolvedTasks.length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-[#FFD166] text-slate-900 border-[#FFCC29] shadow-amber-500/10';
            case 'IN_PROGRESS': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'RESOLVED': return 'bg-[#0F172A] text-white border-transparent shadow-lg shadow-slate-900/10';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    const resolutionRate = tasks.length > 0 ? Math.round((resolvedTasks.length / tasks.length) * 100) : 0;

    const categoryCounts = tasks.reduce((acc, task) => {
        const cat = task.category || 'UNASSIGNED';
        if (cat !== 'NULL') {
            acc[cat] = (acc[cat] || 0) + 1;
        }
        return acc;
    }, {});

    const generateCSVReport = () => {
        if (tasks.length === 0) {
            alert("No task data available to export.");
            return;
        }

        const headers = ["Task ID", "Resource", "Category", "Priority", "Status", "Date"];
        const rows = tasks.map(t => [
            `#INC-${t.id.slice(-6).toUpperCase()}`,
            t.resourceName,
            t.category || 'N/A',
            t.priority,
            t.status,
            new Date().toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Technician_Report_${techName.replace(' ', '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadReport = () => {
        generateCSVReport();
    };

    return (
        <TechnicianLayout>
            {/* Page Header - Reverted to White style with "Technician Core" label */}
            <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 py-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-slate-900/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-[#FFD166] animate-pulse"></span>
                    <p className="text-slate-900 font-black text-[9px] uppercase tracking-[0.4em]">Operations Registry</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
                            Technician Core: {techName.split(' ')[0]}
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] max-w-lg">
                            Active resource monitoring and incident resolution dashboard.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownloadReport}
                            className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                        >
                            <Download size={12} />
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover:scale-110 shadow-lg ${stat.accent}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} /></svg>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Live</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-slate-900 tracking-tight mb-0.5">{stat.val}</div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">

                {/* Resolution Report Card - Previous Dark Blue style */}
                <div className="lg:col-span-2 bg-[#0F172A] text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group transition-all duration-500">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-white/10 rounded-xl">
                                    <FileText className="text-[#FFD166]" size={20} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Efficiency Analysis</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="text-5xl font-black text-white tracking-tighter mb-2">{resolutionRate}%</h4>
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-6">Registry Resolution Ratio</p>
                                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-emerald-400 transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: `${resolutionRate}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-6 flex flex-col justify-center">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-3">
                                            <TrendingUp size={16} className="text-emerald-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Performance</span>
                                        </div>
                                        <span className="text-[10px] font-black text-[#FFD166] uppercase tracking-widest">Optimal</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-amber-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Avg. MTTR</span>
                                        </div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">2.4 Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sector Breakdown Report */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:border-slate-300 transition-all flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <Target className="text-[#0F172A]" size={20} />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Sector Breakdown</h3>
                    </div>
                    <div className="flex-1 space-y-6">
                        {Object.entries(categoryCounts).length > 0 ? Object.entries(categoryCounts).map(([cat, count], i) => (
                            <div key={cat} className="group">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                    <span className="text-slate-400 group-hover:text-slate-900 transition-colors">{cat}</span>
                                    <span className="text-slate-900">{count} Units</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <div
                                        className={`h-full transition-all duration-1000 ${i % 2 === 0 ? 'bg-[#0F172A]' : 'bg-[#FFD166]'}`}
                                        style={{ width: `${(count / tasks.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex items-center justify-center py-8 text-center opacity-30">
                                <p className="text-[10px] font-black uppercase tracking-widest italic">No Active Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Assignments Table */}
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Active Service Queue</h3>
                    </div>
                    <Link to="/technician/tasks" className="text-[9px] font-black text-slate-900 uppercase tracking-widest hover:text-[#FFD166] transition-colors flex items-center gap-2 group">
                        Access Terminal
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Resource Node</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="p-32 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0F172A] rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Syncing Local Registry...</p>
                                    </div>
                                </td></tr>
                            ) : (
                                tasks.slice(0, 5).map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50 transition-all group">
                                        <td className="px-8 py-4">
                                            <div className="font-bold text-slate-900 text-sm mb-1 group-hover:text-slate-600 transition-colors tracking-tight">{task.resourceName}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] text-slate-400 font-black opacity-60 uppercase tracking-wider">Node:</span>
                                                <span className="text-[9px] font-mono text-slate-400">#INC-{task.id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50' :
                                                    task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50' :
                                                        'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all ${getStatusStyle(task.status)}`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <Link to="/technician/tasks" className="px-6 py-2.5 bg-[#FFD166] text-slate-900 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-white hover:border-slate-900 hover:scale-105 transition-all shadow-xl shadow-amber-500/10 active:scale-95 inline-block">
                                                Execute
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-8 bg-slate-50/30 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">End of Active Operational Registry</p>
                </div>
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianDashboard;
