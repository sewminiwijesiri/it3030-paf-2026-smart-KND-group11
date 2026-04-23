import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const TicketSubmission = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        resourceId: '',
        resourceName: '',
        category: 'IT Support',
        description: '',
        priority: 'MEDIUM',
        preferredContact: ''
    });
    const [resources, setResources] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const categories = ['IT Support', 'Electrical', 'Plumbing', 'Furniture', 'Facility Structure', 'Other'];
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/api/resources');
                setResources(response.data);
            } catch (err) {
                console.error('Error fetching resources', err);
            } finally {
                setFetching(false);
            }
        };
        fetchResources();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResourceSelect = (e) => {
        const res = resources.find(r => r.id === e.target.value);
        if (res) {
            setFormData({ ...formData, resourceId: res.id, resourceName: res.name });
        } else {
            setFormData({ ...formData, resourceId: '', resourceName: '' });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            setError('Maximum 3 images allowed for evidence.');
            return;
        }
        setSelectedFiles(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.resourceId) { setError('Please select a campus resource.'); return; }
        setLoading(true);
        setError('');
        try {
            const attachmentUrls = [];
            for (const file of selectedFiles) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const uploadRes = await api.post('/api/files/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                attachmentUrls.push(uploadRes.data.fileUrl);
            }

            await api.post('/api/maintenance', { ...formData, attachments: attachmentUrls });
            setSuccess(true);
            setTimeout(() => navigate('/my-tickets'), 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Verification Error';
            setError(`Submission Failed: ${errorMsg}.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const role = localStorage.getItem('role') || 'USER';

    const renderSidebar = () => {
        switch (role) {
            case 'ADMIN': return <AdminSidebar />;
            case 'TECHNICIAN': return <TechnicianSidebar />;
            default: return <Sidebar />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
            {/* Signature Background Decorations (Matched to Dashboard) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD166]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <Navbar />

            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                {renderSidebar()}
<main className={`flex-1 ${role === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} h-[calc(100vh-72px)] overflow-y-auto scroll-smooth`}>

  {/* Header */}
  <div className="bg-white border-b border-slate-200 py-6">
    <div className="max-w-[800px] mx-auto px-6">
      <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.4em] mb-2 drop-shadow-sm flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
        Incident Portal
      </p>

      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">
        Report Fault
      </h1>

      <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px] max-w-xl">
        Submit details about the resource malfunction or facility damage to request maintenance.
      </p>
    </div>
  </div>
                        </div>
                    </div>

                    <div className="max-w-[900px] mx-auto px-8 py-12">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 p-10 md:p-16 relative overflow-hidden group">
                            {/* Dashboard Accent Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[120px] transition-all group-hover:bg-slate-100/50 pointer-events-none"></div>
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#0F172A]"></div>

                            {success ? (
                                <div className="text-center py-20 animate-up">
                                    <div className="relative w-32 h-32 mx-auto mb-10">
                                        <div className="absolute inset-0 bg-emerald-100 rounded-[32px] animate-ping opacity-20"></div>
                                        <div className="relative w-full h-full bg-white border-2 border-emerald-400 text-emerald-400 rounded-[32px] flex items-center justify-center text-5xl font-black shadow-lg shadow-emerald-500/10">
                                            ✓
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Request Transmitted</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[11px] max-w-xs mx-auto leading-relaxed border-y border-slate-100 py-3">
                                        Syncing with maintenance queue... Terminal ready.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                                    {error && (
                                        <div className="p-6 bg-white border border-rose-100 border-l-4 border-l-rose-500 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Row 1: Resource & Category */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-1">
                                                <div className="w-1 h-1 bg-[#FFD166] rounded-full"></div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Resource Vector</label>
                                            </div>
                                            <select
                                                onChange={handleResourceSelect} required
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-4 focus:ring-[#3f4175]/5 transition-all font-black text-slate-800 text-sm shadow-sm cursor-pointer appearance-none uppercase"
                                            >
                                                <option value="">Scan for resource...</option>
                                                {!fetching && resources.map(res => <option key={res.id} value={res.id}>{res.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-1">
                                                <div className="w-1 h-1 bg-[#3f4175] rounded-full"></div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Incident Class</label>
                                            </div>
                                            <select
                                                name="category" onChange={handleChange}
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-4 focus:ring-[#3f4175]/5 transition-all font-black text-slate-800 text-sm shadow-sm cursor-pointer appearance-none uppercase"
                                            >
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Priority Segmented Control (Matched to Dashboard Badges) */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 ml-1">
                                            <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Severity Calibration</label>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded-[24px] grid grid-cols-2 lg:grid-cols-4 gap-2 border border-slate-100">
                                            {[
                                                { id: 'LOW', color: 'emerald' },
                                                { id: 'MEDIUM', color: 'blue' },
                                                { id: 'HIGH', color: 'amber' },
                                                { id: 'URGENT', color: 'rose' }
                                            ].map((p) => (
                                                <button
                                                    key={p.id} type="button"
                                                    onClick={() => setFormData({ ...formData, priority: p.id })}
                                                    className={`py-4 px-4 rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${formData.priority === p.id
                                                            ? `bg-white text-${p.color}-600 shadow-lg border border-${p.color}-100 scale-[1.02]`
                                                            : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                                        }`}
                                                >
                                                    {p.id}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 ml-1">
                                            <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Incident Parameters</label>
                                        </div>
                                        <textarea
                                            name="description" required rows="5"
                                            onChange={handleChange}
                                            className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[24px] focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-4 focus:ring-[#3f4175]/5 transition-all font-bold text-slate-800 text-md resize-none shadow-sm placeholder:text-slate-300 placeholder:font-black placeholder:uppercase tracking-tight"
                                            placeholder="Enter malfunction details..."
                                        ></textarea>
                                    </div>

                                    {/* Contact & Attachments */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-1">
                                                <div className="w-1 h-1 bg-[#3f4175] rounded-full"></div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Link Interface</label>
                                            </div>
                                            <input
                                                type="text" name="preferredContact" onChange={handleChange}
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[20px] focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-4 focus:ring-[#3f4175]/5 transition-all font-black text-slate-800 text-sm shadow-sm placeholder:text-slate-300 placeholder:uppercase"
                                                placeholder="Email / Ext"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 ml-1">
                                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Telemetry Upload</label>
                                            </div>
                                            <div className="relative group/file">
                                                <input
                                                    type="file" multiple accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                />
                                                <div className="w-full px-6 py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[20px] group-hover/file:border-[#3f4175] group-hover/file:bg-slate-100 transition-all flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        {selectedFiles.length > 0 ? `${selectedFiles.length} IMAGES READY` : 'ADD EVIDENCE'}
                                                    </span>
                                                    <div className="w-8 h-8 bg-[#3f4175] rounded-xl flex items-center justify-center text-white shadow-lg">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10">
                                        <button
                                            type="submit" disabled={loading}
                                            className="group w-full relative h-20 bg-[#0F172A] hover:bg-[#FFD166] rounded-[24px] overflow-hidden transition-all shadow-xl shadow-[#0F172A]/20 disabled:opacity-50 active:scale-[0.98]"
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="relative z-10 text-white group-hover:text-slate-900 font-black text-[11px] uppercase tracking-[0.4em] transition-colors">
                                                {loading ? 'Initializing Sync...' : 'Dispatch Request'}
                                            </span>
                                        </button>
                                        <div className="flex justify-center items-center gap-4 mt-8 opacity-40">
                                            <div className="h-px w-8 bg-slate-300"></div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                v2.4.0 Authorized
                                            </p>
                                            <div className="h-px w-8 bg-slate-300"></div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TicketSubmission;
