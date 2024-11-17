import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLogin from '../Auth/AdminLogin';
import Login from '../Auth/Login';
import Index from '../Index';
import AdminDashboard from '../Admin/AdminDashboard';
import TeacherDashboard from '../Teacher/TeacherDashboard';

function AppRouter() {
  return (
    <>
      <Routes>
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/teacher/login' element={<Login />} />
        <Route path='/' element={<Index />} />
        <Route path='/admin/*' element={<AdminDashboard />} />
        <Route path='/teacher/*' element={<TeacherDashboard />} />
      </Routes>
    </>
  );
}

export default AppRouter;
