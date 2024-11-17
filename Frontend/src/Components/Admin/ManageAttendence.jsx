import React, { useState } from 'react';

function ManageAttendance() {
  const [attendance, setAttendance] = useState([
    { id: 1, student: 'Alice Johnson', class: '10A', date: '2024-11-01', status: 'Present' },
    { id: 2, student: 'Bob Smith', class: '10B', date: '2024-11-01', status: 'Absent' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAttendance = attendance.filter(record =>
    record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.date.includes(searchTerm)
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Attendance</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by student, class, or date..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <i className="ri-add-fill mr-2"></i> Add New Attendance Record
        </button>
      </div>
      <table className="w-full border-collapse text-left mt-4">
        <thead>
          <tr>
            <th className="border-b-2 p-4 text-gray-600">ID</th>
            <th className="border-b-2 p-4 text-gray-600">Student</th>
            <th className="border-b-2 p-4 text-gray-600">Class</th>
            <th className="border-b-2 p-4 text-gray-600">Date</th>
            <th className="border-b-2 p-4 text-gray-600">Status</th>
            <th className="border-b-2 p-4 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendance.length > 0 ? (
            filteredAttendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{record.id}</td>
                <td className="p-4 border-b">{record.student}</td>
                <td className="p-4 border-b">{record.class}</td>
                <td className="p-4 border-b">{record.date}</td>
                <td className="p-4 border-b">{record.status}</td>
                <td className="p-4 border-b">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">
                    <i className="ri-edit-2-line"></i> Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <i className="ri-delete-bin-6-line"></i> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No attendance records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageAttendance;
