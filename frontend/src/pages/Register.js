import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
        <div className="min-h-screen flex flex-col bg-slate-900">
            <Navbar />
            <main 
                className="flex-1 flex items-center justify-center p-5 pt-[72px] relative overflow-hidden bg-cover bg-center min-h-[100vh]"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                {/* Premium Dark Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                
                <div className="bg-white rounded-[24px] w-full max-w-[340px] p-6 z-[1] shadow-2xl relative border border-white/20">
                    <div className="text-center mb-4">
                        <img src={logoIcon} alt="UniFlow Logo" className="w-[40px] h-auto mx-auto mb-2" />
                        <h2 className="text-lg font-black mb-0.5 tracking-tight text-slate-900">Join UniFlow</h2>
                        <p className="font-bold text-[9px] uppercase tracking-widest text-slate-400">Global Learning Community</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-2.5">
                        <div>
                            <label className="block text-[8px] font-black text-slate-800 mb-0.5 uppercase tracking-widest">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3.5 text-[13px] font-semibold focus:outline-none focus:ring-4 focus:ring-[#FFD166]/20 focus:border-[#FFD166] transition-all"
                                placeholder="Your Name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[8px] font-black text-slate-800 mb-0.5 uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3.5 text-[13px] font-semibold focus:outline-none focus:ring-4 focus:ring-[#FFD166]/20 focus:border-[#FFD166] transition-all"
                                placeholder="name@university.edu"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-[8px] font-black text-slate-800 mb-0.5 uppercase tracking-widest">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3.5 text-[13px] font-semibold focus:outline-none focus:ring-4 focus:ring-[#FFD166]/20 focus:border-[#FFD166] transition-all"
                                    placeholder="••••••••"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[8px] font-black text-slate-800 mb-0.5 uppercase tracking-widest">Confirm</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3.5 text-[13px] font-semibold focus:outline-none focus:ring-4 focus:ring-[#FFD166]/20 focus:border-[#FFD166] transition-all"
                                    placeholder="••••••••"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[8px] font-black text-slate-800 mb-0.5 uppercase tracking-widest">Account Role</label>
                            <select 
                                name="role" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3.5 text-[13px] font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#FFD166]/20 focus:border-[#FFD166] transition-all" 
                                value={user.role} 
                                onChange={handleChange}
                            >
                                <option value="USER">User</option>
                                <option value="TECHNICIAN">Technician</option>
                            </select>
                        </div>

                        {error && (
                            <div className="text-[10px] text-rose-600 font-bold mb-1 p-2 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="bg-[#FFD166] text-slate-900 w-full py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#FFC033] hover:scale-[1.02] transition-all shadow-lg shadow-[#FFD166]/30 mt-1" 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Register'}
                        </button>
                    </form>

                    <div className="flex items-center my-3">
                        <div className="flex-1 h-px bg-slate-100"></div>
                        <span className="px-3 text-[8px] text-slate-400 font-black uppercase tracking-widest">OR JOIN WITH</span>
                        <div className="flex-1 h-px bg-slate-100"></div>
                    </div>

                    <a 
                        href="http://localhost:8081/oauth2/authorization/google" 
                        className="flex items-center justify-center w-full py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-slate-100 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all"
                    >
                        <img 
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                            alt="Google" 
                            className="w-4 h-4 mr-2"
                        />
                        Google Sign Up
                    </a>

                    <div className="text-center mt-4 pt-3 border-t border-slate-50">
                        <span className="text-slate-500 text-[9px] font-bold">MEMBER ALREADY?</span> 
                        <Link to={searchParams.get('redirect') ? `/login?redirect=${searchParams.get('redirect')}` : "/login"} className="text-[#5B5FEF] font-black uppercase tracking-widest text-[10px] ml-2 hover:text-slate-900 transition-colors">Portal Login</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
