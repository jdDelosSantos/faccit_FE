import logo from "./logo.svg";
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
import AdminClassManagement from "./Components/AdminClassManagement/AdminClassManagement";
import AdminSidebar from "./Components/AdminSidebar/AdminSidebar";
import TESTING from "./Components/TESTING/TESTING";
import SuperAdminDashboard from "./Components/SuperAdminDashboard/SuperAdminDashboard";
import SuperAdminStudentManagement from "./Components/SuperAdminStudentManagement/SuperAdminStudentManagement";
import SuperAdminCourseManagement from "./Components/SuperAdminCourseManagement/SuperAdminCourseManagement";
import SuperAdminClassManagement from "./Components/SuperAdminClassManagement/SuperAdminClassManagement";
import SuperAdminCollegeManagement from "./Components/SuperAdminCollegeManagement/SuperAdminCollegeManagement";
import SuperAdminProfessorManagement from "./Components/SuperAdminProfessorManagement/SuperAdminProfessorManagement";
import SuperAdminProgrammingLab from "./Components/SuperAdminProgrammingLab/SuperAdminProgrammingLab";
import SuperAdminClassScheduleManagement from "./Components/SuperAdminClassScheduleManagement/SuperAdminClassScheduleManagement";
import TestingEsp from "./Components/TestingEsp/TestingEsp";
import SuperAdminMultimediaLab from "./Components/SuperAdminMultimediaLab/SuperAdminMultimediaLab";
import AdminProgrammingLab from "./Components/AdminProgrammingLab/AdminProgrammingLab";
import AdminMultimediaLab from "./Components/AdminMultimediaLab/AdminMultimediaLab";
import AdminMakeupClassHistory from "./Components/AdminMakeupClassHistory/AdminMakeupClassHistory";
import SuperAdminMakeupClassRequests from "./Components/SuperAdminMakeupClassRequests/SuperAdminMakeupClassRequests";
import AdminCancelClassHistory from "./Components/AdminCancelClassHistory/AdminCancelClassHistory";
import SuperAdminCancelClassRequests from "./Components/SuperAdminCancelClassRequests/SuperAdminCancelClassRequests";
import AdminProfessorAttendancePage from "./Components/AdminProfessorAttendancePage/AdminProfessorAttendancePage";
import AdminStudentAttendancePage from "./Components/AdminStudentAttendancePage/AdminStudentAttendancePage";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import AdminProfile from "./Components/AdminProfile/AdminProfile";

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

  return (
    <div>
      {/* <TESTING /> */}
      {/* <TestingEsp /> */}
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<SuperAdminSidebarFunction />}>
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route
              path="/labs/programming-lab"
              element={<SuperAdminProgrammingLab />}
            />
            <Route
              path="/labs/multimedia-lab"
              element={<SuperAdminMultimediaLab />}
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

            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route element={<AdminSidebarFunction />}>
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/managements/classes"
              element={<AdminClassManagement />}
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
              path="/admin/managements/makeup-classes"
              element={<AdminMakeupClassHistory />}
            />
            <Route
              path="/admin/managements/cancel-classes"
              element={<AdminCancelClassHistory />}
            />
            <Route
              path="/admin/managements/open-classes"
              element={<AdminProfessorAttendancePage />}
            />
            <Route
              path="/admin/managements/attendances/students"
              element={<AdminStudentAttendancePage />}
            />

            <Route path="/" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
