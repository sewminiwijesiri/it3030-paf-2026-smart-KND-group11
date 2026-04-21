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

    // Sample Data
    const stats = [
        { label: 'Active Requests', value: '03', color: 'from-blue-600 to-indigo-600', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Completed Requests', value: '12', color: 'from-emerald-500 to-teal-600', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Pending Requests', value: '01', color: 'from-orange-500 to-amber-600', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    ];

    const recentRequests = [
        { id: '#REQ-829', title: 'Lab B2 Projector Setup', type: 'Facility', status: 'In Progress', date: '2 hours ago' },
        { id: '#REQ-812', title: 'Asset Rental: DSLR Camera', type: 'Asset', status: 'Completed', date: 'Yesterday' },
        { id: '#REQ-799', title: 'Maintenance: VR Station 01', type: 'Technical', status: 'Pending', date: 'Oct 14, 2026' },
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
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-indigo-100 relative overflow-hidden">
            {/* Background Aesthetic Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/20 rounded-full blur-[100px] pointer-events-none"></div>

            <Navbar />
            
            <div className="flex flex-1 relative z-10">
                {renderSidebar()}

                <main className={`flex-1 ${role === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} p-6 md:p-8 transition-all duration-300`}>
                    <div className="max-w-6xl mx-auto">
                        
                        {/* 1. Header with Simplified Status */}
                        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-md mb-2 border border-indigo-100">
                                    Student Workspace
                                </span>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                                    Hello, {userData.name}<span className="text-indigo-600">.</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200/60 rounded-2xl shadow-sm">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</span>
                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Live</span>
                                </div>
                            </div>
                        </header>

                        {/* 2. Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {stats.map((stat, i) => (
                                <div key={i} className="group relative bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden">
                                     <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-[100px] group-hover:opacity-[0.08] transition-opacity`}></div>
                                     <div className="flex items-start justify-between mb-8">
                                        <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl text-white shadow-lg shadow-indigo-100 group-hover:rotate-6 transition duration-500`}>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon} />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-black text-slate-200 uppercase tracking-tighter italic">0{i+1}</span>
                                     </div>
                                     <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</h3>
                                     </div>
                                </div>
                            ))}
                        </div>

                        {/* 3. Main Dashboard Content */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            
                            {/* Left Column (70%) */}
                            <div className="xl:col-span-2 space-y-8">
                                <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden group">
                                    <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Recent Applications</h2>
                                        <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View History</button>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {recentRequests.map((req, i) => (
                                            <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-all cursor-pointer group/row">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover/row:bg-white border border-transparent group-hover/row:border-indigo-100 transition shadow-sm">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-bold text-slate-800 group-hover/row:text-indigo-700 transition">{req.title}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{req.id} • {req.date}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-xl uppercase tracking-widest shadow-sm
                                                    ${req.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                                      req.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Aesthetic Booking Banner */}
                                <div className="bg-slate-900 rounded-[2.5rem] p-1 overflow-hidden group shadow-xl">
                                    <div className="bg-slate-900 rounded-[2.3rem] px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                        <div className="text-center md:text-left">
                                            <h3 className="text-indigo-500 font-black uppercase text-[9px] tracking-[0.3em] mb-2">Resource Ecosystem</h3>
                                            <p className="text-xl font-black text-white leading-tight mb-1 tracking-tighter">Reserve Campus Assets in Seconds.</p>
                                            <p className="text-slate-500 text-xs font-medium">Labs, Assets, and Meeting Rooms.</p>
                                        </div>
                                        <button className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white hover:text-indigo-700 transition-all transform hover:scale-105 shadow-lg">
                                            Start Booking
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (30%) */}
                            <div className="space-y-6">
                                
                                {/* Profile Info */}
                                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
                                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] mx-auto mb-4 flex items-center justify-center text-3xl font-black italic shadow-inner group-hover:scale-95 transition-transform duration-500">
                                        {userData.name?.charAt(0) || '?'}
                                    </div>
                                    <h3 className="text-base font-black text-slate-800 leading-none mb-1">{userData.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4 italic">{userData.email}</p>
                                    <button className="w-full py-2.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">View Profile</button>
                                </section>

                                {/* Quick Tools (Improved Labels) */}
                                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 px-1">Quick Tools</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <ACTION_BTN label="➕ Create" sub="Request" icon="M12 4v16m8-8H4" bg="bg-indigo-50" color="text-indigo-600" />
                                        <ACTION_BTN label="📄 View" sub="Requests" icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" bg="bg-emerald-50" color="text-emerald-600" />
                                        <ACTION_BTN label="💬 Contact" sub="Support" icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" bg="bg-rose-50" color="text-rose-600" />
                                        <ACTION_BTN label="📘 Portal" sub="Guides" icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.254 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" bg="bg-slate-50" color="text-slate-600" />
                                    </div>
                                </section>

                                {/* Integrated Alerts */}
                                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 px-1">Alerts</h3>
                                    <div className="space-y-4">
                                        <ALERT_ITEM icon="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" text="Seminar: Friday, 10 AM." color="text-amber-600" bg="bg-amber-50" />
                                        <ALERT_ITEM icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" text="New resources added." color="text-indigo-600" bg="bg-indigo-50" />
                                    </div>
                                </section>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

// Polished micro-components
const ACTION_BTN = ({ label, sub, icon, bg, color }) => (
    <button className={`${bg} group p-4 rounded-[2rem] border border-transparent hover:border-white transition-all duration-300 text-center shadow-sm hover:shadow-lg active:scale-95`}>
        <div className={`w-7 h-7 ${color} mx-auto mb-1.5 transition-transform group-hover:scale-110`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} /></svg>
        </div>
        <p className={`text-[10px] font-black uppercase tracking-tighter ${color} leading-none mb-0.5`}>{label}</p>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{sub}</p>
    </button>
);

const ALERT_ITEM = ({ icon, text, color, bg }) => (
    <div className={`flex items-center gap-4 p-3.5 ${bg} border border-transparent hover:border-white transition-all rounded-2xl group`}>
        <div className={`shrink-0 w-7 h-7 ${color} rounded-xl bg-white flex items-center justify-center shadow-sm`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={icon} /></svg>
        </div>
        <p className={`text-[10px] font-bold ${color} leading-tight`}>{text}</p>
    </div>
);

export default UserDashboard;
