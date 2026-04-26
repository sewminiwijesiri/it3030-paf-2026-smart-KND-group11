import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';


const UserProfile = () => {
    const [userData, setUserData] = useState({
        name: localStorage.getItem('name') || 'Student',
        email: localStorage.getItem('email') || 'student@uniflow.com',
        role: localStorage.getItem('role') || 'USER',
        id: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState({ text: '', type: '' });
    
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/auth/me');
                setUserData(response.data);
                setNameInput(response.data.name);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('role', response.data.role);
            } catch (err) {
                console.error('Failed to fetch user data', err);
            }
        };

        fetchUserData();
    }, []);

    const handleProfileUpdate = async () => {
        if (!nameInput.trim()) {
            setUpdateMessage({ text: 'Name cannot be empty.', type: 'error' });
            return;
        }

        setUpdateLoading(true);
        setUpdateMessage({ text: '', type: '' });
        
        try {
            await api.put('/auth/update-profile', { name: nameInput });
            setUserData({ ...userData, name: nameInput });
            localStorage.setItem('name', nameInput);
            setUpdateMessage({ text: 'Profile updated successfully!', type: 'success' });
            setIsEditing(false);
            
            // Clear message after 3s
            setTimeout(() => setUpdateMessage({ text: '', type: '' }), 3000);
        } catch (err) {
            setUpdateMessage({ text: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
        } finally {
            setUpdateLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess(false);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        if (passwordData.newPassword.length < 4) {
            setPasswordError('Password must be at least 4 characters.');
            return;
        }

        setPasswordLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordSuccess(true);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordSuccess(false);
            }, 3000);
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const renderSidebar = () => {
        switch (userData.role) {
            case 'ADMIN': return <AdminSidebar />;
            case 'TECHNICIAN': return <TechnicianSidebar />;
            default: return <Sidebar />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative overflow-hidden">
            <Navbar />
            <div className="flex flex-1 pt-[72px]">
                {renderSidebar()}
                <main className="flex-1 lg:ml-72 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth pb-10">
                    
                    <div className="bg-[#002147] border-b border-white/10 py-10 shadow-lg mb-10">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                            <p className="text-blue-200 font-black text-[10px] uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C]"></span>
                                Account Management
                            </p>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                                        Account <span className="text-blue-100/50">Settings</span>
                                    </h1>
                                    <p className="text-blue-100/60 font-bold uppercase tracking-wider text-[11px]">Manage your personal info and security.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isEditing && (
                                        <button 
                                            onClick={() => { setIsEditing(false); setNameInput(userData.name); }}
                                            className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-200 hover:text-white transition-all"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={isEditing ? handleProfileUpdate : () => setIsEditing(true)}
                                        disabled={updateLoading}
                                        className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
                                            isEditing ? 'bg-white text-[#002147] hover:bg-blue-50' : 'bg-[#FF9F1C] text-white shadow-orange-500/20 hover:bg-orange-500 active:scale-95'
                                        } disabled:opacity-50`}
                                    >
                                        {updateLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </button>
                                </div>
                            </div>
                            {updateMessage.text && (
                                <div className={`mt-6 p-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 border ${
                                    updateMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${updateMessage.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    {updateMessage.text}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <section className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="text-[10px] font-black text-[#002147] uppercase tracking-widest">Personal Information</h2>
                                    </div>
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input
                                                type="text" disabled={!isEditing} value={nameInput}
                                                onChange={(e) => setNameInput(e.target.value)}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-[#002147] focus:border-[#002147] disabled:opacity-60 transition-all focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input
                                                type="email" disabled value={userData.email}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-slate-400 cursor-not-allowed opacity-60"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                                            <div className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-black text-[#002147] uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#FF9F1C]"></span> {userData.role}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="p-8 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-black text-[#002147] text-base mb-1">Update Password</h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ensure a secure authentication vector.</p>
                                        </div>
                                        <button onClick={() => setShowPasswordModal(true)} className="px-6 py-3 bg-[#002147] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#003166] transition shadow-lg shadow-[#002147]/20">
                                            Change Password
                                        </button>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-8">
                                <section className="bg-white p-8 rounded-[32px] border border-slate-200 text-center relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-[#FF9F1C]"></div>
                                    <div className="w-28 h-28 bg-[#002147] rounded-[24px] mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black italic shadow-2xl">
                                        {userData.name?.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-black text-[#002147] mb-2">{userData.name}</h3>
                                    <span className="inline-block px-4 py-1.5 bg-[#4DA8DA] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">Verified User</span>
                                </section>

                                <section className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                                    <h3 className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-6">Preferences</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[11px] font-black text-[#002147] uppercase tracking-tight">System Alerts</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time status</p>
                                            </div>
                                            <div className="w-10 h-6 bg-[#002147] rounded-full relative p-1 cursor-pointer"><div className="absolute right-1 w-4 h-4 bg-white rounded-full"></div></div>
                                        </div>
                                        <div className="flex items-center justify-between opacity-40">
                                            <div>
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-tight">Dark Protocol</p>
                                                <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Coming Soon</p>
                                            </div>
                                            <div className="w-10 h-6 bg-slate-100 rounded-full relative p-1"><div className="absolute left-1 w-4 h-4 bg-white rounded-full"></div></div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    {showPasswordModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#002147]/80 backdrop-blur-md">
                            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-white/20">
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                    <h2 className="text-lg font-black text-[#002147] tracking-tight uppercase">Update Security</h2>
                                    <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-[#002147] transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="p-8">
                                    {passwordSuccess ? (
                                        <div className="text-center py-10">
                                            <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                                            <h3 className="font-black text-[#002147] text-lg uppercase tracking-tight">Sequence Verified</h3>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Registry has been updated</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                            {passwordError && <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">{passwordError}</div>}
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                                <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-[#002147] focus:border-[#002147] outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                                <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-[#002147] focus:border-[#002147] outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                                <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-5 py-4 text-sm font-bold text-[#002147] focus:border-[#002147] outline-none" />
                                            </div>
                                            <button type="submit" disabled={passwordLoading} className="w-full py-5 bg-[#002147] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#003166] transition-all shadow-xl shadow-[#002147]/20 disabled:opacity-50">
                                                {passwordLoading ? 'Synchronizing...' : 'Transmit Sequence'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

        </div>
    );
};

export default UserProfile;
