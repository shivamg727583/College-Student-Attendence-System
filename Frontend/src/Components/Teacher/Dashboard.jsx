import React from "react";
import {
  CalendarIcon,
  
  AcademicCapIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline"; // Heroicons v2 for modern icons
import { ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {


  const dispatch = useDispatch();
const navigate = useNavigate();

const handleLogout = () => {
  dispatch(logout()); // Reset user login state
  navigate('/login'); // Redirect to login page
};

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-blue-800 text-white flex flex-col">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
        </div>
        <nav className="flex flex-col mt-6 space-y-4 px-6">
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <CalendarIcon className="w-6 h-6" />
            <span>Class Schedule</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <ArrowBack className="w-6 h-6" />
            <span>Attendance</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <AcademicCapIcon className="w-6 h-6" />
            <span>My Classes</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition">
            <UserCircleIcon className="w-6 h-6" />
            <span>Profile</span>
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
          <h1 className="text-3xl font-semibold text-gray-800">Welcome, Teacher</h1>
        </div>

        {/* Class Schedule */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Today's Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* Class Card 1 */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Math 101</h3>
              <p className="text-gray-600">Time: 9:00 AM - 10:00 AM</p>
              <p className="text-gray-600">Room: 202</p>
            </div>
            {/* Class Card 2 */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Physics 201</h3>
              <p className="text-gray-600">Time: 11:00 AM - 12:30 PM</p>
              <p className="text-gray-600">Room: 305</p>
            </div>
            {/* Class Card 3 */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">Computer Science 301</h3>
              <p className="text-gray-600">Time: 2:00 PM - 3:30 PM</p>
              <p className="text-gray-600">Room: 402</p>
            </div>
          </div>
        </div>

        {/* Attendance Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Mark Attendance</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Student Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">John Doe</td>
                  <td className="px-4 py-2">
                    <select className="border border-gray-300 p-2 rounded-md">
                      <option>Present</option>
                      <option>Absent</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Jane Smith</td>
                  <td className="px-4 py-2">
                    <select className="border border-gray-300 p-2 rounded-md">
                      <option>Present</option>
                      <option>Absent</option>
                    </select>
                  </td>
                </tr>
                {/* More student rows can go here */}
              </tbody>
            </table>
            <div className="mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
