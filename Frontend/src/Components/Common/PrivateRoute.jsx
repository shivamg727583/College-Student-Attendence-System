// src/components/Common/PrivateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Example auth logic

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
