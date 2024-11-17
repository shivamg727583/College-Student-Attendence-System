import React, { useState } from 'react';

function ManageClasses() {
  const [classes, setClasses] = useState([
    { id: 1, name: '10A', teacher: 'Mr. Adams' },
    { id: 2, name: '10B', teacher: 'Ms. Williams' },
    { id: 3, name: '11A', teacher: 'Dr. Brown' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Classes</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by class or teacher..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <i className="ri-add-fill mr-2"></i> Add New Class
        </button>
      </div>
      <table className="w-full border-collapse text-left mt-4">
        <thead>
          <tr>
            <th className="border-b-2 p-4 text-gray-600">ID</th>
            <th className="border-b-2 p-4 text-gray-600">Class</th>
            <th className="border-b-2 p-4 text-gray-600">Teacher</th>
            <th className="border-b-2 p-4 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <tr key={cls.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{cls.id}</td>
                <td className="p-4 border-b">{cls.name}</td>
                <td className="p-4 border-b">{cls.teacher}</td>
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
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No classes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageClasses;
