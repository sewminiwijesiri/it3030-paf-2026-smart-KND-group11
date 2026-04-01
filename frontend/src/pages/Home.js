import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main>
                {/* Hero Section */}
                <section style={{
                    position: 'relative',
                    height: '80vh',
                    background: 'url("https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2000&auto=format&fit=crop") center/cover no-repeat',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white'
                }}>
                    <div className="overlay" style={{ background: 'linear-gradient(to right, rgba(6, 78, 59, 0.8), rgba(0, 0, 0, 0.2))' }}></div>
                    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                        <div className="animate-up" style={{ maxWidth: '650px' }}>
                            <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '500' }}>UniFlow University</h4>
                            <h1 style={{ fontSize: '4.5rem', marginBottom: '2rem', lineHeight: '1.1' }}>Together We'll <br />Explore New Things</h1>
                            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                                We believe everyone should have the opportunity to create progress through technology and join the global flow of innovation.
                            </p>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '1.2rem 2.8rem', fontSize: '1.1rem', borderRadius: '4px' }}>
                                Find Courses
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Floating Cards Section */}
                <section style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>
                    <div className="container">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { title: 'Graduation', desc: 'Join thousands of students who have successfully transformed their careers.', icon: '🎓' },
                                { title: 'University Life', desc: 'Experience a vibrant campus culture with endless opportunities to grow.', icon: '🏫' },
                                { title: 'Global Services', desc: 'Our dedicated support team is available 24/7 to help you along the way.', icon: '🌐' }
                            ].map((card, index) => (
                                <div key={index} className="card animate-up" style={{ textAlign: 'center', animationDelay: `${index * 0.15}s` }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>{card.icon}</div>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{card.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{card.desc}</p>
                                    <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        Learn More <span>→</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="section-padding">
                    <div className="container">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '5rem', alignItems: 'center' }}>
                            <div className="animate-up">
                                <div style={{ position: 'relative' }}>
                                    <img 
                                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop" 
                                        alt="Students" 
                                        style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
                                    />
                                    <div style={{ 
                                        position: 'absolute', 
                                        bottom: '-40px', 
                                        right: '-40px', 
                                        width: '250px', 
                                        height: '250px', 
                                        border: '10px solid white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--shadow-lg)'
                                    }}>
                                        <img 
                                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop" 
                                            alt="Study" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="animate-up" style={{ animationDelay: '0.2s' }}>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>About UniFlow</h4>
                                <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Degrees in Various Academic Disciplines</h2>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                                    Not only can university offer an environment rich in our social and cultural experiences, but it also develops critical thinking and professional skills.
                                </p>
                                <ul style={{ listStyle: 'none', marginBottom: '2.5rem' }}>
                                    {['Access to all our courses', 'Learn the latest skills', 'Upskill your organization'].map((item, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', fontWeight: '500' }}>
                                            <span style={{ color: '#22c55e', fontSize: '1.2rem' }}>✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Read More</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section style={{ background: '#f8fafc', padding: '80px 0' }}>
                    <div className="container">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                            {[
                                { count: '3+', label: 'Years of Experience', icon: '🌍' },
                                { count: '99+', label: 'Innovative Courses', icon: '💻' },
                                { count: '10+', label: 'Qualified Teachers', icon: '👨‍🏫' },
                                { count: '11+', label: 'Learners Enrolled', icon: '📚' }
                            ].map((stat, index) => (
                                <div key={index} className="animate-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
                                    <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stat.count}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{stat.label}</p>
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
