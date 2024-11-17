import React, { useState } from 'react';

function AttendanceForm({ className, subject }) {
  const [students] = useState([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Davis' },
  ]);

  const [attendance, setAttendance] = useState({});

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    console.log(`Attendance for ${className} - ${subject}:`, attendance);
    alert('Attendance submitted successfully!');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 p-4">Student Name</th>
            <th className="border-b-2 p-4">Present</th>
            <th className="border-b-2 p-4">Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="p-4 border-b">{student.name}</td>
              <td className="p-4 border-b">
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  onChange={() => handleAttendanceChange(student.id, 'Present')}
                />
              </td>
              <td className="p-4 border-b">
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  onChange={() => handleAttendanceChange(student.id, 'Absent')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        Submit Attendance
      </button>
    </div>
  );
}

export default AttendanceForm;
