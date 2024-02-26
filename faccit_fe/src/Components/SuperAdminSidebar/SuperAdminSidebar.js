import React, { useState } from "react";
import "./SuperAdminSidebar.css";

function SuperAdminSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    sessionStorage.clear();
  };

  return (
    <div>
      <div className="wrapper">
        <aside id="sidebar" className={isExpanded ? "expand" : ""}>
          <div className="d-flex">
            <button id="toggle-btn" type="button" onClick={toggleSidebar}>
              <i className="lni lni-grid-alt"></i>
            </button>
            <div className="sidebar-logo">
              <a href="#"></a>
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
                <i className="lni lni-agenda"></i>
                <span>List</span>
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
                <i className="lni lni-protection"></i>
                <span>Auth</span>
              </a>
              <ul
                id="auth"
                className="sidebar-dropdown list-unstyle collapse"
                data-bs-parent="#sidebar"
              >
                <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                    Login
                  </a>
                </li>
                <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                    Register
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
                <span>Schedule</span>
              </a>
              <ul
                id="multi"
                className="sidebar-dropdown list-unstyle collapse"
                data-bs-parent="#sidebar"
              >
                <li className="sidebar-item">
                  <a
                    href="#"
                    className="sidebar-link collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#multi-two"
                    aria-expanded="true"
                    aria-controls="multi-two"
                  >
                    Two Links
                  </a>
                  <ul
                    id="multi-two"
                    className="sidebar-dropdown list-unstyled collapse"
                  >
                    <li className="sidebar-item">
                      <a href="#" className="sidebar-link">
                        Link 1
                      </a>
                    </li>
                    <li className="sidebar-item">
                      <a href="#" className="sidebar-link">
                        Link 2
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="sidebar-item">
              <a href="#" className="sidebar-link">
                <i className="lni lni-popup"></i>
                <span>Notification</span>
              </a>
            </li>
            <li className="sidebar-item">
              <a href="#" className="sidebar-link">
                <i className="lni lni-cog"></i>
                <span>Setting</span>
              </a>
            </li>
          </ul>
          <div className="sidebar-footer">
            <a href="/" className="sidebar-link" onClick={() => handleLogout()}>
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

export default SuperAdminSidebar;
