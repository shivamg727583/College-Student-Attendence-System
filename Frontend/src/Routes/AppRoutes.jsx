// Router.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../Pages/Login';
import AdminDashboard from '../Components/Admin/Dashboard';
import TeacherDashboard from '../Components/Teacher/Dashboard';
import { useSelector } from 'react-redux';

const AppRouter = () => {
  const { isLoggedIn, userType } = useSelector((state) => state); // Get the logged-in state and user type

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Dashboard */}
        {isLoggedIn && userType === 'admin' && (
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        )}

        {/* Teacher Dashboard */}
        {isLoggedIn && userType === 'teacher' && (
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        )}

        {/* Redirect to login if user is not authenticated */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
