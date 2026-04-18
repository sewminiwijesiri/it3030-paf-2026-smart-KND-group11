import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users. Access might be restricted.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) {
            try {
                await api.delete(`/admin/users/${id}`);
                setSuccess('User account removed successfully.');
                fetchUsers();
            } catch (err) {
                setError('Failed to remove user account.');
            }
        }
    };

    return (
        <AdminLayout>
            <div className="animate-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">User Control</h1>
                        <p className="mt-1 text-xs text-slate-500 font-bold uppercase tracking-widest">Platform Member Administration</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-5 py-2.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400">TOTAL MEMBERS</span>
                            <span className="text-lg font-black text-slate-900">{users.length}</span>
                        </div>
                    </div>
                </div>

                {/* Feedback */}
                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-xl shadow-sm">
                        <span className="font-bold">Success:</span> {success}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-xl shadow-sm flex justify-between items-center">
                        <div><span className="font-bold">Error:</span> {error}</div>
                        <button onClick={() => setError('')} className="font-black text-lg opacity-50 hover:opacity-100">&times;</button>
                    </div>
                )}

                {/* Users Table */}
                <div className="card p-0 overflow-hidden border-slate-200 shadow-xl bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-20 text-center">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Syncing members...</p>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-20 text-center text-slate-400 italic">No members found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                                                        {user.name?.[0] || user.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-none mb-1">{user.name || 'Anonymous User'}</p>
                                                        <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                                    user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 
                                                    user.role === 'TECHNICIAN' ? 'bg-amber-100 text-amber-600' : 
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => handleDelete(user.id, user.name || user.email)}
                                                    className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                                    disabled={user.email === localStorage.getItem('email')} // Prevent self-delete
                                                >
                                                    Remove Access
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUserManagement;
