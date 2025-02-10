import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedAttendance } from "../../../redux/adminSlice";
import { useNavigate, useParams } from "react-router-dom"; // To get attendanceId from URL

const SelectedAttendance = () => {
    const { id:attendanceId } = useParams(); // Get ID from URL
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedAttendance, loading, error } = useSelector((state) => state.admin);

   
    useEffect(() => {
        if (attendanceId) {
            dispatch(fetchSelectedAttendance(attendanceId));
        }
    }, [dispatch, attendanceId]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button className="font-bold text-xl ">←</button>
            <h2 className="text-2xl font-semibold text-center mb-4">Attendance Details</h2>
            
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {selectedAttendance && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Class Information</h3>
                    <p><strong>Class:</strong> {selectedAttendance.class.class_name}</p>
                    <p><strong>Semester:</strong> {selectedAttendance.class.semester}</p>
                    <p><strong>Section:</strong> {selectedAttendance.class.section}</p>
                    <p><strong>Subject:</strong> {selectedAttendance.subject.subject_name}</p>
                    <p><strong>Date:</strong> {new Date(selectedAttendance.date).toLocaleString()}</p>

                    <h3 className="text-xl font-semibold mt-4">Student Attendance</h3>
                    <table className="w-full border-collapse border border-gray-200 mt-2">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Roll No</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedAttendance.student?.map((user, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{user.enrollment_number}</td>
                                    <td className="border p-2">{user.name}</td>
                                    <td className={`border p-2 ${user.status === "Present" ? "text-green-500" : "text-red-500"}`}>
                                        {user.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="text-xl font-semibold mt-4">Summary</h3>
                    <p><strong>Total Students:</strong> {selectedAttendance.student?.length}</p>
                    <p><strong>Present:</strong> {selectedAttendance.student?.filter(s => s.status === "Present").length}</p>
                    <p><strong>Absent:</strong> {selectedAttendance.student?.filter(s => s.status === "Absent").length}</p>
                    <p><strong>Attendance %:</strong> {(
                        (selectedAttendance.student?.filter(s => s.status === "Present").length / 
                        selectedAttendance.student?.length) * 100).toFixed(2)}%</p>
                </div>
            )}
        </div>
    );
};

export default SelectedAttendance;
