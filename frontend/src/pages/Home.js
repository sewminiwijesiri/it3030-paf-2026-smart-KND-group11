import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <section className="container" style={{ textAlign: 'center', marginTop: '6rem', marginBottom: '8rem' }}>
          <div className="animate-fade">
            <h1 style={{ 
              fontSize: '4.5rem', 
              fontWeight: '800', 
              marginBottom: '1.5rem', 
              lineHeight: '1.1',
              background: 'linear-gradient(to right, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px'
            }}>
              Connect Your Teams <br />With UniFlow
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-secondary)', 
              maxWidth: '700px', 
              margin: '0 auto 2.5rem', 
              fontWeight: '400' 
            }}>
              A premium management system that combines elegant design with seamless JWT authentication and role-based access.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Join Today
              </Link>
              <button className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Learn More
              </button>
            </div>
          </div>
        </section>

        <section className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem', 
          marginBottom: '8rem' 
        }}>
          {[
            { title: 'Smart Auth', desc: 'Secure JWT implementation with MongoDB integration.', icon: '🔐' },
            { title: 'Modern UI', desc: 'Sleek, responsive dark-mode design with Inter typography.', icon: '✨' },
            { title: 'Scalable', desc: 'Built on Spring Boot & React for high performance.', icon: '🚀' }
          ].map((feature, i) => (
            <div key={i} className="card glass animate-fade" style={{ 
              animationDelay: `${i * 0.2}s`, 
              padding: '2.5rem', 
              transition: 'var(--transition)',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
