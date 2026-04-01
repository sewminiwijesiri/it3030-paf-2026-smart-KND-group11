import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: '#022c22', color: 'rgba(255, 255, 255, 0.7)', padding: '80px 0 30px', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '60px' }}>
                    <div style={{ maxWidth: '350px' }}>
                        <Link to="/" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                            <span style={{ background: 'var(--secondary)', color: 'white', padding: '4px 10px', borderRadius: '4px' }}>U</span>
                            UniFlow
                        </Link>
                        <p style={{ lineHeight: '1.8', marginBottom: '2rem' }}>
                            Join the world's largest online learning community. Get access to thousands of courses from top-tier instructors and take your career to the next level.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['FB', 'TW', 'IG', 'LI'].map((social, i) => (
                                <Link key={i} to="/" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', transition: '0.3s' }}>
                                    {social}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.2rem' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['About Us', 'Latest Courses', 'Academic Events', 'Privacy Policy'].map((item, i) => (
                                <li key={i}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.2rem' }}>Our Services</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['Strategy', 'Data Entry', 'Financial', 'Investment'].map((item, i) => (
                                <li key={i}><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>{item}</Link></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.2rem' }}>Contact Info</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <li>📧 info@uniflow.com</li>
                            <li>📍 123 Main St, Tech City</li>
                            <li>📞 +1 (234) 567-890</li>
                        </ul>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <p>© 2024 UniFlow. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</Link>
                        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Support Center</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
