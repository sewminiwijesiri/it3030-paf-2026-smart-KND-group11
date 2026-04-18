import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
import Footer from '../components/Footer';

const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: localStorage.getItem('name') || 'Student',
        email: localStorage.getItem('email') || 'student@uniflow.com',
        role: localStorage.getItem('role') || 'USER',
        id: ''
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/me');
                setUserData(response.data);
                // Also update localStorage to keep it in sync
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('role', response.data.role);
            } catch (err) {
                console.error('Failed to fetch user data', err);
            }
        };

        fetchUserData();
    }, []);

    const renderSidebar = () => {
        switch (userData.role) {
            case 'ADMIN': return <AdminSidebar />;
            case 'TECHNICIAN': return <TechnicianSidebar />;
            default: return <Sidebar />;
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans relative overflow-hidden">
            <Navbar />
            
            <div className="flex flex-1">
                {renderSidebar()}

                <main className={`flex-1 ${userData.role === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} p-6 md:p-10 transition-all duration-300`}>
                    <div className="max-w-5xl mx-auto">
                        
                        {/* Header Section */}
                        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                    Account Settings
                                </h1>
                                <p className="text-slate-400 font-medium">Manage your personal information and security preferences.</p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md ${
                                    isEditing ? 'bg-slate-900 text-white' : 'bg-white text-indigo-600 border border-slate-200 hover:border-indigo-600'
                                }`}
                            >
                                {isEditing ? 'Save Changes' : 'Edit Profile'}
                            </button>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            
                            {/* Left Column: Profile Card & Info */}
                            <div className="lg:col-span-2 space-y-8">
                                
                                {/* Personal Information Card */}
                                <section className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                                    <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/20">
                                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Personal Information</h2>
                                    </div>
                                    <div className="p-10 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    disabled={!isEditing}
                                                    defaultValue={userData.name}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    disabled={true} 
                                                    defaultValue={userData.email}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 cursor-not-allowed opacity-60"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Account Role</label>
                                                <div className="w-full bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl px-4 py-3 text-sm font-black flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                    {userData.role}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">User ID</label>
                                                <input 
                                                    type="text" 
                                                    disabled={true}
                                                    defaultValue={userData.id || 'N/A'}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-400 cursor-not-allowed opacity-60"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Account Security Card */}
                                <section className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                                    <div className="px-10 py-6 border-b border-slate-50 bg-slate-50/20">
                                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Account Security</h2>
                                    </div>
                                    <div className="p-10">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-base font-black text-slate-800 mb-1">Update Password</h3>
                                                <p className="text-xs text-slate-400 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                                            </div>
                                            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition shadow-md">
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Avatar & Preferences */}
                            <div className="space-y-8">
                                
                                {/* Avatar Card */}
                                <section className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center group">
                                    <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-5xl font-black italic shadow-inner relative overflow-hidden ring-4 ring-white shadow-xl">
                                        {userData.name.charAt(0)}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest pointer-events-none">
                                            Change
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 leading-none mb-1">{userData.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                        Verified
                                    </span>
                                </section>

                                {/* Preferences Card */}
                                <section className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Preferences</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black text-slate-700">Email Notifications</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Stay updated with requests</p>
                                            </div>
                                            <div className="w-10 h-6 bg-indigo-600 rounded-full relative shadow-inner">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black text-slate-700">Dark Mode</p>
                                                <p className="text-[10px] text-slate-400 font-medium">Coming soon</p>
                                            </div>
                                            <div className="w-10 h-6 bg-slate-200 rounded-full relative shadow-inner cursor-not-allowed">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Quick Tools Badge */}
                                <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
                                     <div className="relative z-10">
                                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Help Center</p>
                                        <p className="text-sm font-bold leading-snug mb-4">Having trouble with your account settings?</p>
                                        <button className="text-[10px] font-black uppercase bg-white/20 px-4 py-2 rounded-xl hover:bg-white/40 transition">Contact Support</button>
                                     </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
            
            <Footer />
        </div>
    );
};

export default UserProfile;
