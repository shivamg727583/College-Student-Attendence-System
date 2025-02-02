import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';

function Sidenav() {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the dropdown menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger Icon for Mobile */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-20  right-2 z-20 p-2 bg-blue-100 text-white rounded focus:outline-none"
      >
       {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Menu */}
      <div
        className={`fixed lg:relative top-0 left-0 z-10 w-[70%] lg:w-[100%] h-full bg-gray-100 shadow-lg p-4 pr-0 transition-transform  duration-300 ease-in-out ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full lg:translate-x-0"
        }`}
      >
        <h1 className="font-bold text-2xl mt-4">Admin Dashboard</h1>
        <ul className="w-full flex flex-col gap-3 mt-6">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
          `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
            isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
              }`
            }
          >
            <i className="ri-presentation-fill"></i>
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/manage-teachers"
            className={({ isActive }) =>
              `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
                isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
              }`
            }
          >
            <i className="ri-team-fill"></i>
            Manage Teachers
          </NavLink>
          <NavLink
            to="/admin/manage-classes"
            className={({ isActive }) =>
              `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
                isActive ? "bg-white text-blue-500 rounded-r-none" : "hover:bg-blue-500 hover:text-white hover:rounded-r-none"
              }`
            }
          >
            <i className="ri-presentation-fill"></i>
            Manage Classes
          </NavLink>
          <NavLink
            to="/admin/manage-students"
            className={({ isActive }) =>
              `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
                isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
              }`
            }
          >
            <i className="ri-group-3-fill"></i>
            Manage Students
          </NavLink>
          <NavLink
            to="/admin/manage-timetable"
            className={({ isActive }) =>
              `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
                isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
              }`
            }
          >
            <i className="ri-calendar-schedule-fill"></i>
            Manage Timetable
          </NavLink>
          <NavLink
            to="/admin/manage-attendence"
            className={({ isActive }) =>
              `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
                isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
              }`
            }
          >
            <i className="ri-file-paper-fill"></i>
            Manage Attendance
          </NavLink>
          <NavLink
            to="/admin/logout"
            className={({ isActive }) =>
              `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
                isActive ? 'bg-white text-red-500 rounded-r-none' : 'hover:bg-red-500 hover:text-white hover:rounded-r-none'
              }`
            }
          >
            <i className="ri-logout-box-fill"></i>
            Logout
          </NavLink>
        </ul>
      </div>

      {/* Overlay for mobile when menu is open */}
      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black opacity-50 z-5 lg:hidden"
        ></div>
      )}
    </div>
  );
}

export default Sidenav;
