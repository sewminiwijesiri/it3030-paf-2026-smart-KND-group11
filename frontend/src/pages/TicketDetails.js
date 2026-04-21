import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
import Footer from '../components/Footer';
import api from '../utils/api';

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
        <div className="h-screen flex flex-col items-center justify-center font-black animate-pulse text-indigo-600 bg-slate-50">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="uppercase tracking-[0.3em] text-[10px]">Syncing Asset Data...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 max-w-xl animate-up">
                <div className="text-6xl mb-6 grayscale text-rose-500">📁</div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase italic">Registry Access Failed</h2>
                <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-xs mb-8 border border-rose-100 uppercase tracking-widest leading-relaxed">
                    CODE: {error}
                </div>
                <button onClick={() => navigate(-1)} className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                    Return to Hub
                </button>
            </div>
        </div>
    );

    if (!ticket) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 max-w-xl animate-up">
                <div className="text-6xl mb-6 grayscale text-rose-500">🚫</div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 uppercase italic">Incident Registry Missing</h2>
                <p className="text-slate-400 font-bold mb-8 italic">The requested incident ID does not exist in our secure registry.</p>
                <button onClick={() => navigate(-1)} className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95">
                    Return to Hub
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFEFE] flex flex-col font-sans selection:bg-indigo-100">
            <Navbar />
            <div className="flex flex-1 relative z-10">
                {renderSidebar()}
                <main className="flex-1 lg:ml-64 p-6 md:p-12 xl:p-16 animate-up">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                            <div>
                                <div className="flex gap-3 mb-6">
                                    <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-indigo-100 shadow-sm transition-all hover:scale-105 active:scale-95">#{ticket.id.slice(-8).toUpperCase()}</span>
                                    <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                        ticket.status === 'OPEN' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                        ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-900 text-white'
                                    }`}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">{ticket.resourceName}</h1>
                                <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[10px] opacity-70">Category: {ticket.category} • Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
                            </div>

                            {/* Admin Controls */}
                            {userRole === 'ADMIN' && (
                                <div className="flex gap-4">
                                    {ticket.status !== 'CLOSED' && (
                                        <button onClick={() => handleAction('CLOSED')} disabled={actionLoading}
                                            className="px-10 py-5 bg-emerald-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100 active:scale-95">
                                            {actionLoading ? 'Finalizing...' : 'Close Incident'}
                                        </button>
                                    )}
                                    {ticket.status !== 'REJECTED' && (ticket.status === 'OPEN' || ticket.status === 'PENDING') && (
                                        <button onClick={() => handleAction('REJECTED')} disabled={actionLoading}
                                            className="px-10 py-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-100 active:scale-95">
                                            {actionLoading ? 'Rejecting...' : 'Reject Case'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left: Content */}
                            <div className="lg:col-span-2 space-y-12 animate-up delay-100">
                                
                                <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all">
                                    <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-6 px-1">Case Description</h3>
                                    <p className="text-xl font-bold text-slate-800 leading-relaxed italic">"{ticket.description}"</p>
                                    
                                    {/* Resolution Area */}
                                    {ticket.resolutionNotes && (
                                        <div className="mt-12 pt-12 border-t border-slate-50">
                                            <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping"></span>
                                                Official Resolution Notes
                                            </h3>
                                            <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 italic font-bold text-emerald-800 text-lg leading-relaxed">
                                                {ticket.resolutionNotes}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* Gallery Section */}
                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <section>
                                        <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-6 px-4">Evidentiary Documentation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {ticket.attachments.map((url, i) => (
                                                <div key={i} className="group relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm aspect-video bg-slate-50 cursor-zoom-in">
                                                    <img src={`http://localhost:8081${url}`} alt="Ticket Evidence" 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Asset+Image'; }} />
                                                    <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Interaction Section */}
                                <section className="space-y-8 pb-20">
                                    <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-4 px-4">Registry Conversation</h3>
                                    <div className="space-y-6">
                                        {comments.map(comment => (
                                            <div key={comment.id} className="flex gap-4 group">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0 uppercase tracking-tighter">
                                                    {(comment.authorEmail || 'U').charAt(0)}
                                                </div>
                                                <div className="bg-slate-50/80 p-6 rounded-3xl group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all flex-1">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{comment.authorEmail}</span>
                                                        <span className="text-[9px] font-bold text-slate-300 italic">{new Date(comment.createdAt).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-700">{comment.content}</p>
                                                    {comment.authorEmail === userEmail && (
                                                        <button onClick={() => deleteComment(comment.id)} className="mt-3 text-[9px] font-black text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest hover:text-rose-600">Erase Comment</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={submitComment} className="relative group">
                                        <textarea 
                                            placeholder="Append to incident registry..." required
                                            className="w-full px-8 py-8 bg-white border border-slate-100 rounded-[3rem] focus:ring-8 focus:ring-indigo-50 focus:border-indigo-200 outline-none font-bold text-slate-700 shadow-2xl shadow-indigo-100/20 resize-none min-h-[100px]"
                                            value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                        ></textarea>
                                        <button type="submit" className="absolute right-6 bottom-6 px-8 py-3 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-xl">Transmit</button>
                                    </form>
                                </section>
                            </div>

                            {/* Right: Meta Info */}
                            <div className="lg:col-span-1 space-y-8 animate-up delay-200">
                                <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">Metadata Proxy</h4>
                                    <div className="space-y-8">
                                        <div className="group">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 group-hover:text-white/50 transition-colors">Incident Creator</p>
                                            <p className="font-bold text-xs truncate group-hover:text-indigo-300 transition-colors">{ticket.requesterEmail}</p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 group-hover:text-white/50 transition-colors">Active Technician</p>
                                            <p className="font-bold text-xs truncate group-hover:text-indigo-300 transition-colors">{ticket.technicianEmail || 'PENDING ASSIGNMENT'}</p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 group-hover:text-white/50 transition-colors">Response priority</p>
                                            <p className={`font-black text-xs uppercase tracking-widest ${
                                                ticket.priority === 'URGENT' ? 'text-rose-400' : 'text-emerald-400'
                                            }`}>{ticket.priority}</p>
                                        </div>
                                        <div className="group">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1 group-hover:text-white/50 transition-colors">Internal Registry</p>
                                            <p className="font-bold text-xs">SMART-CAMPUS-v2.1</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default TicketDetails;
