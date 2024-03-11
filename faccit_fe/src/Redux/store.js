import { configureStore } from "@reduxjs/toolkit";
// import attendanceReducer from "./attendance";
import studentReducer from "./students";
import courseReducer from "./courses";
import subjectReducer from "./subjects";
import collegeReducer from "./colleges";
import professorReducer from "./professors";

export default configureStore({
  reducer: {
    // attendance: attendanceReducer,
    student: studentReducer,
    course: courseReducer,
    subject: subjectReducer,
    college: collegeReducer,
    professor: professorReducer,
  },
});
