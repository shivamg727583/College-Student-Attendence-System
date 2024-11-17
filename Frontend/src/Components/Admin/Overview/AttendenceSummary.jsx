import React from 'react';

function AttendanceSummary() {
  const classes = [
    { name: 'Class 10A', attendance: '92%' },
    { name: 'Class 10B', attendance: '88%' },
    { name: 'Class 9A', attendance: '95%' },
    { name: 'Class 8C', attendance: '85%' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-4">Class</th>
            <th className="border-b-2 p-4">Attendance</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border-b">{classItem.name}</td>
              <td className="p-4 border-b">{classItem.attendance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceSummary;
