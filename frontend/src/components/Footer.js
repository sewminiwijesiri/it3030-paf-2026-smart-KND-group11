import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Facebook, 
    Twitter, 
    Instagram, 
    Github, 
    ArrowUpRight,
    Globe,
    Shield,
    Zap
} from 'lucide-react';
import logoIcon from '../assets/uniflow-icon.svg';

const Footer = () => {
    return (
        <footer className="bg-[#0F172A] text-slate-400 py-24 pb-12 border-t border-white/5 relative overflow-hidden">
            {/* Decorative Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-[#FFD166]/5 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="inline-flex items-center gap-4 mb-8 group cursor-pointer">
                            <div className="p-2.5 rounded-[14px] bg-white/10 border border-white/10 group-hover:bg-[#FFD166] transition-all duration-500">
                                <img src={logoIcon} alt="UniFlow" className="w-[32px] h-auto group-hover:invert" />
                            </div>
                            <span className="text-white text-3xl font-black tracking-tighter">UniFlow</span>
                        </div>
                        <p className="max-w-[440px] text-[15px] leading-relaxed text-slate-400 mb-10 font-medium">
                            The enterprise-grade ecosystem for campus resource management. Streamlining technical assets, facility booking, and team synchronization with mathematical precision.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, label: 'Facebook' },
                                { icon: Twitter, label: 'Twitter' },
                                { icon: Instagram, label: 'Instagram' },
                                { icon: Github, label: 'GitHub' }
                            ].map((social, i) => (
                                <Link 
                                    key={i} 
                                    to="/" 
                                    className="w-12 h-12 rounded-[16px] bg-white/5 flex items-center justify-center text-white transition-all duration-500 border border-white/5 hover:bg-[#FFD166] hover:text-slate-900 hover:border-[#FFD166] hover:-translate-y-1.5"
                                >
                                    <social.icon size={20} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#FFD166] rounded-full"></div>
                            Platform
                        </h4>
                        <ul className="space-y-4">
                            {['Ecosystem', 'Resource Inventory', 'Incident Control', 'API Documentation'].map((link, i) => (
                                <li key={i}>
                                    <Link to="/" className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-between group">
                                        {link}
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#5B5FEF] rounded-full"></div>
                            Security
                        </h4>
                        <div className="space-y-6">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default">
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield size={16} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">TLS 1.3 Secure</span>
                                </div>
                                <p className="text-[10px] font-medium text-slate-500 leading-normal">All data streams are encrypted with institutional grade protocols.</p>
                            </div>
                            <div className="flex items-center gap-4 px-2">
                                <Globe size={14} className="text-slate-600" />
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Regional Node: SL-WEST</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        <p>© 2026 UNIFLOW CORE</p>
                        <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                        <p>INSTITUTIONAL LICENSE</p>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/5">
                        <Zap size={12} className="text-[#FFD166]" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Status: Nominal Operations</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
