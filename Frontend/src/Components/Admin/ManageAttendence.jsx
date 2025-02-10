import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../Components/Others/Pagination";
import { fetchAttendanceReports } from "../../redux/adminSlice";
import { Link } from "react-router-dom";

const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const { attendanceReports, loading } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({
    semester: "",
    class_name: "",
    section: "",
    subject: "",
    date: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAttendanceReports(filters)); // Fetch attendance data based on filters
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleRecentClick = (attendance) => {
    setFilters({
      semester: attendance.semester,
      class_name: attendance.class_name,
      section: attendance.section,
      subject: attendance.subject.subject_name, // Fixing subject display issue
      date: attendance.date,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-center mb-4">Attendance Management</h2>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.keys(filters).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 font-medium capitalize">{key.replace("_", " ")}</label>
            <input
              type={key === "date" ? "date" : "text"}
              name={key}
              value={filters[key]}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>

      {/* Attendance Records */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Filtered Attendance Records</h3>
        {loading ? (
          <p>Loading...</p>
        ) : attendanceReports.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Semester</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {attendanceReports.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map((record, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{record?.class.semester}</td>
                  <td className="border p-2">{record?.class.class_name}</td>
                  <td className="border p-2">{record?.class.section}</td>
                  <td className="border p-2">{record.subject.subject_name}</td> {/* Fixing Object Rendering */}
                  <td className="border p-2">{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No attendance records found.</p>
        )}

        {/* Pagination Component */}
        <Pagination
          totalRecords={attendanceReports.length}
          recordsPerPage={recordsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Recent Attendance */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Recent Attendance</h3>
        {attendanceReports.length > 0 ? (
          <ul>
            {attendanceReports.slice(0, 5).map((record, index) => (
              <Link
              to={`/admin/attendance/recent/${record._id}`}
                key={index}
                className="cursor-pointer w-full flex flex-row p-2 hover:bg-gray-100 border-b"
                
              >
                {record.subject.subject_name} -  {record?.class.class_name}  ({record?.class.semester} Sem,  Section {record?.class.section})  | Date: {new Date(record.date).toDateString()  } | Time - {new Date(record.date).toLocaleTimeString()  }  | By - {record?.teacher.name}
              </Link>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent attendance records.</p>
        )}
      </div>
    </div>
  );
};

export default AttendanceManagement;
