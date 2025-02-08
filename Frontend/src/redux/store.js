import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import attendanceReducer from './attendanceSlice';
import adminReducer from './adminSlice';
import teacherReducer from './TeacherSlice';
import classReducer from './Slices/classSlice';
import studentReducer from './Slices/StudentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    admin: adminReducer,
    teacher: teacherReducer,
    class:classReducer,
    student:studentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // Ensures async actions work
});

export default store;
