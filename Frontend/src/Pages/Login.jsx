// Components/LoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../Store/action';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('teacher'); // Default to 'teacher'
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Dispatch the login action based on selected role (admin/teacher)
    dispatch(login(role));

    // Navigate to the appropriate dashboard after login
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'teacher') {
      navigate('/teacher/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Role</label>
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
