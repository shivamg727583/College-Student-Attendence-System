import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authSlice';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  
  // For mobile toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logoutHandler = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      try {
        const response = role === 'admin' 
          ? await axios.get('/admin/logout') 
          : await axios.get('/teachers/logout');
          
        if (response.status === 200) {
          dispatch(logout());
          localStorage.removeItem("token");
          toast.success('Logged out successfully');
          navigate('/'); // Redirect after logout
        } else {
          toast.error('Logout failed');
        }
      } catch (error) {
        toast.error('Logout failed');
        console.error('Logout error', error);
      }
    }
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">ATMS</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium capitalize">Hello, {user?.name || role}</span>
              <button
                onClick={logoutHandler}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/admin/login" className="text-blue-600 hover:text-blue-800">Admin Login</NavLink>
              <NavLink to="/teachers/login" className="text-blue-600 hover:text-blue-800">Teachers Login</NavLink>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="lg:hidden text-gray-800 text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white w-full py-4 flex flex-col items-center space-y-4 shadow-md">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 font-medium capitalize">Hello, {user?.name || role}</span>
             
              <button
                onClick={() => { logoutHandler(); setIsMenuOpen(false); }}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/admin/login" className="text-blue-600 hover:text-blue-800" onClick={() => setIsMenuOpen(false)}>Admin Login</NavLink>
              <NavLink to="/teachers/login" className="text-blue-600 hover:text-blue-800" onClick={() => setIsMenuOpen(false)}>Teachers Login</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
