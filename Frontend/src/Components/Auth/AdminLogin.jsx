import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useDispatch } from 'react-redux';
import axios from '../../api/axios';
import { login } from '../../redux/authSlice'; // Import login action
import { toast } from 'react-toastify';

function AdminLogin() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting after successful login

  const adminSubmit = async (data) => {
    setLoading(true); // Start loading
    console.log(data);

    try {
      // Simulated API call (Replace with actual API request)
      const response = await axios.post('/admin/login', data, {
        withCredentials: true, // Ensures cookies are saved
      });

      const result = response.data;
      
      console.log("Result : ",result);
      if (response.status === 200) {
        dispatch(login({ token:result.token, role: 'admin' })); // Update Redux state
        localStorage.setItem('Admintoken', result.token); // Store token in localStorage
        toast.success('Login Successful!');
        reset();
        navigate('/admin/dashboard'); // Redirect to dashboard
      } else {
        
        toast.error('Invalid credentials');
       
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Admin Login Error:', error);
      
    }

    setLoading(false); // Stop loading
     // Reset form
  };

  return (
    <div className="max-w-2xl mt-10 mx-auto p-10 shadow-md">
      <h1 className="text-center font-bold text-3xl">Admin Login</h1>
      <form className="p-5 rounded-xl flex flex-col" onSubmit={handleSubmit(adminSubmit)}>
        <input
          type="email"
          placeholder="Enter email"
          {...register('email')}
          className="p-3 rounded outline-none shadow border mt-3"
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          {...register('password')}
          className="p-3 rounded outline-none shadow border mt-3"
          required
        />
        <button
          type="submit"
          className={`p-3 rounded-xl font-semibold text-white mt-4 ${
            loading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-600'
          }`}
          disabled={loading} // Disable button during loading
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
        If you are a teacher, then{' '}
        <Link to="/teachers/login" className="text-blue-500 font-medium">
          Login
        </Link>{' '}
        here
      </p>
    </div>
  );
}

export default AdminLogin;
