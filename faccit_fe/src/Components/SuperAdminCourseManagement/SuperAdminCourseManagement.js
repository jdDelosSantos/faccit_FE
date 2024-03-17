import React, { useState, useRef, useEffect } from "react";
import "../SuperAdminCourseManagement/SuperAdminCourseManagement.css";
import { setCourses } from "../../Redux/courses";
import { setColleges } from "../../Redux/colleges";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";

function SuperAdminCourseManagement() {
  //NEW COURSE USE STATES
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseCollege, setCourseCollege] = useState("");

  //UPDATE COURSE USE STATES
  const [updateCourseCode, setUpdateCourseCode] = useState("");
  const [updateCourseName, setUpdateCourseName] = useState("");
  const [updateCourseDescription, setUpdateCourseDescription] = useState("");
  const [updateCourseCollege, setUpdateCourseCollege] = useState("");

  const courses = useSelector((state) => state.course.courses);
  const colleges = useSelector((state) => state.college.colleges);
  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();

  const dispatch = useDispatch();

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
        dispatch(setCourses(result.data));
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        }
        console.log(error.response.data.message);
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
        console.log(colleges);
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        }
        console.log(error.response.data.message);
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
      course_code: courseCode,
      course_name: courseName,
      course_description: courseDescription,
      course_college: courseCollege,
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

        setCourseCode("");
        setCourseName("");
        setCourseDescription("");
        setCourseCollege("");
      })
      .catch((error) => {
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        }

        console.log(error.response.data.message);
        goBackToLogin();
      });
  };

  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleCourseUpdate = (
    course_code,
    course_name,
    course_description,
    course_college
  ) => {
    setUpdateCourseCode(course_code);
    setUpdateCourseName(course_name);
    setUpdateCourseDescription(course_description);
    setUpdateCourseCollege(course_college);
  };

  //FUNCTION FOR ADDING UPDATING A COURSE
  const handleUpdateCourseSubmit = (e) => {
    e.preventDefault();
  };

  const handleCourseDeactivate = () => {};

  const handleCourseActivate = () => {};

  const clearUpdateCourse = () => {
    setUpdateCourseCode("");
    setUpdateCourseName("");
    setUpdateCourseDescription("");
    setUpdateCourseCollege("");
  };

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="base_bg w-100 p-4">
      <h1 className="my-1">
        <b>{NametoUpperCase}'S COURSE MANAGEMENT PAGE</b>
      </h1>
      <h4 className="">LIST OF COURSES</h4>
      <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
        <div className="table-responsive">
          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <div className="w-100 d-flex">
              <form
                className="d-flex w-75 searchbar-form"
                onSubmit={handleCourseSearchBar}
              >
                <div className="w-100">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Course..."
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

            <div className="w-25 d-flex justify-content-end">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop4"
                className="btn btn-primary btn-sm"
              >
                ADD COURSE
              </button>
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>COURSE CODE</th>
                <th>COURSE NAME</th>
                <th>COURSE DESCRIPTION</th>
                <th>COURSE COLLEGE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{course.course_code}</td>
                    <td className="p-2">{course.course_name}</td>
                    <td className="p-2">{course.course_description}</td>
                    <td className="p-2">{course.course_college}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop5"
                        className="btn btn-primary"
                        onClick={() => {
                          handleCourseUpdate(
                            course.course_code,
                            course.course_name,
                            course.course_description,
                            course.course_college
                          );
                        }}
                      >
                        UPDATE
                      </button>
                      {course.course_status == "Active" ? (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop6"
                          className="btn btn-danger mx-3"
                          onClick={handleCourseDeactivate()}
                        >
                          DEACTIVATE
                        </button>
                      ) : (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop7"
                          className="btn btn-success mx-3"
                          onClick={handleCourseActivate()}
                        >
                          REACTIVATE
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
                    <h1></h1>
                    {/* Start of Course Code */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="courseCode"
                            value={courseCode}
                            onChange={(e) => {
                              setCourseCode(e.target.value);
                              setError(false);
                            }}
                            maxLength="4"
                            required
                          />
                          <span className="">Course Code</span>
                        </div>
                      </div>
                    </div>

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
                              ? colleges.map((college) => (
                                  <option
                                    key={college.id}
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
                    <h1></h1>
                    {/* Start of Course Code */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox2 w-100">
                          <input
                            type="text"
                            id="updateCourseCode"
                            value={updateCourseCode}
                            onChange={(e) => {
                              setUpdateCourseCode(e.target.value);
                              setError(false);
                            }}
                            maxLength="4"
                            required
                            disabled
                          />
                          <span className="">Course Code</span>
                        </div>
                      </div>
                    </div>

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
                        <div className="inputBox1 w-100">
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
                              ? colleges.map((college) => (
                                  <option
                                    key={college.id}
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

export default SuperAdminCourseManagement;
