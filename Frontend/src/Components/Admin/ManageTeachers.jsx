import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTeacher, fetchTeachers } from '../../redux/TeacherSlice';

function ManageTeachers() {
  const dispatch = useDispatch();
  const { teachers } = useSelector((state) => state.teacher);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const nameMatch = teacher.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || subjectMatch;
  });

  const TeacherDeleteHandler = (teacherId) => {
    dispatch(deleteTeacher(teacherId));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Teachers</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or subject..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
        <Link to='/admin/teacher/register' className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <i className="ri-add-fill mr-2"></i> Add New Teacher
        </Link>
      </div>
      <table className="w-full border-collapse text-left mt-4">
        <thead>
          <tr>
            <th className="border-b-2 p-4 text-gray-600">ID</th>
            <th className="border-b-2 p-4 text-gray-600">Name</th>
            <th className="border-b-2 p-4 text-gray-600">Subject</th>
            <th className="border-b-2 p-4 text-gray-600">Email</th>
            <th className="border-b-2 p-4 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <tr key={teacher._id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{teacher._id}</td>
                <td className="p-4 border-b">{teacher.name}</td>
                <td className="p-4 border-b">{teacher.subject || 'N/A'}</td>
                <td className="p-4 border-b">{teacher.email}</td>
                <td className="p-4 border-b">
                  <Link to={`/admin/teacher/edit/${teacher._id}`} className="text-blue-600 hover:text-blue-800 mr-2">
                    <i className="ri-edit-2-line"></i> Edit
                  </Link>
                  <button onClick={() => TeacherDeleteHandler(teacher._id)} className="text-red-600 hover:text-red-800">
                    <i className="ri-delete-bin-6-line"></i> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTeachers;
