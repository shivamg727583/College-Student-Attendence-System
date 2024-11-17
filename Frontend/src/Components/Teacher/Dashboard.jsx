import React, { useState } from 'react';
import ClassSubjectList from './ClassSubjectList';
import AttendanceForm from './AttendenceForm';

function Dashboard() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>

      {/* Class and Subject Selector */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Select Class and Subject</h2>
        <ClassSubjectList 
          onSelectClass={setSelectedClass} 
          onSelectSubject={setSelectedSubject} 
        />
      </div>

      {/* Attendance Form */}
      {selectedClass && selectedSubject && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Take Attendance for {selectedClass} - {selectedSubject}</h2>
          <AttendanceForm className={selectedClass} subject={selectedSubject} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
