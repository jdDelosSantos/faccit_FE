import { createSlice } from "@reduxjs/toolkit";

// Define a slice for members
const professorsSlice = createSlice({
  name: "professor",
  initialState: { professors: [] },
  reducers: {
    setProfessors: (state, action) => {
      state.professors = action.payload;
    },
    getProfessors: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Export actions generated by the slice
export const { setProfessors, getProfessors } = professorsSlice.actions;

// Export the reducer
export default professorsSlice.reducer;
