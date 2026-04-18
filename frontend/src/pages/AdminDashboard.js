import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div className="animate-up">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
                    <div>
                        <span className="badge badge-primary mb-4">System Administrator</span>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 leading-tight">Admin Core</h1>
                    </div>
                    <div className="px-6 py-3 bg-white rounded-xl border border-slate-200 text-sm font-semibold shadow-sm flex items-center">
                        <span className="text-success mr-2 animate-pulse text-lg">●</span> All Engines Active
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {[
                        { label: 'Total Members', val: '1,284', inc: '+12%' },
                        { label: 'Revenue Flow', val: '$42.5k', inc: '+5.2%' },
                        { label: 'Active Labs', val: '18', inc: 'Stable' },
                        { label: 'System Load', val: '24%', inc: 'Optimal' }
                    ].map((stat, i) => (
                        <div key={i} className="card p-8 group hover:border-primary transition-colors">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">{stat.label}</p>
                            <div className="text-3xl font-extrabold text-slate-900 mb-2">{stat.val}</div>
                            <p className="text-primary text-xs font-bold">{stat.inc}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="card p-0 overflow-hidden border-slate-200 shadow-sm">
                        <div className="p-8 border-b border-slate-200 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900">Platform Entities</h3>
                        </div>
                        <div className="p-12 text-slate-400 text-center min-h-[250px] flex flex-col justify-center items-center">
                            <div className="text-5xl mb-6 opacity-40">📁</div>
                            <p className="max-w-[300px] leading-relaxed">Detailed system logs and entity management will appear here as the platform expands.</p>
                        </div>
                    </div>
                    
                    <div className="card glass-dark bg-slate-950 border-none p-10 flex flex-col shadow-2xl">
                        <h3 className="text-white text-xl font-bold mb-8 tracking-tight">System Integrity</h3>
                        <div className="flex flex-col gap-6 flex-1">
                            {['Database Backup', 'Auth Service', 'Storage Core', 'Email SMTP'].map((service, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{service}</span>
                                    <span className="text-[10px] font-bold text-secondary tracking-widest bg-secondary/10 px-2 py-1 rounded">OPERATIONAL</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-full mt-12 py-3.5 !rounded-lg text-sm shadow-xl shadow-primary/20">Re-scan Core</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
