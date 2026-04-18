import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
import ResourceFilters from '../components/catalogue/ResourceFilters';

const UserResourceCatalogue = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        minCapacity: '',
        location: '',
        status: 'AVAILABLE' // Default to showing available items for students
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
            setError('Unable to load catalogue. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'AVAILABLE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'BUSY': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    const role = localStorage.getItem('role') || 'USER';

    const renderSidebar = () => {
        switch (role) {
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

                <main className={`flex-1 ${role === 'USER' ? 'lg:ml-64' : 'lg:ml-72'} p-6 md:p-8 transition-all duration-300`}>
                    <div className="max-w-6xl mx-auto">
                        
                        {/* Header Section */}
                        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                    Resource Catalogue
                                </h1>
                                <p className="text-slate-400 font-medium italic">Find and book campus facilities & technical assets.</p>
                            </div>
                            <div className="bg-white p-2 border border-slate-200/60 rounded-2xl shadow-sm flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Total Items:</span>
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-black">{resources.length}</span>
                            </div>
                        </header>

                        {/* Filters Panel */}
                        <div className="mb-10 animate-fade-in">
                            <ResourceFilters filters={filters} setFilters={setFilters} />
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-6 rounded-3xl text-center mb-10 font-bold">
                                {error}
                            </div>
                        )}

                        {/* Catalogue Grid */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Catalogue...</p>
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">No Resources Found</h3>
                                <p className="text-slate-400 text-sm">Try adjusting your filters to see more results.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                                {resources.map((resource) => (
                                    <div key={resource.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-indigo-100 overflow-hidden relative">
                                        <div className="bg-slate-50 rounded-[2.1rem] p-6 mb-4 relative overflow-hidden">
                                            {/* Type Badge */}
                                            <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                                                {resource.type.replace('_', ' ')}
                                            </span>
                                            
                                            {/* Resource Icon/Visual */}
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition duration-500">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" />
                                                </svg>
                                            </div>

                                            <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition">
                                                {resource.name}
                                            </h3>
                                            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-tighter">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {resource.location}
                                            </p>
                                        </div>

                                        <div className="px-6 pb-6">
                                            <div className="flex items-center justify-between mb-6 pt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-300 uppercase">Capacity</span>
                                                    <span className="text-sm font-black text-slate-700">{resource.capacity || 'N/A'}</span>
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-b-4 ${getStatusStyles(resource.status)}`}>
                                                    {resource.status}
                                                </div>
                                            </div>

                                            <button className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all transform active:scale-95">
                                                Book This Slot
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserResourceCatalogue;
