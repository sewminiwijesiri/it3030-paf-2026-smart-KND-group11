import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import {
    Search,
    Trash2,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    Plus,
    LayoutGrid,
    List,
    Calendar,
    Tag
} from 'lucide-react';
import toast from 'react-hot-toast';


const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get('/api/maintenance/my');
                setTickets(response.data);
            } catch (err) {
                console.error('Error fetching my tickets', err);
                toast.error('Failed to synchronize incident registry');
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesFilter =
                filter === 'ALL' ||
                (filter === 'ACTIVE' && (t.status === 'OPEN' || t.status === 'IN_PROGRESS')) ||
                (filter === 'RESOLVED' && (t.status === 'RESOLVED' || t.status === 'CLOSED'));

            const matchesSearch =
                t.resourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.category?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [tickets, filter, searchQuery]);

    const stats = useMemo(() => ({
        total: tickets.length,
        active: tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length
    }), [tickets]);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'OPEN': return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: AlertCircle, label: 'Open' };
            case 'IN_PROGRESS': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: 'In Progress' };
            case 'RESOLVED': return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, label: 'Resolved' };
            case 'CLOSED': return { color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', icon: CheckCircle2, label: 'Closed' };
            default: return { color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100', icon: FileText, label: status };
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('WARNING: This action will permanently remove this incident from the registry. Continue?')) {
            const loadingToast = toast.loading('Deleting incident...');
            try {
                await api.delete(`/api/maintenance/${id}`);
                setTickets(tickets.filter(t => t.id !== id));
                toast.success('Incident purged from registry', { id: loadingToast });
            } catch (err) {
                console.error('Delete failed', err);
                toast.error('Deletion Protocol Failed', { id: loadingToast });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-hidden">
            {/* Dynamic Background Accents */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <Navbar />

            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                <Sidebar />
                <main className="flex-1 lg:ml-72 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth">

                    {/* Header Section */}
                    <div className="bg-[#002147] border-b border-white/10 sticky top-0 z-30 shadow-lg backdrop-blur-md">
                        <div className="max-w-[1200px] mx-auto px-6 py-8 lg:px-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-[#FF9F1C] animate-pulse"></div>
                                        <p className="text-blue-200 font-black text-[10px] uppercase tracking-[0.4em]">
                                            Service Registry
                                        </p>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                                        My <span className="text-blue-100/50">Requests</span>
                                    </h1>
                                </div>
                                <Link to="/report-incident" className="group flex items-center gap-3 bg-[#FF9F1C] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
                                    <Plus className="w-4 h-4" />
                                    New Ticket
                                </Link>
                            </div>

                            {/* Summary Stats Bar */}
                            <div className="grid grid-cols-3 gap-5 mt-10">
                                {[
                                    { label: 'Total Records', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
                                    { label: 'Active Tasks', value: stats.active, color: 'text-orange-400', bg: 'bg-white/5' },
                                    { label: 'Resolved', value: stats.resolved, color: 'text-emerald-400', bg: 'bg-white/5' }
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className={`${stat.bg} border border-white/10 rounded-2xl p-5 transition-all hover:bg-white/10 hover:shadow-md`}
                                    >
                                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-1.5 opacity-70">
                                            {stat.label}
                                        </p>
                                        <p className={`text-2xl font-black ${stat.color} italic leading-none`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10">
                        {/* Interactive Toolbar */}
                        <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex flex-wrap items-center gap-2">
                                {['ALL', 'ACTIVE', 'RESOLVED'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setFilter(t)}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t
                                            ? 'bg-[#002147] text-white shadow-lg'
                                            : 'text-slate-400 hover:text-[#002147] hover:bg-slate-50'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 w-full xl:w-auto">
                                <div className="relative flex-1 xl:w-80 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1E293B] transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search by ID, Resource..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#1E293B]/5 focus:bg-white focus:border-[#1E293B]/20 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1E293B]' : 'text-slate-400'}`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1E293B]' : 'text-slate-400'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-6">
                                <div className="w-12 h-12 border-4 border-slate-100 border-t-[#1E293B] rounded-full animate-spin"></div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Retrieving Metadata...</p>
                            </div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="bg-white rounded-[40px] border border-slate-200 border-dashed p-24 text-center group">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <FileText className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">No Incidents Found</h3>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Clear skies. No active maintenance alerts.</p>
                            </div>
                        ) : (
                            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4 items-start" : "space-y-3"}>
                                {filteredTickets.map((ticket) => {
                                    const status = getStatusConfig(ticket.status);
                                    return (
                                        <Link
                                            key={ticket.id}
                                            to={`/tickets/${ticket.id}`}
                                            className={`group bg-white rounded-xl border border-slate-200/60 transition-all duration-500 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden ${viewMode === 'list' ? 'flex items-center p-3 gap-3' : 'p-4 flex flex-col'
                                                }`}
                                        >
                                            {/* Top Decorative Line */}
                                            <div className={`absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity ${status.bg.replace('bg-', 'bg-')}`}></div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <div className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${status.bg} ${status.color} ${status.border}`}>
                                                        <status.icon className="w-2 h-2" />
                                                        {status.label}
                                                    </div>
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                        #{ticket.id.slice(-6).toUpperCase()}
                                                    </span>
                                                </div>

                                                <h3 className={`font-black text-slate-900 tracking-tight group-hover:text-[#1E293B] transition-colors uppercase leading-tight mb-1 ${viewMode === 'list' ? 'text-sm' : 'text-lg'}`}>
                                                    {ticket.resourceName}
                                                </h3>

                                                <p className={`text-slate-600 font-bold leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity mb-2 ${viewMode === 'list' ? 'text-[9px] line-clamp-1' : 'text-[10px] line-clamp-1'}`}>
                                                    {ticket.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <Tag className="w-2.5 h-2.5" />
                                                        <span className="text-[8px] font-bold uppercase tracking-wider">{ticket.category}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400">
                                                        <Calendar className="w-2.5 h-2.5" />
                                                        <span className="text-[8px] font-bold uppercase tracking-wider">
                                                            {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${viewMode === 'list' ? 'flex flex-col items-end gap-2 ml-auto' : 'mt-3 pt-2.5 border-t border-slate-50 flex items-center justify-between'}`}>
                                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${ticket.priority === 'URGENT' ? 'bg-rose-50 text-rose-500 border-rose-100' :
                                                    ticket.priority === 'HIGH' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                                        'bg-slate-50 text-slate-400 border-slate-100'
                                                    }`}>
                                                    <div className={`w-1 h-1 rounded-full ${ticket.priority === 'URGENT' ? 'bg-rose-500 animate-ping' :
                                                        ticket.priority === 'HIGH' ? 'bg-amber-500' : 'bg-slate-300'
                                                        }`}></div>
                                                    {ticket.priority}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={(e) => handleDelete(e, ticket.id)}
                                                        className="p-1.5 rounded-md bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all duration-300"
                                                        title="Delete Incident"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                    <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center group-hover:bg-[#FFD166] group-hover:text-slate-900 transition-all duration-500">
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default MyTickets;
