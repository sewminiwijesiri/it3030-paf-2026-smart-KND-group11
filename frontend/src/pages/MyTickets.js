import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get('/api/maintenance/my');
                setTickets(response.data);
            } catch (err) {
                console.error('Error fetching my tickets', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const filteredTickets = tickets.filter(t => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return t.status === 'OPEN' || t.status === 'IN_PROGRESS';
        if (filter === 'RESOLVED') return t.status === 'RESOLVED' || t.status === 'CLOSED';
        return true;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-500/5';
            case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-500/5';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5';
            case 'CLOSED': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('WARNING: This action will permanently remove this incident from the registry. Continue?')) {
            try {
                await api.delete(`/api/maintenance/${id}`);
                setTickets(tickets.filter(t => t.id !== id));
            } catch (err) {
                console.error('Delete failed', err);
                alert('Deletion Protocol Failed: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFD166]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

            <Navbar />
            
            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 lg:ml-72 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth">
                    
{/* Header */}
<div className="bg-white border-b border-slate-200 py-6">
  <div className="max-w-[1000px] mx-auto px-6">
    <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.4em] mb-2 drop-shadow-sm flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
      Support Dashboard
    </p>

    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">
          My Requests
        </h1>
      </div>
    </div>
  </div>
</div>
                                    </h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px] max-w-md ml-1">
                                        Monitoring <span className="text-slate-900">{tickets.length}</span> active data packets in the maintenance queue.
                                    </p>
                                </div>
{/* Header */}
<div className="bg-white border-b border-slate-200 py-6">
  <div className="max-w-[1000px] mx-auto px-6">
    <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.4em] mb-2 drop-shadow-sm flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
      Support Dashboard
    </p>

    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">
          My Requests
        </h1>
      </div>
    </div>
  </div>
</div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1100px] mx-auto px-8 py-12">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96 space-y-6">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-slate-100 border-t-[#3f4175] rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-2 h-2 bg-[#FFD166] rounded-full"></div>
                                    </div>
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[11px]">Querying Incident Registry...</p>
                            </div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="bg-white p-24 rounded-[40px] border border-slate-200 text-center shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50 group-hover:bg-[#FFD166] transition-colors"></div>
                                <div className="text-7xl mb-8 opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">📁</div>
                                <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">System Ledger Empty</h3>
                                <p className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                                    No records found matching the current filter criteria. Your account health is optimal.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {filteredTickets.map((ticket) => (
                                    <Link 
                                        key={ticket.id} 
                                        to={`/tickets/${ticket.id}`}
                                        className="bg-white group p-10 rounded-[32px] border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                                    >
                                        {/* Accent Node */}
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-all pointer-events-none"></div>

                                        <div className="flex-1 space-y-6">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(ticket.status)}`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                                <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                                                <span className="text-[10px] font-black text-slate-400 tracking-[0.25em] uppercase">
                                                    ID-{ticket.id.slice(-8).toUpperCase()}
                                                </span>
                                                <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${
                                                    ticket.priority === 'URGENT' ? 'bg-rose-50 text-rose-500 border-rose-200' : 
                                                    ticket.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                    'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        ticket.priority === 'URGENT' ? 'bg-rose-500 animate-pulse' : 
                                                        ticket.priority === 'HIGH' ? 'bg-amber-500' : 'bg-slate-400'
                                                    }`}></span>
                                                    {ticket.priority} Priority
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-[#3f4175] transition-colors uppercase leading-none">
                                                    {ticket.resourceName}
                                                </h3>
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded border border-slate-100">{ticket.category}</span>
                                                    <p className="text-xs font-bold truncate max-w-lg italic opacity-60 group-hover:opacity-100 transition-opacity">"{ticket.description}"</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start xl:items-end gap-6 pt-10 xl:pt-0 xl:pl-12 border-t xl:border-t-0 xl:border-l border-slate-50 min-w-[200px]">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left xl:text-right">Transmission Date</p>
                                                <div className="flex items-center gap-2 text-md font-black text-slate-800">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-slate-100 transition-colors">
                                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-[#3f4175]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                    {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center gap-4 group-hover:gap-6 transition-all duration-300">
                                                <button 
                                                    onClick={(e) => handleDelete(e, ticket.id)}
                                                    className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-rose-500/20"
                                                    title="Delete Incident"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                                <div className="w-10 h-10 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-lg group-hover:bg-[#FFD166] group-hover:text-slate-900 transition-all duration-300">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyTickets;
