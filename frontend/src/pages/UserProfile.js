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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            <Navbar />

            <div className="flex flex-1 relative z-10 w-full overflow-hidden">
                {renderSidebar()}

<main className={`flex-1 ${userData.role === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} h-[calc(100vh-72px)] overflow-y-auto scroll-smooth`}>

  {/* Header Area styled like Dashboard */}
  <div className="bg-white border-b border-slate-200 py-6">
                        <div className="max-w-[1000px] mx-auto px-6">
                            <p className="text-[#3f4175] font-black text-[10px] uppercase tracking-[0.4em] mb-2 drop-shadow-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]"></span>
                                Account Management
                            </p>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">
                                        Account Settings
                                    </h1>
                                    <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px] max-w-sm">
                                        Manage your personal information and security preferences.
                                    </p>
                                </div>
<div className="flex items-center gap-4">
  {isEditing && (
    <button 
      onClick={() => { 
        setIsEditing(false); 
        setNameInput(userData.name); 
      }}
      className="px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
    >
      Cancel
    </button>
  )}

  <button
    onClick={isEditing ? handleProfileUpdate : () => setIsEditing(true)}
    disabled={updateLoading}
    className={`shrink-0 px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all shadow-lg ${
      isEditing
        ? 'bg-[#0F172A] text-white hover:bg-slate-800'
        : 'bg-[#FFD166] text-slate-900 shadow-[#FFD166]/20 hover:scale-[1.02] hover:bg-[#FFCC29]'
    } disabled:opacity-50`}
  >
    {updateLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
  </button>
</div>
                            </div>
                            
                            {updateMessage.text && (
                                <div className={`mt-6 p-4 rounded-xl text-[11px] font-bold uppercase tracking-widest ${
                                    updateMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                }`}>
                                    {updateMessage.text}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-[1000px] mx-auto px-6 py-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Left Column: Profile Card & Info */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Personal Information Card */}
                                <section className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Personal Information</h2>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={nameInput}
                                                    onChange={(e) => setNameInput(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0F172A] disabled:opacity-60 transition-all placeholder:text-slate-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                                                <input
                                                    type="email"
                                                    disabled={true}
                                                    value={userData.email}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded px-5 py-4 text-sm font-bold text-slate-500 cursor-not-allowed opacity-60"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Account Role</label>
                                                <div className="w-full bg-slate-100 border border-slate-200 text-[#3f4175] rounded px-5 py-4 text-sm font-black flex items-center gap-2 uppercase tracking-wide">
                                                    <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                                                    {userData.role}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">User ID</label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    value={userData.id || 'N/A'}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded px-5 py-4 text-sm font-bold text-slate-500 cursor-not-allowed opacity-60"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Account Security Card */}
                                <section className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Account Security</h2>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-1">Update Password</h3>
                                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Ensure your account is using a secure, random password.</p>
                                            </div>
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
                                                className="shrink-0 px-6 py-3 bg-[#0F172A] text-white rounded font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition shadow-md"
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Avatar & Preferences */}
                            <div className="space-y-8">

                                {/* Avatar Card */}
                                <section className="bg-white p-8 rounded border border-slate-200 text-center group shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-[#FFD166]"></div>
                                    <div className="w-32 h-32 bg-slate-50 border border-slate-200 text-[#0F172A] rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-black italic relative overflow-hidden">
                                        {userData.name.charAt(0)}
                                        <button className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest cursor-pointer">
                                            Update
                                        </button>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 leading-none mb-2">{userData.name}</h3>
                                    <span className="inline-block px-3 py-1 bg-[#3f4175] text-white text-[9px] font-black uppercase tracking-widest rounded border border-transparent shadow-[0_2px_10px_rgba(63,65,117,0.3)]">
                                        Verified
                                    </span>
                                </section>

                                {/* Preferences Card */}
                                <section className="bg-white p-8 rounded border border-slate-200 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6">Preferences</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</p>
                                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Receive email alerts</p>
                                            </div>
                                            <div className="w-10 h-6 bg-[#3f4175] rounded-full relative shadow-inner cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dark Mode</p>
                                                <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest">WIP Feature</p>
                                            </div>
                                            <div className="w-10 h-6 bg-slate-200 rounded-full relative shadow-inner cursor-not-allowed">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Quick Tools Badge */}
                                <div className="bg-[#0F172A] p-8 rounded border border-slate-800 text-white relative overflow-hidden shadow-lg">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Help Center</p>
                                        <p className="text-sm font-bold leading-snug mb-5">Having trouble with your account settings?</p>
                                        <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20 px-5 py-2.5 rounded hover:bg-white/20 transition-all">Support Desk</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Password Modal */}
                    {showPasswordModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h2 className="text-lg font-bold text-slate-800">Change Password</h2>
                                    <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <div className="p-6">
                                    {passwordSuccess ? (
                                        <div className="text-center py-4">
                                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                ✓
                                            </div>
                                            <p className="font-bold text-slate-800">Password Updated Successfully</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                            {passwordError && <p className="text-xs text-red-500 font-bold">{passwordError}</p>}
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Password</label>
                                                <input
                                                    type="password" required
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F172A]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">New Password</label>
                                                <input
                                                    type="password" required
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F172A]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Confirm New Password</label>
                                                <input
                                                    type="password" required
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0F172A]"
                                                />
                                            </div>
                                            <button
                                                type="submit" disabled={passwordLoading}
                                                className="w-full py-3 bg-[#0F172A] text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition disabled:opacity-50"
                                            >
                                                {passwordLoading ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default UserProfile;
