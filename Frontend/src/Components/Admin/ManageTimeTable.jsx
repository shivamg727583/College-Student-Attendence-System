import React, { useState } from 'react';

function ManageTimetable() {
  const [timetable, setTimetable] = useState([
    { id: 1, class: '10A', subject: 'Mathematics', time: '9:00 - 10:00', teacher: 'Mr. Adams' },
    { id: 2, class: '10B', subject: 'English', time: '10:00 - 11:00', teacher: 'Ms. Williams' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTimetable = timetable.filter(entry =>
    entry.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Timetable</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by class, subject, or teacher..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <i className="ri-add-fill mr-2"></i> Add New Timetable Entry
        </button>
      </div>
      <table className="w-full border-collapse text-left mt-4">
        <thead>
          <tr>
            <th className="border-b-2 p-4 text-gray-600">ID</th>
            <th className="border-b-2 p-4 text-gray-600">Class</th>
            <th className="border-b-2 p-4 text-gray-600">Subject</th>
            <th className="border-b-2 p-4 text-gray-600">Time</th>
            <th className="border-b-2 p-4 text-gray-600">Teacher</th>
            <th className="border-b-2 p-4 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTimetable.length > 0 ? (
            filteredTimetable.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{entry.id}</td>
                <td className="p-4 border-b">{entry.class}</td>
                <td className="p-4 border-b">{entry.subject}</td>
                <td className="p-4 border-b">{entry.time}</td>
                <td className="p-4 border-b">{entry.teacher}</td>
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
                No timetable entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTimetable;
