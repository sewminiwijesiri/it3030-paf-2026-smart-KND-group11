import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';
import showcaseImg from '../assets/campus-showcase.png';

const Home = () => {
    // Local assets for primary sections, Unsplash for secondary ones
    const aboutImg = showcaseImg;
    const resourceImgs = [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main>
                {/* 1. HERO SECTION - Premium Local Background */}
                <section 
                    id="hero"
                    className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: `url(${heroBg})` }}
                >
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                    
                    <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
                        <div className="animate-up max-w-[850px] mx-auto">
                            <p className="text-[#FFD166] font-black text-xs uppercase tracking-[0.4em] mb-6 drop-shadow-md">
                                Next-Generation Campus Management
                            </p>
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tighter">
                                Master Your Future <br/> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                    With UniFlow
                                </span>
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
                                <Link to="/register" className="bg-[#FFD166] text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-[#FFD166]/20">
                                    Start Learning
                                </Link>
                                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dark Feature Bar Overlay */}
                    <div id="features" className="absolute bottom-0 left-0 right-0 bg-[#0F172A] py-12 z-20 border-t border-white/5">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {[
                                    { title: 'SMART BOOKING', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', desc: 'Reserved seating and equipment at your fingertips.' },
                                    { title: 'MAINTENANCE HUB', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', desc: 'Instant reporting and resolution of campus issues.' },
                                    { title: 'ROLE CONTROL', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', desc: 'Secure, role-based access for students and staff.' },
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-[#FFD166] group-hover:border-transparent transition-all">
                                            <svg className="w-6 h-6 text-[#FFD166] group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-1">{feature.title}</h3>
                                            <p className="text-slate-400 text-[11px] font-medium leading-relaxed uppercase opacity-70 tracking-tight">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. ABOUT SECTION - UniFlow Insights */}
                <section id="about-us" className="py-24 bg-white">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                            <div className="animate-up max-w-[550px]">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight">
                                    UniFlow Platform
                                </h2>
                                <p className="text-[15px] text-slate-400 mb-6 leading-relaxed">
                                    For years, UniFlow has empowered campuses with digital transformation, managing more than 1,700 resources and saving thousands of hours in administrative effort across higher education institutions.
                                </p>
                                <p className="text-[15px] text-slate-400 mb-10 leading-relaxed">
                                    We are home to an intricate network of students, technicians, and expert faculty representing an interconnected community. We are proud of our seamless operational ethos, and the way our platform supports academic achievement every single day.
                                </p>
                                <div className="pt-2">
                                    <span 
                                        className="text-4xl text-slate-800" 
                                        style={{ fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive' }}
                                    >
                                        The UniFlow Team
                                    </span>
                                </div>
                            </div>
                            <div className="relative">
                                <img 
                                    src={aboutImg} 
                                    alt="Academic Excellence" 
                                    className="relative z-10 w-full object-cover shadow-md h-[400px] md:h-[500px]" 
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. STATISTICS BAR - Vibrant Accent */}
                <section className="bg-[#FFCC29] py-20 relative overflow-hidden">
                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                            {[
                                { val: '5500', label: 'People Active' },
                                { val: '280+', label: 'Managed Assets' },
                                { val: '12+', label: 'Years Experience' },
                                { val: '100%', label: 'Efficiency Goal' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <h3 className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter italic">{stat.val}</h3>
                                    <p className="text-slate-800 font-black text-[10px] uppercase tracking-widest opacity-70">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                </section>

                {/* 4. RESOURCE HIGHLIGHTS - eSchool Themed Cards */}
                <section id="catalogue" className="py-24 bg-white border-t border-slate-50">
                    <div className="container mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Explore Campus Resources</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Advanced Laboratories', category: 'Science & Tech', price: 'Free', img: resourceImgs[0], rating: 4.9 },
                                { title: 'Creative Studios', category: 'Arts & Media', price: 'Bookable', img: resourceImgs[1], rating: 4.8 },
                                { title: 'Collaborative Spaces', category: 'General', price: 'Open', img: resourceImgs[2], rating: 5.0 },
                            ].map((res, i) => (
                                <div key={i} className="bg-white rounded border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-[240px]">
                                        <img src={res.img} alt={res.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-[#3f4175] text-white px-3 py-1 text-[11px] font-bold shadow-md">
                                                {res.price}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                                <img src={`https://ui-avatars.com/api/?name=Campus+System&background=f1f5f9&color=64748b`} alt="Admin" />
                                            </div>
                                            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{res.category}</p>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{res.title}</h3>
                                        
                                        <div className="flex items-center gap-1 mb-8">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(res.rating) ? 'text-[#FFD166]' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="text-xs text-slate-500 font-medium ml-1">({res.rating})</span>
                                        </div>
                                        
                                        <div className="flex justify-start">
                                            <button className="bg-[#FFD166] text-slate-900 px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest hover:scale-105 transition-transform">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            
            <footer id="contact">
                <Footer />
            </footer>
        </div>
    );
};

export default Home;

