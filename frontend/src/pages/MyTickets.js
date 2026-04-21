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
            case 'OPEN': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFEFE] flex flex-col font-sans selection:bg-indigo-100 relative overflow-x-hidden">
            <div className="absolute top-[-5%] left-[-2%] w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none"></div>
            
            <Navbar />
            <div className="flex flex-1 relative z-10">
                <Sidebar />
                <main className="flex-1 lg:ml-64 p-6 md:p-12 xl:p-16 transition-all duration-300">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-left">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.25em] rounded-xl mb-4 border border-indigo-100 shadow-sm">
                                    Support Dashboard
                                </span>
                                <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                                    My Incidents<span className="text-indigo-600">.</span>
                                </h1>
                            </div>
                            <Link to="/report-incident" className="px-10 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] hover:bg-indigo-600 transition-all transform hover:scale-105 shadow-2xl shadow-indigo-100 active:scale-95">
                                Create New Ticket
                            </Link>
                        </header>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-96">
                                <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Querying Incident DB...</p>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="bg-white p-24 rounded-[4rem] border border-slate-100 text-center shadow-xl shadow-slate-100/50 animate-up">
                                <div className="text-7xl mb-8 grayscale opacity-50">🛡️</div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">System Integrity Normal.</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">All assets are functional. No incidents recorded.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 animate-up">
                                {tickets.map((ticket) => (
                                    <Link 
                                        key={ticket.id} 
                                        to={`/tickets/${ticket.id}`}
                                        className="bg-white group p-10 rounded-[3.5rem] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 hover:shadow-2xl hover:border-indigo-100 transition-all relative overflow-hidden active:scale-[0.98]"
                                    >
                                        <div className="absolute top-0 left-0 w-2.5 h-full bg-slate-50 group-hover:bg-indigo-600 transition-all duration-500"></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${getStatusStyle(ticket.status)}`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] font-black text-slate-300 tracking-widest">#INC-{ticket.id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">{ticket.resourceName}</h3>
                                            <p className="text-slate-400 font-medium italic line-clamp-1 max-w-3xl">"{ticket.description}"</p>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${
                                                ticket.priority === 'URGENT' ? 'bg-rose-50 text-rose-600' : 
                                                ticket.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' : 'text-slate-300'
                                            }`}>
                                                {ticket.priority}
                                            </span>
                                            <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                <svg className="w-4 h-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default MyTickets;
