import { configureStore } from "@reduxjs/toolkit";
// import attendanceReducer from "./attendance";
import studentReducer from "./students";
import courseReducer from "./courses";
import subjectReducer from "./subjects";
import collegeReducer from "./colleges";

export default configureStore({
  reducer: {
    // attendance: attendanceReducer,
    student: studentReducer,
    course: courseReducer,
    subject: subjectReducer,
    college: collegeReducer,
  },
});
