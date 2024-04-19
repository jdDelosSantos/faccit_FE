import React, { useState, useRef, useEffect } from "react";
import "../SuperAdminMakeupClassRequests/SuperAdminMakeupClassRequests.css";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";

function SuperAdminMakeupClassRequests() {
  //NEW SUBJECT USE STATES
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");

  const [laboratory, setLaboratory] = useState("");
  const [classDay, setClassDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [classSchedules, setClassSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortClassSchedule = classSchedules
    .sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .filter(
      (item) =>
        item.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.class_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.class_day.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.professor.user_firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.professor.user_lastname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.created_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.start_time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.end_time.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const currentItems = sortClassSchedule.slice(startIndex, endIndex);

  const professors = useSelector((state) => state.professor.professors);
  const colleges = useSelector((state) => state.college.colleges);

  const [classCollege, setClassCollege] = useState("");
  const [updateClassCollege, setUpdateClassCollege] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [text, setText] = useState("");

  const [absentClassCode, setAbsentClassCode] = useState("");
  const [absentClassDay, setAbsentClassDay] = useState("");
  const [absentStartTime, setAbsentStartTime] = useState("");
  const [absentEndTime, setAbsentEndTime] = useState("");
  const [absentLaboratory, setAbsentLaboratory] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const [classes, setClasses] = useState([]);
  // const classes = useSelector((state) => state.class.classes);
  const sessionToken = sessionStorage.getItem("Token");
  const decoded = jwtDecode(sessionToken);
  const tokenId = decoded.prof_id;

  //Function for fetching Class Schedules
  const fetchClassSchedules = () => {
    https
      .get("makeup_classes", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setSubjects(result.data));
        setClassSchedules(result.data);
        console.log(result.data);
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
        setClasses(result.data);
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

  const [id, setId] = useState(0);
  const [status, setStatus] = useState("");
  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleClassUpdate = (
    id,
    class_name,
    class_code,
    class_day,
    laboratory,
    start_time,
    end_time,
    makeup_class_status
  ) => {
    setId(id);

    setLaboratory(laboratory);
    setClassCode(class_code);
    setClassName(class_name);
    setClassDay(class_day);
    setStartTime(start_time);
    setEndTime(end_time);

    setStatus(makeup_class_status);
  };

  const clearClass = () => {
    setAbsentClassCode("");
    setAbsentClassDay("");
    setAbsentStartTime("");
    setAbsentEndTime("");
    setClassCode("");
    setClassDay("");
    setStartTime("");
    setEndTime("");
    setErrorMessage("");
    setStatus("");
  };

  const handleMakeUpClassRequest = (e) => {
    e.preventDefault();

    const forApproval = {
      class_code: classCode,
      class_day: classDay,
      start_time: startTime,
      end_time: endTime,
      laboratory: laboratory,
    };

    console.log(forApproval);

    try {
      https
        .post(`approve_makeup_class/${id}`, forApproval, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          fetchClassSchedules();
          toast.success(result.data.message, { duration: 7000 });
        })
        .catch((error) => {
          if (error.response.data.message != "Unauthenticated.") {
            setError(true);
            console.log(error.response.data);
            setErrorMessage(error.response.data.message);
            toast.error(error.response.data.message, { duration: 7000 });
          } else {
            console.log(error.response.data.message);
            goBackToLogin();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleMakeUpClassReject = () => {
    const data = {
      id: id,
    };

    try {
      https
        .post(`reject_makeup_class`, data, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          fetchClassSchedules();
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
    } catch (error) {
      console.log(error);
    }
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
          <b>{tokenFirstname}'S MAKEUP CLASS REQUESTS PAGE</b>
        </h1>
        <h4 className="">LIST OF MAKEUP CLASS REQUESTS</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Makeup Classes..."
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
                {/* <button
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
                </button> */}
              </div>
            </div>

            <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
              <thead className="table-light">
                <tr>
                  <th>DATE</th>
                  <th>MAKEUP CLASS REQUESTER</th>
                  <th>CLASS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((makeup, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{makeup.created_date}</td>
                      <td className="p-2">
                        {makeup.professor.user_lastname},{" "}
                        {makeup.professor.user_firstname}
                      </td>
                      <td className="p-2">{makeup.class.class_name}</td>
                      {makeup.makeup_class_status === "Pending" ? (
                        <td className="p-2 text-warning">
                          {makeup.makeup_class_status}
                        </td>
                      ) : makeup.makeup_class_status === "Approved" ? (
                        <td className="p-2 text-success">
                          {makeup.makeup_class_status}
                        </td>
                      ) : (
                        <td className="p-2 text-danger">
                          {makeup.makeup_class_status}
                        </td>
                      )}

                      {makeup.makeup_class_status === "Pending" ? (
                        <td className="p-2">
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop1"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              handleClassUpdate(
                                makeup.id,
                                makeup.class.class_name,
                                makeup.class_code,
                                makeup.class_day,
                                makeup.laboratory,
                                makeup.start_time,
                                makeup.end_time,
                                makeup.makeup_class_status
                              );
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
                        </td>
                      ) : makeup.makeup_class_status === "Approved" ? (
                        <td className="p-2">
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop1"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              handleClassUpdate(
                                makeup.id,
                                makeup.class.class_name,
                                makeup.class_code,
                                makeup.class_day,
                                makeup.laboratory,
                                makeup.start_time,
                                makeup.end_time,
                                makeup.makeup_class_status
                              );
                            }}
                          >
                            <img
                              src={require("../../Assets/images/list.png")}
                              width="25"
                              height="25"
                              style={{
                                TopLeftRadius: ".3rem",
                                TopRightRadius: ".3rem",
                              }}
                              alt="update_user"
                            />
                          </button>
                        </td>
                      ) : (
                        <td className="p-2">
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop1"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              handleClassUpdate(
                                makeup.id,
                                makeup.class.class_name,
                                makeup.class_code,
                                makeup.class_day,
                                makeup.laboratory,
                                makeup.start_time,
                                makeup.end_time,
                                makeup.makeup_class_status
                              );
                            }}
                          >
                            <img
                              src={require("../../Assets/images/list.png")}
                              width="25"
                              height="25"
                              style={{
                                TopLeftRadius: ".3rem",
                                TopRightRadius: ".3rem",
                              }}
                              alt="update_user"
                            />
                          </button>
                        </td>
                      )}
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
                  <b>MAKEUP CLASS SCHEDULE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleMakeUpClassRequest(e)}>
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
                      <div className="container d-flex justify-content-center"></div>
                      {error == true ? (
                        <div className="d-flex justify-content-center">
                          <p className="text-danger fs-4">{errorMessage}</p>
                        </div>
                      ) : (
                        ""
                      )}

                      <h3 className="text-center">
                        Requested Makeup Class Schedule
                      </h3>

                      {/* Start of Class Select */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setClassCode(e.target.value);
                              }}
                              id="classCode"
                              value={classCode || ""}
                              required
                              disabled
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
                          <div className="inputBox2 w-100">
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
                              disabled
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
                          <div className="inputBox2 w-100">
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
                              disabled
                            />
                            <span>Start Time</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class End time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
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
                              disabled
                            />
                            <span>End Time</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Laboratory*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => setLaboratory(e.target.value)}
                              id="laboratory"
                              value={laboratory || ""}
                              disabled
                              required
                            >
                              <option value="" disabled>
                                Select a Laboratory
                              </option>
                              <option key={laboratory} value={laboratory}>
                                {laboratory === "lab_multimedia"
                                  ? "Multimedia Lab"
                                  : laboratory === "lab_programming"
                                  ? "Programming Lab"
                                  : laboratory}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i>
                          Note: Minimum time is 07:30 am and Maximum time is
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

                  {status === "Pending" ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger mb-1"
                        data-bs-dismiss="modal"
                        onClick={handleMakeUpClassReject}
                      >
                        REJECT
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success mb-1"
                        data-bs-dismiss="modal"
                      >
                        APPROVE
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        {/*END OF MODAL FOR UPDATING CLASS */}

        <div
          className="modal fade"
          id="staticBackdrop2"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel2"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel2"></h5>
              </div>
              <div className="modal-body">Makeup Class has been Approved</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="staticBackdrop3"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel3"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel3"></h5>
              </div>
              <div className="modal-body">Makeup Class has been Rejected</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SuperAdminMakeupClassRequests;
