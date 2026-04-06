import React, { useState } from 'react';
import axios from 'axios';
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
            const response = await axios.post('http://localhost:8081/auth/login', credentials);
            
            // Assuming response looks like { token: '...', role: '...' }
            const { token, role, message } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                alert('Login Successful!');
                
                // Role-based dashboard redirection
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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Login to access your UniFlow account</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input-field"
                                placeholder="name@example.com"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <div style={{ 
                                color: 'var(--error)', 
                                fontSize: '0.9rem', 
                                marginBottom: '1.5rem',
                                padding: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '6px',
                                borderLeft: '3px solid var(--error)'
                            }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Login Now'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                        <span style={{ padding: '0 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    </div>

                    <a 
                        href="http://localhost:8081/oauth2/authorization/google" 
                        className="btn" 
                        style={{ 
                            width: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: '0.75rem',
                            background: 'white',
                            color: '#333',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            gap: '10px'
                        }}
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            style={{ width: '18px' }} 
                        />
                        Continue with Google
                    </a>

                    <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
