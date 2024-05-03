import "./App.css";
import SuperAdminSidebar from "./Components/SuperAdminSidebar/SuperAdminSidebar";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";
import TESTING from "./Components/TESTING/TESTING";
import SuperAdminDashboard from "./Components/SuperAdminDashboard/SuperAdminDashboard";
import SuperAdminStudentManagement from "./Components/SuperAdminStudentManagement/SuperAdminStudentManagement";
import SuperAdminCourseManagement from "./Components/SuperAdminCourseManagement/SuperAdminCourseManagement";
import SuperAdminClassManagement from "./Components/SuperAdminClassManagement/SuperAdminClassManagement";
import SuperAdminCollegeManagement from "./Components/SuperAdminCollegeManagement/SuperAdminCollegeManagement";
import SuperAdminProfessorManagement from "./Components/SuperAdminProfessorManagement/SuperAdminProfessorManagement";
import SuperAdminProgrammingLab from "./Components/SuperAdminProgrammingLab/SuperAdminProgrammingLab";
import SuperAdminClassScheduleManagement from "./Components/SuperAdminClassScheduleManagement/SuperAdminClassScheduleManagement";
import SuperAdminMultimediaLab from "./Components/SuperAdminMultimediaLab/SuperAdminMultimediaLab";
import SuperAdminMakeupClassRequests from "./Components/SuperAdminMakeupClassRequests/SuperAdminMakeupClassRequests";
import SuperAdminCancelClassRequests from "./Components/SuperAdminCancelClassRequests/SuperAdminCancelClassRequests";
import SuperAdminProfile from "./Components/SuperAdminProfile/SuperAdminProfile";
import SuperAdminStudentAttendancePage from "./Components/SuperAdminStudentAttendancePage/SuperAdminStudentAttendancePage";
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import UserSidebar from "./Components/UserSidebar/UserSidebar";
import UserCancelClassHistory from "./Components/UserCancelClassHistory/UserCancelClassHistory";
import UserClassManagement from "./Components/UserClassManagement/UserClassManagement";
import UserMakeupClassHistory from "./Components/UserMakeupClassHistory/UserMakeupClassHistory";
import UserMultimediaLab from "./Components/UserMultimediaLab/UserMultimediaLab";
import UserProgrammingLab from "./Components/UserProgrammingLab/UserProgrammingLab";
import UserProfessorAttendancePage from "./Components/UserProfessorAttendancePage/UserProfessorAttendancePage";
import UserProfile from "./Components/UserProfile/UserProfile";
import UserStudentAttendancePage from "./Components/UserStudentAttendancePage/UserStudentAttendancePage";
import SuperAdminAdminManagementPage from "./Components/SuperAdminAdminManagementPage/SuperAdminAdminManagementPage";
import AdminSidebar from "./Components/AdminSidebar/AdminSidebar";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
import AdminProgrammingLab from "./Components/AdminProgrammingLab/AdminProgrammingLab";
import AdminMultimediaLab from "./Components/AdminMultimediaLab/AdminMultimediaLab";
import AdminStudentManagement from "./Components/AdminStudentManagement/AdminStudentManagement";
import AdminProfessorManagement from "./Components/AdminProfessorManagement/AdminProfessorManagement";
import AdminCollegeManagement from "./Components/AdminCollegeManagement/AdminCollegeManagement";
import AdminCourseManagement from "./Components/AdminCourseManagement/AdminCourseManagement";
import AdminClassManagement from "./Components/AdminClassManagement/AdminClassManagement";
import AdminStudentAttendancePage from "./Components/AdminStudentAttendancePage/AdminStudentAttendancePage";
import AdminClassScheduleManagement from "./Components/AdminClassScheduleManagement/AdminClassScheduleManagement";
import SuperAdminClassesManagement from "./Components/SuperAdminClassesManagement/SuperAdminClassesManagement";
import AdminClassesManagement from "./Components/AdminClassesManagement/AdminClassesManagement";

function App() {
  const SuperAdminSidebarFunction = () => (
    <div className="flex-container">
      <SuperAdminSidebar />
      <Outlet />
    </div>
  );

  const AdminSidebarFunction = () => (
    <div className="flex-container">
      <AdminSidebar />
      <Outlet />
    </div>
  );

  const UserSidebarFunction = () => (
    <div className="flex-container">
      <UserSidebar />
      <Outlet />
    </div>
  );

  return (
    <div>
      {/* <TESTING /> */}
      {/* <TestingEsp /> */}
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          //SUPER ADMIN SIDE ROUTES
          <Route element={<SuperAdminSidebarFunction />}>
            <Route path="/testing" element={<TESTING />} />
            <Route path="/profile" element={<SuperAdminProfile />} />
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route
              path="/labs/programming-lab"
              element={<SuperAdminProgrammingLab />}
            />
            <Route
              path="/attendances/students"
              element={<SuperAdminStudentAttendancePage />}
            />
            <Route
              path="/labs/multimedia-lab"
              element={<SuperAdminMultimediaLab />}
            />
            <Route
              path="/managements/admins"
              element={<SuperAdminAdminManagementPage />}
            />
            <Route
              path="/managements/students"
              element={<SuperAdminStudentManagement />}
            />
            <Route
              path="/managements/colleges"
              element={<SuperAdminCollegeManagement />}
            />
            <Route
              path="/managements/professors"
              element={<SuperAdminProfessorManagement />}
            />
            <Route
              path="/managements/courses"
              element={<SuperAdminCourseManagement />}
            />

            <Route
              path="/managements/classes"
              element={<SuperAdminClassManagement />}
            />
            <Route
              path="/managements/classes/schedules"
              element={<SuperAdminClassScheduleManagement />}
            />
            <Route
              path="/managements/makeup-classes/requests"
              element={<SuperAdminMakeupClassRequests />}
            />

            <Route
              path="/managements/cancel-classes/requests"
              element={<SuperAdminCancelClassRequests />}
            />
            <Route
              path="/managements/class-list"
              element={<SuperAdminClassesManagement />}
            />

            <Route path="/" element={<LoginPage />} />
          </Route>
          {/* ADMIN SIDE ROUTES */}
          <Route element={<AdminSidebarFunction />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route
              path="/admin/attendances/students"
              element={<AdminStudentAttendancePage />}
            />
            <Route
              path="/admin/labs/programming-lab"
              element={<AdminProgrammingLab />}
            />

            <Route
              path="/admin/labs/multimedia-lab"
              element={<AdminMultimediaLab />}
            />
            <Route
              path="/admin/managements/students"
              element={<AdminStudentManagement />}
            />
            <Route
              path="/admin/managements/professors"
              element={<AdminProfessorManagement />}
            />
            <Route
              path="/admin/managements/colleges"
              element={<AdminCollegeManagement />}
            />

            <Route
              path="/admin/managements/courses"
              element={<AdminCourseManagement />}
            />

            <Route
              path="/admin/managements/classes"
              element={<AdminClassManagement />}
            />
            <Route
              path="/admin/managements/classes/schedules"
              element={<AdminClassScheduleManagement />}
            />
            <Route
              path="/admin/managements/class-list"
              element={<AdminClassesManagement />}
            />

            <Route path="/" element={<LoginPage />} />
          </Route>
          {/* USER SIDE ROUTES */}
          <Route element={<UserSidebarFunction />}>
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route
              path="/user/managements/classes"
              element={<UserClassManagement />}
            />
            <Route
              path="/user/labs/programming-lab"
              element={<UserProgrammingLab />}
            />
            <Route
              path="/user/labs/multimedia-lab"
              element={<UserMultimediaLab />}
            />
            <Route
              path="/user/managements/makeup-classes"
              element={<UserMakeupClassHistory />}
            />
            <Route
              path="/user/managements/cancel-classes"
              element={<UserCancelClassHistory />}
            />
            <Route
              path="/user/managements/open-classes"
              element={<UserProfessorAttendancePage />}
            />
            <Route
              path="/user/managements/attendances/students"
              element={<UserStudentAttendancePage />}
            />
            <Route path="/user/testing" element={<TESTING />} />

            <Route path="/" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
