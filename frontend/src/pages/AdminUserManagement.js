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

    const getRoleStyle = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-[#3f4175] text-white border-transparent';
            case 'TECHNICIAN': return 'bg-[#FFD166] text-slate-900 border-[#FFCC29]';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 py-10 mb-10">
                <p className="text-[#3f4175] font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                    Platform Administration
                </p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
                            User Control
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                            Manage platform member accounts and access roles.
                        </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded px-6 py-3 flex items-center gap-4 shadow-sm shrink-0">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Members</span>
                        <span className="text-2xl font-black text-slate-900">{users.length}</span>
                    </div>
                </div>
            </div>

            {/* Feedback */}
            {success && (
                <div className="mb-6 p-4 bg-white border border-emerald-200 border-l-4 border-l-emerald-500 text-emerald-700 rounded shadow-sm flex justify-between items-center">
                    <span className="font-bold text-sm">{success}</span>
                    <button onClick={() => setSuccess('')} className="font-black text-lg text-emerald-400 hover:text-emerald-700">×</button>
                </div>
            )}
            {error && (
                <div className="mb-6 p-4 bg-white border border-rose-200 border-l-4 border-l-rose-500 text-rose-700 rounded shadow-sm flex justify-between items-center">
                    <span className="font-bold text-sm">{error}</span>
                    <button onClick={() => setError('')} className="font-black text-lg text-rose-400 hover:text-rose-700">×</button>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#0F172A]"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing members...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No members found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm shrink-0">
                                                    {(user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm leading-none mb-1">{user.name || 'Anonymous User'}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-block px-3 py-1 rounded text-[9px] font-black tracking-widest uppercase border ${getRoleStyle(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(user.id, user.name || user.email)}
                                                className="px-4 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest border border-rose-100 rounded hover:bg-rose-50 hover:border-rose-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                disabled={user.email === localStorage.getItem('email')}
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
        </AdminLayout>
    );
};

export default AdminUserManagement;
