import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-soft)' }}>
            <Navbar />
            <main>
                {/* Modern Hero Section */}
                <section className="hero-gradient" style={{ 
                    position: 'relative', 
                    padding: '100px 0 160px', 
                    overflow: 'hidden' 
                }}>
                    <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                        <div className="animate-up" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                            <span className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>Next-Gen Learning Platform</span>
                            <h1 style={{ 
                                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
                                marginBottom: '1.5rem', 
                                background: 'linear-gradient(135deg, var(--text-main) 0%, #475569 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: '800'
                            }}>
                                Master Your Future <br />With UniFlow
                            </h1>
                            <p style={{ 
                                fontSize: '1.25rem', 
                                marginBottom: '2.5rem', 
                                maxWidth: '600px', 
                                margin: '0 auto 2.5rem',
                                color: 'var(--text-muted)'
                            }}>
                                Experience a transformative education platform that combines creative thinking with industrial-grade technical knowledge.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                    Start Learning <span>→</span>
                                </Link>
                                <Link to="/login" className="btn btn-outline" style={{ padding: '1rem 2.5rem' }}>
                                    View Courses
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Abstract Decorative Elements */}
                    <div className="float" style={{ 
                        position: 'absolute', top: '10%', left: '5%', width: '150px', height: '150px', 
                        background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', 
                        opacity: '0.1', borderRadius: '50%' 
                    }}></div>
                    <div className="float" style={{ 
                        position: 'absolute', bottom: '15%', right: '8%', width: '250px', height: '250px', 
                        background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', 
                        opacity: '0.1', borderRadius: '50%', animationDelay: '1s' 
                    }}></div>
                </section>

                {/* Feature Cards Section */}
                <section style={{ marginTop: '-80px' }}>
                    <div className="container">
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                            gap: '2rem' 
                        }}>
                            {[
                                { title: 'Advanced Labs', desc: 'State-of-the-art virtual laboratories for hands-on technical training.', icon: '⚡', color: '#3b82f6' },
                                { title: 'Expert Mentors', desc: 'Learn directly from industry leaders and academic pioneers.', icon: '🛡️', color: '#10b981' },
                                { title: 'Global Network', desc: 'Connect with a diverse community of students from across the globe.', icon: '🌍', color: '#8b5cf6' }
                            ].map((card, index) => (
                                <div key={index} className="card animate-scale" style={{ 
                                    padding: '2.5rem', 
                                    animationDelay: `${index * 0.1}s`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        width: '60px', height: '60px', background: `${card.color}15`, 
                                        borderRadius: '16px', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center', fontSize: '1.8rem', marginBottom: '1.5rem',
                                        color: card.color
                                    }}>
                                        {card.icon}
                                    </div>
                                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>{card.title}</h3>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Showcase Section */}
                <section className="section-padding">
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
                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
                                        borderRadius: '30px', transform: 'rotate(-2deg)', opacity: 0.1 
                                    }}></div>
                                    <img 
                                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop" 
                                        alt="Modern Workspace" 
                                        style={{ 
                                            width: '100%', borderRadius: '24px', 
                                            boxShadow: 'var(--shadow-lg)', position: 'relative', zIndex: 1 
                                        }}
                                    />
                                    <div className="glass float" style={{ 
                                        position: 'absolute', bottom: '15%', left: '-30px', 
                                        padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)',
                                        zIndex: 2, display: 'flex', alignItems: 'center', gap: '15px'
                                    }}>
                                        <div style={{ background: '#22c55e', width: '12px', height: '12px', borderRadius: '50%' }}></div>
                                        <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>1.2k+ Students Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="animate-up" style={{ animationDelay: '0.2s' }}>
                                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Why Choose UniFlow?</span>
                                <h2 style={{ fontSize: '3rem', margin: '1rem 0 2rem', lineHeight: '1.1' }}>Bridging Academics with Innovation</h2>
                                <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
                                    We provide an environment where curiosity meets capability. Our curriculum is designed to evolve as fast as the technology landscape does.
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                    {[
                                        { label: 'Industry Projects', icon: '📁' },
                                        { label: 'Global Mentors', icon: '💡' },
                                        { label: 'Cloud Access', icon: '☁️' },
                                        { label: 'Job Placement', icon: '🎯' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                                            <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link to="/register" className="btn btn-primary">Join the Community</Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section with Glassmorphism */}
                <section style={{ padding: '80px 0', background: 'var(--primary)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, background: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', textAlign: 'center' }}>
                            {[
                                { val: '4.9/5', label: 'Student Rating' },
                                { val: '99%', label: 'Course Success' },
                                { val: '24/7', label: 'Technical Help' },
                                { val: '500+', label: 'Global Partners' }
                            ].map((stat, i) => (
                                <div key={i} className="animate-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div style={{ fontSize: '2.8rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>{stat.val}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.75)', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
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

