import { configureStore } from "@reduxjs/toolkit";
// import attendanceReducer from "./attendance";
import studentReducer from "./students";
import courseReducer from "./courses";
// import courseReducer from "./course";
// import adminReducer from "./admins";
// import superAdminReducer from "./superAdmins";

export default configureStore({
  reducer: {
    // attendance: attendanceReducer,
    student: studentReducer,
    course: courseReducer,
    // admin: adminReducer,
    // superAdmin: superAdminReducer,
  },
});
