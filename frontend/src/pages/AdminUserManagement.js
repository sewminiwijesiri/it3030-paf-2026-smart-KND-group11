import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';


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

    const handleRoleChange = async (userId, newRole) => {
        const loadingToast = toast.loading('Reconfiguring Access Clearance...');
        try {
            await api.put(`/admin/users/${userId}/role?role=${newRole}`);
            toast.success(`Protocol Updated: Role assigned as ${newRole}`, { id: loadingToast });
            fetchUsers();
        } catch (err) {
            console.error('Role update failed', err);
            toast.error('Clearance Update Failed', { id: loadingToast });
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) {
            const loadingToast = toast.loading('Deactivating User Credentials...');
            try {
                await api.delete(`/admin/users/${id}`);
                toast.success('Access Revoked Successfully', { id: loadingToast });
                fetchUsers();
            } catch (err) {
                toast.error('Deactivation Failed', { id: loadingToast });
            }
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header - Compact Premium */}
                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-slate-900/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-pulse"></span>
                            <p className="text-slate-900 font-black text-[8px] uppercase tracking-[0.4em]">Member Directory</p>
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-0.5">User Management</h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Total Registered Nodes: <span className="text-[#3f4175] font-black">{users.length}</span></p>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">
                            Terminal Active
                        </div>
                    </div>
                </div>

                {/* Users Table Card */}
                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Operator Identity</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Clearance Level</th>
                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Access Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F172A]"></div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Retrieving Registry...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-16 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">Registry Empty</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shadow-sm group-hover:border-[#FFD166] transition-all">
                                                        {(user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-[13px] leading-tight mb-0.5 uppercase tracking-tight">{user.name || 'Unknown Operator'}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <select 
                                                        value={user.role}
                                                        disabled={user.email === localStorage.getItem('email')}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-slate-900/5 ${
                                                            user.role === 'ADMIN' ? 'bg-[#3f4175] text-white border-[#3f4175]' :
                                                            user.role === 'TECHNICIAN' ? 'bg-[#FFD166] text-slate-900 border-[#FFD166]' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        <option value="USER">User</option>
                                                        <option value="TECHNICIAN">Technician</option>
                                                        <option value="ADMIN">Admin</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name || user.email)}
                                                    className="px-4 py-2 text-[9px] font-black text-rose-500 uppercase tracking-widest border border-rose-50 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all disabled:opacity-0 disabled:pointer-events-none shadow-sm"
                                                    disabled={user.email === localStorage.getItem('email')}
                                                >
                                                    Revoke Access
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
