import React, { useState, useRef, useEffect } from "react";
import "./UserStudentAttendancePage.css";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ReactPaginate from "react-paginate";
import https from "../../https";
import { PDFViewer } from "@react-pdf/renderer";
import generatePDF from "../AttendancePDF/AttendancePDF";
import generatePDFmonth from "../AttendancePDFmonth/AttendancePDFmonth";

function UserStudentAttendancePage() {
  //NEW SUBJECT USE STATES
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");

  const [laboratory, setLaboratory] = useState("");
  const [classDay, setClassDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [updateClassCode, setUpdateClassCode] = useState("");
  const [updateClassName, setUpdateClassName] = useState("");
  const [updateFaithId, setUpdateFaithId] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateTimeIn, setUpdateTimeIn] = useState("");

  const [monthClassCode, setMonthClassCode] = useState("");
  const [monthClassName, setMonthClassName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  const [date, setDate] = useState("");

  //REACT-PAGINATION
  const [studentAttendances, setStudentAttendances] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortClassSchedule = [...studentAttendances].sort((classes1, classes2) =>
    classes1.std_lname.localeCompare(classes2.std_lname)
  );

  const currentItems = sortClassSchedule.slice(startIndex, endIndex);

  //REACT-PAGINATION
  const [monthStudentAttendances, setMonthStudentAttendances] = useState([]);
  const [currentPages, setCurrentPages] = useState(0);
  const [itemsPerPages, setItemsPerPages] = useState(9);
  const startIndexes = currentPages * itemsPerPages;
  const endIndexes = startIndexes + itemsPerPages;

  const sortAttendances = [...monthStudentAttendances].sort(
    (classes1, classes2) => classes1.std_lname.localeCompare(classes2.std_lname)
  );

  const currentMonthStudentAttendances = sortAttendances.slice(
    startIndex,
    endIndex
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [classes, setClasses] = useState([]);
  // const classes = useSelector((state) => state.class.classes);
  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const sessionToken = sessionStorage.getItem("Token");
  let decoded;
  let tokenId;

  if (sessionToken) {
    decoded = jwtDecode(sessionToken);
    tokenId = decoded.prof_id;
  } else {
    goBackToLogin();
  }

  //Function for fetching Classes
  const fetchProfClasses = () => {
    https
      .get(`profClasses/${tokenId}`, {
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

          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  useEffect(() => {
    fetchProfClasses();
  }, []);

  const [id, setId] = useState(0);
  const [status, setStatus] = useState("");

  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleStudentAttendance = (
    id,
    class_code,
    class_name,
    faith_id,
    date,
    time_in,
    status
  ) => {
    setId(id);

    setUpdateClassCode(class_code);
    setUpdateClassName(class_name);
    setUpdateFaithId(faith_id);
    setUpdateDate(date);
    setUpdateTimeIn(time_in);
    setStatus(status);
  };

  const handleUpdateAttendance = (e) => {
    e.preventDefault();

    const data = {
      class_code: updateClassCode,
      faith_id: updateFaithId,
      date: updateDate,
      time_in: updateTimeIn,
      status: "Present",
    };

    try {
      https
        .post("add_manual_attendance", data, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          handleAttendance();
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
    } catch (error) {
      console.error(error);
    }
  };

  const clearClass = () => {
    // setAbsentClassCode("");
    // setAbsentClassDay("");
    // setAbsentStartTime("");
    // setAbsentEndTime("");
    // setClassCode("");
    // setClassDay("");
    // setStartTime("");
    // setEndTime("");
    // setErrorMessage("");
    // setStatus("");
  };

  const handleAttendance = () => {
    if (classCode === "" || date === "" || startTime === "" || endTime === "") {
      toast.error("Choose a Class, Date, and Time Range first!", {
        duration: 7000,
      });
    } else {
      const data = {
        date: date,
        start_time: startTime,
        end_time: endTime,
      };
      try {
        https
          .post(`student_attendances/${classCode}`, data, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            setStudentAttendances(result.data);
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMonthAttendance = () => {
    if (
      (classCode === "" && monthClassCode === "") ||
      (startDate === "" && date === "") ||
      endDate === ""
    ) {
      toast.error("Choose a class, start and end Date first!", {
        duration: 7000,
      });
    } else {
      const data = {
        start_date: startDate || date,
        end_date: endDate,
      };

      const month_class_code = classCode || monthClassCode;

      try {
        https
          .post(`month_student_attendances/${month_class_code}`, data, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
            },
          })
          .then((result) => {
            setMonthStudentAttendances(result.data);
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePDF = () => {
    if (studentAttendances.length > 0) {
      generatePDF(studentAttendances, date, className, startTime, endTime);
    } else {
      toast.error("Table data should be displayed first!", { duration: 7000 });
    }
  };

  const handlePDFmonth = () => {
    if (monthStudentAttendances.length > 0) {
      generatePDFmonth(
        monthStudentAttendances,
        monthClassName || className,
        startDate || date,
        endDate
      );
    } else {
      toast.error("Table data should be displayed first!", { duration: 7000 });
    }
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
          <b>{tokenFirstname}'S STUDENT ATTENDANCE PAGE</b>
        </h1>

        <h4 className="">LIST OF STUDENT ATTENDANCES</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center flex-row my-3">
              <div className="inputBox3 w-100">
                <select
                  className="form-select form-select-md"
                  onChange={(e) => {
                    setClassCode(e.target.value);
                    setClassName(
                      classes.find((c) => c.class_code === e.target.value)
                        ?.class_name
                    );
                  }}
                  id="classCode"
                  value={classCode || ""}
                  required
                >
                  <option value="" disabled>
                    N/A
                  </option>
                  {classes.length > 0
                    ? classes
                        .filter((classes) => classes.class_status === "Active")
                        .sort((classes1, classes2) =>
                          classes1.class_name.localeCompare(classes2.class_name)
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
                <span>Class Name</span>
              </div>

              <div className="inputBox3 w-100 mx-2">
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  className="form-control"
                />
                <span>Date</span>
              </div>

              <div className="inputBox3 w-100 mx-2">
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                  }}
                  className="form-control"
                />
                <span>Start Time</span>
              </div>

              <div className="inputBox3 w-100 mx-2">
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                  }}
                  className="form-control"
                />
                <span>End Time</span>
              </div>

              <div className="w-50 mx-2 d-flex justify-content-between">
                <button
                  className="btn btn-secondary btn-sm search_btn"
                  onClick={() => handleAttendance()}
                >
                  <img
                    src={require("../../Assets/images/magnifier.png")}
                    width="25"
                    height="25"
                    alt="update_user"
                  />
                </button>

                <button
                  className="btn btn-primary btn-sm search_btn"
                  onClick={() => handlePDF()}
                >
                  <img
                    src={require("../../Assets/images/print.png")}
                    width="25"
                    height="25"
                    alt="update_user"
                  />
                </button>
                <button
                  type="button"
                  className="btn btn-info btn-sm search_btn "
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  <img
                    src={require("../../Assets/images/list.png")}
                    width="25"
                    height="25"
                    alt="update_user"
                  />
                </button>
              </div>
            </div>

            <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
              <thead className="table-light">
                <tr>
                  <th>DATE</th>
                  <th>CLASS NAME</th>
                  <th>STUDENT NAME</th>
                  <th>YR & SECTION</th>
                  <th>TIME IN</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((attendance, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{attendance.date}</td>
                      <td className="p-2">{attendance.class_name}</td>
                      <td className="p-2">
                        {attendance.std_lname}, {attendance.std_fname}
                      </td>
                      <td className="p-2">
                        {attendance.std_course}-{attendance.std_level}
                        {attendance.std_section}
                      </td>

                      {attendance.time_in != null ? (
                        <td className="p-2">{attendance.time_in}</td>
                      ) : (
                        <td className="p-2">--:--:--</td>
                      )}

                      {attendance.status === "Present" ? (
                        <td className="p-2 text-success">
                          {attendance.status}
                        </td>
                      ) : (
                        <td className="p-2 text-danger">{attendance.status}</td>
                      )}

                      {attendance.status === "Present" ? (
                        <td className="p-2">
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop1"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              handleStudentAttendance(
                                attendance.id,
                                attendance.class_code,
                                attendance.class_name,
                                attendance.faith_id,
                                attendance.date,
                                attendance.time_in
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
                      ) : attendance.status === "Absent" ? (
                        <td className="p-2">
                          <button
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop1"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              handleStudentAttendance(
                                attendance.id,
                                attendance.class_code,
                                attendance.class_name,
                                attendance.faith_id,
                                attendance.date,
                                attendance.time_in,
                                attendance.status
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
                      ) : (
                        ""
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
                pageCount={Math.ceil(studentAttendances.length / itemsPerPage)}
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
                  <b>UPDATE ATTENDANCE</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleUpdateAttendance(e)}>
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

                      <h3 className="text-center">Attendance Update</h3>

                      {/* Start of Class Date */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              onChange={(e) => {
                                setUpdateDate(e.target.value);
                              }}
                              id="updateDate"
                              value={updateDate}
                              required
                              disabled
                            />
                            <span>Date</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Code */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              onChange={(e) => {
                                setUpdateClassCode(e.target.value);
                              }}
                              id="updateClassCode"
                              value={updateClassCode}
                              required
                              disabled
                            />
                            <span>Class Code</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Name */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              type="text"
                              onChange={(e) => {
                                setUpdateClassName(e.target.value);
                              }}
                              id="updateClassName"
                              value={updateClassName}
                              required
                              disabled
                            />
                            <span>Class Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of FAITH ID */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              type="text"
                              onChange={(e) => {
                                setUpdateFaithId(e.target.value);
                              }}
                              id="updateFaithId"
                              value={updateFaithId}
                              required
                              disabled
                            />
                            <span>FAITH ID</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Time In*/}

                      {status === "Absent" ? (
                        <div className="">
                          <div className="md-6 mb-4">
                            <div className="inputBox3 w-100">
                              <input
                                type="time"
                                id="updateTimeIn"
                                value={updateTimeIn || ""}
                                min="07:30"
                                max="21:00"
                                onChange={(e) => {
                                  setUpdateTimeIn(e.target.value);
                                  setErrorMessage("");
                                }}
                                required
                              />
                              <span>Time In</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="">
                          <div className="md-6 mb-4">
                            <div className="inputBox2 w-100">
                              <input
                                type="time"
                                id="updateTimeIn"
                                value={updateTimeIn || ""}
                                min="07:30"
                                max="21:00"
                                onChange={(e) => {
                                  setUpdateTimeIn(e.target.value);
                                  setErrorMessage("");
                                }}
                                required
                                disabled
                              />
                              <span>Time In</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  {status === "Absent" ? (
                    <>
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
                        className="btn btn-success"
                        data-bs-dismiss="modal"
                      >
                        UPDATE
                      </button>
                    </>
                  ) : (
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
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR ATTENDANCE */}

        {/* START OF MODAL FOR MONTH ATTENDNACE */}
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  <b>ATTENDANCE MONTH RANGE</b>
                </h1>
              </div>

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
                        STUDENT ATTENDANCE
                      </h1>
                    </div>
                    {error == true ? (
                      <div className="d-flex justify-content-center">
                        <p className="text-danger fs-4">{errorMessage}</p>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="w-100 d-flex flex-row align-items-center justify-content-between">
                      <div className="inputBox3 w-100">
                        <select
                          className="form-select form-select-md"
                          onChange={(e) => {
                            setMonthClassCode(e.target.value);
                            setMonthClassName(
                              classes.find(
                                (c) => c.class_code === e.target.value
                              )?.class_name
                            );
                          }}
                          id="monthClassCode"
                          value={classCode || monthClassCode}
                          required
                        >
                          <option value="" disabled>
                            N/A
                          </option>
                          {classes.length > 0
                            ? classes
                                .filter(
                                  (classes) => classes.class_status === "Active"
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
                        <span>Class Name</span>
                      </div>

                      <div className="inputBox3 w-100 mx-2">
                        <input
                          type="date"
                          id="startDate"
                          value={startDate || date}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                          }}
                          className="form-control"
                        />
                        <span>Start Date</span>
                      </div>

                      <div className="inputBox3 w-100 mx-2">
                        <input
                          type="date"
                          id="endDate"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                          }}
                          className="form-control"
                        />
                        <span>End Date</span>
                      </div>

                      <div className="w-50 mx-2 d-flex justify-content-between">
                        <button
                          className="btn btn-secondary btn-sm search_btn"
                          onClick={() => handleMonthAttendance()}
                        >
                          <img
                            src={require("../../Assets/images/magnifier.png")}
                            width="25"
                            height="25"
                            alt="update_user"
                          />
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm search_btn"
                          onClick={() => handlePDFmonth()}
                        >
                          <img
                            src={require("../../Assets/images/print.png")}
                            width="25"
                            height="25"
                            alt="update_user"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>CLASS NAME</th>
                            <th>FAITH ID</th>
                            <th>STUDENT NAME</th>
                            <th>LEVEL & SECTION</th>
                            <th>PRESENT COUNT</th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          {currentMonthStudentAttendances.length > 0 ? (
                            currentMonthStudentAttendances.map(
                              (attendance, index) => (
                                <tr className="table-light" key={index}>
                                  <td className="p-2">
                                    {attendance.class_name}
                                  </td>
                                  <td className="p-2">{attendance.faith_id}</td>
                                  <td className="p-2">
                                    {attendance.std_lname},{" "}
                                    {attendance.std_fname}
                                  </td>
                                  <td className="p-2">
                                    {attendance.std_course} -{" "}
                                    {attendance.std_level}
                                    {attendance.std_section}
                                  </td>
                                  <td className="p-2">
                                    {attendance.present_count}
                                  </td>
                                </tr>
                              )
                            )
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
                      <ReactPaginate
                        nextLabel="Next >"
                        onPageChange={(event) =>
                          setCurrentPages(event.selected)
                        }
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={Math.ceil(
                          monthStudentAttendances.length / itemsPerPages
                        )}
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
              </div>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR REQUESTING CANCEL CLASS */}
      </div>
    );
  }
}

export default UserStudentAttendancePage;
