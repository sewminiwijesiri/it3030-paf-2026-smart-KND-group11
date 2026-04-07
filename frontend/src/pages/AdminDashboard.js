import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-soft)' }}>
            <Navbar />
            <main style={{ flex: '1', padding: '80px 0' }}>
                <div className="container">
                    <div className="animate-up">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
                            <div>
                                <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>System Administrator</span>
                                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-0.04em' }}>Admin Core</h1>
                            </div>
                            <div style={{ padding: '0.75rem 1.5rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.9rem', fontWeight: '600' }}>
                                <span style={{ color: 'var(--success)', marginRight: '8px' }}>●</span> All Engines Active
                            </div>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                            {[
                                { label: 'Total Members', val: '1,284', inc: '+12%' },
                                { label: 'Revenue Flow', val: '$42.5k', inc: '+5.2%' },
                                { label: 'Active Labs', val: '18', inc: 'Stable' },
                                { label: 'System Load', val: '24%', inc: 'Optimal' }
                            ].map((stat, i) => (
                                <div key={i} className="card" style={{ padding: '2rem' }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>{stat.label}</p>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>{stat.val}</div>
                                    <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700' }}>{stat.inc}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>Platform Entities</h3>
                                </div>
                                <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                                    <p>Detailed system logs and entity management will appear here as the platform expands.</p>
                                </div>
                            </div>
                            
                            <div className="card glass-dark" style={{ background: 'var(--text-main)', border: 'none', padding: '2.5rem' }}>
                                <h3 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.2rem' }}>System Integrity</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {['Database Backup', 'Auth Service', 'Storage Core', 'Email SMTP'].map((service, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{service}</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>OPERATIONAL</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', marginTop: '3rem' }}>Re-scan Core</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
