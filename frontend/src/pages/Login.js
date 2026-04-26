import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

import logoIcon from '../assets/uniflow-icon.svg';
import heroBg from '../assets/hero-bg.png';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', credentials);
            const { token, role, name, email, message } = response.data;

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('name', name);
                localStorage.setItem('email', email);
                
                const redirectPath = searchParams.get('redirect');

                if (redirectPath) {
                    navigate(redirectPath);
                } else if (role === 'ADMIN') {
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
        <div className="min-h-screen flex flex-col bg-slate-900">
            <Navbar />
            <main 
                className="flex-1 flex items-center justify-center p-5 pt-[72px] relative overflow-hidden bg-cover bg-center min-h-[90vh]"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                {/* Premium Dark Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                
                <div className="bg-white rounded-[24px] w-full max-w-[320px] p-7 z-[1] shadow-2xl relative border border-white/20">
                    <div className="text-center mb-6">
                        <img src={logoIcon} alt="UniFlow Logo" className="w-[48px] h-auto mx-auto mb-4" />
                        <h2 className="text-xl font-black mb-1.5 tracking-tight text-slate-900">Welcome Back</h2>
                        <p className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Secure Portal Access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-800 mb-1.5 uppercase tracking-widest">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#FFD166]/20 focus:border-[#FFD166] transition-all"
                                placeholder="name@example.edu"
                                value={credentials.email}
                                onChange={handleChange}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                                    Password
                                </label>
                                <Link to="/" className="text-[10px] font-black text-[#5B5FEF] hover:text-slate-900 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4">Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#FFD166]/20 focus:border-[#FFD166] transition-all"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-xs text-rose-600 font-bold mb-3 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="bg-[#FFD166] text-slate-900 w-full py-3 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-[#FFC033] hover:scale-[1.02] transition-all shadow-lg shadow-[#FFD166]/30 mt-1" 
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-slate-100"></div>
                        <span className="px-3 text-[9px] text-slate-400 font-black uppercase tracking-widest">OR CONNECT</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    <a 
                        href="http://localhost:8081/oauth2/authorization/google" 
                        className="flex items-center justify-center w-full py-3 rounded-full font-black text-[11px] uppercase tracking-widest border-2 border-slate-100 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            className="w-4 h-4 mr-2"
                        />
                        Sign in with Google
                    </a>

                    <div className="text-center mt-6 pt-5 border-t border-slate-50">
                        <span className="text-slate-500 text-[10px] font-bold">NEW HERE?</span> 
                        <Link to={searchParams.get('redirect') ? `/register?redirect=${searchParams.get('redirect')}` : "/register"} className="text-[#5B5FEF] font-black uppercase tracking-widest text-[10px] ml-2 hover:text-slate-900 transition-colors">Join UniFlow</Link>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Login;
