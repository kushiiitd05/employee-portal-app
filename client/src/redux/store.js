import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import attendanceReducer from './AttendanceSlice'; 

const store = configureStore({
  reducer: {
    user: userReducer,
      attendance: attendanceReducer,
  },
});

export default store;
