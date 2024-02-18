import logo from "./logo.svg";
import "./App.css";
import SuperAdminSidebar from "./Components/SuperAdminSidebar/SuperAdminSidebar";
import SuperAdminStudentManagement from "./Components/SuperAdminStudentManagement/SuperAdminStudentManagement";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./Components/LoginPage/LoginPage";

function App() {
  const SuperAdminSidebarFunction = () => (
    <div className="flex-container">
      <SuperAdminSidebar />
      <Outlet />
    </div>
  );

  const AdminSidebarFunction = () => (
    <div className="flex-container">
      <AdminSide />
      <Outlet />
    </div>
  );

  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<SuperAdminSidebarFunction />}>
            <Route
              path="/SuperAdminStudentManagement"
              element={<SuperAdminStudentManagement />}
            />
            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route element={<AdminSidebarFunction />}>
            <Route
              path="/AdminSubjectManagement"
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
