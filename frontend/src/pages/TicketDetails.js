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

    if (!ticket) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-12 rounded border border-slate-200 max-w-xl shadow-sm">
                <div className="text-6xl mb-6 text-slate-300">🚫</div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-4 uppercase">Incident Missing</h2>
                <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">The requested ticket does not exist.</p>
                <button onClick={() => navigate(-1)} className="px-8 py-4 bg-[#0F172A] text-white rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-md">
                    Return to Hub
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            <Navbar />
            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                {renderSidebar()}
                <main className={`flex-1 ${userRole === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} h-[calc(100vh-72px)] overflow-y-auto scroll-smooth`}>
                    
                    {/* Header Area styled like UserDashboard */}
                    <div className="bg-white border-b border-slate-200 py-10">
                        <div className="max-w-[1000px] mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                <div>
                                    <div className="flex gap-3 mb-4">
                                        <span className="px-3 py-1 bg-slate-100 text-[#0F172A] text-[10px] font-black uppercase tracking-[0.2em] rounded shadow-sm border border-slate-200">
                                            #{ticket.id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                                            ticket.status === 'OPEN' ? 'bg-[#FFD166] text-slate-900 border-[#FFCC29]' : 
                                            ticket.status === 'RESOLVED' ? 'bg-[#3f4175] text-white border-[#3f4175]' : 'bg-[#0F172A] text-white border-[#0F172A]'
                                        }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2 uppercase">
                                        {ticket.resourceName}
                                    </h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                        Category: {ticket.category} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Admin Controls */}
                                {userRole === 'ADMIN' && (
                                    <div className="flex gap-4 shrink-0 mt-4 md:mt-0">
                                        {ticket.status !== 'CLOSED' && (
                                            <button onClick={() => handleAction('CLOSED')} disabled={actionLoading}
                                                className="px-6 py-3 bg-[#3f4175] text-white rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#2c2d54] transition shadow-md">
                                                {actionLoading ? 'Finalizing...' : 'Close Incident'}
                                            </button>
                                        )}
                                        {ticket.status !== 'REJECTED' && (ticket.status === 'OPEN' || ticket.status === 'PENDING') && (
                                            <button onClick={() => handleAction('REJECTED')} disabled={actionLoading}
                                                className="px-6 py-3 bg-white text-rose-600 border border-rose-200 rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 transition shadow-sm">
                                                {actionLoading ? 'Rejecting...' : 'Reject Case'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1000px] mx-auto px-6 py-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Left: Content */}
                            <div className="lg:col-span-2 space-y-8">
                                
                                <section className="bg-white p-8 rounded border border-slate-200 shadow-sm relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-full h-2 bg-[#FFD166]"></div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Case Description</h3>
                                    <p className="text-lg font-bold text-slate-800 leading-relaxed">"{ticket.description}"</p>
                                    
                                    {/* Resolution Area */}
                                    {ticket.resolutionNotes && (
                                        <div className="mt-8 pt-8 border-t border-slate-100">
                                            <h3 className="text-[10px] font-black text-[#3f4175] uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[#ffD166] rounded-full"></span>
                                                Official Resolution Notes
                                            </h3>
                                            <div className="bg-slate-50 p-6 rounded border border-slate-200 font-bold text-slate-800 text-sm leading-relaxed">
                                                {ticket.resolutionNotes}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* Gallery Section */}
                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <section className="bg-white p-8 rounded border border-slate-200 shadow-sm">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Evidentiary Documentation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {ticket.attachments.map((url, i) => (
                                                <div key={i} className="group relative rounded overflow-hidden border border-slate-200 shadow-sm aspect-video bg-slate-50">
                                                    <img src={`http://localhost:8081${url}`} alt="Ticket Evidence" 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Asset+Image'; }} />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Interaction Section */}
                                <section className="bg-white p-8 rounded border border-slate-200 shadow-sm space-y-8">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Registry Conversation</h3>
                                    <div className="space-y-6">
                                        {comments.map(comment => (
                                            <div key={comment.id} className="flex gap-4">
                                                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 border border-slate-200 uppercase tracking-tighter shrink-0">
                                                    {(comment.authorEmail || 'U').charAt(0)}
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded border border-slate-200 flex-1 relative">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{comment.authorEmail}</span>
                                                        <span className="text-[9px] font-bold text-slate-400">{new Date(comment.createdAt).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</span>
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
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-bold text-slate-800 shadow-sm resize-none min-h-[100px] placeholder:text-slate-400"
                                            value={newComment} onChange={(e) => setNewComment(e.target.value)}
                                        ></textarea>
                                        <button type="submit" className="mt-4 px-8 py-3 bg-[#0F172A] text-white rounded font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition shadow-md">Post Comment</button>
                                    </form>
                                </section>
                            </div>

                            {/* Right: Meta Info */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-[#0F172A] p-8 rounded border border-slate-800 text-white shadow-lg relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 relative z-10">Metadata Summary</h4>
                                    <div className="space-y-6 relative z-10">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Incident Creator</p>
                                            <p className="font-bold text-xs truncate text-slate-200">{ticket.requesterEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Technician</p>
                                            <p className="font-bold text-xs truncate text-[#FFD166]">{ticket.technicianEmail || 'PENDING ASSIGNMENT'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Priority Classification</p>
                                            <p className={`font-black text-xs uppercase tracking-widest ${
                                                ticket.priority === 'URGENT' ? 'text-rose-400' : 'text-slate-200'
                                            }`}>{ticket.priority}</p>
                                        </div>
                                        <div className="pt-6 border-t border-slate-800">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Internal System</p>
                                            <p className="font-bold text-xs text-slate-300">WASSUP-PROD</p>
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
