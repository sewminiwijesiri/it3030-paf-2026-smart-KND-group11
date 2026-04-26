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

            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                {renderSidebar()}

                <main className={`flex-1 lg:ml-72 h-[calc(100vh-64px)] overflow-y-auto scroll-smooth pb-10`}>

                    {/* Header Section - Modern Hero Style */}
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
                                <div className="flex items-center gap-4">
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
                                            isEditing
                                                ? 'bg-white text-[#002147] hover:bg-blue-50'
                                                : 'bg-[#FF9F1C] text-white shadow-orange-500/20 hover:bg-orange-500 active:scale-95'
                                        } disabled:opacity-50`}
                                    >
                                        {updateLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                                    </button>
                                </div>
<h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
  Account <span className="text-blue-100/50">Settings</span>
</h1>

<p className="text-blue-100/60 font-bold uppercase tracking-wider text-[11px] max-w-sm">
  Manage your personal information and security preferences.
</p>
                                    </p>
                                </div>
<div className="flex items-center gap-3">
  {isEditing && (
    <button 
      onClick={() => { 
        setIsEditing(false); 
        setNameInput(userData.name); 
      }}
      className="px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
    >
      Cancel
    </button>
  )}
  <button
    onClick={isEditing ? handleProfileUpdate : () => setIsEditing(true)}
    disabled={updateLoading}
    className={`shrink-0 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg ${
      isEditing
        ? 'bg-white text-[#002147] hover:bg-blue-50'
        : 'bg-[#FF9F1C] text-white shadow-orange-500/20 hover:scale-[1.02] hover:bg-orange-500'
    } disabled:opacity-50`}
  >
    {updateLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
  </button>
</div>
                            </div>
                            
                            {updateMessage.text && (
                                <div className={`mt-6 p-4 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 border ${
                                    updateMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${updateMessage.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    {updateMessage.text}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                            {/* Left Column: Profile Card & Info */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Personal Information Card */}
                                <section className="bg-white rounded-[16px] border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Personal Information</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    disabled={!isEditing}
                                                    value={nameInput}
                                                    onChange={(e) => setNameInput(e.target.value)}
className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-sm font-bold text-[#002147] focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] disabled:opacity-60 transition-all placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                                <input
                                                    type="email"
                                                    disabled={true}
                                                    value={userData.email}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] font-bold text-slate-500 cursor-not-allowed opacity-60"
                                                />
                                            </div>
                                            <div>
<label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
  Account Role
</label>

<div className="w-full bg-slate-50 border border-slate-200 text-[#002147] rounded-xl px-5 py-3 text-sm font-black flex items-center gap-2 uppercase tracking-wide">
  <span className="w-2 h-2 rounded-full bg-[#FF9F1C]"></span>
                                                    {userData.role}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">User ID</label>
                                                <input
                                                    type="text"
                                                    disabled={true}
                                                    value={userData.id || 'N/A'}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] font-bold text-slate-500 cursor-not-allowed opacity-60"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Account Security Card */}
                                <section className="bg-white rounded-[16px] border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Account Security</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-800 mb-0.5">Update Password</h3>
                                                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Ensure a secure, random password.</p>
                                            </div>
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
className="shrink-0 px-6 py-3 bg-[#002147] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#003166] transition shadow-lg shadow-blue-900/10"
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
<section className="bg-white p-6 rounded-2xl border border-slate-200 text-center group shadow-sm relative overflow-hidden">
  <div className="absolute top-0 left-0 w-full h-2 bg-[#FF9F1C]"></div>

  <div className="w-28 h-28 bg-slate-50 border border-slate-200 text-[#002147] rounded-full mx-auto mb-5 flex items-center justify-center text-4xl font-black italic relative overflow-hidden">
    {userData.name.charAt(0)}

    <button className="absolute inset-0 bg-[#002147]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest cursor-pointer">
      Update
    </button>
  </div>

  <h3 className="text-xl font-black text-[#002147] leading-none mb-2">
    {userData.name}
  </h3>

  <span className="inline-block px-3 py-1 bg-[#4DA8DA] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-500/20">       Verified
                                    </span>
                                </section>

                                {/* Preferences Card */}
                                <section className="bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm">
                                    <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-5">Preferences</h3>
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Notifications</p>
                                                <p className="text-[8px] text-slate-500 font-semibold uppercase tracking-widest">Email alerts</p>
                                            </div>
                                            <div className="w-8 h-5 bg-[#3f4175] rounded-full relative shadow-inner cursor-pointer">
                                                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dark Mode</p>
                                                <p className="text-[8px] text-slate-300 font-semibold uppercase tracking-widest">WIP Feature</p>
                                            </div>
                                            <div className="w-8 h-5 bg-slate-200 rounded-full relative shadow-inner cursor-not-allowed">
                                                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Quick Tools Badge */}
<div className="bg-[#002147] p-6 rounded-2xl border border-white/5 text-white relative overflow-hidden shadow-lg">
  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF9F1C]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

  <div className="relative z-10">
    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">
      Help Center
    </p>

    <p className="text-sm font-bold leading-snug mb-4">
      Having trouble with your account settings?
    </p>

    <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition-all">
      Support Desk
    </button>
  </div>
</div>
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
