import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
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
      sessionStorage.clear(); // console.warn("No token found in session storage");
      navigate("/");
    }
  }, [navigate]);

  if (component == false) {
    return;
  } else {
    return (
      <div className="base_bg w-100 p-4">
        <h1 className="my-1">
          <b>{tokenFirstname}'S DASHBOARD</b>
        </h1>

        <div className="shadow upper_bg rounded container-fluid w-100 p-4 d-flex flex-column">
          <div className="border container-fluid w-100 d-flex justify-content-md-between mb-5">
            <div className="bg-primary rounded w-25 p-3">
              <h3 className="text-white">CURRENT # OF STUDENTS</h3>
              <span className="text-white">1,403</span>
            </div>
            <div className="bg-secondary rounded w-25 p-3">
              <h3 className="text-white">CURRENT # OF PROFESSORS</h3>
              <span className="text-white">1,403</span>
            </div>
            <div className="bg-success rounded w-25 p-3">
              <h3 className="text-white">CURRENT # OF COURSES</h3>
              <span className="text-white">1,403</span>
            </div>
          </div>
          <div className="container-fluid w-100 mt-5 d-flex">
            <div className="w-75 d-flex flex-column">
              <div className="table-responsive">
                <h3>Newly Added Students</h3>
                <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>FAITH ID</th>
                      <th>LAST NAME</th>
                      <th>FIRST NAME</th>
                      <th>COURSE</th>
                      <th>LEVEL/YEAR</th>
                      <th>SECTION</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <tr>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="table-responsive mt-3">
                <h3>Newly Added Professors</h3>
                <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>FAITH ID</th>
                      <th>LAST NAME</th>
                      <th>FIRST NAME</th>
                      <th>COURSE</th>
                      <th>LEVEL/YEAR</th>
                      <th>SECTION</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    <tr>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                      <td>Hello</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="w-25">
              <div class="table-responsive">
                <table class="table table-striped table-hover table-borderless table-primary align-middle">
                  <thead class="table-light">
                    <caption>Table Name</caption>
                    <tr>
                      <th>Column 1</th>
                      <th>Column 2</th>
                      <th>Column 3</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider">
                    <tr class="table-primary">
                      <td scope="row">Item</td>
                      <td>Item</td>
                      <td>Item</td>
                    </tr>
                    <tr class="table-primary">
                      <td scope="row">Item</td>
                      <td>Item</td>
                      <td>Item</td>
                    </tr>
                  </tbody>
                  <tfoot></tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SuperAdminDashboard;
