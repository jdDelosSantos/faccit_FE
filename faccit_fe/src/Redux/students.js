import { createSlice } from "@reduxjs/toolkit";

// Define a slice for members
const studentsSlice = createSlice({
  name: "student",
  initialState: { students: [] },
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    getStudents: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Export actions generated by the slice
export const { setStudents, getStudents } = studentsSlice.actions;

// Export the reducer
export default studentsSlice.reducer;
