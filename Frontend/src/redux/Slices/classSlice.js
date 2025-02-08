import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { toast } from 'react-toastify'; // Importing toast

// Async thunks
export const fetchClasses = createAsyncThunk('classes/fetchClasses', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('class/');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
});

export const createClass = createAsyncThunk('classes/createClass', async (classData, { rejectWithValue }) => {
    try {
        const response = await axios.post('class/create', classData);
        toast.success('Class created successfully!'); // Success toast
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create class'); // Error toast
        return rejectWithValue(error.response?.data?.message || 'Failed to create class');
    }
});

export const updateClass = createAsyncThunk('classes/updateClass', async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`class/update/${id}`, updatedData);
        toast.success('Class updated successfully!'); // Success toast
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update class'); // Error toast
        return rejectWithValue(error.response?.data?.message || 'Failed to update class');
    }
});

export const deleteClass = createAsyncThunk('classes/deleteClass', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`class/delete/${id}`);
        toast.success('Class deleted successfully!'); // Success toast
        return id;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete class'); // Error toast
        return rejectWithValue(error.response?.data?.message || 'Failed to delete class');
    }
});

const classSlice = createSlice({
    name: 'classes',
    initialState: {
        classes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClasses.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchClasses.fulfilled, (state, action) => { state.loading = false; state.classes = action.payload; })
            .addCase(fetchClasses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createClass.fulfilled, (state, action) => { 
                state.classes.push(action.payload); 
            })
            .addCase(updateClass.fulfilled, (state, action) => {
                const index = state.classes.findIndex(cls => cls._id === action.payload._id);
                if (index !== -1) state.classes[index] = action.payload;
            })
            .addCase(deleteClass.fulfilled, (state, action) => {
                state.classes = state.classes.filter(cls => cls._id !== action.payload);
            });
    }
});

export default classSlice.reducer;
