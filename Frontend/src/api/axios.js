import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/';  // Replace with your backend API URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Add an interceptor to add the token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Admintoken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
