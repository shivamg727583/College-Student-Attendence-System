import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getStudentById,
  updateStudent,
} from "../../../redux/Slices/StudentSlice";
import { FaTruckLoading } from "react-icons/fa";

const StudentUpdate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { student, loading, error } = useSelector((state) => state.student);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enrollment_number: "",
    class_name: "",
    section: "",
    semester: "",
  });

  // **Update formData when student data updates**
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        enrollment_number: student.enrollment_number || "",
        class_name: student.class_name || "",
        section: student.section || "",
        semester: student.semester || "",
      });
    }
  }, [student]);

  // Fetch new student when component mounts or ID changes
  useEffect(() => {
    dispatch(getStudentById(id));
  }, [dispatch, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateStudent({ id, studentData: formData }));
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaTruckLoading className="animate-spin text-4xl" />
        <div className="ml-2 text-lg font-semibold">Loading...</div>
      </div>
    );
  }

 const backfun = () => {
    console.log("Back button clicked");
    if (window.history.length > 1) {
        navigate(-1);
    } else {
        navigate("/admin/manage-students"); 
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={() => backfun()}
          className="cursor-pointer hover:p-1 rounded-full hover:bg-gray-100 text-xl font-bold"
        >
          ←
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Update Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-gray-700 font-medium capitalize">
                {key.replace("_", " ")}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentUpdate;
