import React from 'react';

function ClassOverview({classes}) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-4">Class</th>
            <th className="border-b-2 p-4">Total Students</th>
            <th className="border-b-2 p-4">Section</th>
            <th className="border-b-2 p-4">Semester</th>

          </tr>
        </thead>
        <tbody>
          {classes.map((classItem, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border-b">{classItem.class_name}</td>
              <td className="p-4 border-b">{classItem.students.length}</td>
              <td className="p-4 border-b">{classItem.section}</td>
              <td className="p-4 border-b">{classItem.semester}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClassOverview;
