import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
import Footer from '../components/Footer';
import api from '../utils/api';

const UserDashboard = () => {
    const [userData, setUserData] = useState({
        name: localStorage.getItem('name') || 'Student',
        email: localStorage.getItem('email') || 'student@uniflow.com'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/me');
                setUserData({
                    name: response.data.name,
                    email: response.data.email
                });
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('email', response.data.email);
            } catch (err) {
                console.error('Failed to fetch user data', err);
            }
        };

        fetchUserData();
    }, []);

    const stats = [
        { label: 'Active Bookings', value: '03', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { label: 'Completed Actions', value: '12', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Pending Requests', value: '01', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        { label: 'Platform Rating', value: '4.9', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    ];

    const recentRequests = [
        { id: '#REQ-829', title: 'Lab B2 Projector Setup', type: 'Facility', status: 'In Progress', date: '2 hours ago' },
        { id: '#REQ-812', title: 'Asset Rental: DSLR Camera', type: 'Asset', status: 'Completed', date: 'Yesterday' },
        { id: '#REQ-799', title: 'Maintenance: VR Station 01', type: 'Technical', status: 'Pending', date: 'Oct 14' },
    ];

    const role = localStorage.getItem('role') || 'USER';

    const renderSidebar = () => {
        switch (role) {
            case 'ADMIN': return <AdminSidebar />;
            case 'TECHNICIAN': return <TechnicianSidebar />;
            default: return <Sidebar />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            <Navbar />
            
            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                {renderSidebar()}

                <main className={`flex-1 ${role === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} h-[calc(100vh-72px)] overflow-y-auto scroll-smooth`}>
                    
                    {/* Header Area styled like the Home Hero top-texts but adapted for dashboard */}
                    <div className="bg-white border-b border-slate-200 py-6">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                            <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.4em] mb-2 drop-shadow-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                Dashboard Portal
                            </p>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Welcome back, <br/>
                                    <span className="text-slate-500">{userData.name}</span>
                                </h1>
                                <div className="flex gap-3 mt-2 md:mt-0">
                                    <button className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md">
                                        View Map
                                    </button>
                                    <button className="bg-[#FFD166] text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FFCC29] transition-all shadow-md shadow-[#FFD166]/20">
                                        Book Resource
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-10 space-y-12">
                        
                        {/* 1. STATISTICS BAR (Matched to Home.js Stats Bar) */}
                        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                            {/* Decorative Accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFCC29]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div className="p-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="text-center px-4">
                                            <div className={`w-10 h-10 mx-auto ${stat.bg} ${stat.border} border rounded-full flex items-center justify-center mb-3`}>
                                                <svg className={`w-5 h-5 ${stat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
                                            </div>
                                            <h3 className={`text-3xl md:text-4xl font-black ${stat.color} mb-1 tracking-tighter italic`}>{stat.value}</h3>
                                            <p className="text-slate-500 font-black text-[9px] uppercase tracking-widest opacity-80">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            {/* Left Area (2 columns limit) */}
                            <div className="xl:col-span-2 space-y-8">
                                
                                {/* Featured Promo Banner (Matched to Home's feature bar overlay styling) */}
                                <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#3f4175]/40 rounded-full blur-[80px] pointer-events-none"></div>
                                    <div className="p-10 relative z-10 flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                            <svg className="w-10 h-10 text-[#FFD166]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-2xl tracking-tight mb-2">Need Immediate Maintenance?</h3>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-5 max-w-md">Use the Maintenance Hub for instant reporting and resolution of campus issues.</p>
                                            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
                                                Go to Hub
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Requests (Styled like Home.js Cards) */}
                                <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Active Requests</h3>
                                        <button className="text-[10px] font-bold text-[#3f4175] uppercase tracking-widest hover:text-[#FFD166] transition-colors">See History</button>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {recentRequests.map((req, i) => (
                                            <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500 group-hover:bg-[#FFD166]/10 group-hover:text-[#FFD166] transition-colors">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-base font-bold text-slate-800 mb-1">{req.title}</h4>
                                                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                                            <span>{req.id}</span>
                                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                            <span>{req.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className={`inline-block px-3 py-1.5 text-[10px] font-bold shadow-md tracking-wider uppercase ${
                                                        req.status === 'Completed' ? 'bg-[#3f4175] text-white' : 
                                                        req.status === 'In Progress' ? 'bg-[#FFD166] text-slate-900 border border-[#FFCC29]' : 
                                                        'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Area (1 column) */}
                            <div className="space-y-8">
                                
                                {/* Profile Summary */}
                                <div className="bg-white rounded border border-slate-200 p-8 shadow-sm text-center relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-full h-2 bg-[#FFD166]"></div>
                                     <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 overflow-hidden border border-slate-200 mb-5 flex items-center justify-center">
                                         <span className="text-3xl text-slate-600 font-black italic">{userData.name.charAt(0)}</span>
                                     </div>
                                     <h3 className="text-lg font-bold text-slate-800 mb-1">{userData.name}</h3>
                                     <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-6 bg-slate-50 inline-block px-3 py-1 rounded border border-slate-100">{userData.email}</p>
                                     <div className="flex justify-center w-full">
                                         <button className="w-full bg-white text-slate-700 border border-slate-200 px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-colors">
                                            Manage Profile
                                         </button>
                                     </div>
                                </div>

                                {/* Quick Explore Links (Styled like catalogue categories) */}
                                <div className="bg-white rounded border border-slate-200 p-8 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Explore Resources</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-[#3f4175] group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 group-hover:text-[#3f4175] transition-colors">Science & Tech</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Advanced Labs</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-[#3f4175] group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 group-hover:text-[#3f4175] transition-colors">Arts & Media</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Creative Studios</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-[#3f4175] group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 group-hover:text-[#3f4175] transition-colors">General</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Collaborative Spaces</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                    </div>
                    
                    <Footer />
                </main>
            </div>
            
            {/* Global CSS overrides to reset sidebar and navbar styling back to typical UI if we had stray injected CSS from previous iterations */}
            <style dangerouslySetInnerHTML={{__html: `
                .neo-sidebar-wrapper aside, .dark-sidebar-wrapper aside, .glass-sidebar-wrapper aside {
                    background-color: white !important;
                    border-right: 1px solid #e2e8f0 !important;
                    color: inherit !important;
                    backdrop-filter: none !important;
                }
            `}} />
        </div>
    );
};

export default UserDashboard;
