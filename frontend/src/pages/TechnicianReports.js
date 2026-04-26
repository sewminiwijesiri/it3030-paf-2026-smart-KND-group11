import React, { useState, useEffect } from 'react';
import TechnicianLayout from '../components/TechnicianLayout';
import api from '../utils/api';
import { 
    BarChart3, 
    PieChart, 
    Calendar, 
    Download, 
    FileText, 
    TrendingUp, 
    CheckCircle2, 
    Clock, 
    AlertTriangle,
    ChevronDown
} from 'lucide-react';

const TechnicianReports = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('All Time');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get('/api/technician/tasks');
                setTasks(response.data);
            } catch (err) {
                console.error('Error fetching tasks for reports', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // Date Filtering Logic
    const filterTasksByDate = (taskList, range) => {
        const now = new Date();
        return taskList.filter(task => {
            if (!task.createdAt) return range === 'All Time';
            const taskDate = new Date(task.createdAt);
            
            switch (range) {
                case 'This Month':
                    return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
                case 'Last 7 Days':
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(now.getDate() - 7);
                    return taskDate >= sevenDaysAgo;
                case 'All Time':
                default:
                    return true;
            }
        });
    };

    const filteredTasks = filterTasksByDate(tasks, dateRange);

    // Analytics Logic (based on filtered data)
    const totalTasks = filteredTasks.length;
    const resolvedTasks = filteredTasks.filter(t => t.status === 'RESOLVED').length;
    const inProgressTasks = filteredTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const pendingTasks = filteredTasks.filter(t => t.status === 'OPEN').length;
    
    const resolutionRate = totalTasks > 0 ? Math.round((resolvedTasks / totalTasks) * 100) : 0;
    
    const categoryStats = filteredTasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});

    const priorityStats = filteredTasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
    }, {});

    const generateCSVReport = () => {
        if (filteredTasks.length === 0) {
            alert("No task data available for the selected range.");
            return;
        }

        const headers = ["Task ID", "Resource", "Category", "Priority", "Status", "Created At"];
        const rows = filteredTasks.map(t => [
            `#INC-${t.id.slice(-6).toUpperCase()}`,
            t.resourceName,
            t.category || 'N/A',
            t.priority,
            t.status,
            t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Technician_Report_${dateRange.replace(' ', '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <TechnicianLayout>
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* Header & Controls - Removed overflow-hidden to prevent dropdown clipping */}
                <div className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] animate-pulse"></span>
                            <p className="text-slate-900 font-black text-[10px] uppercase tracking-[0.4em]">Analytics Terminal</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">Performance Reports</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Filtering performance by: <span className="text-[#FFD166]">{dateRange}</span></p>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative w-fit">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:border-slate-400 transition-all min-w-[200px] justify-between shadow-sm active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span className="text-slate-900">{dateRange}</span>
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                    <div className="absolute top-full left-0 mt-3 w-full bg-white border border-slate-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {['All Time', 'This Month', 'Last 7 Days'].map(range => (
                                            <button
                                                key={range}
                                                onClick={() => { setDateRange(range); setIsDropdownOpen(false); }}
                                                className={`w-full px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    dateRange === range 
                                                    ? 'bg-slate-50 text-[#0F172A] border-l-4 border-[#FFD166]' 
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <button 
                            onClick={generateCSVReport}
                            className="flex items-center gap-3 px-10 py-4 bg-[#0F172A] text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                        >
                            <Download size={14} className="text-[#FFD166]" />
                            Export {dateRange}
                        </button>
                    </div>
                </div>

                {/* Primary Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Resolution Rate', val: `${resolutionRate}%`, icon: <CheckCircle2 className="text-emerald-500" />, sub: 'Period Efficiency' },
                        { label: 'Avg. MTTR', val: '2.4d', icon: <Clock className="text-slate-900" />, sub: 'Field Average' },
                        { label: 'Priority Alerts', val: priorityStats['HIGH'] || 0, icon: <AlertTriangle className="text-amber-500" />, sub: 'Urgent Action' },
                        { label: 'Task Count', val: totalTasks, icon: <TrendingUp className="text-emerald-500" />, sub: 'Registered Units' },
                    ].map((m, i) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-[#0F172A] group-hover:text-white transition-all">
                                    {m.icon}
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Live</span>
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{m.val}</h3>
                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{m.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Detailed Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Status Distribution - DARK BLUE CARD */}
                    <div className="lg:col-span-2 bg-[#0F172A] text-white rounded-[48px] p-12 shadow-2xl relative overflow-hidden group transition-all duration-500">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex items-center gap-4">
                                    <PieChart className="text-[#FFD166] drop-shadow-sm" size={24} />
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.25em]">Status Distribution</h3>
                                </div>
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{dateRange} Registry Data</span>
                            </div>
                            
                            <div className="space-y-12">
                                {[
                                    { label: 'Resolved', count: resolvedTasks, color: '#10b981' },
                                    { label: 'In Progress', count: inProgressTasks, color: '#f59e0b' },
                                    { label: 'Open', count: pendingTasks, color: '#6366f1' }
                                ].map((s, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-lg font-bold text-white mb-1 tracking-tight">{s.label}</p>
                                                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.15em]">{s.count} Tasks Registered</p>
                                            </div>
                                            <p className="text-4xl font-black text-white opacity-100 tracking-tighter">{totalTasks > 0 ? Math.round((s.count / totalTasks) * 100) : 0}%</p>
                                        </div>
                                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                                                style={{ width: `${(s.count / totalTasks) * 100}%`, backgroundColor: s.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sector Breakdown Card */}
                    <div className="bg-white rounded-[48px] border border-slate-200 p-12 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-12">
                            <BarChart3 className="text-[#0F172A]" size={20} />
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Service Sectors</h3>
                        </div>
                        <div className="flex-1 space-y-8">
                            {Object.entries(categoryStats).length > 0 ? Object.entries(categoryStats).map(([cat, count]) => (
                                <div key={cat} className="group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD166] group-hover:scale-125 transition-transform"></div>
                                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{cat}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0F172A]/10 group-hover:bg-[#0F172A] transition-all" style={{ width: `${(count / totalTasks) * 100}%` }}></div>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex items-center justify-center text-slate-300 italic text-[10px] font-black uppercase tracking-widest opacity-50">
                                    No data for {dateRange}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Registry Table Log */}
                <div className="bg-white rounded-[48px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-slate-900" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Operational Log Registry</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{filteredTasks.length} Units Found</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Node</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Identifier</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="4" className="p-24 text-center opacity-30 font-black uppercase text-[11px] tracking-[0.3em]">Accessing Field Logs...</td></tr>
                                ) : filteredTasks.length > 0 ? filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-8 text-[11px] font-bold text-slate-500">
                                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-10 py-8 text-[13px] font-bold text-slate-900 uppercase tracking-tight group-hover:text-slate-600 transition-colors">{task.resourceName}</td>
                                        <td className="px-10 py-8">
                                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                                                task.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right font-mono text-[10px] text-slate-400">#INC-{task.id.slice(-6).toUpperCase()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="p-24 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">No results for the selected time range</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </TechnicianLayout>
    );
};

export default TechnicianReports;
