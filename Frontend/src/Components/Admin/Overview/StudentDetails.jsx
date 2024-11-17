import React from 'react';

function ClassOverview() {
  const classes = [
    { name: 'Class 10A', students: 30, averageGrade: 'B+' },
    { name: 'Class 10B', students: 28, averageGrade: 'B' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-4">Class</th>
            <th className="border-b-2 p-4">Total Students</th>
            <th className="border-b-2 p-4">Average Grade</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border-b">{classItem.name}</td>
              <td className="p-4 border-b">{classItem.students}</td>
              <td className="p-4 border-b">{classItem.averageGrade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassOverview;
