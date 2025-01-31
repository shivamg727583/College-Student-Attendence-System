import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

function Login() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Updated login handler using the new pattern
  const teacherSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('teachers/login', data, {
        withCredentials: true, // Ensures cookies are saved
      });

      if (response.status === 200) {
        const token = response.data.token; // Assuming token is returned
        localStorage.setItem('token', token); // Store token in localStorage
        dispatch(login({ token ,role:'teacher'})); // Update Redux state with the token
        toast.success('Login Successful!');
        navigate('/teacher/dashboard'); // Redirect to teacher's dashboard
        reset(); // Reset the form after successful login
      }
    } catch (error) {
      console.error('Login Error:', error);
      if (error.response?.data) {
        toast.error(error.response.data.message || 'Invalid Credentials');
      } else {
        toast.warn('Something went wrong');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mt-10 mx-auto p-10 shadow-md">
      <h1 className="text-center font-bold text-3xl">Teacher Login</h1>
      <form
        className="p-5 rounded-xl flex flex-col"
        onSubmit={handleSubmit(teacherSubmit)}
      >
        {/* Email Field */}
        <input
          type="email"
          placeholder="Enter email"
          {...register('email', { 
            required: 'Email is required', 
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
              message: 'Please enter a valid email'
            }
          })}
          className="p-3 rounded outline-none shadow border mt-3"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        {/* Password Field */}
        <input
          type="password"
          placeholder="Enter password"
          {...register('password', { 
            required: 'Password is required' 
          })}
          className="p-3 rounded outline-none shadow border mt-3"
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}

        {/* Submit Button */}
        <button
          type="submit"
          className={`p-3 rounded-xl font-semibold text-white mt-4 ${loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <p className="text-center capitalize">
        If you are an admin, then{' '}
        <Link to="/admin/login" className="text-blue-500 font-medium">
          Login
        </Link>{' '}
        here
      </p>
    </div>
  );
}

export default Login;
