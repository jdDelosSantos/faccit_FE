import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./UserSidebar.css";

function UserSidebar() {
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
        if (decodedToken.role !== "user") {
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
                <Link to="/user/dashboard">FACCIT</Link>
              </div>
            </div>
            <ul className="sidebar-nav">
              <li className="sidebar-item">
                <Link to="/user/profile" className="sidebar-link ">
                  <i className="lni lni-user"></i>
                  <span>Profile</span>
                </Link>
              </li>

              <li className="sidebar-item">
                <Link to="/user/dashboard" className="sidebar-link">
                  <i className="lni lni-license"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link
                  to="#"
                  className="sidebar-link has-dropdown collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#auth"
                  aria-expanded="true"
                  aria-controls="auth"
                >
                  <i className="lni lni-graph"></i>
                  <span>Laboratories</span>
                </Link>
                <ul
                  id="auth"
                  className="sidebar-dropdown list-unstyle collapse"
                  data-bs-parent="#sidebar"
                >
                  <li className="sidebar-item">
                    <Link
                      to="/user/labs/programming-lab"
                      className="sidebar-link"
                    >
                      Programming Lab
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/user/labs/multimedia-lab"
                      className="sidebar-link"
                    >
                      Multimedia Lab
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-item">
                <Link
                  to="#"
                  className="sidebar-link has-dropdown collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#multi"
                  aria-expanded="true"
                  aria-controls="multi"
                >
                  <i className="lni lni-layout"></i>
                  <span>General Managements</span>
                </Link>
                <ul
                  id="multi"
                  className="sidebar-dropdown list-unstyle collapse"
                  data-bs-parent="#sidebar"
                >
                  <li className="sidebar-item">
                    <Link
                      to="/user/managements/classes"
                      className="sidebar-link"
                    >
                      Class Students
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/user/managements/open-classes"
                      className="sidebar-link"
                    >
                      Open Classes
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/user/managements/attendances/students"
                      className="sidebar-link"
                    >
                      Student Attendances
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="sidebar-item">
                <Link
                  to="#"
                  className="sidebar-link has-dropdown collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#request"
                  aria-expanded="true"
                  aria-controls="request"
                >
                  <i className="lni lni-keyboard"></i>
                  <span>Request Handling</span>
                </Link>
                <ul
                  id="request"
                  className="sidebar-dropdown list-unstyle collapse"
                  data-bs-parent="#sidebar"
                >
                  <li className="sidebar-item">
                    <Link
                      to="/user/managements/makeup-classes"
                      className="sidebar-link"
                    >
                      Makeup Requests
                    </Link>
                  </li>
                  <li className="sidebar-item">
                    <Link
                      to="/user/managements/cancel-classes"
                      className="sidebar-link"
                    >
                      Cancel Requests
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="sidebar-footer">
              <Link
                to="/"
                className="sidebar-link"
                onClick={() => handleLogout()}
              >
                <i className="lni lni-exit"></i>
                <span>Logout</span>
              </Link>
            </div>
          </aside>
          <div className="main"></div>
        </div>
      </div>
    );
  }
}

export default UserSidebar;
