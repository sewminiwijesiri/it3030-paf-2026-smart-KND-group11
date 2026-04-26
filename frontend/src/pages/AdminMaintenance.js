import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  ChevronDown,
  Activity,
  Zap,
  X,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminMaintenance = () => {
    const [tickets, setTickets] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [assigningId, setAssigningId] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [ticketsRes, techsRes] = await Promise.all([
                api.get('/api/maintenance'),
                api.get('/admin/users')
            ]);
            setTickets(ticketsRes.data);
            setTechnicians(techsRes.data.filter(u => u.role === 'TECHNICIAN'));
        } catch (err) {
            console.error('Error fetching admin maintenance data', err);
            setError(err.response?.data?.message || err.message);
            toast.error('Registry Synchronization Failure');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAssign = async (ticketId, techEmail) => {
        if (!techEmail) return;
        const loadingToast = toast.loading('Reconfiguring Incident Ownership...');
        try {
            await api.put(`/api/maintenance/${ticketId}/assign?technicianEmail=${techEmail}`);
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, technicianEmail: techEmail, status: t.status === 'OPEN' ? 'IN_PROGRESS' : t.status } : t));
            setAssigningId(null);
            toast.success('Technician Assigned Successfully', { id: loadingToast });
        } catch (err) {
            console.error('Failed to assign technician', err);
            toast.error('Assignment Protocol Failed', { id: loadingToast });
        }
    };

    const stats = useMemo(() => ({
        total: tickets.length,
        urgent: tickets.filter(t => t.priority === 'URGENT').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length
    }), [tickets]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => 
            t.resourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.requesterEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.technicianEmail?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tickets, searchQuery]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'IN_PROGRESS': return 'bg-[#3f4175] text-white border-transparent';
            case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            {/* Page Header - Matched to User Control */}
            <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 py-7 mb-7">
                <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                    Maintenance Operations
                </p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1">
                            Maintenance Hub
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            Monitor campus infrastructure and manage technical service requests.
                        </p>
                    </div>
                    
                    {/* Stats Bar - Matched to User Control */}
                    <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
                        <div className="bg-slate-50 border border-slate-200 rounded px-5 py-2.5 flex items-center gap-4 shadow-sm shrink-0">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Tickets</span>
                            <span className="text-xl font-black text-slate-900">{stats.total}</span>
                        </div>
                        <div className="bg-rose-50 border border-rose-100 rounded px-5 py-2.5 flex items-center gap-4 shadow-sm shrink-0">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Critical</span>
                            <span className="text-xl font-black text-rose-700">{stats.urgent}</span>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded px-5 py-2.5 flex items-center gap-4 shadow-sm shrink-0">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secured</span>
                            <span className="text-xl font-black text-emerald-700">{stats.resolved}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="mb-8 flex justify-end">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search resource, ID, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-300 shadow-sm"
                    />
                </div>
            </div>

            {/* Main Table - Matched to User Control */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requester / Resource</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Technician</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A]"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Incident Ledger...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="max-w-md mx-auto">
                                            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">Registry Error</h3>
                                            <p className="text-sm text-slate-500 font-bold mb-6 italic">"{error}"</p>
                                            <button onClick={fetchData} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#3f4175] transition-all">Retry Sync</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <Activity className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Zero matches found in active registry.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs italic shrink-0 group-hover:bg-[#3f4175] group-hover:text-white transition-all">
                                                    {ticket.requesterEmail?.[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">INC-{ticket.id.slice(-6).toUpperCase()}</span>
                                                        <span className="text-[9px] font-black text-[#FFD166] bg-[#0F172A] px-2 py-0.5 rounded uppercase tracking-[0.2em]">{ticket.category || 'Maintenance'}</span>
                                                    </div>
                                                    <p className="font-black text-slate-900 text-[13px] tracking-tight mb-1">{ticket.resourceName}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold truncate max-w-[200px] flex items-center gap-1">
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        {ticket.requesterEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-block px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded border shadow-sm ${
                                                ticket.priority === 'URGENT' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                ticket.priority === 'HIGH' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-white text-slate-400 border-slate-100'
                                            }`}>
                                                <Zap className={`w-3 h-3 ${ticket.priority === 'URGENT' ? 'animate-pulse' : ''}`} />
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            {assigningId === ticket.id ? (
                                                <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                                                    <div className="relative">
                                                        <select
                                                            className="text-[10px] font-black bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 outline-none focus:border-[#3f4175] transition-colors appearance-none cursor-pointer uppercase tracking-widest"
                                                            onChange={(e) => handleAssign(ticket.id, e.target.value)}
                                                            defaultValue=""
                                                        >
                                                            <option value="" disabled>Select Tech</option>
                                                            {technicians.map(tech => (
                                                                <option key={tech.id} value={tech.email}>{tech.name || tech.email}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                                    </div>
                                                    <button onClick={() => setAssigningId(null)} className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 group/assign">
                                                    <div className="flex flex-col">
                                                        <p className="text-[11px] font-black text-slate-900 leading-none mb-1.5">{ticket.technicianEmail || 'System Standby'}</p>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Operator</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => setAssigningId(ticket.id)}
                                                        className="opacity-0 group-hover/assign:opacity-100 p-2 bg-slate-50 border border-slate-200 text-slate-400 rounded-lg hover:text-[#3f4175] hover:border-[#3f4175] transition-all"
                                                    >
                                                        <UserPlus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <Link to={`/tickets/${ticket.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFD166] text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-[#FFCC29] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FFD166]/10 group">
                                                Manage Case
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer / System Status */}
            <div className="flex justify-between items-center px-4 opacity-50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Encrypted Hub Sync OK</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Node V2.4.0-MAINT</span>
            </div>
        </AdminLayout>
    );
};

export default AdminMaintenance;
