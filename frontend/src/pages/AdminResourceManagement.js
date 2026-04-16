import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
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
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Facilities & Assets</h1>
            <p className="mt-1 text-sm text-gray-500 font-medium uppercase tracking-wide">Admin Management Console</p>
          </div>
          <button
            onClick={openAddForm}
            className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-xl font-bold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:-translate-y-0.5"
          >
            + Add New Resource
          </button>
        </div>

        {/* Feedback Messages */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-lg shadow-sm animate-pulse">
            <span className="font-bold">Success:</span> {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg shadow-sm">
            <span className="font-bold">Error:</span> {error}
            <button onClick={() => setError('')} className="float-right font-bold text-lg">&times;</button>
          </div>
        )}

        {/* Filters Section */}
        <ResourceFilters filters={filters} setFilters={setFilters} />

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 font-medium">Fetching catalogue data...</p>
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
    </div>
  );
};

export default AdminResourceManagement;
