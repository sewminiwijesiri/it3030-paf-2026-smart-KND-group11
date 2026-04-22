import React, { useState, useEffect } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';

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

    const stats = [
        { label: 'Total Assigned', val: tasks.length, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', accent: 'bg-[#3f4175] text-white' },
        { label: 'Pending', val: tasks.filter(t => t.status === 'OPEN').length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'bg-[#FFD166] text-slate-900 border border-[#FFCC29]' },
        { label: 'In Progress', val: tasks.filter(t => t.status === 'IN_PROGRESS').length, icon: 'M13 10V3L4 14h7v7l9-11h-7z', accent: 'bg-slate-100 text-slate-600 border border-slate-200' },
        { label: 'Completed', val: tasks.filter(t => t.status === 'RESOLVED').length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', accent: 'bg-slate-50 text-slate-600 border border-slate-200' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-[#FFD166] text-slate-900 border-[#FFCC29]';
            case 'IN_PROGRESS': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'RESOLVED': return 'bg-[#3f4175] text-white border-transparent';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <TechnicianLayout>
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 py-10 mb-10">
                <p className="text-[#3f4175] font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                    Field Operations
                </p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
                            Welcome, {techName.split(' ')[0]}
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                            Manage maintenance tasks and service requests.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-5 py-3 rounded shadow-sm shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Online & Ready</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-10 h-10 flex items-center justify-center rounded ${stat.accent}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                            </div>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Live</span>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{stat.val}</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Assignments */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Assignments</h3>
                    <Link to="/technician/tasks" className="text-[10px] font-black text-[#3f4175] uppercase tracking-widest hover:text-[#FFD166] transition-colors">View All Tasks →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="p-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#0F172A]"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Workload...</p>
                                    </div>
                                </td></tr>
                            ) : tasks.length === 0 ? (
                                <tr><td colSpan="4" className="p-16 text-center text-slate-400 font-black uppercase tracking-widest text-xs">No tasks assigned yet.</td></tr>
                            ) : (
                                tasks.slice(0, 5).map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 text-sm mb-0.5">{task.resourceName}</div>
                                            <div className="text-[10px] text-[#3f4175] font-black">INC-{task.id.slice(-6).toUpperCase()}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(task.status)}`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link to="/technician/tasks" className="px-4 py-2 bg-[#FFD166] text-slate-900 font-black text-[9px] uppercase tracking-widest rounded hover:bg-[#FFCC29] hover:scale-105 transition-all shadow-sm shadow-[#FFD166]/20">
                                                Execute
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianDashboard;
