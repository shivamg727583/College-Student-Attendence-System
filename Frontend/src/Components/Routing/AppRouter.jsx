import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "../Auth/AdminLogin";
import Login from "../Auth/Login";
import Index from "../Index";
import AdminDashboard from "../Admin/AdminDashboard";
import TeacherDashboard from "../Teacher/TeacherDashboard";
import ProtectedRoute from "./ProtectedRoutes";
import Unauthorized from "../Others/Unauthorized";
import { useDispatch } from "react-redux";
import { login, logout } from "../../redux/authSlice";

function AppRouter() {
  const dispatch = useDispatch();

  // Check if there's a saved token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch(login({ token: storedToken }));
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/teachers/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes for Admin */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>

      {/* Protected Routes for Teacher */}
      <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
        <Route path="/teacher/*" element={<TeacherDashboard />} />
      </Route>

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;
