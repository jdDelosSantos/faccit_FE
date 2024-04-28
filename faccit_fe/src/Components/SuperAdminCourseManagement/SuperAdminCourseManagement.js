import React, { useState, useRef, useEffect } from "react";
import "../SuperAdminCourseManagement/SuperAdminCourseManagement.css";
// import { setCourses } from "../../Redux/courses";
import { setColleges } from "../../Redux/colleges";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";
import { jwtDecode } from "jwt-decode";

function SuperAdminCourseManagement() {
  //NEW COURSE USE STATES
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCollege, setCourseCollege] = useState("");

  //UPDATE COURSE USE STATES
  const [updateCourseName, setUpdateCourseName] = useState("");
  const [updateCourseDescription, setUpdateCourseDescription] = useState("");
  const [updateCourseCollege, setUpdateCourseCollege] = useState("");
  const [id, setId] = useState(0);

  const reduxCourses = useSelector((state) => state.course.courses);
  const colleges = useSelector((state) => state.college.colleges);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredSortedData = courses.filter((item) => {
    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchingColumns = [
      "course_name",
      "course_description",
      "college_name",
      "course_status",
    ];

    return searchTerms.every((term) => {
      return matchingColumns.some((column) => {
        const regex = new RegExp(term, "i");
        return regex.test(item[column].toLowerCase());
      });
    });
  });

  const currentItems = filteredSortedData.slice(startIndex, endIndex);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Function for fetching Courses
  const fetchCourses = () => {
    https
      .get("courses", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setCourses(result.data));
        setCourses(result.data);
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        }
        goBackToLogin();
      });
  };

  const fetchColleges = () => {
    https
      .get("colleges", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        dispatch(setColleges(result.data));
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        }
        goBackToLogin();
      });
  };

  useEffect(() => {
    fetchCourses();
    fetchColleges();
  }, []);

  const handleCourseSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  //FUNCTION FOR ADDING A COURSE
  const handleCourseSubmit = (e) => {
    e.preventDefault();

    const courseData = {
      course_name: courseName,
      course_description: courseDescription,
      college_name: courseCollege,
    };

    https
      .post("courses", courseData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchCourses();
        toast.success(result.data.message, { duration: 7000 });

        setCourseName("");
        setCourseDescription("");
        setCourseCollege("");
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleCourseUpdate = (
    course_name,
    course_description,
    college_name
  ) => {
    setUpdateCourseName(course_name);
    setUpdateCourseDescription(course_description);
    setUpdateCourseCollege(college_name);
  };

  //FUNCTION FOR ADDING UPDATING A COURSE
  const handleUpdateCourseSubmit = (e) => {
    e.preventDefault();

    const updateCourseData = {
      course_name: updateCourseName,
      course_description: updateCourseDescription,
      college_name: updateCourseCollege,
    };

    https
      .put(`update_course/${id}`, updateCourseData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchCourses();
        toast.success(result.data.message, { duration: 7000 });
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  const handleCourseDeactivate = (course_name) => {
    const courseData = {
      course_status: "Disabled",
    };

    https
      .put(`course_deactivate/${course_name}`, courseData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.error(result.data.message, { duration: 7000 });
        fetchCourses();
      });
  };

  const handleCourseActivate = (course_name) => {
    const courseData = {
      course_status: "Active",
    };

    https
      .put(`course_activate/${course_name}`, courseData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        fetchCourses();
      });
  };

  const clearUpdateCourse = () => {
    setUpdateCourseName("");
    setUpdateCourseDescription("");
    setUpdateCourseCollege("");
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
          <b>{tokenFirstname}'S COURSE MANAGEMENT PAGE</b>
        </h1>
        <h4 className="">LIST OF COURSES</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Course..."
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
                  <img
                    src={require("../../Assets/images/add.png")}
                    width="25"
                    height="25"
                    style={{
                      TopLeftRadius: ".3rem",
                      TopRightRadius: ".3rem",
                    }}
                    alt="add"
                  />
                </button>
              </div>
            </div>

            <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
              <thead className="table-light">
                <tr>
                  <th>COURSE NAME</th>
                  <th>COURSE DESCRIPTION</th>
                  <th>COURSE COLLEGE</th>
                  <th>COURSE STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((course, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{course.course_name}</td>
                      <td className="p-2">{course.course_description}</td>
                      <td className="p-2">{course.college_name}</td>
                      <td className="p-2">
                        {course.course_status === "Active" ? (
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
                            handleCourseUpdate(
                              course.course_name,
                              course.course_description,
                              course.college_name
                            );
                            setId(course.id);
                          }}
                        >
                          <img
                            src={require("../../Assets/images/update_user.png")}
                            width="25"
                            height="25"
                            style={{
                              TopLeftRadius: ".3rem",
                              TopRightRadius: ".3rem",
                            }}
                            alt="update_user"
                          />
                        </button>
                        {course.course_status == "Active" ? (
                          <button
                            type="button"
                            // data-bs-toggle="modal"
                            // data-bs-target="#staticBackdrop6"
                            className="btn btn-danger mx-2 btn-sm"
                            onClick={() =>
                              handleCourseDeactivate(course.course_name)
                            }
                          >
                            <img
                              src={require("../../Assets/images/cancel.png")}
                              width="25"
                              height="25"
                              style={{
                                TopLeftRadius: ".3rem",
                                TopRightRadius: ".3rem",
                              }}
                              alt="cancel"
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            // data-bs-toggle="modal"
                            // data-bs-target="#staticBackdrop7"
                            className="btn btn-success mx-2 btn-sm"
                            onClick={() =>
                              handleCourseActivate(course.course_name)
                            }
                          >
                            <img
                              src={require("../../Assets/images/enable.png")}
                              width="25"
                              height="25"
                              style={{
                                TopLeftRadius: ".3rem",
                                TopRightRadius: ".3rem",
                              }}
                              alt="enable"
                            />
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
                pageCount={Math.ceil(courses.length / itemsPerPage)}
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

        {/* START OF MODAL FOR ADDING COURSE */}
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
                  <b>CREATE COURSE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleCourseSubmit(e)}>
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
                          COURSE INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Start of Course Name*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="courseName"
                              value={courseName}
                              onChange={(e) => {
                                setCourseName(e.target.value);
                              }}
                              required
                            />
                            <span className="">Course Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Course Description */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="courseDescription"
                              value={courseDescription}
                              onChange={(e) => {
                                setCourseDescription(e.target.value);
                              }}
                              required
                            />
                            <span className="">Course Description</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Course College */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setCourseCollege(e.target.value);
                              }}
                              id="courseCollege"
                              value={courseCollege || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Course College
                              </option>
                              {colleges.length > 0
                                ? colleges
                                    .filter(
                                      (college) =>
                                        college.college_status === "Active"
                                    )
                                    .map((college) => (
                                      <option
                                        key={`${college.id}-${college.college_name}-${college.college_description}`}
                                        value={college.college_name}
                                      >
                                        {college.college_name}
                                      </option>
                                    ))
                                : ""}
                            </select>
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
                      clearUpdateCourse();
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                  >
                    ADD COURSE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR ADDING COURSE */}

        {/* START OF MODAL FOR UPDATING COURSE */}
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
                  <b>UPDATE COURSE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleUpdateCourseSubmit(e)}>
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
                          COURSE INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Start of Course Name*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="updateCourseName"
                              value={updateCourseName}
                              onChange={(e) => {
                                setUpdateCourseName(e.target.value);
                              }}
                              required
                            />
                            <span className="">Course Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Course Description */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="text"
                              id="updateCourseDescription"
                              value={updateCourseDescription}
                              onChange={(e) => {
                                setUpdateCourseDescription(e.target.value);
                              }}
                              required
                            />
                            <span className="">Course Description</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Course College */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setUpdateCourseCollege(e.target.value);
                              }}
                              id="updateCourseCollege"
                              value={updateCourseCollege || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Course College
                              </option>
                              {colleges.length > 0
                                ? colleges
                                    .filter(
                                      (college) =>
                                        college.college_status === "Active"
                                    )
                                    .map((college) => (
                                      <option
                                        key={`${college.id}-${college.college_name}-${college.college_description}`}
                                        value={college.college_name}
                                      >
                                        {college.college_name}
                                      </option>
                                    ))
                                : ""}
                            </select>
                            <span>College</span>
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
                      clearUpdateCourse();
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
        {/* END OF MODAL FOR UPDATING COURSE */}
      </div>
    );
  }
}

export default SuperAdminCourseManagement;
