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
import AdminSubjectManagement from "./Components/AdminSubjectManagement/AdminSubjectManagement";
import AdminSidebar from "./Components/AdminSidebar/AdminSidebar";
import TESTING from "./Components/TESTING/TESTING";
import SuperAdminDashboard from "./Components/SuperAdminDashboard/SuperAdminDashboard";
import SuperAdminStudentManagement from "./Components/SuperAdminStudentManagement/SuperAdminStudentManagement";
import SuperAdminCourseManagement from "./Components/SuperAdminCourseManagement/SuperAdminCourseManagement";
import SuperAdminSubjectManagement from "./Components/SuperAdminSubjectManagement/SuperAdminSubjectManagement";
import SuperAdminCollegeManagement from "./Components/SuperAdminCollegeManagement/SuperAdminCollegeManagement";
import SuperAdminProfessorManagement from "./Components/SuperAdminProfessorManagement/SuperAdminProfessorManagement";

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
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<SuperAdminSidebarFunction />}>
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
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
              path="/managements/subjects"
              element={<SuperAdminSubjectManagement />}
            />

            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route element={<AdminSidebarFunction />}>
            <Route
              path="admin/managements/subjects/"
              element={<AdminSubjectManagement />}
            />
            <Route path="/" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
