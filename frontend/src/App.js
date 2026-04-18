import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminResourceManagement from './pages/AdminResourceManagement';
import UserDashboard from './pages/UserDashboard';
import UserResourceCatalogue from './pages/UserResourceCatalogue';
import UserProfile from './pages/UserProfile';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminTest from './pages/AdminTest';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import AccessDenied from './pages/AccessDenied';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin-dashboard" 
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/resources" 
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminResourceManagement /></ProtectedRoute>} 
          />
          <Route 
            path="/user-dashboard" 
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><UserDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/book" 
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><UserResourceCatalogue /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><UserProfile /></ProtectedRoute>} 
          />
          <Route 
            path="/technician-dashboard" 
            element={<ProtectedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}><TechnicianDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTest /></ProtectedRoute>} 
          />
          
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/access-denied" element={<AccessDenied />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
