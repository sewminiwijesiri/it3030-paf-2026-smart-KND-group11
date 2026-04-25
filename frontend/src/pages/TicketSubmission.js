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
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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

    const validate = () => {
        const newErrors = {};
        if (!formData.resourceId) newErrors.resourceId = 'Resource selection required.';
        if (!formData.description) newErrors.description = 'Incident details are required.';
        else if (formData.description.length < 10) newErrors.description = 'Must be at least 10 characters.';

        if (formData.preferredContact && formData.preferredContact.length < 3) {
            newErrors.preferredContact = 'Invalid contact format.';
        }

        if (selectedFiles.length > 3) newErrors.files = 'Max 3 images allowed.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setTouched({ ...touched, [name]: true });

        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleResourceSelect = (e) => {
        const res = resources.find(r => r.id === e.target.value);
        setTouched({ ...touched, resourceId: true });
        if (res) {
            setFormData({ ...formData, resourceId: res.id, resourceName: res.name });
            if (errors.resourceId) setErrors({ ...errors, resourceId: null });
        } else {
            setFormData({ ...formData, resourceId: '', resourceName: '' });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            setErrors({ ...errors, files: 'Maximum 3 images allowed for evidence.' });
            return;
        }
        setSelectedFiles(files);
        setErrors({ ...errors, files: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
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
            setErrors({ submit: `Submission Failed: ${errorMsg}.` });
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
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-hidden">
            {/* Immersive Background Decorations - Synced with Dashboard */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#3f4175]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#FFD166]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <Navbar />

            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                {renderSidebar()}
                <main className={`flex-1 lg:ml-64 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth pb-10`}>

                    {/* Header Section - Synced with Dashboard Style */}
                    <div className="bg-white border-b border-slate-200 py-6 mb-8">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                            <p className="text-[#0F172A] font-black text-[10px] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                Incident Portal
                            </p>

                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                                    Report <span className="text-slate-400">Fault</span>
                                </h1>

                                <div className="flex gap-3 mt-2 md:mt-0">
                                    <div className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500">
                                        Terminal Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                        <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-white shadow-2xl shadow-[#3f4175]/5 p-10 md:p-16 animate-up" style={{ animationDelay: '0.1s' }}>

                            {success ? (
                                <div className="py-24 flex flex-col items-center text-center animate-up">
                                    <div className="w-24 h-24 bg-[#0F172A] rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-[#0F172A]/20 mb-10 animate-bounce">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h2 className="text-4xl font-black text-[#0F172A] mb-3 tracking-tight">Request Transmitted</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Syncing with maintenance matrix...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    {errors.submit && (
                                        <div className="p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-[32px] text-[10px] font-black uppercase tracking-widest flex items-center gap-5 animate-shake">
                                            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            </div>
                                            {errors.submit}
                                        </div>
                                    )}

                                    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-0 border rounded-[40px] overflow-hidden shadow-2xl bg-white transition-all duration-300 ${Object.keys(errors).length > 0 ? 'border-[#0F172A]/20 ring-4 ring-[#0F172A]/5' : 'border-slate-200'}`}>

                                        {/* Column 1: Identity & Class - Navy Theme */}
                                        <div className="space-y-10 p-10 border-r border-slate-100 bg-slate-50/50">
                                            <div className={`space-y-3 transition-all ${errors.resourceId ? 'animate-shake' : ''}`}>
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className={`text-xs font-black uppercase tracking-[0.2em] ${errors.resourceId ? 'text-rose-500' : 'text-slate-500'}`}>Resource Vector</label>
                                                    {errors.resourceId ? (
                                                        <span className="text-[10px] font-bold text-rose-500 uppercase">{errors.resourceId}</span>
                                                    ) : touched.resourceId && formData.resourceId ? (
                                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    ) : null}
                                                </div>
                                                <div className="relative group">
                                                    <select
                                                        onChange={handleResourceSelect} required
                                                        className={`w-full pl-12 pr-6 py-5 bg-white border-2 rounded-2xl focus:bg-white focus:outline-none transition-all font-bold text-[#0F172A] text-base appearance-none group-hover:border-[#0F172A]/20 cursor-pointer shadow-sm ${errors.resourceId ? 'border-rose-400' : touched.resourceId && formData.resourceId ? 'border-emerald-400' : 'border-slate-100 focus:border-[#0F172A]'
                                                            }`}
                                                    >
                                                        <option value="">Scan for resource...</option>
                                                        {!fetching && resources.map(res => <option key={res.id} value={res.id}>{res.name}</option>)}
                                                    </select>
                                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.resourceId ? 'text-rose-400' : touched.resourceId && formData.resourceId ? 'text-emerald-400' : 'text-[#0F172A]/40 group-focus-within:text-[#0F172A]'}`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Incident Class</label>
                                                <div className="relative group">
                                                    <select
                                                        name="category" onChange={handleChange}
                                                        className="w-full pl-12 pr-6 py-5 bg-white border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-[#0F172A] focus:outline-none transition-all font-bold text-[#0F172A] text-base appearance-none group-hover:border-[#0F172A]/20 cursor-pointer shadow-sm"
                                                    >
                                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                    </select>
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F172A]/40 group-focus-within:text-[#0F172A] transition-colors">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-5">
                                                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Severity Calibration</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'LOW', color: 'slate' },
                                                        { id: 'MEDIUM', color: 'slate' },
                                                        { id: 'HIGH', color: 'amber' },
                                                        { id: 'URGENT', color: 'rose' }
                                                    ].map((p) => (
                                                        <button
                                                            key={p.id} type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, priority: p.id });
                                                                setTouched({ ...touched, priority: true });
                                                            }}
                                                            className={`py-4 px-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-[0.15em] ${formData.priority === p.id
                                                                    ? p.id === 'HIGH' || p.id === 'URGENT'
                                                                        ? `border-${p.color}-500 bg-${p.color}-50 text-${p.color}-600 shadow-md`
                                                                        : 'border-[#0F172A] bg-[#0F172A] text-white shadow-md'
                                                                    : 'border-white bg-white text-slate-400 hover:border-[#0F172A]/10 shadow-sm'
                                                                }`}
                                                        >
                                                            {p.id}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 2: Parameters - White Theme with Navy Accents */}
                                        <div className="space-y-5 h-full flex flex-col p-10 bg-white">
                                            <div className={`space-y-3 flex-1 flex flex-col ${errors.description ? 'animate-shake' : ''}`}>
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className={`text-xs font-black uppercase tracking-[0.2em] ${errors.description ? 'text-rose-500' : 'text-[#0F172A]'}`}>Incident Parameters</label>
                                                    {errors.description ? (
                                                        <span className="text-[10px] font-bold text-rose-500 uppercase">{errors.description}</span>
                                                    ) : touched.description && formData.description.length >= 10 ? (
                                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    ) : null}
                                                </div>
                                                <textarea
                                                    name="description" required
                                                    onChange={handleChange}
                                                    className={`flex-1 w-full px-8 py-8 bg-slate-50 border-2 rounded-[32px] focus:bg-white focus:outline-none transition-all font-bold text-[#0F172A] text-base resize-none placeholder:text-slate-300 min-h-[400px] shadow-inner ${errors.description ? 'border-rose-400' : touched.description && formData.description.length >= 10 ? 'border-emerald-400' : 'border-slate-100 focus:border-[#0F172A]'
                                                        }`}
                                                    placeholder="Provide a detailed breakdown of the malfunction..."
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* Column 3: Contact & Evidence - Gray Theme with Yellow Button */}
                                        <div className="space-y-10 p-10 border-l border-slate-100 bg-slate-50/50">
                                            <div className={`space-y-3 ${errors.preferredContact ? 'animate-shake' : ''}`}>
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className={`text-xs font-black uppercase tracking-[0.2em] ${errors.preferredContact ? 'text-rose-500' : 'text-slate-500'}`}>Contact Vector</label>
                                                    {errors.preferredContact ? (
                                                        <span className="text-[10px] font-bold text-rose-500 uppercase">{errors.preferredContact}</span>
                                                    ) : touched.preferredContact && formData.preferredContact.length >= 3 ? (
                                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    ) : null}
                                                </div>
                                                <div className="relative group">
                                                    <input
                                                        type="text" name="preferredContact" onChange={handleChange}
                                                        className={`w-full pl-12 pr-6 py-5 bg-white border-2 rounded-2xl focus:bg-white focus:outline-none transition-all font-bold text-[#0F172A] text-base placeholder:text-slate-300 shadow-sm ${errors.preferredContact ? 'border-rose-400' : touched.preferredContact && formData.preferredContact.length >= 3 ? 'border-emerald-400' : 'border-slate-100 focus:border-[#0F172A]'
                                                            }`}
                                                        placeholder="Email or Ext"
                                                    />
                                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.preferredContact ? 'text-rose-400' : touched.preferredContact && formData.preferredContact.length >= 3 ? 'text-emerald-400' : 'text-[#0F172A]/40 group-focus-within:text-[#0F172A]'}`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`space-y-3 ${errors.files ? 'animate-shake' : ''}`}>
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className={`text-xs font-black uppercase tracking-[0.2em] ${errors.files ? 'text-rose-500' : 'text-slate-500'}`}>Telemetry Upload</label>
                                                    {errors.files ? (
                                                        <span className="text-[10px] font-bold text-rose-500 uppercase">{errors.files}</span>
                                                    ) : touched.files && selectedFiles.length > 0 ? (
                                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    ) : null}
                                                </div>
                                                <div className="relative group h-40">
                                                    <input
                                                        type="file" multiple accept="image/*"
                                                        onChange={(e) => {
                                                            handleFileChange(e);
                                                            setTouched({ ...touched, files: true });
                                                        }}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                    />
                                                    <div className={`w-full h-full border-2 border-dashed rounded-[32px] group-hover:bg-[#FFD166]/10 transition-all flex flex-col items-center justify-center gap-3 shadow-sm ${errors.files ? 'border-rose-300 bg-rose-50' : selectedFiles.length > 0 ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200 bg-white'
                                                        }`}>
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${errors.files ? 'bg-rose-500 text-white' : selectedFiles.length > 0 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-[#0F172A]/40'}`}>
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${errors.files ? 'text-rose-600' : selectedFiles.length > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                            {selectedFiles.length > 0 ? `${selectedFiles.length} IMAGES READY` : 'Add evidence'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button
                                                    type="submit" disabled={loading}
                                                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 group shadow-xl ${Object.keys(errors).length > 0
                                                            ? 'bg-[#0F172A] text-white shadow-[#0F172A]/20'
                                                            : 'bg-[#FFD166] hover:bg-[#FFCC29] text-[#0F172A] shadow-[#FFD166]/20'
                                                        }`}
                                                >
                                                    {loading ? (
                                                        <span className="animate-pulse">Transmitting...</span>
                                                    ) : (
                                                        <>
                                                            {Object.keys(errors).length > 0 ? 'Fix Errors' : 'Dispatch Request'}
                                                            <svg className={`w-4 h-4 transition-transform ${Object.keys(errors).length > 0 ? 'animate-pulse' : 'group-hover:translate-x-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
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

