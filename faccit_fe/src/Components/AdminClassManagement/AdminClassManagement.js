import React, { useState, useRef, useEffect } from "react";
import "./AdminClassManagement.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";
import { setClasses } from "../../Redux/classes";
// import { setStudents } from "../../Redux/students";
import { setCourses } from "../../Redux/courses";
import ReactPaginate from "react-paginate";

function AdminClassManagement() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [filterCourse, setFilterCourse] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSection, setFilterSection] = useState("");

  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [removeSelectedStudents, setRemoveSelectedStudents] = useState([]);

  const [listClassCode, setListClassCode] = useState("");
  const [listClassName, setListClassName] = useState("");

  const [delClassCode, setDelClassCode] = useState("");
  const [delClassName, setDelClassName] = useState("");

  //REACT-PAGINATION
  const [classStudents, setClassStudents] = useState([]);

  const [listClassStudents, setListClassStudents] = useState([]);

  const [delClassStudents, setDelClassStudents] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Function for fetching Subjects
  const fetchClasses = () => {
    if (sessionStorage.getItem("Prof ID") != null || "") {
      https
        .get(`profClasses/${sessionStorage.getItem("Prof ID")}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          dispatch(setClasses(result.data));
          console.log(classes);
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
    }
  };

  //Function for fetching Students
  const fetchStudents = () => {
    https
      .get("students", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setStudents(result.data));
        setClassStudents(result.data);
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
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  useEffect(() => {
    fetchClasses();
    fetchStudents();
    fetchCourses();
  }, []);

  const classes = useSelector((state) => state.class.classes);
  // const reduxStudents = useSelector((state) => state.student.students);
  const courses = useSelector((state) => state.course.courses);

  const handleStudentList = (class_code, class_name) => {
    setListClassCode(class_code);
    setListClassName(class_name);
    try {
      https
        .get(`get_class_students/${class_code}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          console.log(result.data);

          setListClassStudents(result.data);
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

  const handleAddStudents = (class_code, class_name) => {
    setClassCode(class_code);
    setClassName(class_name);
  };

  const handleRemoveStudents = (class_code, class_name) => {
    setDelClassCode(class_code);
    setDelClassName(class_name);

    try {
      https
        .get(`get_class_students/${class_code}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          setDelClassStudents(result.data);
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

  const handleStudentSelection = (student) => {
    if (selectedStudents.includes(student)) {
      setSelectedStudents(selectedStudents.filter((s) => s !== student));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleRemoveStudentSelection = (student) => {
    if (removeSelectedStudents.includes(student)) {
      setRemoveSelectedStudents(
        removeSelectedStudents.filter((s) => s !== student)
      );
    } else {
      setRemoveSelectedStudents([...removeSelectedStudents, student]);
    }
  };

  const addStudentsToClass = () => {
    console.log(selectedStudents);
    https
      .post(`create_class_students/${classCode}`, selectedStudents, {
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
            clearAddStudentsToClass();
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

          console.log(error.response.data.message);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          console.log(error.response.data.message);
          goBackToLogin();
        }
      });
  };

  const removeStudentsToClass = () => {
    console.log(removeSelectedStudents);
    try {
      https
        .delete(`remove_class_students/${delClassCode}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
          data: removeSelectedStudents,
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
          clearRemoveStudentsToClass();
        })
        .catch((error) => {
          console.log(error);
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
      console.error("Error removing students:", error);
      setError(true);
      setErrorMessage("An unexpected error occurred.");
      toast.error("An unexpected error occurred.", { duration: 7000 });
    } finally {
      clearRemoveStudentsToClass();
    }
  };

  const clearListStudentsToClass = () => {
    setClassCode("");
    setClassName("");
  };

  const clearAddStudentsToClass = () => {
    setClassCode("");
    setClassName("");
    setFilterCourse("");
    setFilterLevel("");
    setFilterSection("");
    setSelectedStudents([]);
  };

  const clearRemoveStudentsToClass = () => {
    setDelClassCode("");
    setDelClassName("");
    setRemoveSelectedStudents([]);
  };

  const filteredStudents = classStudents
    .filter(
      (student) =>
        student.std_status === "Active" &&
        (filterCourse === "" || student.std_course === filterCourse) &&
        student.std_level.toLowerCase().includes(filterLevel.toLowerCase()) &&
        student.std_section
          .toLowerCase()
          .includes(filterSection.toLowerCase()) &&
        student.student_images_count >= 3
    )
    .sort((student1, student2) =>
      student1.std_lname.localeCompare(student2.std_lname)
    );

  const filteredListStudents = listClassStudents.sort((student1, student2) =>
    student1.std_lname.localeCompare(student2.std_lname)
  );

  const filteredRemoveStudents = delClassStudents.sort((student1, student2) =>
    student1.std_lname.localeCompare(student2.std_lname)
  );

  const currentItems = filteredStudents.slice(startIndex, endIndex);

  const currentListStudents = filteredListStudents.slice(startIndex, endIndex);

  const currentRemoveStudents = filteredRemoveStudents.slice(
    startIndex,
    endIndex
  );

  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();
  const handleClassSearchBar = (e) => {
    e.preventDefault();
  };

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="base_bg w-100 p-4">
      <h1 className="my-1">
        <b>{NametoUpperCase}'S CLASS MANAGEMENT PAGE</b>
      </h1>
      <h4 className="">LIST OF CLASSES</h4>
      <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
        <div className="table-responsive">
          <div className="w-100 d-flex justify-content-between align-items-center my-3">
            <div className="w-100 d-flex">
              <form
                className="d-flex w-75 searchbar-form"
                onSubmit={handleClassSearchBar}
              >
                <div className="w-100">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Classes..."
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
              {/* <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop4"
                className="btn btn-primary btn-sm"
              >
                ADD STUDENTS
              </button> */}
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>CLASS CODE</th>
                <th>CLASS NAME</th>
                <th>CLASS DESCRIPTION</th>
                <th>COLLEGE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {classes.length > 0 ? (
                classes.map((classes, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{classes.class_code}</td>
                    <td className="p-2">{classes.class_name}</td>
                    <td className="p-2">{classes.class_description}</td>
                    <td className="p-2">{classes.college_name}</td>

                    <td className="p-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        className="btn btn-secondary"
                        onClick={() => {
                          handleStudentList(
                            classes.class_code,
                            classes.class_name
                          );
                        }}
                      >
                        LIST
                      </button>

                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop1"
                        className="btn btn-primary mx-3"
                        onClick={() =>
                          handleAddStudents(
                            classes.class_code,
                            classes.class_name
                          )
                        }
                      >
                        ADD
                      </button>

                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop2"
                        className="btn btn-danger"
                        onClick={() =>
                          handleRemoveStudents(
                            classes.class_code,
                            classes.class_name
                          )
                        }
                      >
                        REMOVE
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
        </div>
      </div>

      {/* MODAL LIST */}
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
                CURRENT STUDENTS IN {className}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Start of Subject Code */}
              <div className="w-100 d-flex justify-content-center">
                <div className="md-6 mb-4 mx-2">
                  <div className="inputBox2 w-100">
                    <input
                      type="text"
                      id="classCode"
                      value={listClassCode}
                      onChange={(e) => {
                        setListClassCode(e.target.value);
                        setError(false);
                      }}
                      disabled
                    />
                    <span className="">Subject Code</span>
                  </div>
                </div>

                <div className="md-6 mb-4 mx-2">
                  <div className="inputBox2 w-100">
                    <input
                      type="text"
                      id="className"
                      value={listClassName}
                      onChange={(e) => {
                        setListClassName(e.target.value);
                        setError(false);
                      }}
                      disabled
                    />
                    <span className="">Subject Name</span>
                  </div>
                </div>
              </div>

              <div className="table-responsive mt-2">
                <table className="table table-hover table-bordered border-secondary table-secondary align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>FAITH ID</th>
                      <th>LAST NAME</th>
                      <th>FIRST NAME</th>
                      <th>COURSE</th>
                      <th>YEAR</th>
                      <th>SECTION</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {currentListStudents.length > 0 ? (
                      currentListStudents.map((student, index) => (
                        <tr key={student.id} className="table-primary">
                          <td className="p-2">{student.faith_id}</td>
                          <td className="p-2">{student.std_lname}</td>
                          <td className="p-2">{student.std_fname}</td>
                          <td className="p-2">{student.std_course}</td>
                          <td className="p-2">{student.std_level}</td>
                          <td className="p-2">{student.std_section}</td>
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
                    pageCount={Math.ceil(
                      listClassStudents.length / itemsPerPage
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => clearListStudentsToClass()}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ADD */}
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
                ADD STUDENTS TO {className} SUBJECT
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Start of Subject Code */}
              <div className="w-100 d-flex justify-content-center">
                <div className="md-6 mb-4 mx-2">
                  <div className="inputBox2 w-100">
                    <input
                      type="text"
                      id="classCode"
                      value={classCode}
                      onChange={(e) => {
                        setClassCode(e.target.value);
                        setError(false);
                      }}
                      disabled
                    />
                    <span className="">Subject Code</span>
                  </div>
                </div>

                <div className="md-6 mb-4 mx-2">
                  <div className="inputBox2 w-100">
                    <input
                      type="text"
                      id="className"
                      value={className}
                      onChange={(e) => {
                        setClassName(e.target.value);
                        setError(false);
                      }}
                      disabled
                    />
                    <span className="">Subject Name</span>
                  </div>
                </div>
              </div>

              {/* Start of Course Name */}
              <div className="d-flex justify-content-between mb-3">
                <div className="mx-2">
                  <label htmlFor="filterCourse" className="form-label">
                    Course:
                  </label>
                  <select
                    id="filterCourse"
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a Course</option>

                    {courses.length > 0
                      ? courses
                          .filter((course) => course.course_status === "Active")
                          .map((course) => (
                            <option key={course.id} value={course.course_name}>
                              {course.course_name}
                            </option>
                          ))
                      : ""}
                  </select>
                </div>
                <div className="mx-2">
                  <label htmlFor="filterLevel" className="form-label">
                    Level:
                  </label>

                  <select
                    className="form-select form-select-md mb-3"
                    aria-label=".form-select-md example"
                    onChange={(e) => {
                      setFilterLevel(e.target.value);
                    }}
                    id="filterLevel"
                    value={filterLevel || ""}
                    required
                  >
                    <option value="">Select a Level/Year</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="mx-2">
                  <label htmlFor="filterSection" className="form-label">
                    Section:
                  </label>

                  <select
                    className="form-select form-select-md mb-3"
                    aria-label=".form-select-md example"
                    onChange={(e) => {
                      setFilterSection(e.target.value);
                    }}
                    id="filterSection"
                    value={filterSection || ""}
                    required
                  >
                    <option value="">Select a Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive mt-2">
                <table className="table table-hover table-bordered border-secondary table-secondary align-middle">
                  <thead className="table-light">
                    <tr>
                      <th></th>
                      <th>FAITH ID</th>
                      <th>LAST NAME</th>
                      <th>FIRST NAME</th>
                      <th>COURSE</th>
                      <th>YEAR</th>
                      <th>SECTION</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {currentItems.length > 0 ? (
                      currentItems.map((student, index) => (
                        <tr key={student.id} className="table-primary">
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student)}
                              onChange={() => handleStudentSelection(student)}
                            />
                          </td>
                          <td className="p-2">{student.faith_id}</td>
                          <td className="p-2">{student.std_lname}</td>
                          <td className="p-2">{student.std_fname}</td>
                          <td className="p-2">{student.std_course}</td>
                          <td className="p-2">{student.std_level}</td>
                          <td className="p-2">{student.std_section}</td>
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
                    pageCount={Math.ceil(classStudents.length / itemsPerPage)}
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
                <p>
                  <i>
                    Note: Students need to have a status of active and have 3
                    images before they are displayed in this list...
                  </i>
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => clearAddStudentsToClass()}
              >
                CLOSE
              </button>
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => addStudentsToClass()}
              >
                ADD STUDENTS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL REMOVE*/}
      <div
        className="modal fade"
        id="staticBackdrop2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel2"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel2">
                REMOVE STUDENTS FROM {delClassName}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Start of Subject Code */}
              <div className="w-100 d-flex justify-content-center">
                <div className="md-6 mb-4 mx-2">
                  <div className="inputBox2 w-100">
                    <input
                      type="text"
                      id="delClassCode"
                      value={delClassCode}
                      onChange={(e) => {
                        setDelClassCode(e.target.value);
                        setError(false);
                      }}
                      disabled
                    />
                    <span className="">Subject Code</span>
                  </div>
                </div>

                <div className="md-6 mb-4 mx-2">
                  <div className="inputBox2 w-100">
                    <input
                      type="text"
                      id="delClassName"
                      value={delClassName}
                      onChange={(e) => {
                        setDelClassName(e.target.value);
                        setError(false);
                      }}
                      disabled
                    />
                    <span className="">Subject Name</span>
                  </div>
                </div>
              </div>
              <div className="table-responsive mt-2">
                <table className="table table-hover table-bordered border-secondary table-secondary align-middle">
                  <thead className="table-light">
                    <tr>
                      <th></th>
                      <th>FAITH ID</th>
                      <th>LAST NAME</th>
                      <th>FIRST NAME</th>
                      <th>COURSE</th>
                      <th>YEAR</th>
                      <th>SECTION</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {currentRemoveStudents.length > 0 ? (
                      currentRemoveStudents.map((student, index) => (
                        <tr key={student.id} className="table-primary">
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={removeSelectedStudents.includes(student)}
                              onChange={() =>
                                handleRemoveStudentSelection(student)
                              }
                            />
                          </td>
                          <td className="p-2">{student.faith_id}</td>
                          <td className="p-2">{student.std_lname}</td>
                          <td className="p-2">{student.std_fname}</td>
                          <td className="p-2">{student.std_course}</td>
                          <td className="p-2">{student.std_level}</td>
                          <td className="p-2">{student.std_section}</td>
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
                    pageCount={Math.ceil(
                      delClassStudents.length / itemsPerPage
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => clearRemoveStudentsToClass()}
              >
                CLOSE
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => removeStudentsToClass()}
              >
                REMOVE STUDENTS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminClassManagement;
