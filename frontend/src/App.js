import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminResourceManagement from './pages/AdminResourceManagement';
import AdminUserManagement from './pages/AdminUserManagement';
import UserDashboard from './pages/UserDashboard';
import UserResourceCatalogue from './pages/UserResourceCatalogue';
import UserProfile from './pages/UserProfile';
import TechnicianDashboard from './pages/TechnicianDashboard';
import TechnicianTasks from './pages/TechnicianTasks';
import TechnicianReports from './pages/TechnicianReports';
import TicketSubmission from './pages/TicketSubmission';
import MyTickets from './pages/MyTickets';
import TicketDetails from './pages/TicketDetails';
import AdminMaintenance from './pages/AdminMaintenance';
import AdminTest from './pages/AdminTest';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import AccessDenied from './pages/AccessDenied';
import ProtectedRoute from './components/ProtectedRoute';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';
import VerifyBooking from './pages/VerifyBooking';
import { Toaster } from 'react-hot-toast';
import NotificationListener from './components/NotificationListener';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <NotificationListener />
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
            path="/admin/users"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUserManagement /></ProtectedRoute>}
          />
          <Route
            path="/admin/maintenance"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminMaintenance /></ProtectedRoute>}
          />
          <Route
            path="/user-dashboard"
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><UserDashboard /></ProtectedRoute>}
          />
          <Route
            path="/my-tickets"
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><MyTickets /></ProtectedRoute>}
          />
          <Route
            path="/report-incident"
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><TicketSubmission /></ProtectedRoute>}
          />
          <Route
            path="/tickets/:id"
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><TicketDetails /></ProtectedRoute>}
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
            path="/technician/tasks"
            element={<ProtectedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}><TechnicianTasks /></ProtectedRoute>}
          />
          <Route 
            path="/my-bookings" 
            element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'TECHNICIAN']}><MyBookings /></ProtectedRoute>} 
          />
          <Route 
            path="/admin-bookings" 
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminBookings /></ProtectedRoute>} 
          />
          
          <Route
            path="/technician/reports"
            element={<ProtectedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}><TechnicianReports /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminTest /></ProtectedRoute>}
          />

          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          
          {/* Public Routes */}
          <Route path="/booking/verify/:bookingId" element={<VerifyBooking />} />
        </Routes>
      </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
