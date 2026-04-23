import React, { useState, useEffect } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';

const TechnicianTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(null);
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

    useEffect(() => { fetchTasks(); }, []);

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
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
                    Service Assignments
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    Execute maintenance and document asset health.
                </p>
            </div>

            {/* Content */}
            <div>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A]"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Workload...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="bg-white p-20 rounded border border-slate-200 text-center shadow-sm">
                        <div className="text-6xl mb-4 mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">🛠️</div>
                        <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-wide">Zero Pending Faults</h3>
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">The campus infrastructure is currently stable.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-white rounded border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all relative overflow-hidden group flex flex-col">
                                
                                {/* Left accent bar */}
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="p-8 flex flex-col md:flex-row justify-between items-start gap-6">
                                    {/* Left: Task Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap gap-3 mb-4 items-center">
                                            <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                                                task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                task.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}>
                                                {task.priority} Priority
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">INC-{task.id.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">{task.resourceName}</h3>
                                        <p className="text-slate-500 font-medium italic leading-relaxed text-sm">"{task.description}"</p>
                                    </div>

                                    {/* Right: Status & Actions */}
                                    <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                                        <span className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(task.status)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex gap-3">
                                            {task.status === 'OPEN' && (
                                                <button
                                                    onClick={() => updateStatus(task.id, 'IN_PROGRESS')} disabled={updating}
                                                    className="px-6 py-3 bg-[#0F172A] text-white rounded font-black text-[10px] uppercase tracking-widest hover:bg-[#3f4175] transition-all shadow-md disabled:opacity-50"
                                                >
                                                    Begin Execution
                                                </button>
                                            )}
                                            {task.status === 'IN_PROGRESS' && (
                                                <button
                                                    onClick={() => setResolving(task.id)} disabled={updating}
                                                    className="px-6 py-3 bg-[#FFD166] text-slate-900 rounded font-black text-[10px] uppercase tracking-widest border border-[#FFCC29] hover:bg-[#FFCC29] hover:scale-[1.02] transition-all shadow-md shadow-[#FFD166]/20 disabled:opacity-50"
                                                >
                                                    Resolve Asset
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Evidence Images */}
                                {task.attachments && task.attachments.length > 0 && (
                                    <div className="px-8 pb-6">
                                        <div className="border-t border-slate-100 pt-6">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                                Evidence Documentation ({task.attachments.length} image{task.attachments.length > 1 ? 's' : ''})
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {task.attachments.map((url, i) => (
                                                    <a key={i} href={`http://localhost:8081${url}`} target="_blank" rel="noopener noreferrer"
                                                        className="group relative rounded border border-slate-200 overflow-hidden aspect-video bg-slate-50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all block">
                                                        <img
                                                            src={`http://localhost:8081${url}`}
                                                            alt={`Evidence ${i + 1}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                                                        />
                                                        <div className="absolute inset-0 bg-[#0F172A]/0 group-hover:bg-[#0F172A]/30 transition-colors flex items-center justify-center">
                                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-black text-[10px] uppercase tracking-widest bg-black/50 px-3 py-1 rounded">View</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Resolution Form */}
                                {resolving === task.id && (
                                    <form onSubmit={handleResolve} className="mx-8 mb-8 p-8 bg-slate-50 rounded border border-slate-200">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-[#3f4175] uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                                    Resolution Panel
                                                </p>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">Asset Recovery Documentation</h4>
                                            </div>
                                            <button type="button" onClick={() => setResolving(null)} className="text-[10px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest border border-slate-200 px-3 py-1.5 rounded hover:border-rose-200 transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="Document your findings and technical resolution steps..."
                                            required
                                            className="w-full px-5 py-4 bg-white border border-slate-200 rounded focus:border-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-bold text-slate-800 text-sm mb-6 resize-none min-h-[120px] placeholder:text-slate-400 placeholder:font-medium"
                                            value={notes} onChange={(e) => setNotes(e.target.value)}
                                        ></textarea>
                                        <div className="flex flex-col md:flex-row gap-5 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Recovery Evidence (Images)</label>
                                                <input
                                                    type="file" multiple accept="image/*"
                                                    onChange={(e) => setFiles(Array.from(e.target.files))}
                                                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-400 file:mr-4 file:bg-[#3f4175] file:text-white file:px-4 file:py-1.5 file:rounded file:border-0 file:text-[9px] file:font-black hover:file:bg-[#0F172A] transition-all cursor-pointer"
                                                />
                                            </div>
                                            <button
                                                type="submit" disabled={updating}
                                                className="px-8 py-4 bg-[#FFD166] text-slate-900 rounded font-black text-[10px] uppercase tracking-widest border border-[#FFCC29] hover:bg-[#FFCC29] hover:scale-[1.02] transition-all shadow-lg shadow-[#FFD166]/20 disabled:opacity-50 shrink-0"
                                            >
                                                {updating ? 'Transmitting...' : 'Finalize Resolution'}
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
