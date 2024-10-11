// Inside TeacherDashboard.js and AdminDashboard.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/actions';

const dispatch = useDispatch();
const navigate = useNavigate();

const handleLogout = () => {
  dispatch(logout()); // Reset user login state
  navigate('/login'); // Redirect to login page
};

return (
 
);
