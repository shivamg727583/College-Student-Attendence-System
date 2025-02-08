import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchSubjects } from "../adminSlice";

// 📌 Async Thunks

// ✅ Fetch all students
export const fetchStudents = createAsyncThunk("students/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("/students");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch students");
    }
});

// ✅ Get student by ID
export const getStudentById = createAsyncThunk("students/getById", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/students/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Student not found");
    }
});

// ✅ Register (Upload) students
export const registerStudents = createAsyncThunk("students/register", async (formData, { rejectWithValue }) => {
    try {
        const response = await axios.post("/students/register-upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Students registered successfully!");
        console.log("API Response:", response.data); // Debugging

        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "File upload failed");
        return rejectWithValue(error.response?.data);
    }
});

// ✅ Update student
export const updateStudent = createAsyncThunk("students/update", async ({ id, studentData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/students/${id}`, studentData);
        toast.success("Student updated successfully!");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Update failed");
        return rejectWithValue(error.response?.data);
    }
});

// ✅ Delete student
export const deleteStudent = createAsyncThunk("students/delete", async (id, { rejectWithValue, dispatch }) => {
    try {
        await axios.delete(`/students/${id}`);
        toast.success("Student deleted successfully!");

        // ✅ Fetch updated student list
        await dispatch(fetchStudents());

        return id;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete student");
        return rejectWithValue(error.response?.data);
    }
});

// 📌 Redux Slice

const studentSlice = createSlice({
    name: "students",
    initialState: {
        students: [],
        student: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearStatus: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getStudentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentById.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload;
            })
            .addCase(getStudentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerStudents.fulfilled, (state, action) => {
                state.loading = false;

                // ✅ Debugging Step
                console.log("Inserted Students:", action.payload.inserted);

                if (Array.isArray(action.payload.inserted)) {
                    state.students = [...state.students, ...action.payload.inserted];
                } else {
                    console.error("Error: inserted is not an array", action.payload);
                }
            })
            .addCase(registerStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.map((student) =>
                    student._id === action.payload._id ? action.payload : student
                );
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.students = state.students.filter((student) => student._id !== action.payload);
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearStatus } = studentSlice.actions;
export default studentSlice.reducer;
