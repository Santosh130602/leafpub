import './App.css'


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Author pages
import AuthorDashboard from './pages/author/AuthorDashboard';
import MyBooks from './pages/author/MyBooks';
import SubmitTicket from './pages/author/SubmitTicket';
import MyTickets from './pages/author/MyTickets';
import TicketDetail from './pages/author/TicketDetail';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TicketQueue from './pages/admin/TicketQueue';
import AdminTicketDetail from './pages/admin/AdminTicketDetail';
import AuthorsList from './pages/admin/AuthorsList';

// Layout components
import AuthorLayout from './components/common/AuthorLayout';
import AdminLayout from './components/common/AdminLayout';



// Route guard: redirect to login if not authenticated
const PrivateRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate portal
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/author'} replace />;
  }

  return children;
};

// Root redirect based on role
const RootRedirect = () => {
  const { isLoggedIn, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/author" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '8px'
            }
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Author routes */}
          <Route
            path="/author"
            element={
              <PrivateRoute requiredRole="author">
                <AuthorLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AuthorDashboard />} />
            <Route path="books" element={<MyBooks />} />
            <Route path="tickets" element={<MyTickets />} />
            <Route path="tickets/new" element={<SubmitTicket />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="tickets" element={<TicketQueue />} />
            <Route path="tickets/:id" element={<AdminTicketDetail />} />
            <Route path="authors" element={<AuthorsList />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
