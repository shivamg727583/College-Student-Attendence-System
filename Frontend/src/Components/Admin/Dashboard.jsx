import React from "react";
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline"; // Updated import for Heroicons v2
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const dispatch = useDispatch();
const navigate = useNavigate();

const handleLogout = () => {
  dispatch(logout()); // Reset user login state
  navigate('/login'); // Redirect to login page
};
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-800 text-white flex flex-col">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="flex flex-col mt-6 space-y-4 px-6">
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <HomeIcon className="w-6 h-6" />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <UsersIcon className="w-6 h-6" />
            <span>Manage Users</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <CalendarIcon className="w-6 h-6" />
            <span>Classes</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <CogIcon className="w-6 h-6" />
            <span>Settings</span>
          </a>
          <button
    className="flex items-center space-x-3 text-gray-300 hover:text-white transition"
    onClick={handleLogout}
  >
    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
    <span>Logout</span>
  </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome, Admin</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total Students</h3>
            <p className="text-gray-500 text-3xl mt-4">1,200</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total Teachers</h3>
            <p className="text-gray-500 text-3xl mt-4">80</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Total Classes</h3>
            <p className="text-gray-500 text-3xl mt-4">45</p>
          </div>
        </div>

        {/* Additional Content (Optional) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Some other content like charts or tables can go here */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">Recent Activities</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-gray-700">Teacher A created a new class</li>
              <li className="text-gray-700">Student B marked attendance</li>
              <li className="text-gray-700">Admin C updated a schedule</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">System Notifications</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-gray-700">System backup completed</li>
              <li className="text-gray-700">Password reset for User D</li>
              <li className="text-gray-700">Scheduled maintenance upcoming</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
