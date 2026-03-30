import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AdminTest = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const callAdmin = async () => {
        setLoading(true);
        setResult('');

        try {
            const response = await axios.get('http://localhost:8081/admin/test', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Admin test response:', response.data);
            setResult(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
            alert('API Success: ' + (typeof response.data === 'string' ? response.data : JSON.stringify(response.data)));
        } catch (err) {
            console.error('Admin test error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Access Denied';
            setResult('Error: ' + errorMsg);
            alert('API Failed: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary)' }}>Admin Dashboard</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome to the protected admin area. Your role is: <strong>{role}</strong></p>
                    </div>

                    <div style={{ 
                        padding: '2.5rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        borderRadius: '12px', 
                        border: '1px solid var(--glass-border)',
                        marginBottom: '2rem'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Protected API Test</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Click the button below to test the protected <code>GET /admin/test</code> endpoint using your JWT token.
                        </p>
                        
                        <button 
                            onClick={callAdmin} 
                            className="btn btn-primary" 
                            style={{ padding: '1rem 3rem' }}
                            disabled={loading || !token}
                        >
                            {loading ? 'Calling API...' : 'Call Admin API'}
                        </button>
                    </div>

                    {result && (
                        <div style={{ 
                            padding: '1.5rem', 
                            background: result.startsWith('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', 
                            color: result.startsWith('Error') ? 'var(--error)' : 'var(--success)', 
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontFamily: 'monospace',
                            textAlign: 'left',
                            wordBreak: 'break-all'
                        }}>
                             {result}
                        </div>
                    )}

                    {!token && (
                        <div style={{ color: 'var(--error)', marginTop: '1rem' }}>
                            No JWT token found. Please login first.
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminTest;
