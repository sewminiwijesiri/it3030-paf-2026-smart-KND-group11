import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
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
            setError(`Submission Failed: ${errorMsg}. (Check if server is running)`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFEFE] flex flex-col font-sans relative overflow-x-hidden">
             {/* Gradient Aesthetic Blobs */}
             <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[140px] pointer-events-none"></div>
            
            <Navbar />
            
            <div className="flex flex-1 relative z-10">
                <Sidebar />
                <main className="flex-1 lg:ml-64 p-6 md:p-12 xl:p-16 transition-all duration-300">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-up">
                            
                            <header className="mb-14">
                                <span className="inline-block px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl mb-4 border border-indigo-100 shadow-sm">
                                    Incident Portal
                                </span>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                                    Report an Issue<span className="text-indigo-600">.</span>
                                </h1>
                                <p className="text-slate-400 font-bold text-base leading-relaxed max-w-xl">Submit details about the resource malfunction or facility damage.</p>
                            </header>

                            {success ? (
                                <div className="bg-white border border-slate-100 p-20 rounded-[3.5rem] text-center shadow-2xl shadow-indigo-100/50">
                                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-4xl shadow-xl shadow-indigo-200 rotate-12 animate-pulse">✓</div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Request Transmitted.</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing with maintenance queue...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    {error && (
                                        <div className="p-5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-2xl text-[12px] font-black uppercase tracking-tight shadow-sm animate-shake">
                                            {error}
                                        </div>
                                    )}

                                    {/* Row 1: Resource & Category */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Resource / Location</label>
                                            <div className="relative group">
                                                <select 
                                                    onChange={handleResourceSelect} required
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none font-bold text-slate-700 appearance-none shadow-sm cursor-pointer"
                                                >
                                                    <option value="">Select a resource</option>
                                                    {resources.map(res => <option key={res.id} value={res.id}>{res.name}</option>)}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-indigo-400 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Incident Category</label>
                                            <div className="relative group">
                                                <select 
                                                    name="category" onChange={handleChange}
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none font-bold text-slate-700 appearance-none shadow-sm cursor-pointer"
                                                >
                                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-indigo-400 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggle Priority */}
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Priority Level</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {priorities.map(p => (
                                                <button
                                                    key={p} type="button"
                                                    onClick={() => setFormData({...formData, priority: p})}
                                                    className={`py-5 px-6 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${
                                                        formData.priority === p 
                                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1' 
                                                        : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white hover:text-slate-600'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Incident Description</label>
                                        <textarea 
                                            name="description" required rows="6"
                                            onChange={handleChange}
                                            className="w-full px-8 py-8 bg-slate-50 border border-slate-100 rounded-[3rem] focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none font-bold text-slate-700 resize-none italic shadow-sm"
                                            placeholder="Please explain the situation in detail..."
                                        ></textarea>
                                    </div>

                                    {/* Contact & Attachments */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Direct Contact (Email/Ext)</label>
                                            <div className="relative group">
                                                <input 
                                                    type="text" name="preferredContact" onChange={handleChange}
                                                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none font-bold text-slate-700 shadow-sm" 
                                                    placeholder="How can we reach you quickly?"
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-indigo-400 transition-colors">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Visual Evidence (Files)</label>
                                            <div className="relative group">
                                                <input 
                                                    type="file" multiple accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="w-full px-8 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-[11px] font-bold text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-indigo-600 file:text-white hover:file:bg-slate-900 transition-all shadow-sm cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" disabled={loading}
                                        className="w-full py-6 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[2.5rem] hover:bg-indigo-600 transition-all transform hover:scale-[1.01] active:scale-95 shadow-2xl shadow-indigo-100 disabled:opacity-50 mt-8"
                                    >
                                        {loading ? 'Initializing Secure Support...' : 'Initialize Support Ticket'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default TicketSubmission;
