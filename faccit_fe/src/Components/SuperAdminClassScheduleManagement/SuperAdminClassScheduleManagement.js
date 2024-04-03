import React, { useState, useRef, useEffect } from "react";
import "./SuperAdminClassScheduleManagement.css";
import { jwtDecode } from "jwt-decode";
import { setProfessors } from "../../Redux/professors";
import { setColleges } from "../../Redux/colleges";
import { useDispatch, useSelector } from "react-redux";
import { setClasses } from "../../Redux/classes";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";

function SuperAdminClassScheduleManagement() {
  //NEW SUBJECT USE STATES
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");

  const [classSelected, setClassSelected] = useState("");
  const [classDay, setClassDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  //UPDATE SUBJECT USE STATES
  const [updateClassID, setUpdateClassID] = useState(0);
  const [updateClassCode, setUpdateClassCode] = useState("");
  const [updateClassDay, setUpdateClassDay] = useState("");
  const [updateStartTime, setUpdateStartTime] = useState("");
  const [updateEndTime, setUpdateEndTime] = useState("");

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [classSchedules, setClassSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortClassSchedule = classSchedules
    .sort((classes1, classes2) =>
      classes1.class.class_name.localeCompare(classes2.class.class_name)
    )
    .filter(
      (item) =>
        item.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.class_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.class_day.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.start_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.end_time.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentItems = sortClassSchedule.slice(startIndex, endIndex);

  const classes = useSelector((state) => state.class.classes);
  const professors = useSelector((state) => state.professor.professors);
  const colleges = useSelector((state) => state.college.colleges);

  const [classCollege, setClassCollege] = useState("");
  const [updateClassCollege, setUpdateClassCollege] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Function for fetching Class Schedules
  const fetchClassSchedules = () => {
    https
      .get("class_schedule", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setSubjects(result.data));
        setClassSchedules(result.data);
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

  //Function for fetching Classes
  const fetchClasses = () => {
    https
      .get("classes", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        dispatch(setClasses(result.data));
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
    fetchClassSchedules();
    // fetchProfessors();
    fetchClasses();
  }, []);

  const handleSubjectSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  //FUNCTION FOR ADDING A COURSE
  const handleClassSubmit = (e) => {
    e.preventDefault();

    const classScheduleData = {
      class_code: classCode,
      class_day: classDay,
      start_time: startTime,
      end_time: endTime,
    };

    console.log(classScheduleData);
    https
      .post("class_schedule", classScheduleData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchClassSchedules();
        toast.success(result.data.message, { duration: 7000 });

        setClassCode("");
        setClassName("");
        setClassDay("");
        setStartTime("");
        setEndTime("");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleClassUpdate = (class_code, class_day, start_time, end_time) => {
    setUpdateClassCode(class_code);
    setUpdateClassDay(class_day);
    setUpdateStartTime(start_time);
    setUpdateEndTime(end_time);
  };

  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleClassDelete = (id) => {
    https
      .delete(`delete_class_schedule/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchClassSchedules();
        toast.success(result.data.message, { duration: 7000 });
      })
      .catch((error) => {
        console.log(error);
        if (error.response.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  //FUNCTION FOR ADDING UPDATING A SUBJECT
  const handleUpdateClassSubmit = (e) => {
    e.preventDefault();

    const updateClassData = {
      id: updateClassID,
      class_code: updateClassCode,
      class_day: updateClassDay,
      start_time: updateStartTime,
      end_time: updateEndTime,
    };
    console.log(updateClassData);

    https
      .put(`update_class_schedule/${updateClassID}`, updateClassData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchClassSchedules();
        toast.success(result.data.message, { duration: 7000 });

        clearUpdateClass();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  const clearClass = () => {
    setClassCode("");
    setClassDay("");
    setStartTime("");
    setEndTime("");
    setErrorMessage("");
  };

  const clearUpdateClass = () => {
    setUpdateClassCode("");
    setUpdateClassDay("");
    setUpdateStartTime("");
    setUpdateEndTime("");
    setErrorMessage("");
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
          <b>{tokenFirstname}'S CLASS SCHEDULE MANAGEMENT PAGE</b>
        </h1>
        <h4 className="">LIST OF CLASS SCHEDULES</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Class Schedules..."
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
                  data-bs-target="#staticBackdrop"
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
                  <th>CLASS CODE</th>
                  <th>CLASS NAME</th>
                  <th>CLASS DAY</th>
                  <th>START TIME</th>
                  <th>END TIME</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((classes, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{classes.class_code}</td>
                      <td className="p-2">{classes.class.class_name}</td>
                      <td className="p-2">{classes.class_day}</td>
                      <td className="p-2">{classes.start_time}</td>
                      <td className="p-2">{classes.end_time}</td>
                      <td className="p-2">
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop1"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            handleClassUpdate(
                              classes.class_code,
                              classes.class_day,
                              classes.start_time,
                              classes.end_time
                            );
                            setUpdateClassID(classes.id);
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
                        <button
                          type="button"
                          className="btn btn-danger mx-2 btn-sm"
                          onClick={() => {
                            handleClassDelete(classes.id);
                          }}
                        >
                          <img
                            src={require("../../Assets/images/delete.png")}
                            width="25"
                            height="25"
                            style={{
                              TopLeftRadius: ".3rem",
                              TopRightRadius: ".3rem",
                            }}
                            alt="delete"
                          />
                        </button>
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
                pageCount={Math.ceil(classSchedules.length / itemsPerPage)}
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
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  <b>CREATE CLASS SCHEDULE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleClassSubmit(e)}>
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
                          CLASS INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Start of Class Select */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setClassCode(e.target.value);
                              }}
                              id="classCode"
                              value={classCode || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Class
                              </option>
                              {classes.length > 0
                                ? classes
                                    .filter(
                                      (classes) =>
                                        classes.class_status === "Active"
                                    )
                                    .sort((classes1, classes2) =>
                                      classes1.class_name.localeCompare(
                                        classes2.class_name
                                      )
                                    )
                                    .map((classes) => (
                                      <option
                                        key={`${classes.id}-${classes.class_name}-${classes.class_description}`}
                                        value={classes.class_code}
                                      >
                                        {classes.class_name}
                                      </option>
                                    ))
                                : ""}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class day*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setClassDay(e.target.value);
                                setErrorMessage("");
                              }}
                              id="classDay"
                              value={classDay || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Day
                              </option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Start time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="time"
                              id="startTime"
                              value={startTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setStartTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Start of Class End time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="time"
                              id="endTime"
                              value={endTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setEndTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <p>
                        <i>
                          Note: Mininum time is 07:30 am and Maximum time is
                          09:00pm
                        </i>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      clearClass();
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                  >
                    ADD CLASS
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR ADDING CLASS */}

        {/* MODAL FOR UPDATING CLASS */}
        <div
          className="modal fade"
          id="staticBackdrop1"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel1">
                  <b>UPDATE CLASS SCHEDULE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleUpdateClassSubmit(e)}>
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
                          CLASS INFORMATION
                        </h1>
                      </div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* Start of Class Select */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              type="text"
                              id="updateClassCode"
                              value={updateClassCode}
                              onChange={(e) => {
                                setUpdateClassCode(e.target.value);
                              }}
                              required
                              disabled
                            />
                            <span className="">Class Code</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class day*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setUpdateClassDay(e.target.value);
                                setErrorMessage("");
                              }}
                              id="updateClassDay"
                              value={updateClassDay || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Day
                              </option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Start time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="time"
                              id="updateStartTime"
                              value={updateStartTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setUpdateStartTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Start of Class End time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox1 w-100">
                            <input
                              type="time"
                              id="updateEndTime"
                              value={updateEndTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setUpdateEndTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <p>
                        <i>
                          Note: Mininum time is 07:30 am and Maximum time is
                          09:00pm
                        </i>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      clearUpdateClass();
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
        {/*END OF MODAL FOR UPDATING CLASS */}
      </div>
    );
  }
}
export default SuperAdminClassScheduleManagement;
