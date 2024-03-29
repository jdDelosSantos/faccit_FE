import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../SuperAdminProgrammingLab/SuperAdminProgrammingLab.css";
import { setProfessors } from "../../Redux/professors";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";

function SuperAdminProgrammingLab() {
  //NEW SUBJECT USE STATES
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [professorID, setProfessorID] = useState("");
  const [subjectDay, setSubjectDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  //UPDATE SUBJECT USE STATES
  const [updateSubjectCode, setUpdateSubjectCode] = useState("");
  const [updateSubjectName, setUpdateSubjectName] = useState("");
  const [updateSubjectDescription, setUpdateSubjectDescription] = useState("");
  const [updateProfessorID, setUpdateProfessorID] = useState("");
  const [updateSubjectDay, setUpdateSubjectDay] = useState("");
  const [updateStartTime, setUpdateStartTime] = useState("");
  const [updateEndTime, setUpdateEndTime] = useState("");

  //REACT-PAGINATION
  const [classSchedules, setClassSchedules] = useState([]);
  const [labClassSchedules, setLabClassSchedules] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = classSchedules.slice(startIndex, endIndex);
  const currentLabClassSchedules = labClassSchedules.slice(
    startIndex,
    endIndex
  );

  const sortedData = currentLabClassSchedules.sort((a, b) => {
    const classNameComparison = a.class.class_name.localeCompare(
      b.class.class_name
    );
    if (classNameComparison !== 0) {
      return classNameComparison;
    }
    // If class names are the same, sort by class day
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

    // If class day is the same, sort by start time
    const startTimeA = new Date(`2000-01-01T${a.start_time}`);
    const startTimeB = new Date(`2000-01-01T${b.start_time}`);
    return startTimeA - startTimeB;
  });

  const [selectedClasses, setSelectedClasses] = useState([]);

  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Function for fetching Class Schedules
  const fetchClassSchedules = () => {
    https
      .get("class_schedule_prof", {
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

  //Function for fetching Laboratory Class Schedules
  const fetchLaboratoryClassSchedules = () => {
    const laboratory = "lab_prog";
    https
      .get(`laboratory_class_schedules/${laboratory}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setLabClassSchedules(result.data);
        console.log(labClassSchedules);
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
    fetchLaboratoryClassSchedules();
  }, []);

  const handleSubjectSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  const handleSubjectsSearchBar = (e) => {
    e.preventDefault();
  };

  const clearLoadSubjects = () => {
    setSelectedClasses([]);
    setErrorMessage("");
    setError(false);
  };

  const loadSubjects = () => {
    console.log(selectedClasses);
    const laboratory = "lab_prog";
    https
      .post(`create_laboratory_classes/${laboratory}`, selectedClasses, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        if (result && result.data) {
          const errors = result.data.errors;
          if (errors) {
            // Check if errors exist before iterating
            errors.forEach((error) => {
              toast.error(error, { duration: 7000 });
            });
          } else {
            toast.success(result.data.message, { duration: 7000 });
            fetchLaboratoryClassSchedules();
            clearLoadSubjects();
          }
        } else {
          console.error("Server response doesn't contain data property");
          // Handle the error appropriately
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message != "Unauthenticated.") {
          setError(true);
          setSelectedClasses([]);
          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  const handleClassSelection = (classes) => {
    if (selectedClasses.includes(classes)) {
      setSelectedClasses(selectedClasses.filter((s) => s !== classes));
    } else {
      setSelectedClasses([...selectedClasses, classes]);
    }
  };

  // Filter function to check if all required fields have values
  const hasRequiredFields = (classes) => {
    return classes.class_day && classes.start_time && classes.end_time;
  };

  const filteredData = currentItems.filter(hasRequiredFields);

  const sortedClassSchedules = filteredData.sort((a, b) => {
    const classNameComparison = a.class.class_name.localeCompare(
      b.class.class_name
    );
    if (classNameComparison !== 0) {
      return classNameComparison;
    }

    // If class names are the same, sort by class day
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

    // If class day is the same, sort by start time
    const startTimeA = new Date(`2000-01-01T${a.start_time}`);
    const startTimeB = new Date(`2000-01-01T${b.start_time}`);
    return startTimeA - startTimeB;
  });

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="base_bg w-100 p-4">
      <h1 className="my-1">
        <b>{NametoUpperCase}'S PROGRAMMING LAB PAGE</b>
      </h1>
      <h4 className="">LIST OF CLASS SCHEDULES IN PROGRAMMING LAB</h4>
      <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
        <div className="table-responsive">
          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <div className="w-100 d-flex">
              <form
                className="d-flex w-75 searchbar-form"
                onSubmit={handleSubjectSearchBar}
              >
                <div className="w-100">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Class Schedule..."
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
                LOAD CLASS
              </button>
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>CLASS CODE</th>
                <th>CLASS NAME</th>
                <th>PROFESSOR ID</th>
                <th>SUBJECT DAY</th>
                <th>START TIME</th>
                <th>END TIME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {sortedData.length > 0 ? (
                sortedData.map((classes, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{classes.class_code}</td>
                    <td className="p-2">{classes.class.class_name}</td>
                    <td className="p-2">{classes.class.prof_id}</td>
                    <td className="p-2">{classes.class_day}</td>
                    <td className="p-2">{classes.start_time}</td>
                    <td className="p-2">{classes.end_time}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        // data-bs-toggle="modal"
                        // data-bs-target="#staticBackdrop6"
                        className="btn btn-danger mx-3"
                        onClick={() =>
                          handleSubjectRemove(subject.subject_code)
                        }
                      >
                        UNLOAD
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
              pageCount={Math.ceil(labClassSchedules.length / itemsPerPage)}
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

      {/* START OF MODAL FOR LOADING CLASSES */}
      <div
        className="modal fade"
        id="staticBackdrop4"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel4"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel4">
                <b>LOAD CLASS</b>
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
                      CLASS SCHEDULES
                    </h1>
                  </div>
                  {error == true ? (
                    <div className="d-flex justify-content-center">
                      <p className="text-danger fs-4">{errorMessage}</p>
                    </div>
                  ) : (
                    ""
                  )}

                  <form
                    className="d-flex w-75 searchbar-form"
                    onSubmit={handleSubjectsSearchBar}
                  >
                    <div className="w-100">
                      <div className="input-group">
                        <input
                          className="form-control"
                          type="search"
                          placeholder="Search Subject..."
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

                  <div className="mt-2">
                    <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
                      <thead className="table-light">
                        <tr>
                          <th></th>
                          <th>CLASS CODE</th>
                          <th>CLASS NAME</th>
                          <th>PROFESSOR ID</th>
                          <th>CLASS DAY</th>
                          <th>START TIME</th>
                          <th>END TIME</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {sortedClassSchedules.length > 0 ? (
                          sortedClassSchedules
                            .sort((class1, class2) =>
                              class1.class.class_name.localeCompare(
                                class2.class.class_name
                              )
                            )
                            .map((classes, index) => (
                              <tr className="table-light" key={index}>
                                <td className="p-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedClasses.includes(classes)}
                                    onChange={() =>
                                      handleClassSelection(classes)
                                    }
                                  />
                                </td>
                                <td className="p-2">{classes.class_code}</td>
                                <td className="p-2">
                                  {classes.class.class_name}
                                </td>
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
                    <ReactPaginate
                      nextLabel="Next >"
                      onPageChange={(event) => setCurrentPage(event.selected)}
                      pageRangeDisplayed={3}
                      marginPagesDisplayed={2}
                      pageCount={Math.ceil(filteredData.length / itemsPerPage)}
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
                    <p>
                      Note: Classes displayed are only those with Professors,
                      Day, Start Time and End Time
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => clearLoadSubjects()}
              >
                CLOSE
              </button>
              <button
                type="submit"
                className="btn btn-success mb-1"
                data-bs-dismiss="modal"
                onClick={() => loadSubjects()}
              >
                LOAD SUBJECTS
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* END OF MODAL FOR LOADING SUBJECTS */}
    </div>
  );
}

export default SuperAdminProgrammingLab;
