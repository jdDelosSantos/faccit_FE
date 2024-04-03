import React, { useState, useEffect } from "react";
import "./SuperAdminSidebar.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function SuperAdminSidebar() {
  const [isExpanded, setIsExpanded] = useState(
    localStorage.getItem("isSidebarExpanded") === "true" ? true : false
  );

  // Update localStorage when the isExpanded state changes
  useEffect(() => {
    localStorage.setItem("isSidebarExpanded", isExpanded);
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    sessionStorage.clear();
  };

  const [tokenFirstname, setTokenFirstname] = useState("");
  const [component, setComponent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("Token");
    // Check if token exists and is not empty
    if (sessionToken && sessionToken.length > 0) {
      try {
        const decodedToken = jwtDecode(sessionToken);
        // Use the decoded token for role checks
        if (decodedToken.role !== "super_admin") {
          sessionStorage.clear();
          navigate("/");
        } else {
          setTokenFirstname(decodedToken.user_firstname.toUpperCase());
          setComponent(true);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle the decoding error (e.g., redirect to login)
        sessionStorage.clear();
        navigate("/");
      }
    } else {
      // console.warn("No token found in session storage");
      sessionStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  if (component == false) {
    return;
  } else {
    return (
      <div>
        <div className="wrapper">
          <aside id="sidebar" className={isExpanded ? "expand" : ""}>
            <div className="d-flex">
              <button id="toggle-btn" type="button" onClick={toggleSidebar}>
                <i className="lni lni-grid-alt"></i>
              </button>
              <div className="sidebar-logo">
                <a href="#">FACCIT</a>
              </div>
            </div>
            <ul className="sidebar-nav">
              <li className="sidebar-item">
                <a href="#" className="sidebar-link ">
                  <i className="lni lni-user"></i>
                  <span>Profile</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  <i className="lni lni-cog"></i>
                  <span>Settings</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a href="/dashboard" className="sidebar-link">
                  <i className="lni lni-license"></i>
                  <span>Dashboard</span>
                </a>
              </li>
              <li className="sidebar-item">
                <a
                  href="#"
                  className="sidebar-link has-dropdown collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#auth"
                  aria-expanded="true"
                  aria-controls="auth"
                >
                  <i className="lni lni-graph"></i>
                  <span>Laboratories</span>
                </a>
                <ul
                  id="auth"
                  className="sidebar-dropdown list-unstyle collapse"
                  data-bs-parent="#sidebar"
                >
                  <li className="sidebar-item">
                    <a href="/labs/programming-lab" className="sidebar-link">
                      Programming Lab
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/labs/multimedia-lab" className="sidebar-link">
                      Multimedia Lab
                    </a>
                  </li>
                </ul>
              </li>
              <li className="sidebar-item">
                <a
                  href="#"
                  className="sidebar-link has-dropdown collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#multi"
                  aria-expanded="true"
                  aria-controls="multi"
                >
                  <i className="lni lni-layout"></i>
                  <span>Managements</span>
                </a>
                <ul
                  id="multi"
                  className="sidebar-dropdown list-unstyle collapse"
                  data-bs-parent="#sidebar"
                >
                  <li className="sidebar-item">
                    <a href="/managements/students" className="sidebar-link">
                      Students
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/managements/professors" className="sidebar-link">
                      Professors
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/managements/colleges" className="sidebar-link">
                      Colleges
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="/managements/courses" className="sidebar-link">
                      Courses
                    </a>
                  </li>

                  <li className="sidebar-item">
                    <a href="/managements/classes" className="sidebar-link">
                      Classes
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a
                      href="/managements/classes/schedules"
                      className="sidebar-link"
                    >
                      Class Schedules
                    </a>
                  </li>
                </ul>
              </li>
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  <i className="lni lni-popup"></i>
                  <span>Notification</span>
                </a>
              </li>
            </ul>
            <div className="sidebar-footer">
              <a
                href="/"
                className="sidebar-link"
                onClick={() => handleLogout()}
              >
                <i className="lni lni-exit"></i>
                <span>Logout</span>
              </a>
            </div>
          </aside>
          <div className="main"></div>
        </div>
      </div>
    );
  }
}
export default SuperAdminSidebar;
