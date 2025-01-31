import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";  // Import the configured Axios instance
import { toast } from "react-toastify";

// 🟢 Fetch All Teachers
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("teachers/manage-teachers");
      return response.data;
    } catch (error) {
      console.log("failed error :=> ", error);
      return rejectWithValue(error.response?.data || "Failed to fetch teachers");
    }
  }
);

// 🟢 Register a Teacher
export const registerTeacher = createAsyncThunk(
  "teachers/register",
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post("teachers/register-teacher", teacherData);
      toast.success("Teacher registered successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to register teacher");
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// 🟢 Delete a Teacher
export const deleteTeacher = createAsyncThunk(
  "teachers/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`teachers/delete/${id}`);
      toast.success("Teacher deleted successfully");
      return id;
    } catch (error) {
      toast.error("Failed to delete teacher");
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

const teacherSlice = createSlice({
  name: "teachers",
  initialState: {
    teachers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload.teacher);
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter((teacher) => teacher._id !== action.payload);
      });
  },
});

export default teacherSlice.reducer;
