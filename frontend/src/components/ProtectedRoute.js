import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        // Not logged in -> Redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Logged in but wrong role -> Show access denied
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

export default ProtectedRoute;
