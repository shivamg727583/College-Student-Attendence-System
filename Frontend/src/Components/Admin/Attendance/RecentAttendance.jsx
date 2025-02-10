import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceReports, fetchSelectedAttendance } from "../../../redux/adminSlice";

const RecentAttendance = () => {
  const dispatch = useDispatch();
  const { attendanceReports, loading, error, selectedAttendance } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAttendanceReports({})); // Fetch all attendance records initially
  }, [dispatch]);

  // Handle selection of a specific attendance record
  const handleSelectAttendance = (attendanceId) => {
    dispatch(fetchSelectedAttendance(attendanceId)); // Fetch selected attendance by ID
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-4">Recent Attendance</h2>

      {/* Attendance Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Select Attendance Record</h3>
        {attendanceReports.length > 0 ? (
          <ul>
            {attendanceReports.map((record) => (
              <li
                key={record._id}
                className="cursor-pointer p-2 hover:bg-gray-100 border-b"
                onClick={() => handleSelectAttendance(record._id)}
              >
                {record.subject.subject_name} - {record.class_name} ({record.semester} Sem, Section {record.section}) | Date: {record.date}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No attendance records found.</p>
        )}
      </div>

      {/* Display Selected Attendance */}
      {selectedAttendance && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Attendance Details</h3>
          <p className="text-lg font-medium">
            <strong>Class:</strong> {selectedAttendance.class_name} | 
            <strong> Semester:</strong> {selectedAttendance.semester} | 
            <strong> Section:</strong> {selectedAttendance.section} | 
            <strong> Subject:</strong> {selectedAttendance.subject.subject_name} | 
            <strong> Date:</strong> {selectedAttendance.date}
          </p>

          {/* Student Attendance List */}
          <table className="w-full border-collapse border border-gray-200 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Roll No</th>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedAttendance.students.map((student, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{student.roll_no}</td>
                  <td className="border p-2">{student.name}</td>
                  <td className={`border p-2 ${student.status === "Present" ? "text-green-600" : "text-red-600"}`}>
                    {student.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Attendance Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p><strong>Total Students:</strong> {selectedAttendance.students.length}</p>
            <p className="text-green-600"><strong>Present:</strong> {selectedAttendance.students.filter(s => s.status === "Present").length}</p>
            <p className="text-red-600"><strong>Absent:</strong> {selectedAttendance.students.filter(s => s.status === "Absent").length}</p>
            <p><strong>Attendance %:</strong> {((selectedAttendance.students.filter(s => s.status === "Present").length / selectedAttendance.students.length) * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentAttendance;
