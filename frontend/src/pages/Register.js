import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
    const [user, setUser] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'USER' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8081/auth/register', user);
            alert('Registration Successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="card glass animate-fade" style={{ width: '100%', maxWidth: '500px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--primary)' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Welcome to the UniFlow community</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input-field"
                                placeholder="John Doe"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input-field"
                                placeholder="name@example.com"
                                value={user.email}
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
                                value={user.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="role">Account Role</label>
                            <select 
                                id="role" 
                                name="role" 
                                className="input-field" 
                                value={user.role} 
                                onChange={handleChange}
                                style={{ background: 'var(--surface)' }}
                            >
                                <option value="USER">Standard User</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
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
                            {loading ? 'Creating account...' : 'Complete Registration'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Log in</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
