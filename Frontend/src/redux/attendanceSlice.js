import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  records: [],
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    addAttendance: (state, action) => {
      state.records.push(action.payload);
    },
    removeAttendance: (state, action) => {
      state.records = state.records.filter(record => record.id !== action.payload);
    },
  },
});

export const { addAttendance, removeAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
