import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import UploadPrescription from './pages/UploadPrescription.jsx';
import PasswordResetRequest from './pages/PasswordResetRequest.jsx';
import PasswordReset from './pages/PasswordReset.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import NotificationCenter from './pages/NotificationCenter.jsx';
import NotificationPreferences from './pages/NotificationPreferences.jsx';
import NotificationPermissionTest from './pages/NotificationPermissionTest.jsx';
import Landing from './pages/Landing.jsx';
import Reports from './pages/Reports.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  // Use useLocation inside a wrapper component
  // const location = useLocation();
  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary>
        {/* Always show Navbar on all pages */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><UploadPrescription /></PrivateRoute>} />
          <Route path="/request-password-reset" element={<PasswordResetRequest />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationCenter /></PrivateRoute>} />
          <Route path="/notification-preferences" element={<PrivateRoute><NotificationPreferences /></PrivateRoute>} />
          <Route path="/notification-permission-test" element={<PrivateRoute><NotificationPermissionTest /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ErrorBoundary>
    </ChakraProvider>
  );
}

// Wrap App with Router to provide useLocation
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;