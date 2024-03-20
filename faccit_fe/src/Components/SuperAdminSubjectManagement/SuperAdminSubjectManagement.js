import React, { useState, useRef, useEffect } from "react";
import "../SuperAdminSubjectManagement/SuperAdminSubjectManagement.css";
import { setSubjects } from "../../Redux/subjects";
import { setProfessors } from "../../Redux/professors";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";

function SuperAdminSubjectManagement() {
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

  const subjects = useSelector((state) => state.subject.subjects);
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
    fetchProfessors();
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

  const handleSubjectDeactivate = () => {};

  const handleSubjectActivate = () => {};

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
                ADD SUBJECT
              </button>
            </div>
          </div>

          <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
            <thead className="table-light">
              <tr>
                <th>SUBJECT CODE</th>
                <th>SUBJECT NAME</th>
                <th>SUBJECT DESCRIPTION</th>
                <th>PROFESSOR ID</th>
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
                    <td className="p-2">{subject.subject_description}</td>
                    <td className="p-2">{subject.prof_id}</td>
                    <td className="p-2">{subject.subject_day}</td>
                    <td className="p-2">{subject.start_time}</td>
                    <td className="p-2">{subject.end_time}</td>
                    <td className="p-2">
                      <button
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop5"
                        className="btn btn-primary"
                        onClick={() => {
                          handleSubjectUpdate(
                            subject.subject_code,
                            subject.subject_name,
                            subject.subject_description,
                            subject.prof_id,
                            subject.subject_day,
                            subject.start_time,
                            subject.end_time
                          );
                        }}
                      >
                        UPDATE
                      </button>
                      {subject.subject_status == "Active" ? (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop6"
                          className="btn btn-danger mx-3"
                          onClick={handleSubjectDeactivate()}
                        >
                          DEACTIVATE
                        </button>
                      ) : (
                        <button
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop7"
                          className="btn btn-success mx-3"
                          onClick={handleSubjectActivate()}
                        >
                          REACTIVATE
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
                <b>CREATE COURSE</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleSubjectSubmit(e)}>
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
                        SUBJECT INFORMATION
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
                    {/* Start of Subject Code */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="subjectCode"
                            value={subjectCode}
                            onChange={(e) => {
                              setSubjectCode(e.target.value);
                              setError(false);
                            }}
                            maxLength="4"
                            required
                          />
                          <span className="">Subject Code</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject Name*/}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="subjectName"
                            value={subjectName}
                            onChange={(e) => {
                              setSubjectName(e.target.value);
                            }}
                            required
                          />
                          <span className="">Subject Name</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject Description */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="subjectDescription"
                            value={subjectDescription}
                            onChange={(e) => {
                              setSubjectDescription(e.target.value);
                            }}
                            required
                          />
                          <span className="">Subject Description</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject Day */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <select
                            className="form-select form-select-md mb-3"
                            aria-label=".form-select-md example"
                            onChange={(e) => {
                              setSubjectDay(e.target.value);
                            }}
                            id="subjectDay"
                            value={subjectDay || ""}
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
                              ? professors.map((professor) => (
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

                    {/* Start of Subject Start Time */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="time"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => {
                              setStartTime(e.target.value);
                            }}
                          />
                          <span className="">Subject Start Time</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject End Time */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="time"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => {
                              setEndTime(e.target.value);
                            }}
                          />
                          <span className="">Subject End Time</span>
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
                    clearSubject();
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn btn-success mb-1"
                  data-bs-dismiss="modal"
                >
                  ADD SUBJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* END OF MODAL FOR ADDING SUBJECT */}

      {/* START OF MODAL FOR UPDATING SUBJECT */}
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
                <b>UPDATE SUBJECT</b>
              </h1>
            </div>

            <form onSubmit={(e) => handleUpdateSubjectSubmit(e)}>
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
                        SUBJECT INFORMATION
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
                    {/* Start of Subject Code */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox2 w-100">
                          <input
                            type="text"
                            id="updateSubjectCode"
                            value={updateSubjectCode}
                            onChange={(e) => {
                              setUpdateSubjectCode(e.target.value);
                              setError(false);
                            }}
                            maxLength="4"
                            required
                            disabled
                          />
                          <span className="">Subject Code</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject Name*/}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateSubjectName"
                            value={updateSubjectName}
                            onChange={(e) => {
                              setUpdateSubjectName(e.target.value);
                            }}
                            required
                          />
                          <span className="">Subject Name</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject Description */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="text"
                            id="updateSubjectDescription"
                            value={updateSubjectDescription}
                            onChange={(e) => {
                              setUpdateSubjectDescription(e.target.value);
                            }}
                            required
                          />
                          <span className="">Subject Description</span>
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
                            <option value="None">None</option>
                            {professors.length > 0
                              ? professors.map((professor) => (
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

                    {/* Start of Subject Day */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <select
                            className="form-select form-select-md mb-3"
                            aria-label=".form-select-md example"
                            onChange={(e) => {
                              setUpdateSubjectDay(e.target.value);
                            }}
                            id="updateSubjectDay"
                            value={updateSubjectDay || ""}
                          >
                            <option value="" disabled>
                              Select a Day
                            </option>
                            <option value="None">None</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject Start Time */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="time"
                            id="updateStartTime"
                            value={updateStartTime || ""}
                            onChange={(e) => {
                              setUpdateStartTime(e.target.value);
                            }}
                          />
                          <span className="">Subject Start Time</span>
                        </div>
                      </div>
                    </div>

                    {/* Start of Subject End Time */}
                    <div className="">
                      <div className="md-6 mb-4">
                        <div className="inputBox1 w-100">
                          <input
                            type="time"
                            id="updateEndTime"
                            value={updateEndTime || ""}
                            onChange={(e) => {
                              setUpdateEndTime(e.target.value);
                            }}
                          />
                          <span className="">Subject End Time</span>
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
                    clearUpdateSubject();
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

export default SuperAdminSubjectManagement;
