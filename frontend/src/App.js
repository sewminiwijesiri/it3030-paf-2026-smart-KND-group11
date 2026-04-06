import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminTest from './pages/AdminTest';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
          <Route path="/admin" element={<AdminTest />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
