import { configureStore } from "@reduxjs/toolkit";
// import attendanceReducer from "./attendance";
import studentReducer from "./students";
import courseReducer from "./courses";
import classReducer from "./classes";
import collegeReducer from "./colleges";
import professorReducer from "./professors";

export default configureStore({
  reducer: {
    // attendance: attendanceReducer,
    student: studentReducer,
    course: courseReducer,
    class: classReducer,
    college: collegeReducer,
    professor: professorReducer,
  },
});
