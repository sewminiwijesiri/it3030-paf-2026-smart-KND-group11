import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';

import api from '../utils/api';
import { resolveImageUrl } from '../utils/imageUtils';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const userRole = localStorage.getItem('role');
    const userEmail = localStorage.getItem('userEmail');

    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const [ticketRes, commentsRes] = await Promise.all([
                    api.get(`/api/maintenance/${id}`),
                    api.get(`/api/maintenance/${id}/comments`)
                ]);
                setTicket(ticketRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                console.error('Error fetching ticket details', err);
                const msg = err.response?.data?.message || err.message || 'Unknown Registry Error';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleAction = async (status) => {
        setActionLoading(true);
        try {
            await api.put(`/api/maintenance/${id}/status?status=${status}`);
            window.location.reload();
        } catch (err) {
            console.error('Action failed', err);
            alert('Action failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/maintenance/${id}/comments`, { content: newComment });
            setComments([...comments, res.data]);
            setNewComment('');
        } catch (err) {
            console.error('Comment failed', err);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await api.delete(`/api/maintenance/${id}/comments/${commentId}`);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const renderSidebar = () => {
        if (userRole === 'ADMIN') return <AdminSidebar />;
        if (userRole === 'TECHNICIAN') return <TechnicianSidebar />;
        return <Sidebar />;
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center font-black animate-pulse text-[#0F172A] bg-slate-50">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-[#0F172A] rounded-full animate-spin mb-4"></div>
            <p className="uppercase tracking-[0.2em] text-[10px]">Syncing Asset Data...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-12 rounded border border-slate-200 max-w-xl shadow-sm">
                <div className="text-6xl mb-6 text-rose-500">📁</div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-4 uppercase">Registry Access Failed</h2>
                <div className="p-4 bg-rose-50 text-rose-600 rounded font-bold text-xs mb-8 border border-rose-100 uppercase tracking-widest">
                    CODE: {error}
                </div>
                <button onClick={() => navigate(-1)} className="px-8 py-4 bg-[#0F172A] text-white rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md">
                    Return to Hub
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            {/* Image Viewer Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-xl animate-in fade-in duration-300 p-6" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-6" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => setSelectedImage(null)} className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all group">
                                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <img src={selectedImage} alt="Fullscreen View" className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" />
                        <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
                            <p className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Full Resolution Asset</p>
                        </div>
                    </div>
                </div>
            )}

            <Navbar />
            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                {renderSidebar()}
                <main className={`flex-1 lg:ml-72 h-[calc(100vh-64px)] overflow-y-auto scroll-smooth pb-10`}>

                    {/* Header Section - Modern Hero Style */}
                    <div className="bg-[#002147] border-b border-white/10 py-10 shadow-lg mb-10">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                <div>
                                    <div className="flex flex-wrap gap-3 mb-5">
                                        <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-blue-200 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-inner">
                                            INCIDENT #{ticket.id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg border ${ticket.status === 'OPEN' ? 'bg-[#FF9F1C] text-white border-[#FF9F1C]/20 shadow-orange-500/20' :
                                                ticket.status === 'RESOLVED' ? 'bg-[#4DA8DA] text-white border-[#4DA8DA]/20 shadow-blue-500/20' : 'bg-[#002147] text-white border-white/10'
                                            }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                                        {ticket.resourceName}
                                    </h1>
                                    <p className="text-blue-100/60 font-bold uppercase tracking-[0.2em] text-[10px]">
                                        Category: {ticket.category} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Admin Controls */}
                                {userRole === 'ADMIN' && (
                                    <div className="flex gap-4 shrink-0 mt-4 md:mt-0">
                                        {ticket.status !== 'CLOSED' && (
                                            <button onClick={() => handleAction('CLOSED')} disabled={actionLoading}
                                                className="px-6 py-3 bg-[#4DA8DA] text-white rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#3f98c8] transition shadow-md">
                                                {actionLoading ? 'Finalizing...' : 'Close Incident'}
                                            </button>
                                        )}
                                        {ticket.status !== 'REJECTED' && (ticket.status === 'OPEN' || ticket.status === 'PENDING') && (
                                            <button onClick={() => handleAction('REJECTED')} disabled={actionLoading}
                                                className="px-6 py-3 bg-rose-500 text-white rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 transition shadow-sm">
                                                {actionLoading ? 'Rejecting...' : 'Reject Case'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1000px] mx-auto px-6 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left: Content */}
                            <div className="lg:col-span-2 space-y-6">

<section className="bg-white p-6 rounded border border-slate-200 shadow-sm relative overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-2 bg-[#FF9F1C]"></div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Case Description</h3>
                                    <p className="text-base font-bold text-slate-800 leading-relaxed">"{ticket.description}"</p>

                                    {/* Resolution Area */}
                                    {ticket.resolutionNotes && (
                                        <div className="mt-8 pt-8 border-t border-slate-100">
                                            <h3 className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[#FF9F1C] rounded-full"></span>
                                                Official Resolution Notes
                                            </h3>
                                            <div className="bg-slate-50 p-4 rounded border border-slate-200 font-bold text-slate-800 text-xs leading-relaxed">
                                                {ticket.resolutionNotes}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* Gallery Section */}
                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <section className="bg-white p-6 rounded border border-slate-200 shadow-sm">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Evidentiary Documentation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {ticket.attachments.map((url, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setSelectedImage(resolveImageUrl(url))}
                                                    className="group relative rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm aspect-video bg-slate-50 cursor-pointer hover:border-[#FFD166] transition-all"
                                                >
                                                    <img src={resolveImageUrl(url)} alt="Ticket Evidence"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Asset+Image'; }} />
                                                    <div className="absolute inset-0 bg-[#0F172A]/0 group-hover:bg-[#0F172A]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl text-[#0F172A]">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Interaction Section */}
                                <section className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Registry Conversation</h3>
                                    <div className="space-y-6">
                                        {comments.map(comment => (
                                            <div key={comment.id} className="flex gap-4">
                                                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 border border-slate-200 uppercase tracking-tighter shrink-0">
                                                    {(comment.authorEmail || 'U').charAt(0)}
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded border border-slate-200 flex-1 relative">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{comment.authorEmail}</span>
                                                        <span className="text-[9px] font-bold text-slate-400">{new Date(comment.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-600">{comment.content}</p>
                                                    {comment.authorEmail === userEmail && (
                                                        <button onClick={() => deleteComment(comment.id)} className="absolute bottom-6 right-6 text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Delete</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={submitComment} className="relative pt-6 border-t border-slate-100">
                                        <textarea
                                            placeholder="Add a comment to the incident thread..." required
className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002147]/30 focus:border-[#002147] font-bold text-slate-800 shadow-sm resize-none min-h-[100px] placeholder:text-slate-400 text-sm"
                                            value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                        ></textarea>
                                        <button type="submit" className="mt-4 px-8 py-3 bg-[#002147] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#003166] transition shadow-md">Post Comment</button>
                                    </form>
                                </section>
                            </div>

                            {/* Right: Meta Info */}
                            <div className="lg:col-span-1 space-y-8">
<div className="bg-[#002147] p-6 rounded-2xl border border-white/5 text-white shadow-xl relative overflow-hidden">
  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9F1C]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

  <h4 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-6 relative z-10">
    Metadata Summary
  </h4>

  <div className="space-y-5 relative z-10">
                                        <div>
                                            <p className="text-[9px] font-black text-blue-300/50 uppercase tracking-widest mb-1">Incident Creator</p>
                                            <p className="font-bold text-xs truncate text-white">{ticket.requesterEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-blue-300/50 uppercase tracking-widest mb-1">Active Technician</p>
                                            <p className="font-bold text-xs truncate text-[#FF9F1C]">{ticket.technicianEmail || 'PENDING ASSIGNMENT'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-blue-300/50 uppercase tracking-widest mb-1">Priority Classification</p>
                                            <p className={`font-black text-xs uppercase tracking-widest ${ticket.priority === 'URGENT' ? 'text-rose-400' : 'text-white'
                                                }`}>{ticket.priority}</p>
                                        </div>
                                        <div className="pt-6 border-t border-white/10">
                                            <p className="text-[9px] font-black text-blue-300/50 uppercase tracking-widest mb-1">Internal System</p>
                                            <p className="font-bold text-xs text-blue-100/60">UNIFLOW-PROD</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
};

export default TicketDetails;
