import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';
import showcaseImg from '../assets/campus-showcase.png';

const Home = () => {
    return (
        <div className="home-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-soft)' }}>
            <Navbar />
            <main>
                {/* Modern Hero Section */}
                <section style={{ 
                    position: 'relative', 
                    padding: '160px 0 200px', 
                    overflow: 'hidden',
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {/* Dark Overlay for Readability */}
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, left: 0, 
                        width: '100%', height: '100%', 
                        background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7))',
                        zIndex: 1 
                    }}></div>

                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <div className="animate-up" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                            <span className="badge badge-primary" style={{ marginBottom: '1.5rem', background: 'var(--primary)', color: 'white' }}>Next-Gen Learning Platform</span>
                            <h1 style={{ 
                                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
                                marginBottom: '1.5rem', 
                                color: 'white',
                                fontWeight: '800',
                                letterSpacing: '-0.03em'
                            }}>
                                Master Your Future <br />With UniFlow
                            </h1>
                            <p style={{ 
                                fontSize: '1.2rem', 
                                marginBottom: '2.5rem', 
                                maxWidth: '750px', 
                                margin: '0 auto 2.5rem',
                                color: 'rgba(255, 255, 255, 0.85)',
                                lineHeight: '1.8'
                            }}>
                                UniFlow is a role-based platform designed to manage facility bookings, maintenance requests, and campus workflows efficiently. It supports Admins, Technicians, and Users with secure access and real-time system management.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                    Start Learning
                                </Link>
                                <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                                    View Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Cards Section */}
                <section id="features" style={{ padding: '80px 0', background: 'var(--bg-soft)' }}>
                    <div className="container" style={{ marginTop: '-120px', position: 'relative', zIndex: 10 }}>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                            gap: '1.5rem' 
                        }}>
                            {[
                                { title: 'Booking Management', desc: 'Request and manage room, lab, and equipment bookings with automated conflict prevention.', icon: '📅', color: '#3b82f6' },
                                { title: 'Maintenance System', desc: 'Report issues with resources and track ticket status from Open to Closed in real-time.', icon: '🛠', color: '#10b981' },
                                { title: 'Secure Authentication', desc: 'Enterprise-grade security featuring JWT-based login and Google OAuth 2.0 integration.', icon: '🔐', color: '#8b5cf6' },
                                { title: 'Role-Based Dashboards', desc: 'Dedicated portals for Admins, Technicians, and Users to manage their specific tasks.', icon: '👥', color: '#f59e0b' }
                            ].map((card, index) => (
                                <div key={index} className="card animate-scale" style={{ 
                                    padding: '2.5rem 1.5rem', 
                                    animationDelay: `${index * 0.1}s`,
                                    background: '#f0f7ff',
                                    border: '1px solid rgba(59, 130, 246, 0.1)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    minHeight: '320px',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ 
                                        width: '64px', height: '64px', background: 'white', 
                                        borderRadius: '18px', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', fontSize: '1.8rem', marginBottom: '1.5rem',
                                        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.1)',
                                        color: card.color
                                    }}>
                                        {card.icon}
                                    </div>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem', fontWeight: '700', color: '#1e3a8a' }}>{card.title}</h3>
                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#475569' }}>{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Workflow Section - How it Works */}
                <section style={{ padding: '100px 0 80px', background: 'white' }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Operational Flow</span>
                            <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: '800', color: '#0f172a' }}>How UniFlow Works</h2>
                        </div>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '2rem', 
                            position: 'relative' 
                        }}>
                            {[
                                { 
                                    step: '01', 
                                    title: 'Resource Request', 
                                    desc: 'User requests a booking or reports a campus incident with key details.', 
                                    icon: '📝' 
                                },
                                { 
                                    step: '02', 
                                    title: 'Rapid Assignment', 
                                    desc: 'Admin reviews requests or assigns a Technician to relevant tickets.', 
                                    icon: '🤝' 
                                },
                                { 
                                    step: '03', 
                                    title: 'Live Resolution', 
                                    desc: 'Real-time updates and push notifications are sent throughout the workflow.', 
                                    icon: '✅' 
                                }
                            ].map((item, index) => (
                                <div key={index} style={{ 
                                    textAlign: 'center', 
                                    padding: '2rem', 
                                    position: 'relative' 
                                }}>
                                    <div style={{ 
                                        width: '80px', height: '80px', 
                                        background: 'var(--primary)', color: 'white', 
                                        borderRadius: '50%', display: 'flex', 
                                        alignItems: 'center', justifyContent: 'center', 
                                        fontSize: '2rem', margin: '0 auto 1.5rem',
                                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                                        position: 'relative', zIndex: 2
                                    }}>
                                        {item.icon}
                                        <div style={{ 
                                            position: 'absolute', top: '-5px', right: '-5px', 
                                            background: '#0f172a', color: 'white', 
                                            width: '28px', height: '28px', borderRadius: '50%', 
                                            fontSize: '0.8rem', fontWeight: '700', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                        }}>{item.step}</div>
                                    </div>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', fontWeight: '700', color: '#1e3a8a' }}>{item.title}</h3>
                                    <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '1rem' }}>{item.desc}</p>
                                    
                                    {/* Connector for Desktop (Arrows) */}
                                    {index < 2 && (
                                        <div className="desktop-only" style={{ 
                                            position: 'absolute', top: '40px', right: '-15%', 
                                            width: '30%', height: '2px', 
                                            borderTop: '2px dashed #cbd5e1', 
                                            zIndex: 1,
                                            display: 'none' // Hidden by default, can be shown with media queries if needed
                                        }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Showcase Section - Detailed Modules */}
                <section className="section-padding" style={{ background: '#f8fafc' }}>
                    <div className="container">
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                            gap: '5rem', 
                            alignItems: 'center' 
                        }}>
                            <div className="animate-up">
                                <div style={{ position: 'relative' }}>
                                    <div style={{ 
                                        position: 'absolute', inset: '-10px', 
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                                        borderRadius: '30px', transform: 'rotate(-2deg)', opacity: 0.1 
                                    }}></div>
                                    <img 
                                        src={showcaseImg} 
                                        alt="Campus Operations" 
                                        style={{ 
                                            width: '100%', borderRadius: '24px', 
                                            boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 1 
                                        }}
                                    />
                                    <div className="glass float" style={{ 
                                        position: 'absolute', bottom: '10%', right: '-20px', 
                                        padding: '1.25rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)',
                                        zIndex: 2, display: 'flex', alignItems: 'center', gap: '12px',
                                        background: 'rgba(255, 255, 255, 0.95)', border: '1px solid var(--primary-light)'
                                    }}>
                                        <div style={{ background: 'var(--success)', width: '10px', height: '10px', borderRadius: '50%' }}></div>
                                        <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.85rem' }}>Automated Conflict Checking</span>
                                    </div>
                                </div>
                            </div>
                            <div className="animate-up" style={{ animationDelay: '0.2s' }}>
                                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Operational Excellence</span>
                                <h2 style={{ fontSize: '2.8rem', margin: '1rem 0 2rem', lineHeight: '1.1', fontWeight: '800' }}>Unified Hub for Smart Campus Management</h2>
                                <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#4d5562' }}>
                                    Our platform streamlines daily university operations by digitizing resource allocation and maintenance workflows. Built with a production-grade layered architecture using Spring Boot and React.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    {[
                                        { label: 'Facility Catalogue', icon: '🏛️' },
                                        { label: 'Conflict Prevention', icon: '⚖️' },
                                        { label: 'Incident Evidence', icon: '📸' },
                                        { label: 'Live Notifications', icon: '🔔' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '1.3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{item.icon}</span>
                                            <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Explore Platform Capabilities</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Real-time Campus Stats Section */}
                <section style={{ padding: '80px 0', background: '#e0f2fe', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2, background: 'radial-gradient(circle at 50% 50%, var(--primary), transparent)' }}></div>
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', textAlign: 'center' }}>
                            {[
                                { val: '250+', label: 'Managed Assets' },
                                { val: '99.8%', label: 'Conflict Accuracy' },
                                { val: '45m', label: 'Avg. Response' },
                                { val: '24/7', label: 'Live Monitoring' }
                            ].map((stat, i) => (
                                <div key={i} className="animate-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#1e3a8a', marginBottom: '0.5rem' }}>{stat.val}</div>
                                    <div style={{ color: '#475569', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{stat.label}</div>
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

