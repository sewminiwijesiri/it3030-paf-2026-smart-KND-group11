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
        <div className="min-h-screen flex flex-col bg-bg-soft">
            <Navbar />
            <main className="flex-1 flex items-center justify-center py-12 px-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-60 z-0 bg-sky-50"></div>
                
                <div className="card animate-up glass w-full max-w-[440px] p-8 z-[1] shadow-2xl">
                    <div className="text-center mb-8">
                        <img src={logoIcon} alt="UniFlow Logo" className="w-[64px] h-auto mx-auto mb-6" />
                        <h2 className="text-2xl font-extrabold mb-1 tracking-tight text-slate-900">Join UniFlow</h2>
                        <p className="text-text-muted text-sm">Global learning community</p>
                    </div>

                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="input-field !py-2.5 !px-3.5 !text-sm"
                                placeholder="Your Name"
                                value={user.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="input-field !py-2.5 !px-3.5 !text-sm"
                                placeholder="name@university.edu"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="input-field !py-2.5 !px-3.5 !text-sm"
                                    placeholder="••••••••"
                                    value={user.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="input-field !py-2.5 !px-3.5 !text-sm"
                                    placeholder="••••••••"
                                    value={user.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Account Role</label>
                            <select 
                                name="role" 
                                className="input-field !py-2.5 !px-3.5 !text-sm cursor-pointer" 
                                value={user.role} 
                                onChange={handleChange}
                            >
                                <option value="USER">Student / Standard User</option>
                                <option value="TECHNICIAN">Technician / Researcher</option>
                            </select>
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
                            {loading ? 'Processing...' : 'Register'}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="px-3 text-[10px] text-slate-400 font-bold uppercase">OR JOIN WITH</span>
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
                        Google Sign Up
                    </a>

                    <div className="text-center mt-8 text-slate-500 text-sm">
                        Member already? <Link to="/login" className="text-primary font-bold no-underline ml-1">Log in</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
