import React, { useState, useRef, useEffect } from "react";
import "../SuperAdminCollegeManagement/SuperAdminCollegeManagement.css";
// import { setColleges } from "../../Redux/colleges";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";
import { jwtDecode } from "jwt-decode";

function SuperAdminCollegeManagement() {
  //NEW COLLEGE USE STATES
  const [collegeName, setCollegeName] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");

  //UPDATE COLLEGE USE STATES
  const [updateCollegeName, setUpdateCollegeName] = useState("");
  const [updateCollegeDescription, setUpdateCollegeDescription] = useState("");

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [colleges, setColleges] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredSortedData = colleges.filter((item) => {
    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchingColumns = [
      "college_name",
      "college_description",
      "college_status",
    ];

    return searchTerms.every((term) => {
      return matchingColumns.some((column) => {
        const regex = new RegExp(term, "i");
        return regex.test(item[column].toLowerCase());
      });
    });
  });

  const currentItems = filteredSortedData.slice(startIndex, endIndex);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Function for fetching colleges
  const fetchColleges = () => {
    https
      .get("colleges", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setColleges(result.data));
        setColleges(result.data);
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleCollegeSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  //FUNCTION FOR ADDING A COLLEGE
  const handleCollegeSubmit = (e) => {
    e.preventDefault();

    const collegeData = {
      college_name: collegeName,
      college_description: collegeDescription,
    };

    https
      .post("colleges", collegeData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchColleges();
        toast.success(result.data.message, { duration: 7000 });

        setCollegeName("");
        setCollegeDescription("");
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  //FUNCTION FOR PUTTING SELECTED COLLEGE TO UPDATE FIELDS
  const handleCollegeUpdate = (college_name, college_description) => {
    setUpdateCollegeName(college_name);
    setUpdateCollegeDescription(college_description);
  };

  //FUNCTION FOR ADDING UPDATING A COLLEGE
  const handleUpdateCollegeSubmit = (e) => {
    e.preventDefault();

    const updateCollegeData = {
      college_name: updateCollegeName,
      college_description: updateCollegeDescription,
    };

    https
      .put(`update_college/${updateCollegeName}`, updateCollegeData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchColleges();
        toast.success(result.data.message, { duration: 7000 });
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  const handleCollegeDeactivate = (college_name) => {
    const collegeData = {
      college_status: "Disabled",
    };

    https
      .put(`college_deactivate/${college_name}`, collegeData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.error(result.data.message, { duration: 7000 });
        fetchColleges();
      });
  };

  const handleCollegeActivate = (college_name) => {
    const collegeData = {
      college_status: "Active",
    };

    https
      .put(`college_activate/${college_name}`, collegeData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        fetchColleges();
      });
  };

  const clearCollege = () => {
    setCollegeName("");
    setCollegeDescription("");
  };

  const clearUpdateCollege = () => {
    setUpdateCollegeName("");
    setUpdateCollegeDescription("");
  };

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const [tokenFirstname, setTokenFirstname] = useState("");
  const [component, setComponent] = useState(false);

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
          <b>{tokenFirstname}'S COLLEGE MANAGEMENT PAGE</b>
        </h1>
        <h4 className="">LIST OF COLLEGES</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search College..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-25 d-flex justify-content-end">
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop4"
                  className="btn btn-primary btn-sm"
                >
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4 2C2.34315 2 1 3.34315 1 5V9V10V19C1 20.6569 2.34315 22 4 22H12C12.5523 22 13 21.5523 13 21C13 20.4477 12.5523 20 12 20H4C3.44772 20 3 19.5523 3 19V10V9C3 8.44772 3.44772 8 4 8H11.7808H13.5H20.1C20.5971 8 21 8.40294 21 8.9V9C21 9.55228 21.4477 10 22 10C22.5523 10 23 9.55228 23 9V8.9C23 7.29837 21.7016 6 20.1 6H13.5H11.7808L11.3489 4.27239C11.015 2.93689 9.81505 2 8.43845 2H4ZM4 6C3.64936 6 3.31278 6.06015 3 6.17071V5C3 4.44772 3.44772 4 4 4H8.43845C8.89732 4 9.2973 4.3123 9.40859 4.75746L9.71922 6H4ZM20 13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13V16H15C14.4477 16 14 16.4477 14 17C14 17.5523 14.4477 18 15 18H18V21C18 21.5523 18.4477 22 19 22C19.5523 22 20 21.5523 20 21V18H23C23.5523 18 24 17.5523 24 17C24 16.4477 23.5523 16 23 16H20V13Z"
                        fill="#ffffff"
                      />
                    </g>
                  </svg>
                </button>
              </div>
            </div>

            <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
              <thead className="table-light">
                <tr>
                  <th>COLLEGE NAME</th>
                  <th>COLLEGE DESCRIPTION</th>
                  <th>COLLEGE STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((college, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{college.college_name}</td>
                      <td className="p-2">{college.college_description}</td>
                      <td className="p-2">
                        {college.college_status === "Active" ? (
                          <span style={{ color: "green" }}>ACTIVE</span>
                        ) : (
                          <span style={{ color: "red" }}>DISABLED</span>
                        )}
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop5"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            handleCollegeUpdate(
                              college.college_name,
                              college.college_description
                            );
                          }}
                        >
                          <svg
                            fill="#ffffff"
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            id="update-alt-2"
                            data-name="Flat Line"
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon flat-line"
                            stroke="#ffffff"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              <path
                                id="primary"
                                d="M6,5H16a2,2,0,0,1,2,2v7"
                                style={{
                                  fill: "none",
                                  stroke: "#ffffff",
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                }}
                              />
                              <path
                                id="primary-2"
                                data-name="primary"
                                d="M18,19H8a2,2,0,0,1-2-2V10"
                                style={{
                                  fill: "none",
                                  stroke: "#ffffff",
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                }}
                              />
                              <polyline
                                id="primary-3"
                                data-name="primary"
                                points="15 11 18 14 21 11"
                                style={{
                                  fill: "none",
                                  stroke: "#ffffff",
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                }}
                              />
                              <polyline
                                id="primary-4"
                                data-name="primary"
                                points="9 13 6 10 3 13"
                                style={{
                                  fill: "none",
                                  stroke: "#ffffff",
                                  strokeLinecap: "round",
                                  strokeLinejoin: "round",
                                  strokeWidth: 2,
                                }}
                              />
                            </g>
                          </svg>
                        </button>
                        {college.college_status == "Active" ? (
                          <button
                            type="button"
                            // data-bs-toggle="modal"
                            // data-bs-target="#staticBackdrop6"
                            className="btn btn-danger mx-2 btn-sm"
                            onClick={() =>
                              handleCollegeDeactivate(college.college_name)
                            }
                          >
                            <svg
                              width="25"
                              height="25"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <g id="SVGRepo_iconCarrier">
                                <path
                                  d="M19 18.0039V17C19 15.8954 18.1046 15 17 15C15.8954 15 15 15.8954 15 17V18.0039M10 21H4C4 17.134 7.13401 14 11 14C11.3395 14 11.6734 14.0242 12 14.0709M15.5 21H18.5C18.9659 21 19.1989 21 19.3827 20.9239C19.6277 20.8224 19.8224 20.6277 19.9239 20.3827C20 20.1989 20 19.9659 20 19.5C20 19.0341 20 18.8011 19.9239 18.6173C19.8224 18.3723 19.6277 18.1776 19.3827 18.0761C19.1989 18 18.9659 18 18.5 18H15.5C15.0341 18 14.8011 18 14.6173 18.0761C14.3723 18.1776 14.1776 18.3723 14.0761 18.6173C14 18.8011 14 19.0341 14 19.5C14 19.9659 14 20.1989 14.0761 20.3827C14.1776 20.6277 14.3723 20.8224 14.6173 20.9239C14.8011 21 15.0341 21 15.5 21ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                                  stroke="#ffffff"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            // data-bs-toggle="modal"
                            // data-bs-target="#staticBackdrop7"
                            className="btn btn-success mx-2 btn-sm"
                            onClick={() =>
                              handleCollegeActivate(college.college_name)
                            }
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              width="25"
                              height="25"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <g id="SVGRepo_iconCarrier">
                                <path
                                  d="M14.9999 15.2547C13.8661 14.4638 12.4872 14 10.9999 14C7.40399 14 4.44136 16.7114 4.04498 20.2013C4.01693 20.4483 4.0029 20.5718 4.05221 20.6911C4.09256 20.7886 4.1799 20.8864 4.2723 20.9375C4.38522 21 4.52346 21 4.79992 21H9.94465M13.9999 19.2857L15.7999 21L19.9999 17M14.9999 7C14.9999 9.20914 13.2091 11 10.9999 11C8.79078 11 6.99992 9.20914 6.99992 7C6.99992 4.79086 8.79078 3 10.9999 3C13.2091 3 14.9999 4.79086 14.9999 7Z"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </g>
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="table-light" key="loading-row">
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
                )}
              </tbody>
            </table>
            <div className="d-flex flex-row">
              <ReactPaginate
                nextLabel="Next >"
                onPageChange={(event) => setCurrentPage(event.selected)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={Math.ceil(colleges.length / itemsPerPage)}
                previousLabel="< Previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
            </div>
          </div>
        </div>

        {/* START OF MODAL FOR ADDING  COLLEGE*/}
        <div
          className="modal fade"
          id="staticBackdrop4"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel4"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel4">
                  <b>CREATE COLLEGE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleCollegeSubmit(e)}>
                <div className="modal-body">
                  <div className="row d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../../Assets/images/faith-cover-1280x420.png")}
                      className="w-100 rounded-top"
                      style={{
                        TopLeftRadius: ".3rem",
                        TopRightRadius: ".3rem",
                      }}
                      alt="cover"
                    />

                    <div className="card-body p-4 p-md-5">
                      <div className="container d-flex justify-content-center">
                        <h1 className="fontfam fw-bolder mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-justify">
                          COLLEGE INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}
                      <h1></h1>
                      {/* Start of College Name */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="collegeName"
                              value={collegeName}
                              onChange={(e) => {
                                setCollegeName(e.target.value);
                                setError(false);
                              }}
                              maxLength="4"
                              required
                            />
                            <span className="">College Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of College Description */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="collegeDescription"
                              value={collegeDescription}
                              onChange={(e) => {
                                setCollegeDescription(e.target.value);
                              }}
                              required
                            />
                            <span className="">College Description</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      clearCollege();
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                  >
                    ADD COLLEGE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR ADDING COLLEGE */}

        {/* START OF MODAL FOR UPDATING COLLEGE */}
        <div
          className="modal fade"
          id="staticBackdrop5"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel5"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel5">
                  <b>UPDATE COLLEGE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleUpdateCollegeSubmit(e)}>
                <div className="modal-body">
                  <div className="row d-flex justify-content-center align-items-center h-100">
                    <img
                      src={require("../../Assets/images/faith-cover-1280x420.png")}
                      className="w-100 rounded-top"
                      style={{
                        TopLeftRadius: ".3rem",
                        TopRightRadius: ".3rem",
                      }}
                      alt="cover"
                    />

                    <div className="card-body p-4 p-md-5">
                      <div className="container d-flex justify-content-center">
                        <h1 className="fontfam fw-bolder mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-justify">
                          COLLEGE INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}
                      <h1></h1>

                      {/* Start of College Name*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              type="text"
                              id="updateCollegeName"
                              value={updateCollegeName}
                              onChange={(e) => {
                                setUpdateCollegeName(e.target.value);
                              }}
                              required
                            />
                            <span className="">College Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of College Description */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="updateCollegeDescription"
                              value={updateCollegeDescription}
                              onChange={(e) => {
                                setUpdateCollegeDescription(e.target.value);
                              }}
                              required
                            />
                            <span className="">College Description</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      clearUpdateCollege();
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR UPDATING Coolege */}
      </div>
    );
  }
}
export default SuperAdminCollegeManagement;
