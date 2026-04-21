import React, { useState, useEffect } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';

const TechnicianTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(null); // ID of task being resolved
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState([]);
    const [updating, setUpdating] = useState(false);

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
        setUpdating(true);
        try {
            await api.put(`/api/technician/tasks/${taskId}/status?status=${newStatus}`);
            fetchTasks();
        } catch (err) {
            console.error('Error updating status', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const attachmentUrls = [];
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const res = await api.post('/api/files/upload', uploadData);
                attachmentUrls.push(res.data.fileUrl);
            }

            await api.put(`/api/technician/tasks/${resolving}/status?status=RESOLVED`, {
                resolutionNotes: notes,
                attachments: attachmentUrls
            });
            
            setResolving(null);
            setNotes('');
            setFiles([]);
            fetchTasks();
        } catch (err) {
            console.error('Resolution failed', err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <TechnicianLayout>
            <div className="relative z-10 p-6 md:p-12 animate-up">
                 <header className="mb-12 border-b border-slate-100 pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Service Assignments</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Execute maintenance & document asset health.</p>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                         <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center shadow-sm">
                         <h3 className="text-2xl font-black text-slate-800 mb-2">Zero Pending Faults</h3>
                         <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">The campus infrastructure is currently stable.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 flex flex-col gap-8 hover:shadow-2xl transition-all relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2.5 h-full bg-slate-50 group-hover:bg-indigo-600 transition-all duration-500"></div>
                                
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="flex-1">
                                        <div className="flex gap-3 mb-4">
                                            <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                                                task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                            }`}>
                                                {task.priority} Priority
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest self-center">INC-{task.id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{task.resourceName}</h3>
                                        <p className="text-slate-500 font-medium italic leading-relaxed">"{task.description}"</p>
                                    </div>
                                    
                                    <div className="flex flex-col items-center md:items-end gap-4 min-w-[200px]">
                                         <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                             task.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                             task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                         }`}>
                                             {task.status.replace('_', ' ')}
                                         </span>
                                         
                                         <div className="flex gap-2">
                                             {task.status === 'OPEN' && (
                                                 <button onClick={() => updateStatus(task.id, 'IN_PROGRESS')} disabled={updating}
                                                     className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-indigo-100">
                                                     Begin Execution
                                                 </button>
                                             )}
                                             {task.status === 'IN_PROGRESS' && (
                                                 <button onClick={() => setResolving(task.id)} disabled={updating}
                                                     className="px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-emerald-100">
                                                     Resolve Asset
                                                 </button>
                                             )}
                                         </div>
                                    </div>
                                </div>

                                {/* Resolution Form (shown when resolving) */}
                                {resolving === task.id && (
                                    <form onSubmit={handleResolve} className="mt-4 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-up">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Asset Recovery Documentation</h4>
                                            <button type="button" onClick={() => setResolving(null)} className="text-slate-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                                        </div>
                                        <textarea 
                                            placeholder="Document your findings and technical resolution steps..." required
                                            className="w-full p-6 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-slate-700 mb-6 bg-white min-h-[120px]"
                                            value={notes} onChange={(e) => setNotes(e.target.value)}
                                        ></textarea>
                                        <div className="flex flex-col md:flex-row gap-6 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Recovery Evidence (Images)</label>
                                                <input type="file" multiple accept="image/*" 
                                                    onChange={(e) => setFiles(Array.from(e.target.files))}
                                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-400 file:mr-4 file:bg-slate-900 file:text-white file:px-4 file:py-1.5 file:rounded-xl file:border-0 file:text-[9px] file:font-black" />
                                            </div>
                                            <button type="submit" disabled={updating}
                                                className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-100">
                                                {updating ? 'Transmitting Data...' : 'Finalize Resolution'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianTasks;
