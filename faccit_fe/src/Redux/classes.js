import { createSlice } from "@reduxjs/toolkit";

// Define a slice for members
const classesSlice = createSlice({
  name: "class",
  initialState: { classes: [] },
  reducers: {
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    getClasses: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Export actions generated by the slice
export const { setClasses, getClasses } = classesSlice.actions;

// Export the reducer
export default classesSlice.reducer;
