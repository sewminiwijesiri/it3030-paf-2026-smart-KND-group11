import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AccessDenied = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '600px', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🚫</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--error)' }}>
                        Access Denied
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        You do not have the required permissions to view this page. 
                        If you believe this is an error, please contact your administrator.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="btn btn-secondary"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Go Back
                        </button>
                        <button 
                            onClick={() => navigate('/')} 
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 1.5rem' }}
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AccessDenied;
