import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./UserMultimediaLab.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";
import { jwtDecode } from "jwt-decode";
// import { setClasses } from "../../Redux/classes";

function UserMultimediaLab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClass, setSearchClass] = useState("");

  //NEW CLASS USE STATES
  const [classCode, setClassCode] = useState("");
  const [classDay, setClassDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [laboratory, setLaboratory] = useState("");
  const [text, setText] = useState("");
  const [openDate, setOpenDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const [absentClassCode, setAbsentClassCode] = useState("");
  const [absentClassDay, setAbsentClassDay] = useState("");
  const [absentStartTime, setAbsentStartTime] = useState("");
  const [absentEndTime, setAbsentEndTime] = useState("");
  const [absentLaboratory, setAbsentLaboratory] = useState("");
  const [absentRemarks, setAbsentRemarks] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const [classes, setClasses] = useState([]);

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const sessionToken = sessionStorage.getItem("Token");
  let decoded;
  let id;

  if (sessionToken) {
    decoded = jwtDecode(sessionToken);
    id = decoded.prof_id;
  } else {
    goBackToLogin();
  }

  //Function for fetching Classes
  const fetchClasses = () => {
    const lab = {
      laboratory: "lab_multimedia",
    };
    https
      .post(`get_laboratory_scheds/${id}`, lab, {
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

  //REACT-PAGINATION CLASS SCHEDULES
  const [classSchedules, setClassSchedules] = useState([]);
  const [currentPageCS, setCurrentPageCS] = useState(0); // Renamed state variable for class schedules
  const [itemsPerPageCS, setItemsPerPageCS] = useState(6); // Renamed state variable for class schedules
  const startIndexCS = currentPageCS * itemsPerPageCS;
  const endIndexCS = startIndexCS + itemsPerPageCS;

  //SORTING CLASS SCHEDULES BY DAY THEN TIME
  const sortedClassSchedules = [...classSchedules].sort((a, b) => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const dayIndexA = days.indexOf(a.class_day);
    const dayIndexB = days.indexOf(b.class_day);

    if (dayIndexA !== dayIndexB) {
      return dayIndexA - dayIndexB;
    }

    const startTimeA = new Date(`2000-01-01T${a.start_time}`);
    const startTimeB = new Date(`2000-01-01T${b.start_time}`);

    if (startTimeA !== startTimeB) {
      return startTimeA - startTimeB;
    }

    const endTimeA = new Date(`2000-01-01T${a.end_time}`);
    const endTimeB = new Date(`2000-01-01T${b.end_time}`);

    return endTimeA - endTimeB;
  });

  //CODE FOR FILTERING BASED ON SEARCHCLASS
  const filteredClassSchedules = sortedClassSchedules.filter(
    (item) =>
      item.class_code.toLowerCase().includes(searchClass.toLowerCase()) ||
      item.class.class_name.toLowerCase().includes(searchClass.toLowerCase()) ||
      item.class.prof_id.toLowerCase().includes(searchClass.toLowerCase()) ||
      item.class_day.toLowerCase().includes(searchClass.toLowerCase())
  );

  //PUTTING SORTED AND FILTERED CLASS SCHEDULES TO CURRENT CLASS SCHEDULES
  const currentClassSchedules = filteredClassSchedules.slice(
    startIndexCS,
    endIndexCS
  );

  //REACT-PAGINATION LAB CLASS SCHEDULES
  const [labClassSchedules, setLabClassSchedules] = useState([]);
  const [currentPages, setCurrentPages] = useState(0);
  const [itemsPerPages, setItemsPerPages] = useState(10);
  const startIndexs = currentPages * itemsPerPages;
  const endIndexs = startIndexs + itemsPerPages;

  const sortedData = [...labClassSchedules].sort((a, b) => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const dayIndexA = days.indexOf(a.class_day);
    const dayIndexB = days.indexOf(b.class_day);

    if (dayIndexA !== dayIndexB) {
      return dayIndexA - dayIndexB;
    }

    const startTimeA = new Date(`2000-01-01T${a.start_time}`);
    const startTimeB = new Date(`2000-01-01T${b.start_time}`);

    if (startTimeA !== startTimeB) {
      return startTimeA - startTimeB;
    }

    const endTimeA = new Date(`2000-01-01T${a.end_time}`);
    const endTimeB = new Date(`2000-01-01T${b.end_time}`);

    return endTimeA - endTimeB;
  });

  //CODE FOR FILTERING BASED ON SEARCHTERM
  const filteredSortedData = sortedData.filter(
    (item) =>
      item.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class.prof_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.class_day.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentLabClassSchedules = filteredSortedData.slice(
    startIndexs,
    endIndexs
  );

  //Function for fetching Laboratory Class Schedules
  const fetchLaboratoryClassSchedules = () => {
    const laboratory = "lab_multimedia";
    https
      .get(`laboratory_class_schedules/${laboratory}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setLabClassSchedules(result.data);
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

  const clearClass = () => {
    setSelectedClass(null);
    setAbsentClassCode("");
    setAbsentClassDay("");
    setAbsentStartTime("");
    setAbsentEndTime("");
    setOpenDate("");
    setClassCode("");
    setClassDay("");
    setStartTime("");
    setEndTime("");
    setErrorMessage("");
  };

  useEffect(() => {
    fetchLaboratoryClassSchedules();
  }, []);

  const handleMakeUpClassRequest = (e) => {
    e.preventDefault();

    const makeupClassData = {
      laboratory: laboratory,
      class_code: classCode,
      class_day: classDay,
      start_time: startTime,
      end_time: endTime,
      remarks: remarks,
    };

    https
      .post(`request_makeup_class/${id}`, makeupClassData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        clearClass();
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

  const handleClassCancelationRequest = (e) => {
    e.preventDefault();

    const cancelClassData = {
      laboratory: absentLaboratory,
      class_code: absentClassCode,
      class_day: absentClassDay,
      start_time: absentStartTime,
      end_time: absentEndTime,
      remarks: absentRemarks,
    };

    try {
      https
        .post(`request_cancel_class/${id}`, cancelClassData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
          clearClass();
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenClass = (e) => {
    e.preventDefault();

    const openClassData = {
      id: id,
      day: absentClassDay,
      time: absentStartTime,
      date: openDate,
      laboratory: "lab_multimedia",
    };

    try {
      https
        .post("open_attendance", openClassData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
          clearClass();
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

  const handleClassChange = (e) => {
    const selectedClassCode = e.target.value;
    setAbsentClassCode(selectedClassCode);
    setClassCode(selectedClassCode);
    const selectedClass = classes.find(
      (classItem) => classItem.class_code === selectedClassCode
    );
    setSelectedClass(selectedClass);
  };

  useEffect(() => {
    if (selectedClass && absentClassDay) {
      const classDetails = selectedClass.facilities.filter(
        (facility) => facility.class_day === absentClassDay
      );

      if (classDetails.length > 0) {
        const selectedFacility = classDetails.find(
          (facility) => facility.start_time === absentStartTime
        );

        if (selectedFacility) {
          setAbsentStartTime(selectedFacility.start_time);
          setAbsentEndTime(selectedFacility.end_time);
          setAbsentLaboratory(selectedFacility.laboratory);
        } else {
          setAbsentStartTime(classDetails[0].start_time);
          setAbsentEndTime(classDetails[0].end_time);
          setAbsentLaboratory(classDetails[0].laboratory);
        }
      } else {
        setAbsentStartTime("");
        setAbsentEndTime("");
        setAbsentLaboratory("");
        setOpenDate("");
      }
    } else {
      setAbsentStartTime("");
      setAbsentEndTime("");
      setAbsentLaboratory("");
      setOpenDate("");
    }
  }, [selectedClass, absentClassDay]);

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
          <b>{tokenFirstname}'S MULTIMEDIA LAB PAGE</b>
        </h1>
        <h4 className="">LIST OF CLASS SCHEDULES IN MULTIMEDIA LAB</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Class Schedule..."
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
                  data-bs-target="#staticBackdrop6"
                  className="btn btn-secondary btn-sm"
                  onClick={() => fetchClasses()}
                >
                  <img
                    src={require("../../Assets/images/unlock.png")}
                    width="25"
                    height="25"
                    style={{
                      TopLeftRadius: ".3rem",
                      TopRightRadius: ".3rem",
                    }}
                    alt="add"
                  />
                </button>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop4"
                  className="btn btn-primary btn-sm mx-2"
                  onClick={() => fetchClasses()}
                >
                  <img
                    src={require("../../Assets/images/request.png")}
                    width="25"
                    height="25"
                    style={{
                      TopLeftRadius: ".3rem",
                      TopRightRadius: ".3rem",
                    }}
                    alt="add"
                  />
                </button>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop5"
                  className="btn btn-danger btn-sm"
                  onClick={() => fetchClasses()}
                >
                  <img
                    src={require("../../Assets/images/request.png")}
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
                  <th>PROFESSOR ID</th>
                  <th>CLASS DAY</th>
                  <th>START TIME</th>
                  <th>END TIME</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentLabClassSchedules.length > 0 ? (
                  currentLabClassSchedules.map((classes, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{classes.class_code}</td>
                      <td className="p-2">{classes.class.class_name}</td>
                      <td className="p-2">{classes.class.prof_id}</td>
                      <td className="p-2">{classes.class_day}</td>
                      <td className="p-2">{classes.start_time}</td>
                      <td className="p-2">{classes.end_time}</td>
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
                onPageChange={(event) => setCurrentPages(event.selected)}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={Math.ceil(labClassSchedules.length / itemsPerPages)}
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

        {/* START OF MODAL FOR REQUESTING MAKEUP CLASS */}
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
                  <b>REQUEST MAKEUP CLASS SCHEDULE</b>
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
                        Request a Makeup Class Schedule
                      </h3>

                      {/* Start of Class Select */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
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
                            <span>Class Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class day*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
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
                            <span>Class Day</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Start time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
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
                            <span>Start Time</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class End time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
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
                            <span>End Time</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class day*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                setLaboratory(e.target.value);
                                setErrorMessage("");
                              }}
                              id="laboratory"
                              value={laboratory || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Laboratory
                              </option>
                              <option value="lab_multimedia">
                                Multimedia Lab
                              </option>
                              <option value="lab_programming">
                                Programming Lab
                              </option>
                            </select>
                            <span>Laboratory</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Remarks*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <textarea
                              className="w-100 p-2"
                              placeholder="Enter remarks about the request..."
                              required
                              rows="4"
                              maxLength={150}
                              value={remarks || ""}
                              onChange={(e) => setRemarks(e.target.value)}
                            ></textarea>
                            <span>Remarks</span>
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
                  <button
                    type="submit"
                    className="btn btn-success mb-1"
                    data-bs-dismiss="modal"
                    // onClick={() => requestMakeupClass()}
                  >
                    REQUEST MAKEUP CLASS
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR REQUESTING MAKEUP CLASS */}

        {/* END OF MODAL FOR REQUESTING CANCEL CLASS */}
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
                  <b>REQUEST CLASS CANCELATION</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleClassCancelationRequest(e)}>
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
                        Request Cancelation of a Class
                      </h3>
                      {/* Start of Class Select */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={handleClassChange}
                              id="absentClassCode"
                              value={absentClassCode || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Class
                              </option>
                              {classes.length > 0
                                ? classes
                                    .sort((classes1, classes2) =>
                                      classes1.class_name.localeCompare(
                                        classes2.class_name
                                      )
                                    )
                                    .map((classes) => (
                                      <option
                                        key={`${classes.id}-${classes.class_name}`}
                                        value={classes.class_code}
                                      >
                                        {classes.class_name}
                                      </option>
                                    ))
                                : ""}
                            </select>
                            <span>Class Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class day*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                const [day, startTime] =
                                  e.target.value.split("|");
                                setAbsentClassDay(day);
                                setAbsentStartTime(startTime);
                              }}
                              id="absentClassDay"
                              value={`${absentClassDay || ""}|${
                                absentStartTime || ""
                              }`}
                              required
                            >
                              <option value="">Select a Day and Time</option>
                              {selectedClass &&
                                selectedClass.facilities.map((facility) => (
                                  <option
                                    key={`${facility.class_day}|${facility.start_time}`}
                                    value={`${facility.class_day}|${facility.start_time}`}
                                  >
                                    {`${facility.class_day} (${facility.start_time} - ${facility.end_time})`}
                                  </option>
                                ))}
                            </select>
                            <span>Class Day</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Start time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              type="time"
                              id="absentStartTime"
                              value={absentStartTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setAbsentStartTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                              disabled={!selectedClass || !absentClassDay}
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
                              value={absentEndTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setAbsentEndTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                              disabled={!selectedClass || !absentClassDay}
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
                              onChange={(e) =>
                                setAbsentLaboratory(e.target.value)
                              }
                              id="absentLaboratory"
                              value={absentLaboratory || ""}
                              disabled={!selectedClass || !absentClassDay}
                              required
                            >
                              <option value="" disabled>
                                Select a Laboratory
                              </option>
                              {selectedClass &&
                                selectedClass.facilities
                                  .filter(
                                    (facility) =>
                                      facility.class_day === absentClassDay
                                  )
                                  .map((facility) => (
                                    <option
                                      key={`${facility.id}-${facility.laboratory}`}
                                      value={facility.laboratory}
                                    >
                                      {facility.laboratory === "lab_programming"
                                        ? "Programming Lab"
                                        : facility.laboratory ===
                                          "lab_multimedia"
                                        ? "Multimedia Lab"
                                        : facility.laboratory}
                                    </option>
                                  ))}
                            </select>
                            <span>Laboratory</span>
                          </div>
                        </div>
                      </div>
                      {/* Start of Class Remarks*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <textarea
                              className="w-100 p-2"
                              placeholder="Enter remarks about the request..."
                              required
                              rows="4"
                              maxLength={150}
                              value={absentRemarks || ""}
                              onChange={(e) => setAbsentRemarks(e.target.value)}
                            ></textarea>
                            <span>Remarks</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i>
                          Note: Class Schedules displayed are only for within
                          Multimedia Lab.
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
                    REQUEST CLASS CANCELATION
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR REQUESTING CANCEL CLASS */}

        {/* END OF MODAL FOR OPENING CLASS */}
        <div
          className="modal fade"
          id="staticBackdrop6"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel6"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel6">
                  <b>OPEN CLASS</b>
                </h1>
              </div>

              <form onSubmit={(e) => handleOpenClass(e)}>
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
                        Open a Class for Attendance
                      </h3>
                      {/* Start of Class Select */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={handleClassChange}
                              id="absentClassCode"
                              value={absentClassCode || ""}
                              required
                            >
                              <option value="" disabled>
                                Select a Class
                              </option>
                              {classes.length > 0
                                ? classes
                                    .sort((classes1, classes2) =>
                                      classes1.class_name.localeCompare(
                                        classes2.class_name
                                      )
                                    )
                                    .map((classes) => (
                                      <option
                                        key={`${classes.id}-${classes.class_name}`}
                                        value={classes.class_code}
                                      >
                                        {classes.class_name}
                                      </option>
                                    ))
                                : ""}
                            </select>
                            <span>Class Name</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class day*/}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <select
                              className="form-select form-select-md mb-3"
                              aria-label=".form-select-md example"
                              onChange={(e) => {
                                const [day, startTime] =
                                  e.target.value.split("|");
                                setAbsentClassDay(day);
                                setAbsentStartTime(startTime);
                              }}
                              id="absentClassDay"
                              value={`${absentClassDay || ""}|${
                                absentStartTime || ""
                              }`}
                              required
                            >
                              <option value="">Select a Day and Time</option>
                              {selectedClass &&
                                selectedClass.facilities.map((facility) => (
                                  <option
                                    key={`${facility.class_day}|${facility.start_time}`}
                                    value={`${facility.class_day}|${facility.start_time}`}
                                  >
                                    {`${facility.class_day} (${facility.start_time} - ${facility.end_time})`}
                                  </option>
                                ))}
                            </select>
                            <span>Class Day</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Start time */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox2 w-100">
                            <input
                              type="time"
                              id="absentStartTime"
                              value={absentStartTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setAbsentStartTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                              disabled={!selectedClass || !absentClassDay}
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
                              value={absentEndTime}
                              min="07:30"
                              max="21:00"
                              onChange={(e) => {
                                setAbsentEndTime(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                              disabled={!selectedClass || !absentClassDay}
                            />
                            <span>End Time</span>
                          </div>
                        </div>
                      </div>

                      {/* Start of Class Date */}
                      <div className="">
                        <div className="md-6 mb-4">
                          <div className="inputBox3 w-100">
                            <input
                              type="date"
                              id="openDate"
                              value={openDate}
                              onChange={(e) => {
                                setOpenDate(e.target.value);
                                setErrorMessage("");
                              }}
                              required
                            />
                            <span>Date</span>
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
                              onChange={(e) =>
                                setAbsentLaboratory(e.target.value)
                              }
                              id="absentLaboratory"
                              value={absentLaboratory || ""}
                              disabled={!selectedClass || !absentClassDay}
                              required
                            >
                              <option value="" disabled>
                                Select a Laboratory
                              </option>
                              {selectedClass &&
                                selectedClass.facilities
                                  .filter(
                                    (facility) =>
                                      facility.class_day === absentClassDay
                                  )
                                  .map((facility) => (
                                    <option
                                      key={`${facility.id}-${facility.laboratory}`}
                                      value={facility.laboratory}
                                    >
                                      {facility.laboratory === "lab_programming"
                                        ? "Programming Lab"
                                        : facility.laboratory ===
                                          "lab_multimedia"
                                        ? "Multimedia Lab"
                                        : facility.laboratory}
                                    </option>
                                  ))}
                            </select>
                            <span>Laboratory</span>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i>
                          Note: Class Schedules displayed are only for within
                          Multimedia Lab.
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
                    // onClick={() => requestMakeupClass()}
                  >
                    OPEN CLASS
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* END OF MODAL FOR OPENING CLASS */}
      </div>
    );
  }
}

export default UserMultimediaLab;
