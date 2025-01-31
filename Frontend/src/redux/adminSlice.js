import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";  // Use the configured Axios instance
import { toast } from "react-toastify";

// ✅ Fetch Admin Dashboard Data
export const fetchAdminDashboard = createAsyncThunk(
    "admin/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("admin/dashboard");
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            return rejectWithValue(error.response?.data || "Failed to fetch");
        }
    }
);

// ✅ Fetch Subjects
export const fetchSubjects = createAsyncThunk(
    "admin/fetchSubjects",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("admin/manage-subjects");
            return response.data.subjects;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching subjects");
        }
    }
);

// ✅ Fetch Classes
export const fetchClasses = createAsyncThunk(
    "admin/fetchClasses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("admin/manage-classes");
            return response.data.classes;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching classes");
        }
    }
);

// ✅ Fetch Students
export const fetchStudents = createAsyncThunk(
    "admin/fetchStudents",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("admin/manage-students");
            return response.data.students;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching students");
        }
    }
);

// ✅ Fetch Attendance Reports
export const fetchAttendanceReports = createAsyncThunk(
    "admin/fetchAttendanceReports",
    async (filters, { rejectWithValue }) => {
        try {
            const response = await axios.post("admin/attendance-report", filters);
            return response.data.reports;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching attendance reports");
        }
    }
);

// ✅ Update Admin
export const updateAdmin = createAsyncThunk(
    "admin/updateAdmin",
    async ({ id, adminData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`admin/edit/${id}`, adminData);
            toast.success("Admin updated successfully");
            return response.data;
        } catch (error) {
            toast.error("Failed to update admin");
            return rejectWithValue(error.response.data);
        }
    }
);

// ✅ Delete Admin
export const deleteAdmin = createAsyncThunk(
    "admin/deleteAdmin",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`admin/delete/${id}`);
            toast.success("Admin deleted successfully");
            return id;
        } catch (error) {
            toast.error("Failed to delete admin");
            return rejectWithValue(error.response.data);
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        admin: null,
        teachers: [],
        students: [],
        classes: [],
        subjects: [],
        attendanceReports: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload.admin;
                state.teachers = action.payload.teachers;
                state.students = action.payload.students;
                state.classes = action.payload.classes;
                state.subjects = action.payload.subjects;
            })
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.classes = action.payload;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.students = action.payload;
            })
            .addCase(fetchAttendanceReports.fulfilled, (state, action) => {
                state.attendanceReports = action.payload;
            })
            .addCase(updateAdmin.fulfilled, (state, action) => {
                state.admin = action.payload;
            })
            .addCase(deleteAdmin.fulfilled, (state, action) => {
                if (state.admin?._id === action.payload) {
                    state.admin = null;
                }
            });
    },
});

export default adminSlice.reducer;
