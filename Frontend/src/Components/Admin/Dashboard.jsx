import React from 'react';
import AttendanceSummary from './Overview/AttendenceSummary';
import ClassOverview from './Overview/ClassOverview';
import StudentDetails from './Overview/StudentDetails';
import PerformanceCharts from './Overview/PerformanceChart';

function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overview Cards */}
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Total Students</h2>
          <p className="text-2xl mt-2">1,250</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Classes</h2>
          <p className="text-2xl mt-2">25</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Average Attendance</h2>
          <p className="text-2xl mt-2">89%</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Performance Score</h2>
          <p className="text-2xl mt-2">B+</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Attendance Overview</h2>
        <AttendanceSummary />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Class Overview</h2>
        <ClassOverview />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Student Details</h2>
        <StudentDetails />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Performance Analysis</h2>
        <PerformanceCharts />
      </div>
    </div>
  );
}

export default Dashboard;
