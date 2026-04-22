import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import AdminLayout from '../components/AdminLayout';
import ResourceTable from '../components/catalogue/ResourceTable';
import ResourceForm from '../components/catalogue/ResourceForm';
import ResourceFilters from '../components/catalogue/ResourceFilters';

const AdminResourceManagement = () => {
    // ... same state and effects
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
            const data = new FormData();
            
            // Extract file from formData
            const { file, ...resourceData } = formData;
            
            // Create the resource JSON blob
            const resourceBlob = new Blob([JSON.stringify({
                ...resourceData,
                name: resourceData.name.trim(),
                location: resourceData.location.trim(),
            })], { type: 'application/json' });
            
            data.append('resource', resourceBlob);
            
            if (file) {
                data.append('file', file);
            }

            if (editingResource) {
                await api.put(`/api/resources/${editingResource.id}`, data);
                setSuccess('Resource updated successfully!');
            } else {
                await api.post('/api/resources', data);
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
            <div className="animate-up">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Facilities & Assets</h1>
                        <p className="mt-1 text-xs text-slate-500 font-bold uppercase tracking-widest">Management Console</p>
                    </div>
                    <button
                        onClick={openAddForm}
                        className="btn btn-primary !rounded-xl shadow-lg"
                    >
                        + Add New Resource
                    </button>
                </div>

                {/* Feedback Messages */}
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

                {/* Filters Section */}
                <ResourceFilters filters={filters} setFilters={setFilters} />

                {/* Main Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Fetching catalogue...</p>
                    </div>
                ) : (
                    <ResourceTable 
                        resources={resources} 
                        onEdit={openEditForm} 
                        onDelete={handleDelete} 
                    />
                )}
            </div>

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
