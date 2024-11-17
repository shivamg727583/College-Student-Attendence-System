import React from 'react';

function ClassSubjectList({ onSelectClass, onSelectSubject }) {
  const classes = [
    { name: 'Class 101', subjects: ['Mathematics', 'Physics', 'Computer Science'] },
    { name: 'Class 102', subjects: ['Chemistry', 'Biology', 'Statistics'] },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <label className="block mb-2">Select Class:</label>
      <select
        className="w-full p-2 border rounded-lg mb-4"
        onChange={(e) => {
          const selectedClass = classes.find(c => c.name === e.target.value);
          onSelectClass(selectedClass.name);
        }}
      >
        <option value="">Select a Class</option>
        {classes.map((classItem, index) => (
          <option key={index} value={classItem.name}>{classItem.name}</option>
        ))}
      </select>

      <label className="block mb-2">Select Subject:</label>
      <select
        className="w-full p-2 border rounded-lg"
        onChange={(e) => onSelectSubject(e.target.value)}
      >
        <option value="">Select a Subject</option>
        {classes.flatMap(c => c.subjects).map((subject, index) => (
          <option key={index} value={subject}>{subject}</option>
        ))}
      </select>
    </div>
  );
}

export default ClassSubjectList;
