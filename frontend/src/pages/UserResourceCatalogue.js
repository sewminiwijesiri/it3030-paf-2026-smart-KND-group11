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
import { Search, MapPin, Users, Info, Calendar, Sparkles, Filter } from 'lucide-react';

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
            case 'AVAILABLE': return 'bg-emerald-500 text-white border-emerald-400';
            case 'BUSY': return 'bg-rose-500 text-white border-rose-400';
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
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-[#FFD166] selection:text-slate-900">
            <Navbar />
            
            <div className="flex flex-1 pt-[72px] relative z-10 w-full overflow-hidden">
                {renderSidebar()}

                <main className="flex-1 lg:ml-64 h-[calc(100vh-72px)] overflow-y-auto scroll-smooth">
                    
                    {/* Header Area */}
                    <div className="bg-white border-b border-slate-200/60 py-10">
                        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
                            <div className="inline-flex items-center gap-2 bg-[#5B5FEF]/5 px-3 py-1 rounded-full mb-4">
                                <Sparkles className="w-3 h-3 text-[#5B5FEF]" />
                                <p className="text-[#5B5FEF] font-black text-[9px] uppercase tracking-[0.3em]">
                                    Live Inventory
                                </p>
                            </div>
                            
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">
                                        Resource Catalogue
                                    </h1>
                                    <p className="text-slate-400 font-medium text-sm">Discover and secure high-end campus facilities and specialized equipment.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-900 text-white p-6 rounded-[24px] shadow-2xl flex items-center gap-6 min-w-[200px]">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Assets</span>
                                            <span className="text-3xl font-black">{resources.length}</span>
                                        </div>
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <Filter className="w-5 h-5 text-[#FFD166]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-10">
                        
                        {/* Premium Filters Panel */}
                        <div className="mb-12 animate-fade-in bg-white p-8 rounded-[32px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-[#FFD166] rounded-full"></div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filter Inventory</h3>
                            </div>
                            <ResourceFilters filters={filters} setFilters={setFilters} />
                        </div>

                        {/* Catalogue Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                {[1, 2, 3, 4, 5, 6].map(n => (
                                    <div key={n} className="h-[500px] bg-slate-200/50 animate-pulse rounded-[40px]"></div>
                                ))}
                            </div>
                        ) : resources.length === 0 ? (
                            <div className="bg-white py-32 rounded-[48px] text-center shadow-xl border border-slate-100 px-10">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100 text-slate-200">
                                    <Search className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-wide">No Assets Found</h3>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-sm mx-auto opacity-70">
                                    Our apologies, but no resources currently match your selected filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mb-20">
                                {resources.map((resource, i) => (
                                    <div key={resource.id} className="group bg-white rounded-[40px] overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.12)] hover:-translate-y-4 transition-all duration-700 border border-slate-100 flex flex-col">
                                        <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                                            <img 
                                                src={resolveImageUrl(resource.imageUrl)} 
                                                alt={resource.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                            
                                            <div className="absolute top-6 right-6">
                                                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border ${getStatusStyles(resource.status)}`}>
                                                    {resource.status}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-6 left-6 flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                <div className="bg-[#FFD166] text-slate-900 p-2 rounded-lg">
                                                    <Info className="w-3 h-3" />
                                                </div>
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Active Status</span>
                                            </div>
                                        </div>

                                        <div className="p-10 flex-1 flex flex-col">
                                            <div className="mb-6">
                                                <div className="inline-block bg-slate-50 px-3 py-1 rounded-lg mb-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{resource.type.replace('_', ' ')}</p>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-[#5B5FEF] transition-colors line-clamp-2">
                                                    {resource.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <MapPin className="w-4 h-4 text-[#FFD166]" />
                                                    <span className="text-[11px] font-bold uppercase tracking-widest">{resource.location}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Capacity</span>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3 h-3 text-[#5B5FEF]" />
                                                        <span className="text-xs font-black text-slate-800">{resource.capacity || '—'}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Accessibility</span>
                                                    <span className="text-xs font-black text-slate-800 uppercase">Standard</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleBookClick(resource)}
                                                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-[#FFD166] hover:text-slate-900 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 mt-auto group/btn"
                                            >
                                                <Calendar className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" /> 
                                                Secure Slot
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
