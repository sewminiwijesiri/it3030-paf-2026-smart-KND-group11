import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserDashboard = () => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name') || 'Student';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-soft)' }}>
            <Navbar />
            <main style={{ flex: '1', padding: '60px 0' }}>
                <div className="container">
                    <div className="animate-up">
                        <div style={{ marginBottom: '3rem' }}>
                            <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>Connected as {role}</span>
                            <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.03em' }}>User Dashboard</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
                                Manage your technical inquiries, access course materials, and track your global progress in the UniFlow ecosystem.
                            </p>
                        </div>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '2.5rem' 
                        }}>
                            <div className="card glass-dark" style={{ 
                                padding: '2.5rem', 
                                border: 'none',
                                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            }}>
                                <h3 style={{ marginBottom: '1.5rem', color: 'white', opacity: 0.9, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Status</h3>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Active Flow</div>
                                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Your account is in good standing. All services are operational.</p>
                            </div>

                            <div className="card" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', letterSpacing: '0.02em' }}>Notifications</h3>
                                    <div style={{ width: '10px', height: '10px', background: 'var(--error)', borderRadius: '50%' }}></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500' }}>• Global Seminar starts tomorrow</p>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>• Your profile update is complete</p>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>• 2 New resources added to Labs</p>
                                </div>
                            </div>

                            <div className="card" style={{ padding: '2.5rem' }}>
                                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Quick Actions</h3>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Browse Innovation Portal</button>
                                    <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Contact Faculty Lab</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;
