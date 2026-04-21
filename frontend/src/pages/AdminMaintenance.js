import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AdminMaintenance = () => {
    const [tickets, setTickets] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assigning, setAssigning] = useState({ ticketId: null, techEmail: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [ticketsRes, usersRes] = await Promise.all([
                    api.get('/api/maintenance'),
                    api.get('/admin/users')
                ]);
                console.log('Admin Data Fetched:', ticketsRes.data);
                setTickets(ticketsRes.data);
                setTechnicians(usersRes.data.filter(u => u.role === 'TECHNICIAN'));
            } catch (err) {
                console.error('Error fetching admin maintenance data', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (ticketId) => {
        if (!assigning.techEmail) return;
        try {
            await api.put(`/api/maintenance/${ticketId}/assign?technicianEmail=${assigning.techEmail}`);
            setTickets(tickets.map(t => t.id === ticketId ? { ...t, technicianEmail: assigning.techEmail } : t));
            setAssigning({ ticketId: null, techEmail: '' });
        } catch (err) {
            console.error('Failed to assign technician', err);
        }
    };

    return (
        <AdminLayout>
            <div className="animate-up">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">
                        Incident Control Center<span className="text-indigo-600">.</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Asset Integrity & Service Management</p>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100 text-center">
                         <div className="text-4xl mb-4">⚠️</div>
                         <h3 className="text-lg font-black text-rose-800 mb-2 whitespace-pre-line underline decoration-rose-200 uppercase tracking-widest">Access Protocol Compromised</h3>
                         <p className="text-rose-600 font-bold text-sm">{error}</p>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center shadow-sm">
                        <div className="text-6xl mb-6 grayscale">🛡️</div>
                        <h3 className="text-xl font-black text-slate-800 mb-2 italic">No Pending Incidents</h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">The campus maintenance queue is currently empty.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Ticket / Case</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Priority</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Assigned To</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-7">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-indigo-500 mb-1">INC-{ticket.id.slice(-6).toUpperCase()}</span>
                                                    <span className="font-bold text-slate-900 line-clamp-1">{ticket.resourceName}</span>
                                                    <span className="text-[10px] font-medium text-slate-400">{ticket.requesterEmail}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                    ticket.status === 'OPEN' ? 'bg-indigo-50 text-indigo-600' : 
                                                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : 
                                                    ticket.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className={`text-[9px] font-black uppercase tracking-tighter ${
                                                    ticket.priority === 'URGENT' ? 'text-rose-600' : 
                                                    ticket.priority === 'HIGH' ? 'text-amber-600' : 'text-slate-400'
                                                }`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7">
                                                {assigning.ticketId === ticket.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <select 
                                                            className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded-lg p-1.5 outline-none"
                                                            onChange={(e) => setAssigning({ ...assigning, techEmail: e.target.value })}
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>Select Tech</option>
                                                            {technicians.map(tech => <option key={tech.id} value={tech.email}>{tech.name || tech.email}</option>)}
                                                        </select>
                                                        <button 
                                                            onClick={() => handleAssign(ticket.id)}
                                                            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-black transition"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => setAssigning({ ticketId: null, techEmail: '' })}
                                                            className="p-1.5 bg-slate-200 text-slate-500 rounded-lg hover:bg-slate-300 transition"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[11px] font-bold text-slate-700 underline decoration-slate-200">{ticket.technicianEmail || 'Unassigned'}</span>
                                                        <button 
                                                            onClick={() => setAssigning({ ticketId: ticket.id, techEmail: '' })}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600 transition"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-7 text-right">
                                                <Link to={`/tickets/${ticket.id}`} className="px-5 py-2 bg-slate-50 text-slate-500 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                                    Manage Case
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminMaintenance;
