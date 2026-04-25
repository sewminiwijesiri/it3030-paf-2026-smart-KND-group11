import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Lock, LogIn, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
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
        <div className="min-h-screen flex flex-col bg-[#0F172A] selection:bg-[#FFD166] selection:text-slate-900">
            <Navbar />
            <main 
                className="flex-1 flex items-center justify-center p-6 pt-[100px] pb-24 relative overflow-hidden"
            >
                {/* Immersive Background Elements */}
                <div className="absolute inset-0 z-0">
                    <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A]"></div>
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FFD166]/10 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#5B5FEF]/10 blur-[100px] rounded-full animate-pulse delay-700"></div>
                </div>
                
                <div className="w-full max-w-[340px] z-10 relative group">
                    {/* Glassmorphism Card */}
                    <div className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 hover:border-white/20">
                        {/* Decorative Top Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD166] to-transparent opacity-50"></div>

                        <div className="text-center mb-10">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-[#FFD166] blur-lg opacity-20 animate-pulse"></div>
                                <div className="relative w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                                    <img src={logoIcon} alt="UniFlow" className="w-9 h-auto" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black mb-2 tracking-tight text-white flex items-center justify-center gap-2">
                                Welcome <Sparkles className="w-5 h-5 text-[#FFD166]" />
                            </h2>
                            <p className="font-bold text-[9px] uppercase tracking-[0.3em] text-slate-500">Secure Protocol Access</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    <Mail size={10} className="text-[#FFD166]" />
                                    Account Identity
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#FFD166]/10 focus:border-[#FFD166]/30 transition-all duration-500"
                                    placeholder="name@uniflow.system"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <Lock size={10} className="text-[#FFD166]" />
                                        Access Key
                                    </label>
                                    <Link to="/" className="text-[9px] font-black text-[#FFD166] hover:text-white transition-colors uppercase tracking-widest">Recovery?</Link>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-5 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#FFD166]/10 focus:border-[#FFD166]/30 transition-all duration-500"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-[10px] text-rose-400 font-bold p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 animate-shake">
                                    <ShieldCheck size={14} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="w-full group/btn relative"
                                disabled={loading}
                            >
                                <div className="absolute inset-0 bg-[#FFD166] blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity"></div>
                                <div className="relative bg-[#FFD166] text-slate-900 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Initialize Session
                                            <LogIn size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="flex items-center my-8">
                            <div className="flex-1 h-px bg-white/5"></div>
                            <span className="px-4 text-[8px] text-slate-600 font-black uppercase tracking-[0.3em]">Network Gateway</span>
                            <div className="flex-1 h-px bg-white/5"></div>
                        </div>

                        <button 
                            className="w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 group/google"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" className="w-4 h-4 group-hover/google:scale-110 transition-transform" />
                            Federated ID Login
                        </button>

                        <div className="text-center mt-10 pt-6 border-t border-white/5">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">New to the Ecosystem?</p>
                            <Link 
                                to={searchParams.get('redirect') ? `/register?redirect=${searchParams.get('redirect')}` : "/register"} 
                                className="inline-flex items-center gap-2 text-[#FFD166] font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-all group/link"
                            >
                                Create Digital Identity
                                <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Security Badge */}
                    <div className="mt-8 flex items-center justify-center gap-3 text-slate-600">
                        <ShieldCheck size={14} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Enterprise AES-256 Encrypted</span>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
