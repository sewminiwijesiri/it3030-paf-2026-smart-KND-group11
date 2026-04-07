import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', credentials);
            const { token, role, message } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                
                if (role === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else if (role === 'TECHNICIAN') {
                    navigate('/technician-dashboard');
                } else {
                    navigate('/user-dashboard');
                }
            } else if (message) {
                setError(message);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-soft)' }}>
            <Navbar />
            <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative background elements */}
                <div className="hero-gradient" style={{ position: 'absolute', inset: 0, opacity: 0.6, zIndex: 0 }}></div>
                
                <div className="card animate-up glass" style={{ 
                    width: '100%', 
                    maxWidth: '400px', 
                    padding: '2rem', 
                    zIndex: 1,
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ 
                            width: '40px', height: '40px', background: 'var(--primary)', 
                            borderRadius: '10px', margin: '0 auto 1rem', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' 
                        }}>U</div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secure portal access</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                placeholder="name@example.edu"
                                style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Password
                                </label>
                                <Link to="/" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                className="input-field"
                                placeholder="••••••••"
                                style={{ padding: '0.65rem 0.85rem', fontSize: '0.9rem' }}
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{ 
                                color: 'var(--error)', 
                                fontSize: '0.8rem', 
                                marginBottom: '1rem',
                                padding: '0.6rem 0.8rem',
                                background: 'rgba(239, 68, 68, 0.08)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid rgba(239, 68, 68, 0.12)',
                                fontWeight: '500'
                            }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', fontSize: '0.95rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span style={{ padding: '0 0.75rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>OR CONNECT</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <a 
                        href="http://localhost:8081/oauth2/authorization/google" 
                        className="btn btn-outline" 
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: 'white', fontSize: '0.9rem' }}
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            style={{ width: '16px' }} 
                        />
                        Google Auth
                    </a>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        New? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Join UniFlow</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
