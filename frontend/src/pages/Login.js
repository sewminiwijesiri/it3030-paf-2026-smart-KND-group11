import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logoIcon from '../assets/uniflow-icon.svg';

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
        <div className="min-h-screen flex flex-col bg-bg-soft">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-10 px-5 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-60 z-0 bg-sky-50"></div>
                
                <div className="card animate-up glass w-full max-w-[400px] p-8 z-[1] shadow-2xl">
                    <div className="text-center mb-8">
                        <img src={logoIcon} alt="UniFlow Logo" className="w-[64px] h-auto mx-auto mb-6" />
                        <h2 className="text-2xl font-extrabold mb-1 tracking-tight text-slate-900">Welcome Back</h2>
                        <p className="text-text-muted text-sm">Secure portal access</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="input-field !py-2.5 !px-3.5 !text-sm"
                                placeholder="name@example.edu"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link to="/" className="text-[10px] font-bold text-primary no-underline">Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                className="input-field !py-2.5 !px-3.5 !text-sm"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-xs text-error font-medium mb-4 p-3 bg-error/5 border border-error/10 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full !py-3 !text-sm mt-1" 
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="px-3 text-[10px] text-slate-400 font-bold uppercase">OR CONNECT</span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <a 
                        href="http://localhost:8081/oauth2/authorization/google" 
                        className="btn btn-outline w-full !py-2.5 !text-sm bg-white hover:bg-slate-50 transition-colors"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            className="w-4 h-4 mr-2"
                        />
                        Google Auth
                    </a>

                    <div className="text-center mt-8 text-slate-500 text-sm">
                        New here? <Link to="/register" className="text-primary font-bold no-underline ml-1">Join UniFlow</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
