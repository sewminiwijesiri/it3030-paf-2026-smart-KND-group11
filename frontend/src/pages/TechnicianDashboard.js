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
        { label: 'Assigned Tasks', val: tasks.length, color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
        { label: 'Pending', val: tasks.filter(t => t.status === 'PENDING').length, color: 'text-[#F59E0B]', bg: 'bg-[#FFF7ED]', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'In Progress', val: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
        { label: 'Completed', val: tasks.filter(t => t.status === 'COMPLETED').length, color: 'text-[#22C55E]', bg: 'bg-[#ECFDF5]', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    return (
        <TechnicianLayout>
            <div className="relative overflow-x-hidden">
                {/* Background Aesthetic Blobs */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none z-[-1]"></div>

                <div className="animate-up">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] mb-2">Technician Hub</h1>
                    <p className="text-[#64748B] font-medium leading-relaxed">Manage system maintenance and service requests.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="card bg-white p-0 overflow-hidden hover:translate-y-[-4px] transition-all relative">
                            {/* Blue Accent Top Bar */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${i === 0 || i === 2 ? 'from-[#5B5FEF] to-[#7C3AED]' : 'from-slate-200 to-slate-300'} opacity-80`}></div>
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm border border-white/50`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Sync</span>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-[#0F172A] mb-1">{stat.val}</h3>
                                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.1em]">{stat.label}</p>
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
                                    <th className="px-8 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-widest">Resource</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-widest">Priority</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[#64748B] uppercase tracking-widest text-right">Action</th>
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
                                                <div className="font-bold text-[#0F172A]">{task.resourceName}</div>
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
                                                    task.status === 'PENDING' ? 'bg-[#FFF7ED] text-[#F59E0B]' : 
                                                    task.status === 'IN_PROGRESS' ? 'bg-[#EFF6FF] text-[#3B82F6]' : 'bg-[#ECFDF5] text-[#22C55E]'
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
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianDashboard;
