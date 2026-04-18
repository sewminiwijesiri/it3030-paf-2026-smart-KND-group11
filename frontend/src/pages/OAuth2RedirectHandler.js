import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');
        const role = getUrlParameter('role');
        const name = getUrlParameter('name');
        const email = getUrlParameter('email');

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            if (name) localStorage.setItem('name', name);
            if (email) localStorage.setItem('email', email);
            
            // Redirect based on role
            if (role === 'ADMIN') {
                navigate('/admin-dashboard');
            } else if (role === 'TECHNICIAN') {
                navigate('/technician-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } else {
            console.error('No token found in redirect URL');
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>Completing your login...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;
