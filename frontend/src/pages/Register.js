import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, Mail, Lock, UserPlus, ShieldCheck, ArrowLeft, Sparkles } from 'lucide-react';
import logoIcon from '../assets/uniflow-icon.svg';
import heroBg from '../assets/hero-bg.png';

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
    const [searchParams] = useSearchParams();

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
            const redirectPath = searchParams.get('redirect');
            navigate(redirectPath ? `/login?redirect=${redirectPath}` : '/login');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                    <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#5B5FEF]/10 blur-[130px] rounded-full animate-pulse"></div>
                </div>
                
                <div className="w-full max-w-[360px] z-10 relative group">
                    {/* Glassmorphism Card */}
                    <div className="bg-white/5 backdrop-blur-2xl rounded-[40px] p-8 md:p-10 border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 hover:border-white/20">
                        {/* Decorative Gradient Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5B5FEF] to-transparent opacity-50"></div>

                        <div className="text-center mb-8">
                            <div className="relative inline-block mb-4">
                                <div className="absolute inset-0 bg-[#5B5FEF] blur-lg opacity-20 animate-pulse"></div>
                                <div className="relative w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shadow-2xl">
                                    <img src={logoIcon} alt="UniFlow" className="w-7 h-auto" />
                                </div>
                            </div>
                            <h2 className="text-xl font-black mb-1 tracking-tight text-white flex items-center justify-center gap-2">
                                Join System <Sparkles className="w-4 h-4 text-[#FFD166]" />
                            </h2>
                            <p className="font-bold text-[8px] uppercase tracking-[0.4em] text-slate-500">Initialize Digital Identity</p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <User size={10} className="text-[#FFD166]" />
                                    Full Designation
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 px-4 text-[13px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#FFD166]/10 focus:border-[#FFD166]/30 transition-all"
                                    placeholder="Operative Name"
                                    value={user.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <Mail size={10} className="text-[#FFD166]" />
                                    Digital Mailbox
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 px-4 text-[13px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#FFD166]/10 focus:border-[#FFD166]/30 transition-all"
                                    placeholder="name@uniflow.system"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        <Lock size={10} className="text-[#FFD166]" />
                                        Key
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 px-4 text-[13px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#FFD166]/10 focus:border-[#FFD166]/30 transition-all"
                                        placeholder="••••"
                                        value={user.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                        Confirm
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 px-4 text-[13px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#FFD166]/10 focus:border-[#FFD166]/30 transition-all"
                                        placeholder="••••"
                                        value={user.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    <ShieldCheck size={10} className="text-[#FFD166]" />
                                    Access Tier
                                </label>
                                <select 
                                    name="role" 
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 px-4 text-[13px] font-bold text-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#FFD166]/10 focus:border-[#FFD166]/30 transition-all appearance-none" 
                                    value={user.role} 
                                    onChange={handleChange}
                                >
                                    <option value="USER" className="bg-[#0F172A]">Standard Operative</option>
                                    <option value="TECHNICIAN" className="bg-[#0F172A]">Technical Specialist</option>
                                </select>
                            </div>

                            {error && (
                                <div className="text-[10px] text-rose-400 font-bold p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 animate-shake">
                                    <ShieldCheck size={12} className="shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className="w-full group/btn relative mt-4"
                                disabled={loading}
                            >
                                <div className="absolute inset-0 bg-[#FFD166] blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity"></div>
                                <div className="relative bg-[#FFD166] text-slate-900 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-500">
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Begin Registration
                                            <UserPlus size={16} className="group-hover/btn:rotate-12 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="text-center mt-8 pt-6 border-t border-white/5">
                            <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest mb-3">Existing Identity?</p>
                            <Link 
                                to={searchParams.get('redirect') ? `/login?redirect=${searchParams.get('redirect')}` : "/login"} 
                                className="inline-flex items-center gap-2 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-[#FFD166] transition-all group/link"
                            >
                                <ArrowLeft size={12} className="group-hover/link:-translate-x-1 transition-transform" />
                                Return to Portal
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3 text-slate-600">
                        <ShieldCheck size={14} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em]">Protocol V2.4 SECURE</span>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
