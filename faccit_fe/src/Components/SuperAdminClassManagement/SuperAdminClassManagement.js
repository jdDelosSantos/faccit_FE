import React, { useState, useRef, useEffect } from "react";
import "./SuperAdminClassManagement.css";
// import { setSubjects } from "../../Redux/subjects";
import { setProfessors } from "../../Redux/professors";
import { setColleges } from "../../Redux/colleges";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";

function SuperAdminClassManagement() {
  //NEW SUBJECT USE STATES
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [professorID, setProfessorID] = useState("");
  // const [subjectDay, setSubjectDay] = useState("");
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");

  //UPDATE SUBJECT USE STATES
  const [updateClassCode, setUpdateClassCode] = useState("");
  const [updateClassName, setUpdateClassName] = useState("");
  const [updateClassDescription, setUpdateClassDescription] = useState("");
  const [updateProfessorID, setUpdateProfessorID] = useState("");
  // const [updateSubjectDay, setUpdateSubjectDay] = useState("");
  // const [updateStartTime, setUpdateStartTime] = useState("");
  // const [updateEndTime, setUpdateEndTime] = useState("");

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredSortedData = classes.filter((item) => {
    const searchTerms = searchTerm.toLowerCase().split(" ");
    const matchingColumns = [
      "class_code",
      "class_name",
      "class_description",
      "college_name",
      "prof_id",
      "class_status",
    ];

    return searchTerms.every((term) => {
      return matchingColumns.some((column) => {
        const regex = new RegExp(term, "i");
        return regex.test(item[column].toLowerCase());
      });
    });
  });

  const currentItems = filteredSortedData.slice(startIndex, endIndex);

  const reduxClasses = useSelector((state) => state.class.classes);
  const professors = useSelector((state) => state.professor.professors);
  const colleges = useSelector((state) => state.college.colleges);

  const [classCollege, setClassCollege] = useState("");
  const [updateClassCollege, setUpdateClassCollege] = useState("");

  const NametoUpperCase = sessionStorage.getItem("Firstname").toUpperCase();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {}, [professors]);
  useEffect(() => {}, [classes]);

  //Function for fetching Subjects
  const fetchClasses = () => {
    https
      .get("classes", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        // dispatch(setSubjects(result.data));
        setClasses(result.data);
        console.log(currentItems);
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

  //Function for fetching Professors
  const fetchColleges = () => {
    https
      .get("colleges", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        dispatch(setColleges(result.data));
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
    fetchProfessors();
    fetchColleges();
  }, []);

  const handleSubjectSearchBar = (e) => {
    e.preventDefault();
    // Implement search functionality if needed
  };

  //FUNCTION FOR ADDING A COURSE
  const handleClassSubmit = (e) => {
    e.preventDefault();

    const classData = {
      class_code: classCode,
      class_name: className,
      class_description: classDescription,
      college_name: classCollege,
      prof_id: professorID,
    };

    console.log(classData);
    https
      .post("classes", classData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchClasses();
        toast.success(result.data.message, { duration: 7000 });

        setClassCode("");
        setClassName("");
        setClassDescription("");
        setClassCollege("");
        setProfessorID("");
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
  const handleClassUpdate = (
    subject_code,
    subject_name,
    subject_description,
    college_name,
    prof_id
  ) => {
    setUpdateClassCode(subject_code);
    setUpdateClassName(subject_name);
    setUpdateClassDescription(subject_description);
    setUpdateClassCollege(college_name);
    setUpdateProfessorID(prof_id);
  };

  //FUNCTION FOR ADDING UPDATING A SUBJECT
  const handleUpdateClassSubmit = (e) => {
    e.preventDefault();
    const updateClassData = {
      class_code: updateClassCode,
      class_name: updateClassName,
      class_description: updateClassDescription,
      college_name: updateClassCollege,
      prof_id: updateProfessorID,
    };
    console.log(updateClassData);

    https
      .put(`update_classes/${updateClassCode}`, updateClassData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        fetchClasses();
        toast.success(result.data.message, { duration: 7000 });

        setUpdateClassCode("");
        setUpdateClassName("");
        setUpdateClassDescription("");
        setUpdateClassCollege("");
        setUpdateProfessorID("");
      })
      .catch((error) => {
        if (error.response.message != "Unauthenticated.") {
          setError(true);
          setErrorMessage(error.response.data.message);
          toast.error(error.response.data.message, { duration: 7000 });
        } else {
          goBackToLogin();
        }
      });
  };

  const handleClassDeactivate = (class_code) => {
    const classData = {
      class_status: "Disabled",
    };

    https
      .put(`class_disable/${class_code}`, classData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.error(result.data.message, { duration: 7000 });
        fetchClasses();
      });
  };

  const handleClassActivate = (class_code) => {
    const classData = {
      class_status: "Active",
    };

    https
      .put(`class_enable/${class_code}`, classData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        toast.success(result.data.message, { duration: 7000 });
        fetchClasses();
      });
  };

  const clearClass = () => {
    setClassCode("");
    setClassName("");
    setClassDescription("");
    // setSubjectDay("");
    // setStartTime("");
    // setEndTime("");
  };

  const clearUpdateClass = () => {
    setUpdateClassCode("");
    setUpdateClassName("");
    setUpdateClassDescription("");
    setUpdateProfessorID("");
    // setUpdateSubjectDay("");
    // setUpdateStartTime("");
    // setUpdateEndTime("");
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
              <div className="w-75">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search Class..."
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
                ADD CLASS
              </button>
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>CLASS CODE</th>
                <th>CLASS NAME</th>
                <th>CLASS DESCRIPTION</th>
                <th>CLASS COLLEGE</th>
                <th>PROFESSOR ID</th>
                <th>CLASS STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentItems.length > 0 ? (
                currentItems.map((classes, index) => (
                  <tr className="table-light" key={index}>
                    <td className="p-2">{classes.class_code}</td>
                    <td className="p-2">{classes.class_name}</td>
                    <td className="p-2">{classes.class_description}</td>
                    <td className="p-2">{classes.college_name}</td>
                    <td className="p-2">{classes.prof_id}</td>
                    <td className="p-2">
                      {classes.class_status === "Active" ? (
                        <span style={{ color: "green" }}>ACTIVE</span>
                      ) : (
                        <span style={{ color: "red" }}>DISABLED</span>
                      )}
                    </td>
                    <td className="p-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop5"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          handleClassUpdate(
                            classes.class_code,
                            classes.class_name,
                            classes.class_description,
                            classes.college_name,
                            classes.prof_id
                          );
                        }}
                      >
                        UPDATE
                      </button>
                      {classes.class_status == "Active" ? (
                        <button
                          type="button"
                          // data-bs-toggle="modal"
                          // data-bs-target="#staticBackdrop6"
                          className="btn btn-danger mx-2 btn-sm"
                          onClick={() =>
                            handleClassDeactivate(classes.class_code)
                          }
                        >
                          DISABLE
                        </button>
                      ) : (
                        <button
                          type="button"
                          // data-bs-toggle="modal"
                          // data-bs-target="#staticBackdrop7"
                          className="btn btn-success mx-2 btn-sm"
                          onClick={() =>
                            handleClassActivate(classes.class_code)
                          }
                        >
                          ENABLE
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
          <div className="d-flex flex-row">
            <ReactPaginate
              nextLabel="Next >"
              onPageChange={(event) => setCurrentPage(event.selected)}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={Math.ceil(classes.length / itemsPerPage)}
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
                <b>CREATE CLASS</b>
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
                    <h1></h1>
                    {/* Start of CLASS Code */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="classCode"
                            value={classCode}
                            onChange={(e) => {
                              setClassCode(e.target.value);
                              setError(false);
                            }}
                            maxLength="4"
                            required
                          />
                          <span className="">Class Code</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Class Name*/}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="className"
                            value={className}
                            onChange={(e) => {
                              setClassName(e.target.value);
                            }}
                            required
                          />
                          <span className="">Class Name</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Class Description */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="classDescription"
                            value={classDescription}
                            onChange={(e) => {
                              setClassDescription(e.target.value);
                            }}
                            required
                          />
                          <span className="">Class Description</span>
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
                              setClassCollege(e.target.value);
                            }}
                            id="classCollege"
                            value={classCollege || ""}
                            required
                          >
                            <option value="" disabled>
                              Select a Course College
                            </option>
                            {colleges.length > 0
                              ? colleges
                                  .filter(
                                    (college) =>
                                      college.college_status === "Active"
                                  )
                                  .map((college) => (
                                    <option
                                      key={`${college.id}-${college.college_name}-${college.college_description}`}
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

                    {/* Start of Prof ID */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <select
                            className="form-select form-select-md mb-3"
                            aria-label=".form-select-md example"
                            onChange={(e) => {
                              setProfessorID(e.target.value);
                            }}
                            id="professorID"
                            value={professorID || ""}
                          >
                            <option value="" disabled>
                              Select a Professor
                            </option>
                            {professors.length > 0
                              ? professors
                                  .filter(
                                    (professor) =>
                                      professor.user_status === "Active"
                                  )
                                  .map((professor) => (
                                    <option
                                      key={`${professor.prof_id}-${professor.user_lastname}-${professor.user_firstname}`}
                                      value={professor.prof_id}
                                      title={`Professor ID: ${professor.prof_id}`}
                                    >
                                      {professor.user_lastname},{" "}
                                      {professor.user_firstname}
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

      {/* START OF MODAL FOR UPDATING CLASS */}
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
                <b>UPDATE CLASS</b>
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
                    <h1></h1>
                    {/* Start of Class Code */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox2 w-100">
                          <input
                            type="text"
                            id="updateClassCode"
                            value={updateClassCode}
                            onChange={(e) => {
                              setUpdateClassCode(e.target.value);
                              setError(false);
                            }}
                            maxLength="4"
                            required
                            disabled
                          />
                          <span className="">Class Code</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Class Name*/}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateClassName"
                            value={updateClassName}
                            onChange={(e) => {
                              setUpdateClassName(e.target.value);
                            }}
                            required
                          />
                          <span className="">Class Name</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Class Description */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateClassDescription"
                            value={updateClassDescription}
                            onChange={(e) => {
                              setUpdateClassDescription(e.target.value);
                            }}
                            required
                          />
                          <span className="">Class Description</span>
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
                              setUpdateClassCollege(e.target.value);
                            }}
                            id="updateClassCollege"
                            value={updateClassCollege || ""}
                            required
                          >
                            <option value="" disabled>
                              Select a Class College
                            </option>
                            {colleges.length > 0
                              ? colleges
                                  .filter(
                                    (college) =>
                                      college.college_status === "Active"
                                  )
                                  .map((college) => (
                                    <option
                                      key={`${college.id}-${college.college_name}-${college.college_description}`}
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

                    {/* Start of Prof ID */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <select
                            className="form-select form-select-md mb-3"
                            aria-label=".form-select-md example"
                            onChange={(e) => {
                              setUpdateProfessorID(e.target.value);
                            }}
                            id="updateProfessorID"
                            value={updateProfessorID || ""} // Use an empty string if updateProfessorID is falsy
                          >
                            <option value="" disabled>
                              Select a Professor
                            </option>

                            {professors.length > 0
                              ? professors
                                  .filter(
                                    (professor) =>
                                      professor.user_status === "Active"
                                  )
                                  .map((professor) => (
                                    <option
                                      key={`${professor.prof_id}-${professor.user_lastname}-${professor.user_firstname}`}
                                      value={professor.prof_id}
                                      title={`Professor ID: ${professor.prof_id}`}
                                    >
                                      {professor.user_lastname},{" "}
                                      {professor.user_firstname}
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
      {/* END OF MODAL FOR UPDATING SUBJECT */}
    </div>
  );
}

export default SuperAdminClassManagement;
