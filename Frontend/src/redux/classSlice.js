import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';
import { toast } from 'react-toastify';

// ✅ Fetch Classes
export const fetchClasses = createAsyncThunk(
    'class/fetchClasses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/admin');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching classes');
        }
    }
);

// ✅ Create Class
export const createClass = createAsyncThunk(
    'class/createClass',
    async (classData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/admin/create-class', classData);
            toast.success("Class created successfully");
            return response.data;
        } catch (error) {
            toast.error("Failed to create class");
            return rejectWithValue(error.response?.data || 'Failed to create class');
        }
    }
);

// ✅ Update Class
export const updateClass = createAsyncThunk(
    'class/updateClass',
    async ({ classId, classData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/admin/update-class/${classId}`, classData);
            toast.success("Class updated successfully");
            return response.data;
        } catch (error) {
            toast.error("Failed to update class");
            return rejectWithValue(error.response?.data || 'Failed to update class');
        }
    }
);

// ✅ Delete Class
export const deleteClass = createAsyncThunk(
    'class/deleteClass',
    async (classId, { rejectWithValue }) => {
        try {
            await axios.get(`/api/admin/delete/${classId}`);
            toast.success("Class deleted successfully");
            return classId;
        } catch (error) {
            toast.error("Failed to delete class");
            return rejectWithValue(error.response?.data || 'Failed to delete class');
        }
    }
);

const classSlice = createSlice({
    name: 'class',
    initialState: {
        classes: [],
        branches: [],
        sections: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload.branches;
                state.sections = action.payload.sections;
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createClass.fulfilled, (state, action) => {
                state.classes.push(action.payload);
            })
            .addCase(updateClass.fulfilled, (state, action) => {
                const updatedClassIndex = state.classes.findIndex(cls => cls._id === action.payload._id);
                if (updatedClassIndex >= 0) {
                    state.classes[updatedClassIndex] = action.payload;
                }
            })
            .addCase(deleteClass.fulfilled, (state, action) => {
                state.classes = state.classes.filter(cls => cls._id !== action.payload);
            });
    }
});

export default classSlice.reducer;
