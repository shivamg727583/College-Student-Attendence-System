import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import attendanceReducer from './attendanceSlice';
import adminReducer from './adminSlice';
import teacherReducer from './TeacherSlice';
import classReducer from './Slices/classSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    admin: adminReducer,
    teacher: teacherReducer,
    class:classReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // Ensures async actions work
});

export default store;
