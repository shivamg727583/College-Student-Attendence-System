import React from 'react';
import AttendanceSummary from './Overview/AttendenceSummary';
import ClassOverview from './Overview/ClassOverview';
import StudentDetails from './Overview/StudentDetails';
import PerformanceCharts from './Overview/PerformanceChart';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAdminDashboard, fetchAttendanceReports, fetchClasses, fetchStudents, fetchSubjects } from '../../redux/adminSlice';
import LoaderSpinner from '../Others/Loading';
function Dashboard() {
  const dispatch = useDispatch();
  const {admin, teachers, students,attendanceReports, classes, subjects, loading, error } = useSelector((state)=>state.admin);



  useEffect(() => {
    dispatch(fetchAdminDashboard());
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
    dispatch(fetchStudents());
    dispatch(fetchAttendanceReports({}));
  }, [dispatch]);


if (error) return <p>Error: {error}</p>;

  return (
    <>
     { loading ? (
      <LoaderSpinner />
    ) : (
      <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overview Cards */}
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Total Students</h2>
          <p className="text-2xl mt-2">{students.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Classes</h2>
          <p className="text-2xl mt-2">{classes.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Recent Attendance Reports</h2>
          <p className="text-2xl mt-2">{attendanceReports.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Subjects</h2>
          <p className="text-2xl mt-2">{subjects.length}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Attendance Overview</h2>
        <AttendanceSummary />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Class Overview</h2>
        <ClassOverview classes={classes}/>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Student Details</h2>
        <StudentDetails students={students} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Performance Analysis</h2>
        <PerformanceCharts />
      </div>
    </div>
    )
  }
    </>
  );
}

export default Dashboard;
