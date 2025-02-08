import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Others/Loading";
import { deleteStudent } from "../../redux/Slices/StudentSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Toasts for notifications
import { fetchStudents } from "../../redux/Slices/StudentSlice";

function ManageStudents() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10;

    const { students, loading: isLoading, error } = useSelector((state) => state.student);

    // 🔍 Handle search input
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    useEffect(()=>{
      dispatch(fetchStudents())
    },[dispatch])

    // 🔍 Filter students by name, class, or enrollment number
    const filteredStudents =
        students?.filter(
            (student) =>
                student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student?.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student?.enrollment_number?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    // 📌 Pagination Logic
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // ⏮ Previous Page
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // ⏭ Next Page
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    // 🗑️ Delete Function
    const deleteStudentHandler =  (id) => {
          dispatch(deleteStudent(id));
    };

    if (isLoading) {
        return <Loading />;
    }

  

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
            <h2 className="text-2xl font-bold mb-4">Manage Students</h2>

            {/* 🔍 Search Box */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
                <input
                    type="text"
                    placeholder="Search by name, ID, or class..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full sm:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
                <Link to='/admin/student/register' className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <i className="ri-add-fill mr-2"></i> Add New Student
                </Link>
            </div>

            {/* 📋 Student Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left mt-4">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b-2 p-4 text-gray-600">ID</th>
                            <th className="border-b-2 p-4 text-gray-600">Name</th>
                            <th className="border-b-2 p-4 text-gray-600">Class</th>
                            <th className="border-b-2 p-4 text-gray-600">Email</th>
                            <th className="border-b-2 p-4 text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.length > 0 ? (
                            currentStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b">{student.enrollment_number}</td>
                                    <td className="p-4 border-b">{student.name}</td>
                                    <td className="p-4 border-b">{student.class_name}</td>
                                    <td className="p-4 border-b">{student.email}</td>
                                    <td className="p-4 border-b flex gap-2">
                                        <Link to={`/admin/student/edit/${student._id}`} className="text-blue-600 hover:text-blue-800">
                                            <i className="ri-edit-2-line"></i> Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteStudentHandler(student._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <i className="ri-delete-bin-6-line"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 📌 Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                    >
                        ⏮ Prev
                    </button>
                    <span className="text-gray-700 font-semibold">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                    >
                        Next ⏭
                    </button>
                </div>
            )}
        </div>
    );
}

export default ManageStudents;
