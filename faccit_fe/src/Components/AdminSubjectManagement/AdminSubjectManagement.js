import React, { useState, useRef, useEffect } from "react";
import "./AdminSubjectManagement.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";
import { setSubjects } from "../../Redux/subjects";
import { setStudents } from "../../Redux/students";

function AdminSubjectManagement() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //Function for fetching Subjects
  const fetchSubjects = () => {
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
  };

  //Function for fetching Students
  const fetchStudents = () => {
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

  useEffect(() => {
    fetchSubjects();
  }, []);

  const subjects = useSelector((state) => state.subject.subjects);
  const students = useSelector((state) => state.student.students);

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
        <b>{NametoUpperCase}'S STUDENT MANAGEMENT PAGE</b>
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
    </div>
  );
}

export default AdminSubjectManagement;
