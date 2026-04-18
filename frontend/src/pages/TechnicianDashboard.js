import React, { useState, useEffect } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

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
        { label: 'Assigned Tasks', val: tasks.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Pending', val: tasks.filter(t => t.status === 'PENDING').length, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'In Progress', val: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed', val: tasks.filter(t => t.status === 'COMPLETED').length, color: 'text-emerald-600', bg: 'bg-emerald-50' }
    ];

    return (
        <TechnicianLayout>
            <div className="animate-up">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-md mb-4 border border-indigo-100">
                            Professional Portfolio
                        </span>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 leading-tight">Technician Hub</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, i) => (
                        <div key={i} className="card p-8 group hover:border-indigo-400 transition-colors bg-white">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <div className={`text-4xl font-extrabold ${stat.color}`}>{stat.val}</div>
                                <div className={`${stat.bg} ${stat.color} p-2 rounded-xl`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card bg-white border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-900 leading-none">Recent Assignments</h3>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Tasks</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Workload...</td></tr>
                                ) : tasks.length === 0 ? (
                                    <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No tasks assigned yet.</td></tr>
                                ) : (
                                    tasks.slice(0, 5).map((task) => (
                                        <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-slate-800">{task.resourceName}</div>
                                                <div className="text-[10px] text-slate-400 font-medium">{task.id}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                    task.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                    task.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                                                    task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition">Execute</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianDashboard;
