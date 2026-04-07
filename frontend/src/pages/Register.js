import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logoIcon from '../assets/uniflow-icon.svg';

const Register = () => {
    const [user, setUser] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
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

        if (user.password !== user.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...registrationData } = user;
            await axios.post('http://localhost:8081/auth/register', registrationData);
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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-soft)' }}>
            <Navbar />
            <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', position: 'relative', overflow: 'hidden' }}>
                <div className="hero-gradient" style={{ position: 'absolute', inset: 0, opacity: 0.6, zIndex: 0 }}></div>
                
                <div className="card animate-up glass" style={{ 
                    width: '100%', 
                    maxWidth: '440px', 
                    padding: '2rem', 
                    zIndex: 1,
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <img src={logoIcon} alt="UniFlow Logo" style={{ width: '64px', height: 'auto', margin: '0 auto 1.5rem' }} />
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Join UniFlow</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Global learning community</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="input-field"
                                placeholder="Your Name"
                                style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                placeholder="name@university.edu"
                                style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                    style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input-field"
                                    placeholder="••••••••"
                                    style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Role</label>
                            <select 
                                name="role" 
                                className="input-field" 
                                value={user.role} 
                                onChange={handleChange}
                                style={{ cursor: 'pointer', padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                            >
                                <option value="USER">Student / Standard User</option>
                                <option value="TECHNICIAN">Technician / Researcher</option>
                            </select>
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
                            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Register'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span style={{ padding: '0 0.75rem', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>OR JOIN WITH</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <a 
                        href="http://localhost:8081/oauth2/authorization/google" 
                        className="btn btn-outline" 
                        style={{ width: '100%', padding: '0.6rem', backgroundColor: 'white', fontSize: '0.9rem' }}
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            style={{ width: '16px' }} 
                        />
                        Google Sign Up
                    </a>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Member already? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Log in</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
