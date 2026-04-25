import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Users, MapPin, Calendar, Layout } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';
import showcaseImg from '../assets/campus-showcase.png';
import api from '../utils/api';

const Home = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/api/resources');
                setResources(response.data.slice(0, 3)); // Only show top 3 on home
            } catch (err) {
                console.error("Failed to fetch resources for home:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    const fallbackImgs = [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
    ];

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-[#FFD166] selection:text-slate-900">
            <Navbar />
            
            <main>
                {/* Immersive Hero Section */}
                <section 
                    id="hero"
                    className="relative min-h-[95vh] flex items-center justify-center bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: `url(${heroBg})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90 backdrop-blur-[3px]"></div>
                    
                    {/* Animated Glow Elements */}
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FFD166]/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#5B5FEF]/20 rounded-full blur-[120px] animate-pulse transition-all delay-1000"></div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="max-w-[1000px] mx-auto">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full mb-8 animate-fade-in">
                                <span className="w-2 h-2 bg-[#FFD166] rounded-full animate-ping"></span>
                                <p className="text-white font-black text-[10px] uppercase tracking-[0.3em]">
                                    Unified Campus Infrastructure v2.0
                                </p>
                            </div>
                            
                            <h1 className="text-6xl md:text-9xl font-black text-white mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">
                                REIMAGINE <br/> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-white to-white/70">
                                    EFFICIENCY.
                                </span>
                            </h1>
                            
                            <p className="text-slate-300 text-lg md:text-xl font-medium max-w-[650px] mx-auto mb-12 leading-relaxed opacity-90">
                                The centralized ecosystem for booking, maintenance, and asset intelligence. Streamline your academic journey with UniFlow's precision management.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-4">
                                <Link to="/register" className="group bg-[#FFD166] text-slate-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:shadow-[0_0_50px_-12px_rgba(255,209,102,0.6)] transition-all flex items-center justify-center gap-3">
                                    Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="#catalogue" className="bg-white/5 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                                    View Catalogue
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Features Quick-Access Bar */}
                    <div className="absolute bottom-12 left-0 right-0 z-20">
                        <div className="container mx-auto px-6">
                            <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-3xl flex flex-col md:flex-row gap-12 justify-between">
                                {[
                                    { title: 'Smart Booking', icon: Layout, desc: 'Real-time availability with instant conflict resolution.' },
                                    { title: 'Maintenance 24/7', icon: Zap, desc: 'Integrated ticketing for seamless campus upkeep.' },
                                    { title: 'Asset Intelligence', icon: CheckCircle, desc: 'Detailed usage analytics and role-based controls.' },
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-6 group flex-1">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-[#FFD166] group-hover:border-transparent transition-all duration-500 shadow-inner">
                                            <feature.icon className="w-6 h-6 text-[#FFD166] group-hover:text-slate-900" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-2">{feature.title}</h3>
                                            <p className="text-slate-400 text-xs font-medium leading-relaxed opacity-70 tracking-tight">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Modern About Section */}
                <section id="about-us" className="py-32 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 skew-x-[-12deg] translate-x-1/4"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="max-w-[550px]">
                                <div className="w-12 h-1 bg-[#FFD166] mb-8"></div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                                    Pioneering Digital <br/> Campus Operations
                                </h2>
                                <p className="text-lg text-slate-500 mb-6 leading-relaxed font-medium">
                                    UniFlow isn't just a management tool—it's the backbone of a smarter academic environment. We bridge the gap between complex infrastructure and user convenience.
                                </p>
                                <div className="space-y-4 mb-10">
                                    {['Institutional-grade security', 'Cloud-sync technology', 'Automated reporting'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-[#5B5FEF]/10 flex items-center justify-center">
                                                <CheckCircle className="w-3 h-3 text-[#5B5FEF]" />
                                            </div>
                                            <span className="text-slate-700 font-bold text-sm tracking-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6">
                                    <p className="text-4xl font-serif italic text-slate-400 opacity-60">The UniFlow Vision</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-[#FFD166]/20 to-transparent rounded-[40px] -z-10 group-hover:scale-105 transition-transform duration-700"></div>
                                <img 
                                    src={showcaseImg} 
                                    alt="Academic Excellence" 
                                    className="w-full h-[600px] object-cover rounded-[32px] shadow-2xl border-4 border-white grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                                />
                                <div className="absolute bottom-8 left-8 right-8 bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <p className="text-white font-bold text-sm leading-relaxed italic">
                                        "Transforming raw campus logistics into streamlined academic experiences for over 15,000 users worldwide."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* High-Impact Statistics */}
                <section className="bg-slate-900 py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(91,95,239,0.1),transparent)]"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { val: '1.7K+', label: 'Managed Assets', color: '#FFD166' },
                                { val: '24/7', label: 'Availability', color: '#5B5FEF' },
                                { val: '98%', label: 'Uptime Score', color: '#10B981' },
                                { val: '0.5s', label: 'Response Time', color: '#F43F5E' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <h3 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter" style={{ color: stat.color }}>{stat.val}</h3>
                                    <div className="w-8 h-1 mx-auto mb-4 bg-white/10 group-hover:w-16 transition-all duration-500"></div>
                                    <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] opacity-60">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Premium Resource Catalogue Highlights */}
                <section id="catalogue" className="py-32 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                            <div className="max-w-[600px]">
                                <p className="text-[#5B5FEF] font-black text-xs uppercase tracking-[0.4em] mb-4">The Collection</p>
                                <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Explore Premier Resources</h2>
                            </div>
                            <Link to="/book" className="group flex items-center gap-3 text-slate-900 font-black text-sm uppercase tracking-widest hover:text-[#5B5FEF] transition-colors">
                                View Full Directory <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {loading ? (
                                [1, 2, 3].map(n => (
                                    <div key={n} className="h-[550px] bg-slate-200/50 animate-pulse rounded-[40px]"></div>
                                ))
                            ) : (
                                resources.map((res, i) => (
                                    <div key={res.id} className="group bg-white rounded-[40px] overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-all duration-700 border border-slate-100 flex flex-col h-full">
                                        <div className="relative h-[300px] overflow-hidden">
                                            <img 
                                                src={res.imageUrl || fallbackImgs[i % 3]} 
                                                alt={res.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                            
                                            <div className="absolute top-6 left-6">
                                                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
                                                    <p className="text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                                        <Users className="w-3 h-3 text-[#5B5FEF]" /> {res.capacity} Seats
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="absolute top-6 right-6">
                                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-xl border ${
                                                    res.status === 'AVAILABLE' 
                                                        ? 'bg-emerald-500 text-white border-emerald-400' 
                                                        : 'bg-rose-500 text-white border-rose-400'
                                                }`}>
                                                    {res.status}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                <p className="text-white/90 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-[#FFD166]" /> {res.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-10 flex-1 flex flex-col">
                                            <div className="mb-auto">
                                                <div className="inline-block bg-slate-50 px-3 py-1 rounded-lg mb-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{res.type.replace('_', ' ')}</p>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-[#5B5FEF] transition-colors">{res.name}</h3>
                                            </div>
                                            
                                            <div className="pt-8 mt-8 border-t border-slate-50 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</span>
                                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active Ready</span>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const token = localStorage.getItem('token');
                                                        const dest = '/book';
                                                        window.location.href = token ? dest : `/login?redirect=${dest}`;
                                                    }}
                                                    className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-[#FFD166] hover:text-slate-900 transition-all hover:scale-110 shadow-xl shadow-slate-900/10 active:scale-95"
                                                >
                                                    <Calendar className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {!loading && resources.length === 0 && (
                            <div className="text-center py-24 bg-white rounded-[60px] border-4 border-dashed border-slate-100">
                                <Layout className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                                <p className="text-slate-400 font-black uppercase tracking-[0.3em]">No registry entries available</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            
            <footer id="contact">
                <Footer />
            </footer>
        </div>
    );
};

export default Home;

