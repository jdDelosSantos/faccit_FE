import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../SuperAdminProgrammingLab/SuperAdminProgrammingLab.css";
import { setProfessors } from "../../Redux/professors";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";
import { jwtDecode } from "jwt-decode";

function SuperAdminMachineLab() {
  const [selectedClasses, setSelectedClasses] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClass, setSearchClass] = useState("");

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
    const laboratory = "lab_machine";
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

  const handleClassScheduleSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  const handleFacilityClassScheduleSearchBar = (e) => {
    e.preventDefault();
  };

  const clearLoadSubjects = () => {
    setSelectedClasses([]);
    setErrorMessage("");
    setError(false);
  };

  const loadSubjects = () => {
    if (selectedClasses && selectedClasses.length === 0) {
      toast.error("No Selected Classes!", { duration: 7000 });
    } else if (selectedClasses != null) {
      console.log(selectedClasses);
      const laboratory = "lab_machine";
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
            fetchLaboratoryClassSchedules();
            setErrorMessage(error.response.data.message);
            toast.error(error.response.data.message, { duration: 7000 });
          } else {
            console.log(error.response.data.message);
            goBackToLogin();
          }
        });
    }
  };

  const handleClassSelection = (classes) => {
    if (selectedClasses.includes(classes)) {
      setSelectedClasses(selectedClasses.filter((s) => s !== classes));
    } else {
      setSelectedClasses([...selectedClasses, classes]);
    }
  };

  const handleClassScheduleRemove = (id) => {
    console.log(id);

    https
      .delete(`delete_laboratory_classes/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        fetchLaboratoryClassSchedules();
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
          <b>{tokenFirstname}'S MACHINE LAB PAGE</b>
        </h1>
        <h4 className="">LIST OF CLASS SCHEDULES IN MACHINE LAB</h4>
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
                  <th>CLASS CODE</th>
                  <th>CLASS NAME</th>
                  <th>PROFESSOR ID</th>
                  <th>CLASS DAY</th>
                  <th>START TIME</th>
                  <th>END TIME</th>
                  <th>ACTIONS</th>
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
                      <td className="p-2">
                        <button
                          type="button"
                          // data-bs-toggle="modal"
                          // data-bs-target="#staticBackdrop6"
                          className="btn btn-danger mx-3"
                          onClick={() => handleClassScheduleRemove(classes.id)}
                        >
                          <svg
                            width="25"
                            height="25"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#000000"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              <g fill="none" fillRule="evenodd">
                                <path d="m0 0h32v32h-32z" />
                                <path
                                  d="m31 6c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1l-3-.001v18.001c0 3.3137085-2.6862915 6-6 6h-12c-3.3137085 0-6-2.6862915-6-6v-18h-3c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1zm-18 8c-.5522847 0-1 .4477153-1 1v7c0 .5522847.4477153 1 1 1s1-.4477153 1-1v-7c0-.5522847-.4477153-1-1-1zm6 0c-.5522847 0-1 .4477153-1 1v7c0 .5522847.4477153 1 1 1s1-.4477153 1-1v-7c0-.5522847-.4477153-1-1-1zm4.5-13c.8284271 0 1.5.67157288 1.5 1.5s-.6715729 1.5-1.5 1.5h-15c-.82842712 0-1.5-.67157288-1.5-1.5s.67157288-1.5 1.5-1.5z"
                                  fill="#ffffff"
                                />
                              </g>
                            </g>
                          </svg>
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
                      onSubmit={handleClassScheduleSearchBar}
                    >
                      <div className="w-100">
                        <div className="input-group">
                          <input
                            className="form-control"
                            type="search"
                            placeholder="Search Class Schedule..."
                            aria-label="Search"
                            value={searchClass}
                            onChange={(e) => {
                              setSearchClass(e.target.value);
                            }}
                          />
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
                          {currentClassSchedules.length > 0 ? (
                            currentClassSchedules.map((classes, index) => (
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
                        onPageChange={(event) =>
                          setCurrentPageCS(event.selected)
                        }
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        pageCount={Math.ceil(
                          classSchedules.length / itemsPerPageCS
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
}

export default SuperAdminMachineLab;
