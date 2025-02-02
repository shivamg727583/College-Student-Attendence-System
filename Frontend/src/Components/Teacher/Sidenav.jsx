import React from "react";
import { Link, NavLink } from "react-router-dom";

function Sidenav() {
  return (
    <div className="w-[20%]  h-full shadow-lg rounded bg-gray-100 p-4 pr-0">
      <h1 className="font-bold text-2xl mt-4">Teacher Dashboard</h1>
      <ul className="w-full flex flex-col gap-3 mt-6">
        <NavLink  to='/teacher/dashboard' className={({ isActive }) =>
          `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
            isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
          }`
        }>
          <i class="ri-presentation-fill"></i>
          Dashboard
        </NavLink>
        <NavLink
          to="/teacher/classes"
          className={({ isActive }) =>
            `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
              isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
            }`
          }
        >
          {" "}
          <i className="ri-team-fill"></i>
          Classes
        </NavLink>
     
        <NavLink
          to="/teacher/view-attendence"
          className={({ isActive }) =>
          `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
            isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white hover:rounded-r-none'
          }`
        }
        >
          <i class="ri-group-3-fill"></i>
          View Attendence
        </NavLink>
        <NavLink to='/teacher/timetable' className={({ isActive }) =>
          `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
            isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white  hover:rounded-r-none'
          }`
        }>
          <i class="ri-calendar-schedule-fill"></i>
          timetable
        </NavLink>
        <NavLink  to='/teacher/attendence' className={({ isActive }) =>
          `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
            isActive ? 'bg-white text-blue-500 rounded-r-none' : 'hover:bg-blue-500 hover:text-white  hover:rounded-r-none'
          }`
        }>
          <i class="ri-file-paper-fill"></i>
          Take Attendence
        </NavLink>

        <NavLink  to='/teacher/logout' className={({ isActive }) =>
          `text-lg font-medium flex gap-2 items-center w-full px-10 py-4 rounded-xl transition duration-300 ${
            isActive ? 'bg-white text-red-500 rounded-r-none' : 'hover:bg-red-500 hover:text-white hover:rounded-r-none'
          }`
        }>
         <i class="ri-logout-box-fill"></i>
          Logout
        </NavLink>
      </ul>
    </div>
  );
}

export default Sidenav;
