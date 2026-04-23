import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'IN_PROGRESS': return 'bg-[#FFD166] text-slate-900 border-[#FFCC29] shadow-sm';
            case 'RESOLVED': return 'bg-[#3f4175] text-white border-transparent shadow-sm';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            <Navbar />
            
            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 lg:ml-64 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth">
                    
                    {/* Header matches styling of User Dashboard / Home */}
                    <div className="bg-white border-b border-slate-200 py-6">
                        <div className="max-w-[1000px] mx-auto px-6">
                            <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.4em] mb-2 drop-shadow-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                Support Dashboard
                            </p>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">
                                        My Incidents
                                    </h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px] max-w-sm">
                                        Track the status of all your maintenance requests and support tickets.
                                    </p>
                                </div>
                                <Link to="/report-incident" className="shrink-0 bg-[#FFD166] text-slate-900 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 hover:bg-[#FFCC29] transition-all shadow-lg shadow-[#FFD166]/20">
                                    Create New Ticket
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1000px] mx-auto px-6 py-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A]"></div>
                                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Querying Incident DB...</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="bg-white p-20 rounded border border-slate-200 text-center shadow-sm">
                                <div className="text-6xl mb-6 mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">🛡️</div>
                                <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-wide">System Component Nominal</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">No outstanding maintenance tickets.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {tickets.map((ticket) => (
                                    <Link 
                                        key={ticket.id} 
                                        to={`/tickets/${ticket.id}`}
                                        className="bg-white group p-8 border border-slate-200 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-full bg-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(ticket.status)}`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                                    #{ticket.id.slice(-6)}
                                                </span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-slate-200 ${
                                                    ticket.priority === 'URGENT' ? 'text-rose-500 bg-rose-50' : 
                                                    ticket.priority === 'HIGH' ? 'text-amber-500 bg-amber-50' : 'text-slate-500 bg-slate-50'
                                                }`}>
                                                    Priority: {ticket.priority}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#3f4175] transition-colors">{ticket.resourceName}</h3>
                                            <p className="text-sm font-semibold text-slate-500 italic line-clamp-1">"{ticket.description}"</p>
                                        </div>
                                        <div className="flex flex-col items-start md:items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 text-left md:text-right w-full md:w-auto">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Logged</span>
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="mt-2 text-[#3f4175] text-[10px] font-black uppercase tracking-widest group-hover:text-[#FFD166] transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                                                View Details <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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
