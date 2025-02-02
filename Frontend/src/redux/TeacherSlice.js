import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";  
import { toast } from "react-toastify";

// 🟢 Fetch All Teachers (Admin)
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

// 🟢 Fetch Single Teacher by ID (Admin)
export const fetchTeacherById = createAsyncThunk(
  "teachers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`teachers/fetch-teacher/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch teacher");
    }
  }
);

// 🟢 Register a Teacher (Admin)
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

// 🟢 Delete a Teacher (Admin)
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

// 🟢 Update Teacher Profile (Admin)
export const updateTeacherByAdmin = createAsyncThunk(
  "teachers/updateByAdmin",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`teachers/edit-teacher/${id}`, updatedData);
      toast.success("Teacher updated successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data ||"Failed to update teacher");
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// 🟢 Update Own Profile (Teacher)
export const updateTeacherProfile = createAsyncThunk(
  "teachers/updateProfile",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axios.put("teachers/edit-profile", updatedData);
      toast.success("Profile updated successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to update profile");
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

const teacherSlice = createSlice({
  name: "teachers",
  initialState: {
    teachers: [],
    selectedTeacher: null, // Stores a single teacher’s details
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
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload.teacher);
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter((teacher) => teacher._id !== action.payload);
      })
      .addCase(updateTeacherByAdmin.fulfilled, (state, action) => {
        if (action.payload && action.payload.teacher) {
          state.teachers = state.teachers.map((teacher) =>
            teacher._id === action.payload.teacher._id ? action.payload.teacher : teacher
          );
        }
      })
      .addCase(updateTeacherProfile.fulfilled, (state, action) => {
        if (action.payload && action.payload.teacher) {
          state.teachers = state.teachers.map((teacher) =>
            teacher._id === action.payload.teacher._id ? action.payload.teacher : teacher
          );
        }
      })
      
  },
});

export default teacherSlice.reducer;
