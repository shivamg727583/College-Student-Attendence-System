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
import CreateClass from './Class/CreateClass';
import EditClass from './Class/EditClass';
import StudentRegister from './Student/StudentRegister';
import StudentUpdate from './Student/StudentUpdate';
import RecentAttendance from './Attendance/RecentAttendance';
import SelectedAttendance from './Attendance/SelectedAttendance';


function AdminDashboard() {
  return (
    <div className="flex flex-col h-screen w-full">
  

      {/* Main content area with responsive flex layout */}
      <div className="flex flex-col md:flex-row h-full  overflow-hidden">
        {/* Sidebar (Sidenav) - Adjust width on larger screens */}
        <div className="md:w-[20%] w-full md:h-full bg-gray-50  overflow-auto">
          <Sidenav />
        </div>

        {/* Main content area - Takes the remaining width and is scrollable */}
        <div className="md:w-[80%] w-full h-full overflow-auto p-4 md:p-10 bg-gray-50 mt-20">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-teachers" element={<ManageTeachers />} />
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="manage-classes" element={<ManageClasses />} />
            <Route path="manage-timetable" element={<ManageTimetable />} />
            <Route path="manage-attendence" element={<ManageAttendance />} />
            <Route path='teacher/register' element={<TeacherRegistration />} />
            <Route path='teacher/edit/:id' element={<EditTeacher />} />
            <Route path='class/register' element={<CreateClass />} />
            <Route path='class/edit/:id' element={<EditClass />} />
            <Route path='student/register' element={<StudentRegister />} />
            <Route path='student/edit/:id' element={<StudentUpdate />} />
            <Route path='attendance/recent' element={<RecentAttendance />} />
            <Route path='attendance/recent/:id' element={<SelectedAttendance />} />



            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
