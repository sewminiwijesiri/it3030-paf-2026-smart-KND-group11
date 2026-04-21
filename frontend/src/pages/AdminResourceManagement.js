import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import ResourceTable from '../components/catalogue/ResourceTable';
import ResourceForm from '../components/catalogue/ResourceForm';
import ResourceFilters from '../components/catalogue/ResourceFilters';

const AdminResourceManagement = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);

    const [filters, setFilters] = useState({
        type: '',
        minCapacity: '',
        location: '',
        status: ''
    });

    const fetchResources = useCallback(async () => {
        setLoading(true);
        try {
            const { type, minCapacity, location, status } = filters;
            const response = await api.get('/api/resources', {
                params: { type, minCapacity, location, status }
            });
            setResources(response.data);
        } catch (err) {
            setError('Failed to fetch resources. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (editingResource) {
                await api.put(`/api/resources/${editingResource.id}`, formData);
                setSuccess('Resource updated successfully!');
            } else {
                await api.post('/api/resources', formData);
                setSuccess('Resource created successfully!');
            }
            setIsFormOpen(false);
            setEditingResource(null);
            fetchResources();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed. Please check your data.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await api.delete(`/api/resources/${id}`);
                setSuccess('Resource deleted successfully!');
                fetchResources();
            } catch (err) {
                setError('Failed to delete resource.');
            }
        }
    };

    const openAddForm = () => {
        setEditingResource(null);
        setIsFormOpen(true);
    };

    const openEditForm = (resource) => {
        setEditingResource(resource);
        setIsFormOpen(true);
    };

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-10 -mt-6 md:-mt-10 px-6 md:px-10 py-10 mb-10">
                <p className="text-[#3f4175] font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FFD166]"></span>
                    Management Console
                </p>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-2">
                            Facilities & Assets
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                            Create, update and manage all campus resources.
                        </p>
                    </div>
                    <button
                        onClick={openAddForm}
                        className="shrink-0 bg-[#FFD166] text-slate-900 px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 hover:bg-[#FFCC29] transition-all shadow-lg shadow-[#FFD166]/20 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Add New Resource
                    </button>
                </div>
            </div>

            {/* Feedback Messages */}
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

            {/* Filters Section */}
            <div className="bg-white p-6 rounded border border-slate-200 shadow-sm mb-8">
                <ResourceFilters filters={filters} setFilters={setFilters} />
            </div>

            {/* Main Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A]"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching catalogue...</p>
                </div>
            ) : (
                <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                    <ResourceTable
                        resources={resources}
                        onEdit={openEditForm}
                        onDelete={handleDelete}
                    />
                </div>
            )}

            {/* Resource Modal Form */}
            {isFormOpen && (
                <ResourceForm
                    resource={editingResource}
                    onSubmit={handleCreateOrUpdate}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </AdminLayout>
    );
};

export default AdminResourceManagement;
