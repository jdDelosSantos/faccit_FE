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
import SuperAdminStudentCourseManagement from "./Components/SuperAdminStudentCourseManagement/SuperAdminStudentCourseManagement";

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
      <TESTING />
      {/* <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<SuperAdminSidebarFunction />}>
            <Route
              path="/managements/student&courses"
              element={<SuperAdminStudentCourseManagement />}
            />
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route element={<AdminSidebarFunction />}>
            <Route
              path="/SubjectManagement"
              element={<AdminSubjectManagement />}
            />
            <Route path="/" element={<LoginPage />} />
          </Route>
        </Routes>
      </Router> */}
    </div>
  );
}

export default App;
