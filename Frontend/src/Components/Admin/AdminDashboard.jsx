import Navbar from '../Others/Navbar';
import Sidenav from './Sidenav';
import { Route, Routes } from 'react-router-dom';
import ManageTeachers from './ManageTeachers';
import ManageStudents from './ManageStudents';
import ManageClasses from './ManageClasses';
import ManageTimetable from './ManageTimeTable';
import ManageAttendance from './ManageAttendence';
import Dashboard from './Dashboard';
import TeacherRegistration from './Teacher/TeacherRegister';
import EditTeacher from './Teacher/EditTeacher';

function AdminDashboard() {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content area with responsive flex layout */}
      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        {/* Sidebar (Sidenav) - Adjust width on larger screens */}
        <div className="md:w-[20%] w-full md:h-full bg-gray-50 overflow-auto">
          <Sidenav />
        </div>

        {/* Main content area - Takes the remaining width and is scrollable */}
        <div className="md:w-[80%] w-full h-full overflow-auto p-4 md:p-10 bg-gray-50">
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="manage-teachers" element={<ManageTeachers />} />
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="manage-classes" element={<ManageClasses />} />
            <Route path="manage-timetable" element={<ManageTimetable />} />
            <Route path="manage-attendence" element={<ManageAttendance />} />
            <Route path='teacher/register' element={<TeacherRegistration />} />
            <Route path='teacher/edit' element={<EditTeacher />} />


            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
