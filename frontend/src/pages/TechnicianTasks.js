import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';
import { resolveImageUrl } from '../utils/imageUtils';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  ChevronRight,
  Activity,
  History,
  MessageSquare,
  X,
  TrendingUp,
  Search,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const TechnicianTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(null);
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // History Modal State
    const [viewingHistory, setViewingHistory] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/technician/tasks');
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
            toast.error('Workload Registry Sync Failed');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    const fetchHistory = async (resourceName) => {
        setViewingHistory(resourceName);
        setLoadingHistory(true);
        try {
            const response = await api.get(`/api/maintenance/history/${encodeURIComponent(resourceName)}`);
            setHistoryData(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) {
            console.error('Error fetching history', err);
            toast.error('Failed to retrieve node history');
        } finally {
            setLoadingHistory(false);
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        setUpdating(true);
        const loadingToast = toast.loading(`Updating Node Status to ${newStatus.replace('_', ' ')}...`);
        try {
            await api.put(`/api/technician/tasks/${taskId}/status?status=${newStatus}`);
            toast.success('Protocol Initiated', { id: loadingToast });
            fetchTasks();
        } catch (err) {
            console.error('Error updating status', err);
            toast.error('Protocol Update Failed', { id: loadingToast });
        } finally {
            setUpdating(false);
        }
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const loadingToast = toast.loading('Transmitting Resolution Telemetry...');
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
            toast.success('Asset Recovery Finalized', { id: loadingToast });
            setResolving(null);
            setNotes('');
            setFiles([]);
            fetchTasks();
        } catch (err) {
            console.error('Resolution failed', err);
            const errorMsg = err.response?.data?.message || err.message || 'Transmission Failure';
            toast.error(`System Error: ${errorMsg}`, { id: loadingToast });
        } finally {
            setUpdating(false);
        }
    };

    const stats = useMemo(() => {
        return {
            total: tasks.length,
            urgent: tasks.filter(t => t.priority === 'URGENT').length,
            active: tasks.filter(t => t.status === 'IN_PROGRESS').length,
            resolved: tasks.filter(t => t.status === 'RESOLVED').length
        };
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => 
            t.resourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tasks, searchQuery]);

    return (
        <TechnicianLayout>
            {/* Image Viewer */}
            {selectedImage && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0F172A]/95 backdrop-blur-3xl p-6" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 w-12 h-12 bg-white/10 hover:bg-[#FFD166] text-white hover:text-black rounded-2xl flex items-center justify-center transition-all">
                            <X className="w-6 h-6" />
                        </button>
                        <img src={selectedImage} alt="Telemetry" className="max-h-[80vh] w-auto object-contain rounded-3xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300" />
                    </div>
                </div>
            )}

            {/* Node History Modal */}
            {viewingHistory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-md p-6" onClick={() => setViewingHistory(null)}>
                    <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10">
                                    <History className="w-6 h-6 text-[#FFD166]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight leading-none mb-2">{viewingHistory}</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Historical Incident Registry</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingHistory(null)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 rounded-xl transition-all shadow-sm">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8">
                            {loadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A]"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Node Archives...</p>
                                </div>
                            ) : historyData.length === 0 ? (
                                <div className="text-center py-20">
                                    <Activity className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No prior incidents found for this resource node.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {historyData.map((item, idx) => (
                                        <div key={item.id} className="relative pl-10 group">
                                            {/* Timeline Line */}
                                            {idx !== historyData.length - 1 && (
                                                <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-slate-100 group-hover:bg-[#FFD166]/30 transition-colors"></div>
                                            )}
                                            
                                            {/* Timeline Dot */}
                                            <div className={`absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center border-2 z-10 transition-all ${
                                                item.status === 'RESOLVED' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-amber-50 border-amber-100 text-amber-500'
                                            }`}>
                                                {item.status === 'RESOLVED' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                                            </div>

                                            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm group-hover:shadow-md group-hover:border-slate-200 transition-all">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">INC-{item.id.slice(-8).toUpperCase()}</span>
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                            item.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Calendar size={12} />
                                                        <span className="text-[10px] font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-slate-600 font-bold italic mb-4">"{item.description}"</p>
                                                
                                                {item.resolutionNotes && (
                                                    <div className="mt-6 pt-6 border-t border-slate-50">
                                                        <p className="text-[9px] font-black text-[#0F172A] uppercase tracking-[0.2em] mb-3">Resolution Outcome:</p>
                                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.resolutionNotes}</p>
                                                    </div>
                                                )}

                                                <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                    <p className="text-slate-300">Operator: <span className="text-slate-500">{item.technicianEmail || 'Unassigned'}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header - Matched to Reports */}
                <div className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] animate-pulse"></span>
                            <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.4em]">Field Operations Hub</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2 italic uppercase">Assigned Tasks</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Managing workload for operator: <span className="text-[#FFD166] font-black">{localStorage.getItem('email')}</span></p>
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search by Node or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-[24px] text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Metrics Grid - Matched to Reports */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Active Tasks', val: stats.active, icon: <Activity className="text-slate-900" />, sub: 'Currently Processing' },
                        { label: 'Critical Ops', val: stats.urgent, icon: <AlertTriangle className="text-rose-500" />, sub: 'Priority Response' },
                        { label: 'Total Registry', val: stats.total, icon: <TrendingUp className="text-[#FFD166]" />, sub: 'Workload Volume' },
                        { label: 'Resolved Units', val: stats.resolved, icon: <CheckCircle2 className="text-emerald-500" />, sub: 'Sector Secured' },
                    ].map((m, i) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-[#0F172A] group-hover:text-white transition-all">
                                    {m.icon}
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Live</span>
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{m.val}</h3>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{m.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Task Grid - Matched to Reports Table/Card Vibe */}
                <div className="space-y-10">
                    {loading ? (
                        <div className="bg-white rounded-[48px] border border-slate-200 p-24 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A] mx-auto mb-6"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Registry...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="bg-white rounded-[48px] border border-slate-200 p-32 text-center shadow-sm">
                            <Activity className="w-20 h-20 text-slate-100 mx-auto mb-8" />
                            <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tight italic">Registry Clear</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">Zero pending malfunctions detected in your sector.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-10">
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="bg-white rounded-[48px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
                                    <div className="p-10 md:p-14 flex flex-col xl:flex-row justify-between gap-12">
                                        <div className="flex-1 space-y-8">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
                                                    task.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                                                    task.priority === 'HIGH' ? 'bg-[#FFD166]/10 text-slate-900 border-[#FFD166]/20' :
                                                    'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                    {task.priority} Priority
                                                </div>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">INC-{task.id.slice(-8).toUpperCase()}</span>
                                            </div>

                                            <div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4 group-hover:text-[#0F172A] transition-colors">
                                                    {task.resourceName}
                                                </h3>
                                                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 relative shadow-inner">
                                                    <MessageSquare className="absolute -top-4 -left-4 w-10 h-10 text-slate-200" />
                                                    <p className="text-slate-600 font-bold italic leading-relaxed text-base">"{task.description}"</p>
                                                </div>
                                            </div>

                                            {/* Evidence Gallery */}
                                            {task.attachments && task.attachments.length > 0 && (
                                                <div className="space-y-4">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Evidence Documentation</p>
                                                    <div className="flex flex-wrap gap-4">
                                                        {task.attachments.map((url, i) => (
                                                            <div 
                                                                key={i} 
                                                                onClick={() => setSelectedImage(resolveImageUrl(url))}
                                                                className="w-28 h-28 rounded-3xl border border-slate-200 overflow-hidden cursor-pointer hover:border-[#FFD166] hover:-translate-y-1 transition-all shadow-sm"
                                                            >
                                                                <img src={resolveImageUrl(url)} alt="Asset" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions Column */}
                                        <div className="xl:w-80 flex flex-col justify-between items-stretch xl:items-end gap-10">
                                            <div className={`px-8 py-3.5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] border self-start xl:self-end shadow-sm ${
                                                task.status === 'OPEN' ? 'bg-[#FFD166] text-slate-900 border-[#FFD166]' :
                                                task.status === 'IN_PROGRESS' ? 'bg-[#0F172A] text-white border-[#0F172A]' :
                                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                                {task.status.replace('_', ' ')}
                                            </div>

                                            <div className="space-y-5 w-full">
                                                {task.status === 'OPEN' && (
                                                    <button
                                                        onClick={() => updateStatus(task.id, 'IN_PROGRESS')} disabled={updating}
                                                        className="w-full py-5 bg-[#0F172A] text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                    >
                                                        Begin Operation
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {task.status === 'IN_PROGRESS' && (
                                                    <button
                                                        onClick={() => setResolving(task.id)} disabled={updating}
                                                        className="w-full py-5 bg-[#FFD166] text-slate-900 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#FFCC29] transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                    >
                                                        Finalize Asset
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => fetchHistory(task.resourceName)}
                                                    className="w-full py-5 bg-slate-50 text-slate-400 rounded-[24px] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-slate-900 border border-slate-100 transition-all flex items-center justify-center gap-3"
                                                >
                                                    <History className="w-4 h-4" />
                                                    Node History
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resolution Terminal Overlay */}
                                    {resolving === task.id && (
                                        <div className="bg-[#0F172A] p-12 md:p-16 animate-in slide-in-from-bottom duration-500 relative">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-center mb-12">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-[#FFD166] rounded-[20px] flex items-center justify-center shadow-lg shadow-[#FFD166]/20">
                                                            <CheckCircle2 className="w-6 h-6 text-[#0F172A]" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-2xl font-black text-white uppercase italic tracking-tight leading-none">Resolution Terminal</h4>
                                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mt-3">Finalizing Asset Integrity Record</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setResolving(null)} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all">
                                                        <X className="w-6 h-6" />
                                                    </button>
                                                </div>

                                                <form onSubmit={handleResolve} className="space-y-12">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Technical Resolution Protocol</label>
                                                        <textarea
                                                            placeholder="Log resolution steps, hardware replacements, and final integrity status..."
                                                            required
                                                            className="w-full px-10 py-10 bg-white/5 border-2 border-white/5 rounded-[40px] focus:border-[#FFD166] focus:outline-none transition-all font-bold text-white text-base resize-none min-h-[220px] placeholder:text-slate-700 italic"
                                                            value={notes} onChange={(e) => setNotes(e.target.value)}
                                                        ></textarea>
                                                    </div>

                                                    <div className="flex flex-col lg:flex-row gap-8 items-end">
                                                        <div className="flex-1 w-full space-y-4">
                                                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-6">Recovery Telemetry (Evidence)</label>
                                                            <div className="relative group h-28">
                                                                <input
                                                                    type="file" multiple accept="image/*"
                                                                    onChange={(e) => setFiles(Array.from(e.target.files))}
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                                />
                                                                <div className="w-full h-full border-2 border-dashed border-white/10 rounded-[32px] flex items-center justify-center gap-5 group-hover:bg-white/5 transition-all">
                                                                    <Camera className="w-6 h-6 text-slate-600" />
                                                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                                                        {files.length > 0 ? `${files.length} ASSETS READY` : 'Staging resolution evidence'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="submit" disabled={updating}
                                                            className="w-full lg:w-96 py-7 bg-[#FFD166] text-[#0F172A] rounded-[32px] font-black text-[13px] uppercase tracking-[0.5em] hover:bg-white transition-all shadow-2xl active:scale-95 disabled:opacity-50 shrink-0"
                                                        >
                                                            {updating ? 'Transmitting...' : 'Finalize Log'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianTasks;
