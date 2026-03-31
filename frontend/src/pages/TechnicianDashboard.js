import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TechnicianDashboard = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: '1', padding: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div className="card glass animate-fade" style={{ padding: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)' }}>Technician Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
                        Welcome, Technician. Keep track of your assigned tasks and update the status of service requests.
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        <div className="card" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Pending Tasks</h3>
                            <p style={{ fontSize: '2rem', fontWeight: '700' }}>0</p>
                        </div>
                        <div className="card" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Completed Jobs</h3>
                            <p style={{ fontSize: '2rem', fontWeight: '700' }}>0</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TechnicianDashboard;
