import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';
import showcaseImg from '../assets/campus-showcase.png';

const Home = () => {
    return (
        <div className="min-h-screen bg-bg-soft">
            <Navbar />
            <main>
                {/* Modern Hero Section */}
                <section className="relative py-40 md:py-60 overflow-hidden bg-cover bg-center flex items-center" style={{ backgroundImage: `url(${heroBg})` }}>
                    {/* Dark Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-900/70 z-[1]"></div>

                    <div className="container mx-auto px-4 md:px-8 relative z-[10]">
                        <div className="animate-up text-center max-w-[900px] mx-auto">
                            <span className="badge bg-primary text-white border-none mb-6 px-6 py-2">Next-Gen Learning Platform</span>
                            <h1 className="text-4xl md:text-7xl font-extrabold mb-6 text-white tracking-tight leading-tight">
                                Master Your Future <br className="hidden md:block" /> With UniFlow
                            </h1>
                            <p className="text-lg md:text-xl text-white/85 mb-10 max-w-[750px] mx-auto leading-relaxed">
                                UniFlow is a role-based platform designed to manage facility bookings, maintenance requests, and campus workflows efficiently.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/register" className="btn btn-primary !px-10 !py-4 shadow-xl shadow-primary/20">
                                    Start Learning
                                </Link>
                                <Link to="/login" className="btn btn-outline !px-10 !py-4 text-white border-white/30 hover:bg-white/10">
                                    View Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Cards Section */}
                <section id="features" className="py-20 bg-bg-soft">
                    <div className="container mx-auto px-4 md:px-8 -mt-32 relative z-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Booking Management', desc: 'Request and manage room, lab, and equipment bookings with automated conflict prevention.', icon: '📅', color: '#3b82f6' },
                                { title: 'Maintenance System', desc: 'Report issues with resources and track ticket status from Open to Closed in real-time.', icon: '🛠', color: '#10b981' },
                                { title: 'Secure Authentication', desc: 'Enterprise-grade security featuring JWT-based login and Google OAuth 2.0 integration.', icon: '🔐', color: '#8b5cf6' },
                                { title: 'Role-Based Dashboards', desc: 'Dedicated portals for Admins, Technicians, and Users to manage their specific tasks.', icon: '👥', color: '#f59e0b' }
                            ].map((card, index) => (
                                <div key={index} className="card bg-blue-50 border border-blue-500/10 shadow-xl shadow-blue-900/5 rounded-[24px] p-10 flex flex-col items-center text-center justify-center min-h-[320px] animate-scale" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-500/10" style={{ color: card.color }}>
                                        {card.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-blue-900">{card.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow Section - How it Works */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-3 block">Operational Flow</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">How UniFlow Works</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {[
                                { step: '01', title: 'Resource Request', desc: 'User requests a booking or reports a campus incident with key details.', icon: '📝' },
                                { step: '02', title: 'Rapid Assignment', desc: 'Admin reviews requests or assigns a Technician to relevant tickets.', icon: '🤝' },
                                { step: '03', title: 'Live Resolution', desc: 'Real-time updates and notifications are sent throughout the workflow.', icon: '✅' }
                            ].map((item, index) => (
                                <div key={index} className="text-center p-8 relative group">
                                    <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl shadow-primary/30 relative z-[2]">
                                        {item.icon}
                                        <div className="absolute -top-1 -right-1 bg-slate-900 text-white w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">{item.step}</div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-blue-900 tracking-tight">{item.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Showcase Section - Detailed Modules */}
                <section className="py-32 bg-slate-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="animate-up relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-primary to-secondary rounded-[32px] -rotate-2 opacity-10"></div>
                                <img 
                                    src={showcaseImg} 
                                    alt="Campus Operations" 
                                    className="w-full rounded-3xl shadow-2xl relative z-[1]"
                                />
                                <div className="glass float absolute bottom-[10%] -right-5 p-5 rounded-2xl shadow-xl z-[2] flex items-center gap-3 bg-white/95 border border-blue-100">
                                    <div className="bg-success w-2.5 h-2.5 rounded-full"></div>
                                    <span className="font-bold text-slate-800 text-xs tracking-tight">Automated Conflict Checking</span>
                                </div>
                            </div>
                            <div className="animate-up delay-200">
                                <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Operational Excellence</span>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold my-8 leading-[1.1] tracking-tight text-slate-900">Unified Hub for Smart Campus Management</h2>
                                <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                                    Our platform streamlines daily university operations by digitizing resource allocation and maintenance workflows.
                                </p>
                                <div className="grid grid-cols-2 gap-8 mb-12">
                                    {[
                                        { label: 'Facility Catalogue', icon: '🏛️' },
                                        { label: 'Conflict Prevention', icon: '⚖️' },
                                        { label: 'Incident Evidence', icon: '📸' },
                                        { label: 'Live Notifications', icon: '🔔' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-2xl drop-shadow-sm">{item.icon}</span>
                                            <span className="font-semibold text-slate-800 text-sm">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/register" className="btn btn-primary !px-8 !py-3.5">Explore Platform Capabilities</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-time Campus Stats Section */}
                <section className="py-24 bg-sky-100 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,var(--primary),transparent)]"></div>
                    <div className="container mx-auto px-4 md:px-8 relative z-[1]">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                            {[
                                { val: '250+', label: 'Managed Assets' },
                                { val: '99.8%', label: 'Conflict Accuracy' },
                                { val: '45m', label: 'Avg. Response' },
                                { val: '24/7', label: 'Live Monitoring' }
                            ].map((stat, i) => (
                                <div key={i} className="animate-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">{stat.val}</div>
                                    <div className="text-slate-600 font-bold text-xs uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;

