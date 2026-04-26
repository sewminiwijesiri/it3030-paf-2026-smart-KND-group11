import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AdminSidebar from '../components/AdminSidebar';
import TechnicianSidebar from '../components/TechnicianSidebar';
import ResourceFilters from '../components/catalogue/ResourceFilters';
import BookingFormModal from '../components/BookingFormModal';
import { toast } from 'react-hot-toast';
import Footer from '../components/Footer';
import { resolveImageUrl } from '../utils/imageUtils';

const UserResourceCatalogue = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        minCapacity: '',
        location: '',
        status: 'AVAILABLE'
    });

    const [selectedResource, setSelectedResource] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleBookClick = (resource) => {
        setSelectedResource(resource);
        setShowModal(true);
    };

    const handleBookingSuccess = (resourceName) => {
        toast.success(`${resourceName} booking request submitted!`);
        fetchResources(); // Refresh to update status if needed
    };

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
            case 'AVAILABLE': return 'bg-[#3f4175] text-white shadow-md border-transparent';
            case 'BUSY': return 'bg-[#FFD166] text-slate-900 border-[#FFCC29] shadow-sm';
            default: return 'bg-slate-200 text-slate-700 border-slate-300';
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
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">
            <Navbar />
            
            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                {renderSidebar()}

                <main className="flex-1 lg:ml-72 h-[calc(100vh-64px)] overflow-y-auto scroll-smooth">
                    
                    {/* Header Area styled like UserDashboard */}
                    <div className="bg-[#002147] border-b border-white/10 py-10 shadow-lg">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
                            <p className="text-blue-200 font-black text-[10px] uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C]"></span>
                                Campus Catalogue
                            </p>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                                        Resource <span className="text-blue-100/50">Catalogue</span>
                                    </h1>
                                    <p className="text-blue-100/60 font-bold uppercase tracking-wider text-[11px]">Find and book campus facilities & technical assets.</p>
                                </div>
                                <div className="bg-white/5 p-2 border border-white/10 rounded-2xl shrink-0 shadow-inner flex items-center gap-4 px-4">
                                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest pl-2">Available Assets:</span>
                                    <span className="bg-[#FF9F1C] text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-orange-500/20">{resources.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-6">
                        
                        {/* Filters Panel */}
                        <div className="mb-6 animate-fade-in bg-white p-4 rounded border border-slate-200 shadow-sm">
                            <ResourceFilters filters={filters} setFilters={setFilters} />
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="bg-white border-l-4 border-rose-500 text-rose-600 p-6 shadow-sm mb-10 font-bold">
                                {error}
                            </div>
                        )}

                        {/* Catalogue Grid */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#0F172A]"></div>
                                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Syncing Catalogue...</p>
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="bg-white p-20 rounded border border-slate-200 text-center shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 text-[#FFD166]">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-wide">No Resources Found</h3>
                                <p className="text-slate-400 text-sm font-semibold">Try adjusting your filters to see more results.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                                {resources.map((resource) => (
                                    <div key={resource.id} className="group bg-white rounded border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden flex flex-col justify-between">
                                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                            {resource.imageUrl ? (
                                                <img 
                                                    src={resolveImageUrl(resource.imageUrl)} 
                                                    alt={resource.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m4 0h1m-5 10h1m4 0h1m-5-4h1m4 0h1" />
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Type Badge Overlay */}
                                            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-sm border border-slate-200 px-3 py-1 rounded text-[9px] font-black text-slate-800 uppercase tracking-widest z-10 font-bold">
                                                {resource.type.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 min-h-[3rem] line-clamp-2">
                                                    {resource.name}
                                                </h3>
                                                <p className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                                                    <svg className="w-4 h-4 text-[#FFD166]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    {resource.location}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mb-6 p-3 bg-slate-50 border border-slate-100 rounded">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Capacity</span>
                                                    <span className="text-sm font-black text-slate-800">{resource.capacity || 'N/A'}</span>
                                                </div>
                                                <div className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border rounded shadow-sm ${getStatusStyles(resource.status)}`}>
                                                    {resource.status}
                                                </div>
                                            </div>

<button 
  onClick={() => handleBookClick(resource)}
  className="w-full py-4 bg-[#FFD166] text-slate-900 font-bold rounded-full text-[11px] uppercase tracking-widest shadow-lg shadow-[#FFD166]/20 hover:scale-105 hover:bg-[#FFCC29] transition-transform active:scale-95 mt-auto"
>
  Book This Slot
</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <Footer />
                </main>
            </div>

            {showModal && selectedResource && (
                <BookingFormModal
                    resource={selectedResource}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
};

export default UserResourceCatalogue;
