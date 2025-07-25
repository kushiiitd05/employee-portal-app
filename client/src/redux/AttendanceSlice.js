// src/redux/AttendanceSlice.js
import { createSlice } from '@reduxjs/toolkit';

// ✅ THE FIX: The default state is now 'Loading...'.
// This prevents the UI from flashing "Not Marked" incorrectly.
const initialState = {
  today: 'Loading...',
  yesterday: 'Loading...',
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // This is the only function that can change the attendance state
    setAttendance: (state, action) => {
      state.today = action.payload.today;
      state.yesterday = action.payload.yesterday;
    },
  },
});

export const { setAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;