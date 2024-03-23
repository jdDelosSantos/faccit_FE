import React, { useState, useRef, useEffect } from "react";
import "./AdminSubjectManagement.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";
import { setSubjects } from "../../Redux/subjects";
// import { setStudents } from "../../Redux/students";
import { setCourses } from "../../Redux/courses";
import ReactPaginate from "react-paginate";

function AdminSubjectManagement() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [filterCourse, setFilterCourse] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterSection, setFilterSection] = useState("");

  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [removeSelectedStudents, setRemoveSelectedStudents] = useState([]);

  const [listSubjectCode, setListSubjectCode] = useState("");
  const [listSubjectName, setListSubjectName] = useState("");

  const [delSubjectCode, setDelSubjectCode] = useState("");
  const [delSubjectName, setDelSubjectName] = useState("");

  //REACT-PAGINATION
  const [subjectStudents, setSubjectStudents] = useState([]);

  const [listSubjectStudents, setListSubjectStudents] = useState([]);

  const [delSubjectStudents, setDelSubjectStudents] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Function for fetching Subjects
  const fetchSubjects = () => {
    if (sessionStorage.getItem("Prof ID") != null || "") {
      https
        .get(`profSubjects/${sessionStorage.getItem("Prof ID")}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          dispatch(setSubjects(result.data));
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
        setSubjectStudents(result.data);
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
    fetchSubjects();
    fetchStudents();
    fetchCourses();
  }, []);

  const subjects = useSelector((state) => state.subject.subjects);
  // const reduxStudents = useSelector((state) => state.student.students);
  const courses = useSelector((state) => state.course.courses);

  const handleStudentList = (subject_code, subject_name) => {
    setListSubjectCode(subject_code);
    setListSubjectName(subject_name);
    try {
      https
        .get(`get_subject_students/${subject_code}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          console.log(result.data);

          setListSubjectStudents(result.data);
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

  const handleAddStudents = (subject_code, subject_name) => {
    setSubjectCode(subject_code);
    setSubjectName(subject_name);
  };

  const handleRemoveStudents = (subject_code, subject_name) => {
    setDelSubjectCode(subject_code);
    setDelSubjectName(subject_name);

    try {
      https
        .get(`get_subject_students/${subject_code}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          setDelSubjectStudents(result.data);
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

  const addStudentsToSubject = () => {
    console.log(selectedStudents);
    https
      .post(`create_subject_students/${subjectCode}`, selectedStudents, {
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

  const removeStudentsToSubject = () => {
    console.log(removeSelectedStudents);
    try {
      https
        .delete(`remove_subject_students/${delSubjectCode}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
          data: removeSelectedStudents,
        })
        .then((result) => {
          toast.success(result.data.message, { duration: 7000 });
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
            // goBackToLogin();
          }
        });
    } catch (error) {
      console.error("Error removing students:", error);
      setError(true);
      setErrorMessage("An unexpected error occurred.");
      toast.error("An unexpected error occurred.", { duration: 7000 });
    } finally {
      clearRemoveStudentsToSubject();
    }
  };

  const clearListStudentsToSubject = () => {
    setSubjectCode("");
    setSubjectName("");
  };

  const clearAddStudentsToSubject = () => {
    setSubjectCode("");
    setSubjectName("");
    setSelectedStudents([]);
  };

  const clearRemoveStudentsToSubject = () => {
    setDelSubjectCode("");
    setDelSubjectName("");
    setRemoveSelectedStudents([]);
  };

  const filteredStudents = subjectStudents.filter(
    (student) =>
      student.std_status === "Active" &&
      (filterCourse === "" || student.std_course === filterCourse) &&
      student.std_level.toLowerCase().includes(filterLevel.toLowerCase()) &&
      student.std_section.toLowerCase().includes(filterSection.toLowerCase())
  );
  // .sort((student1, student2) =>
  //   student1.std_lname.localeCompare(student2.std_lname)
  // );

  const filteredListStudents = listSubjectStudents.sort((student1, student2) =>
    student1.std_lname.localeCompare(student2.std_lname)
  );

  const filteredRemoveStudents = delSubjectStudents.sort((student1, student2) =>
    student1.std_lname.localeCompare(student2.std_lname)
  );

  const currentItems = filteredStudents.slice(startIndex, endIndex);

  const currentListStudents = filteredListStudents.slice(startIndex, endIndex);

  const currentRemoveStudents = filteredRemoveStudents.slice(
    startIndex,
    endIndex
  );

  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();
  const handleSubjectSearchBar = (e) => {
    e.preventDefault();
  };

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="base_bg w-100 p-4">
      <h1 className="my-1">
        <b>{NametoUpperCase}'S SUBJECT MANAGEMENT PAGE</b>
      </h1>
      <h4 className="">LIST OF SUBJECTS</h4>
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
                      placeholder="Search Subjects..."
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
                <th>SUBJECT CODE</th>
                <th>SUBJECT NAME</th>
                <th>SUBJECT DAY</th>
                <th>START TIME</th>
                <th>END TIME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{subject.subject_code}</td>
                    <td className="p-2">{subject.subject_name}</td>
                    <td className="p-2">{subject.subject_day}</td>
                    <td className="p-2">{subject.start_time}</td>
                    <td className="p-2">{subject.end_time}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        className="btn btn-secondary"
                        onClick={() => {
                          handleStudentList(
                            subject.subject_code,
                            subject.subject_name
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
                            subject.subject_code,
                            subject.subject_name
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
                            subject.subject_code,
                            subject.subject_name
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
                CURRENT STUDENTS IN {subjectName}
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
                      id="subjectCode"
                      value={listSubjectCode}
                      onChange={(e) => {
                        setListSubjectCode(e.target.value);
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
                      id="subjectName"
                      value={listSubjectName}
                      onChange={(e) => {
                        setListSubjectName(e.target.value);
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
                      listSubjectStudents.length / itemsPerPage
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
                onClick={() => clearListStudentsToSubject()}
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
                ADD STUDENTS TO {subjectName} SUBJECT
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
                      id="subjectCode"
                      value={subjectCode}
                      onChange={(e) => {
                        setSubjectCode(e.target.value);
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
                      id="subjectName"
                      value={subjectName}
                      onChange={(e) => {
                        setSubjectName(e.target.value);
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
                    pageCount={Math.ceil(subjectStudents.length / itemsPerPage)}
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
                onClick={() => clearAddStudentsToSubject()}
              >
                CLOSE
              </button>
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => addStudentsToSubject()}
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
                REMOVE STUDENTS FROM {delSubjectName}
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
                      id="delSubjectCode"
                      value={delSubjectCode}
                      onChange={(e) => {
                        setDelSubjectCode(e.target.value);
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
                      id="delSubjectName"
                      value={delSubjectName}
                      onChange={(e) => {
                        setDelSubjectName(e.target.value);
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
                      delSubjectStudents.length / itemsPerPage
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
                onClick={() => clearRemoveStudentsToSubject()}
              >
                CLOSE
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={() => removeStudentsToSubject()}
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

export default AdminSubjectManagement;
