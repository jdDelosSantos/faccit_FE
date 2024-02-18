import React from "react";
import "./SuperAdminStudentManagement.css";

function SuperAdminStudentManagement() {
  const handleSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };
  const clark = "Clark";
  return (
    <div className="base_bg w-100 p-5">
      <h1 className="my-4">{clark}'s Student Management Page</h1>
      <div className="upper_bg rounded container-fluid w-100 p-3 px-5">
        <div class="table-responsive">
          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <div className="w-100 d-flex">
              <caption className="">List of Students</caption>
              <form
                className="d-flex w-50 searchbar-form mx-5"
                onSubmit={handleSearchBar}
              >
                <div className="w-100">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Student..."
                      aria-label="Search"
                    />
                    <button
                      className="fa-solid fa-magnifying-glass searchbtn"
                      type="submit"
                      style={{ color: "#ffffff" }}
                    ></button>
                  </div>
                </div>
              </form>
            </div>

            <div className=" w-30 d-flex justify-content-end">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                className="btn btn-primary btn-sm"
              >
                Add Student
              </button>
            </div>
          </div>

          <table class="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead class="table-light">
              <tr>
                <th>FAITH ID</th>
                <th>LAST NAME</th>
                <th>FIRST NAME</th>
                <th>COURSE</th>
                <th>YR & SECTION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr class="table-light">
                <td scope="row">S2019112158</td>
                <td>Delos Santos</td>
                <td>John Daniel</td>
                <td>BSIT</td>
                <td>4A</td>
              </tr>
              <tr key="loading-row">
                <td colSpan="8" className="text-center">
                  <div className="loadcontainer">
                    <div className="loadingspinner">
                      <div id="square1"></div>
                      <div id="square2"></div>
                      <div id="square3"></div>
                      <div id="square4"></div>
                      <div id="square5"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminStudentManagement;
