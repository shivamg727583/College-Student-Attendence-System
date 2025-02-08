import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerStudents } from "../../../redux/Slices/StudentSlice";


const StudentRegister = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });
    const dispatch = useDispatch();

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const allowedExtensions = ["csv", "xlsx", "xls"];
            const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                setMessage({ type: "error", text: "Only CSV and Excel files are allowed!" });
                setFile(null);
            } else {
                setMessage({ type: "", text: "" });
                setFile(selectedFile);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage({ type: "error", text: "Please upload a file first!" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

dispatch(registerStudents(formData))       
       
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Bulk Register Students</h1>

                {message.text && (
                    <div className={`p-4 rounded mb-4 ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Upload CSV or Excel File</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".csv, .xlsx, .xls"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-sm text-gray-600">
                    <p>Ensure your file has the following columns:</p>
                    <ul className="list-disc list-inside">
                        <li>Name</li>
                        <li>Email</li>
                        <li>Enrollment Number</li>
                        <li>Class Name</li>
                        <li>Section</li>
                        <li>Semester</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;
