import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
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

    const role = localStorage.getItem('role') || 'USER';

    const renderSidebar = () => {
        switch (role) {
            case 'ADMIN': return <AdminSidebar />;
            case 'TECHNICIAN': return <TechnicianSidebar />;
            default: return <Sidebar />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            <Navbar />
            
            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                {renderSidebar()}
                
                <main className={`flex-1 ${role === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} h-[calc(100vh-72px)] overflow-y-auto scroll-smooth`}>
                    
                    {/* Header Area styled identically to UserDashboard and Home */}
                    <div className="bg-white border-b border-slate-200 py-10">
                        <div className="max-w-[800px] mx-auto px-6">
                            <p className="text-[#3f4175] font-black text-xs uppercase tracking-[0.4em] mb-4 drop-shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                                Incident Portal
                            </p>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                                Report an Issue
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px] max-w-xl">
                                Submit details about the resource malfunction or facility damage to request maintenance.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-[800px] mx-auto px-6 py-10">
                        <div className="bg-white border border-slate-200 rounded p-8 md:p-12 shadow-sm relative overflow-hidden">
                            {/* Accent line like in profile */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#0F172A]"></div>
                            
                            {success ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-white border-2 border-[#FFD166] text-[#FFD166] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-lg">✓</div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-wide">Request Transmitted</h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Syncing with maintenance queue...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {error && (
                                        <div className="p-4 bg-white border border-rose-200 border-l-4 border-l-rose-500 text-rose-600 rounded text-xs font-black uppercase tracking-wider shadow-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Row 1: Resource & Category */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resource / Location</label>
                                            <select 
                                                onChange={handleResourceSelect} required
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-1 focus:ring-[#3f4175] transition-all font-bold text-slate-800 text-sm shadow-sm cursor-pointer"
                                            >
                                                <option value="">Select a resource</option>
                                                {!fetching && resources.map(res => <option key={res.id} value={res.id}>{res.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Incident Category</label>
                                            <select 
                                                name="category" onChange={handleChange}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-1 focus:ring-[#3f4175] transition-all font-bold text-slate-800 text-sm shadow-sm cursor-pointer"
                                            >
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Toggle Priority */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Priority Level</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                            {priorities.map(p => (
                                                <button
                                                    key={p} type="button"
                                                    onClick={() => setFormData({...formData, priority: p})}
                                                    className={`py-4 px-4 rounded font-black text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                                                        formData.priority === p 
                                                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-md' 
                                                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Incident Description</label>
                                        <textarea 
                                            name="description" required rows="5"
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-1 focus:ring-[#3f4175] transition-all font-bold text-slate-800 text-sm resize-none shadow-sm placeholder:text-slate-400 placeholder:font-medium"
                                            placeholder="Please describe the malfunction or issue..."
                                        ></textarea>
                                    </div>

                                    {/* Contact & Attachments */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Direct Contact</label>
                                            <input 
                                                type="text" name="preferredContact" onChange={handleChange}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-[#3f4175] focus:outline-none focus:ring-1 focus:ring-[#3f4175] transition-all font-bold text-slate-800 text-sm shadow-sm placeholder:text-slate-400 placeholder:font-medium" 
                                                placeholder="Email or Ext No."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Visual Evidence</label>
                                            <input 
                                                type="file" multiple accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-bold text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:bg-[#3f4175] file:text-white hover:file:bg-[#0F172A] transition-all shadow-sm cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <button 
                                            type="submit" disabled={loading}
                                            className="w-full py-5 bg-[#FFD166] text-slate-900 border border-[#FFCC29] font-black text-xs uppercase tracking-widest rounded shadow-lg shadow-[#FFD166]/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                                        >
                                            {loading ? 'Initializing Secure Report...' : 'Submit Maintenance Request'}
                                        </button>
                                    </div>
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
