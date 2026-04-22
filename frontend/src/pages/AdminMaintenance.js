import React, { useState, useEffect } from 'react';
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-[#FFD166] text-slate-900 border-[#FFCC29]';
            case 'IN_PROGRESS': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'RESOLVED': return 'bg-[#3f4175] text-white border-transparent';
            case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 py-10 mb-10">
                <p className="text-[#3f4175] font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                    Maintenance Hub
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
                    Incident Control Center
                </h1>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    Asset Integrity & Service Management
                </p>
            </div>

            {/* Loading / Error / Empty States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A]"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Incident Queue...</p>
                </div>
            ) : error ? (
                <div className="bg-white border border-rose-200 border-l-4 border-l-rose-500 p-8 rounded shadow-sm text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-lg font-black text-rose-800 mb-1 uppercase tracking-widest">Access Protocol Error</h3>
                    <p className="text-rose-600 font-bold text-sm">{error}</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="bg-white p-20 rounded border border-slate-200 text-center shadow-sm">
                    <div className="text-6xl mb-4 mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">🛡️</div>
                    <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-wide">No Pending Incidents</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">The campus maintenance queue is currently empty.</p>
                </div>
            ) : (
                <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket / Case</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned To</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-[#3f4175] mb-1">INC-{ticket.id.slice(-6).toUpperCase()}</span>
                                                <span className="font-bold text-slate-900 line-clamp-1 text-sm">{ticket.resourceName}</span>
                                                <span className="text-[10px] font-medium text-slate-400 mt-0.5">{ticket.requesterEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-block px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                                                ticket.priority === 'URGENT' ? 'text-rose-600 bg-rose-50 border-rose-100' :
                                                ticket.priority === 'HIGH' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                                                'text-slate-400 bg-slate-50 border-slate-100'
                                            }`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            {assigning.ticketId === ticket.id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="text-[10px] font-bold bg-slate-50 border border-slate-200 rounded px-2 py-2 outline-none focus:border-[#3f4175] transition-colors"
                                                        onChange={(e) => setAssigning({ ...assigning, techEmail: e.target.value })}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Select Tech</option>
                                                        {technicians.map(tech => <option key={tech.id} value={tech.email}>{tech.name || tech.email}</option>)}
                                                    </select>
                                                    <button onClick={() => handleAssign(ticket.id)} className="p-2 bg-[#0F172A] text-white rounded hover:bg-[#3f4175] transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                    </button>
                                                    <button onClick={() => setAssigning({ ticketId: null, techEmail: '' })} className="p-2 bg-slate-100 text-slate-500 rounded hover:bg-slate-200 transition-colors">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] font-bold text-slate-700">{ticket.technicianEmail || 'Unassigned'}</span>
                                                    <button
                                                        onClick={() => setAssigning({ ticketId: ticket.id, techEmail: '' })}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-slate-50 border border-slate-200 text-slate-400 rounded hover:text-[#3f4175] hover:border-[#3f4175] transition-all"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <Link to={`/tickets/${ticket.id}`} className="px-4 py-2 bg-[#FFD166] text-slate-900 font-black text-[9px] uppercase tracking-widest rounded hover:bg-[#FFCC29] hover:scale-105 transition-all shadow-sm shadow-[#FFD166]/20">
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
        </AdminLayout>
    );
};

export default AdminMaintenance;
