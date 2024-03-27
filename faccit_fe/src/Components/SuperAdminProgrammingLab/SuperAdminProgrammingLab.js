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
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = subjects.slice(startIndex, endIndex);

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const reduxSubjects = useSelector((state) => state.subject.subjects);
  const professors = useSelector((state) => state.professor.professors);
  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {}, [professors]);
  useEffect(() => {}, [subjects]);

  //Function for fetching Subjects
  const fetchSubjects = () => {
    https
      .get("subjects", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setSubjects(result.data));
        setSubjects(result.data);
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

  //Function for fetching Professors
  const fetchProfessors = () => {
    https
      .get("getProfessors", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        dispatch(setProfessors(result.data));
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
  }, []);

  const handleSubjectSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  //FUNCTION FOR ADDING A COURSE
  const handleSubjectSubmit = (e) => {
    e.preventDefault();

    const subjectData = {
      subject_code: subjectCode,
      subject_name: subjectName,
      subject_description: subjectDescription,
      ...(professorID && { prof_id: professorID }),
      ...(subjectDay && { subject_day: subjectDay }),
      ...(startTime && { start_time: startTime }),
      ...(endTime && { end_time: endTime }),
    };

    console.log(subjectData);

    try {
      https
        .post("subjects", subjectData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        })
        .then((result) => {
          fetchSubjects();
          toast.success(result.data.message, { duration: 7000 });

          setSubjectCode("");
          setSubjectName("");
          setSubjectDescription("");
          setSubjectDay("");
          setStartTime("");
          setEndTime("");
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
    } catch {
      console.error(error);
    }
  };

  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleSubjectUpdate = (
    subject_code,
    subject_name,
    subject_description,
    prof_id,
    subject_day,
    start_time,
    end_time
  ) => {
    setUpdateSubjectCode(subject_code);
    setUpdateSubjectName(subject_name);
    setUpdateSubjectDescription(subject_description);
    setUpdateProfessorID(prof_id);
    setUpdateSubjectDay(subject_day);
    setUpdateStartTime(start_time);
    setUpdateEndTime(end_time);
  };

  //FUNCTION FOR ADDING UPDATING A SUBJECT
  const handleUpdateSubjectSubmit = (e) => {
    e.preventDefault();
    const updateSubjectData = {
      subject_code: updateSubjectCode,
      subject_name: updateSubjectName,
      subject_description: updateSubjectDescription,
      subject_day: updateSubjectDay,
      prof_id: updateProfessorID,
      start_time: updateStartTime,
      end_time: updateEndTime,
    };

    console.log(updateSubjectData);
    https
      .put(`update_subjects/${updateSubjectCode}`, updateSubjectData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchSubjects();
        toast.success(result.data.message, { duration: 7000 });

        setUpdateSubjectCode("");
        setUpdateSubjectName("");
        setUpdateSubjectDescription("");
        setUpdateProfessorID("");
        setUpdateSubjectDay("");
        setUpdateStartTime("");
        setUpdateEndTime("");
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

  const handleSubjectRemove = (subject_code) => {
    // const subjectData = {
    //   subject_status: "Disabled",
    // };
    // https
    //   .put(`subject_deactivate/${subject_code}`, subjectData, {
    //     headers: {
    //       Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
    //     },
    //   })
    //   .then((result) => {
    //     toast.error(result.data.message, { duration: 7000 });
    //     fetchSubjects();
    //   });
  };

  const handleSubjectActivate = (subject_code) => {
    // const subjectData = {
    //   subject_status: "Active",
    // };
    // https
    //   .put(`subject_activate/${subject_code}`, subjectData, {
    //     headers: {
    //       Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
    //     },
    //   })
    //   .then((result) => {
    //     toast.success(result.data.message, { duration: 7000 });
    //     fetchSubjects();
    //   });
  };

  const handleSubjectsSearchBar = (e) => {
    e.preventDefault();
  };

  const clearSubject = () => {
    setSubjectCode("");
    setSubjectName("");
    setSubjectDescription("");
    setSubjectDay("");
    setStartTime("");
    setEndTime("");
  };

  const clearUpdateSubject = () => {
    setUpdateSubjectCode("");
    setUpdateSubjectName("");
    setUpdateSubjectDescription("");
    setUpdateProfessorID("");
    setUpdateSubjectDay("");
    setUpdateStartTime("");
    setUpdateEndTime("");
  };

  const clearLoadSubjects = () => {
    setSubjectCode("");
    setSubjectName("");
    setSelectedSubjects([]);
  };

  const loadSubjects = () => {
    console.log(selectedSubjects);
    const laboratory = "lab_prog";
    https
      .post(`create_laboratory_subjects/${laboratory}`, selectedSubjects, {
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

  const handleSubjectSelection = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Filter function to check if all required fields have values
  const hasRequiredFields = (subject) => {
    return (
      subject.subject_day &&
      subject.start_time &&
      subject.end_time &&
      subject.subject_status === "Active"
    );
  };

  const filteredData = currentItems.filter(hasRequiredFields);

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
            </div>

            <div className="w-25 d-flex justify-content-end">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop4"
                className="btn btn-primary btn-sm"
              >
                LOAD SUBJECT
              </button>
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>SUBJECT CODE</th>
                <th>SUBJECT NAME</th>
                <th>PROFESSOR ID</th>
                <th>SUBJECT DAY</th>
                <th>START TIME</th>
                <th>END TIME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentItems.length > 0 ? (
                currentItems.map((subject, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{subject.subject_code}</td>
                    <td className="p-2">{subject.subject_name}</td>
                    <td className="p-2">{subject.prof_id}</td>
                    <td className="p-2">{subject.subject_day}</td>
                    <td className="p-2">{subject.start_time}</td>
                    <td className="p-2">{subject.end_time}</td>
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
          <div className="d-flex flex-row">
            <ReactPaginate
              nextLabel="Next >"
              onPageChange={(event) => setCurrentPage(event.selected)}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={Math.ceil(subjects.length / itemsPerPage)}
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

      {/* START OF MODAL FOR LOADING SUBJECTS */}
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
                <b>LOAD SUBJECT</b>
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
                      SUBJECTS
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
                          <th>SUBJECT CODE</th>
                          <th>SUBJECT NAME</th>
                          <th>SUBJECT DAY</th>
                          <th>START TIME</th>
                          <th>END TIME</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {filteredData.length > 0 ? (
                          filteredData.map((subject, index) => (
                            <tr className="table-light" key={index}>
                              <td className="p-2">
                                <input
                                  type="checkbox"
                                  checked={selectedSubjects.includes(subject)}
                                  onChange={() =>
                                    handleSubjectSelection(subject)
                                  }
                                />
                              </td>
                              <td className="p-2">{subject.subject_code}</td>
                              <td className="p-2">{subject.subject_name}</td>

                              <td className="p-2">{subject.subject_day}</td>
                              <td className="p-2">{subject.start_time}</td>
                              <td className="p-2">{subject.end_time}</td>
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
                    <p>
                      Note: Subjects Displayed are only those with Professors,
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
