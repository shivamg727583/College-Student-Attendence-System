import React, { useState } from 'react';

function ManageStudents() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', class: '10A', email: 'alice.johnson@example.com' },
    { id: 2, name: 'Bob Smith', class: '10B', email: 'bob.smith@example.com' },
    { id: 3, name: 'Charlie Brown', class: '11A', email: 'charlie.brown@example.com' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Students</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or class..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <i className="ri-add-fill mr-2"></i> Add New Student
        </button>
      </div>
      <table className="w-full border-collapse text-left mt-4">
        <thead>
          <tr>
            <th className="border-b-2 p-4 text-gray-600">ID</th>
            <th className="border-b-2 p-4 text-gray-600">Name</th>
            <th className="border-b-2 p-4 text-gray-600">Class</th>
            <th className="border-b-2 p-4 text-gray-600">Email</th>
            <th className="border-b-2 p-4 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{student.id}</td>
                <td className="p-4 border-b">{student.name}</td>
                <td className="p-4 border-b">{student.class}</td>
                <td className="p-4 border-b">{student.email}</td>
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
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageStudents;
