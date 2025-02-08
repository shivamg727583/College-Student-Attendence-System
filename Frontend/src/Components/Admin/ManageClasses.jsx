import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteClass, fetchClasses, updateClass } from '../../redux/Slices/classSlice';
import LoaderSpinner from '../Others/Loading';
import { Link, useNavigate } from 'react-router-dom';

function ManageClasses() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { classes, isLoading } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [classesPerPage, setClassesPerPage] = useState(10);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClassesPerPageChange = (event) => {
    setClassesPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredClasses = classes ? classes.filter(cls =>
    cls.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.teacher?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ) : [];

  // Pagination Logic
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);


  const deleteClassHanlder =(id)=>{
    dispatch(deleteClass(id));
  }
  

  return (
    
    <div className="bg-white p-6 rounded-lg shadow-lg h-fit mb-6">
      <h2 className="text-2xl font-bold mb-4">Manage Classes</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by class or teacher..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
        <select
          value={classesPerPage}
          onChange={handleClassesPerPageChange}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
         <Link to='/admin/class/register' className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <i className="ri-add-fill mr-2"></i> Add New Class
                </Link>
        
      </div>
     {
      isLoading ? (
<>
<LoaderSpinner />
</>
      ):(
        <>
        <table className="w-full border-collapse text-left mt-4">
        <thead>
          <tr>
            <th className="border-b-2 p-4 text-gray-600">ID</th>
            <th className="border-b-2 p-4 text-gray-600">Class</th>
            <th className="border-b-2 p-4 text-gray-600">Semester</th>
            <th className="border-b-2 p-4 text-gray-600">Section</th>
            <th className="border-b-2 p-4 text-gray-600">Subjects</th>
            <th className="border-b-2 p-4 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClasses.length > 0 ? (
            currentClasses.map((cls) => (
              <tr key={cls._id} className="hover:bg-gray-50">
                <td className="p-4 border-b">{cls._id}</td>
                <td className="p-4 border-b">{cls.class_name}</td>
                <td className="p-4 border-b">{cls.semester}</td>
                <td className="p-4 border-b">{cls.section}</td>
                <td className="p-4 border-b">
  {cls.subjects && cls.subjects.length > 0 ? (
    cls.subjects.map((subject) => (
      subject?.subject?.subject_name ? (
        <div key={subject._id}>{subject.subject.subject_name}</div>
      ) : (
        <div key={subject._id}>Subject name unavailable</div>
      )
    ))
  ) : (
    <div>No subjects available</div>
  )}
</td>

                <td className="p-4 border-b">
                   <Link to={`/admin/class/edit/${cls._id}`} className="text-blue-600 hover:text-blue-800 mr-2">
                                      <i className="ri-edit-2-line"></i> Edit
                                    </Link>
                  <button onClick={()=>deleteClassHanlder(cls._id)} className="text-red-600 hover:text-red-800">
                    <i className="ri-delete-bin-6-line"></i> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No classes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
        >
          Prev
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-lg ml-2"
        >
          Next
        </button>
      </div>
      </>
      )
     }
    </div>
  );
}

export default ManageClasses;
