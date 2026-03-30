import React from 'react';

const Footer = () => {
  return (
    <footer className="glass" style={{ 
      marginTop: '4rem', 
      padding: '4rem 2rem 2rem', 
      borderTop: '1px solid var(--glass-border)',
      background: 'rgba(15, 23, 42, 0.8)'
    }}>
      <div className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        <div>
          <h3 style={{ 
            color: 'var(--primary)', 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            marginBottom: '1rem' 
          }}>UniFlow</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            A modern, smart management system designed to streamline your workflows and empower collaboration across teams.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Sitemap</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Home</li>
            <li style={{ marginBottom: '0.5rem' }}>Dashboard</li>
            <li style={{ marginBottom: '0.5rem' }}>About Us</li>
            <li style={{ marginBottom: '0.5rem' }}>Services</li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Contact</h4>
          <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>support@uniflow.com</li>
            <li style={{ marginBottom: '0.5rem' }}>+1 (555) 000-0000</li>
            <li style={{ marginBottom: '0.5rem' }}>Colombo, Sri Lanka</li>
          </ul>
        </div>
      </div>
      <div className="container" style={{ 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--glass-border)',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem'
      }}>
        &copy; {new Date().getFullYear()} UniFlow. All rights reserved. Crafted for excellence.
      </div>
    </footer>
  );
};

export default Footer;
