import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../assets/uniflow-icon.svg';

const Footer = () => {
    return (
        <footer style={{ 
            background: 'var(--text-main)', 
            color: 'rgba(255, 255, 255, 0.6)', 
            padding: '100px 0 40px', 
            position: 'relative' 
        }}>
            <div className="container">
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                    gap: '4rem', 
                    marginBottom: '80px' 
                }}>
                    <div style={{ maxWidth: '400px' }}>
                        <Link to="/" style={{ 
                            fontSize: '1.8rem', 
                            fontWeight: '800', 
                            color: 'white', 
                            textDecoration: 'none', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '1.5rem' 
                        }}>
                            <img src={logoIcon} alt="UniFlow" style={{ width: '45px', height: 'auto', filter: 'brightness(0) invert(1)' }} />
                            UniFlow
                        </Link>
                        <p style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                            Rethinking global education through technology and creative problem solving. Join our network of over 1.2 million students worldwide.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            {['LinkedIn', 'X', 'Github'].map((social, i) => (
                                <Link key={i} to="/" style={{ 
                                    padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', 
                                    borderRadius: '8px', color: 'white', textDecoration: 'none', 
                                    fontSize: '0.8rem', fontWeight: '600', transition: 'var(--transition)'
                                }}>
                                    {social}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.1rem', letterSpacing: '1px' }}>EXPLORE</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem' }}>
                            {['Our Vision', 'Research Labs', 'Global Events', 'Success Stories'].map((item, i) => (
                                <li key={i}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.1rem', letterSpacing: '1px' }}>ACADEMICS</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem' }}>
                            {['Computer Science', 'Fine Arts', 'Data Analytics', 'Modern Ethics'].map((item, i) => (
                                <li key={i}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.1rem', letterSpacing: '1px' }}>CONNECT</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.9rem' }}>
                            <li>📧 hi@uniflow.tech</li>
                            <li>📍 Silicon Valley, CA</li>
                            <li>📞 +1 800 UNIFLOW</li>
                        </ul>
                    </div>
                </div>

                <div style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
                    paddingTop: '40px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    fontSize: '0.85rem' 
                }}>
                    <p>© 2026 UniFlow University. Precision-built for the future.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Internal Portal</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
