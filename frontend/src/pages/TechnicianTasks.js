import React, { useState, useEffect } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';

const TechnicianTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/technician/tasks');
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/api/technician/tasks/${taskId}/status?status=${newStatus}`);
            fetchTasks(); // Refresh list
        } catch (err) {
            console.error('Error updating status', err);
        }
    };

    return (
        <TechnicianLayout>
            <div className="animate-up">
                <header className="mb-12 border-b border-slate-100 pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Service Assignments</h1>
                        <p className="text-slate-400 font-medium italic">Execute maintenance and update platform assets.</p>
                    </div>
                    <div className="bg-white p-2 border border-slate-200/60 rounded-2xl shadow-sm flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Total Tasks:</span>
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-black">{tasks.length}</span>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 mb-2">Everything's Operational</h3>
                        <p className="text-slate-400 text-sm">No maintenance tasks are currently assigned to you.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all border-l-8 border-l-indigo-600">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                            task.priority === 'URGENT' || task.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {task.priority} Priority
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-300">#{task.id}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-2">{task.resourceName}</h3>
                                    <p className="text-sm text-slate-500 max-w-xl">{task.description}</p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                    <div className="flex flex-col items-center md:items-end mr-4">
                                        <span className="text-[10px] font-black text-slate-300 uppercase mb-1">Status</span>
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                            task.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {task.status === 'PENDING' && (
                                            <button 
                                                onClick={() => updateStatus(task.id, 'IN_PROGRESS')}
                                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition shadow-lg"
                                            >
                                                Start Task
                                            </button>
                                        )}
                                        {task.status === 'IN_PROGRESS' && (
                                            <button 
                                                onClick={() => updateStatus(task.id, 'COMPLETED')}
                                                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition shadow-lg"
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition border border-slate-100">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianTasks;
