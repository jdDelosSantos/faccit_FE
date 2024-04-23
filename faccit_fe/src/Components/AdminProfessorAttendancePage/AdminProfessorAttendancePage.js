import React, { useState, useRef, useEffect } from "react";
import "../AdminProfessorAttendancePage/AdminProfessorAttendancePage.css";
import { jwtDecode } from "jwt-decode";

import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import https from "../../https";

function AdminProfessorAttendancePage() {
  //NEW SUBJECT USE STATES
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");

  const [laboratory, setLaboratory] = useState("");
  const [classDay, setClassDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  //SEARCHTERM FOR SEARCH BAR
  const [searchTerm, setSearchTerm] = useState("");

  //REACT-PAGINATION
  const [classSchedules, setClassSchedules] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const sortClassSchedule = classSchedules
    .sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .filter(
      (item) =>
        item.class_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.class.class_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.class_day.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.professor.user_firstname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.professor.user_lastname
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  const currentItems = sortClassSchedule.slice(startIndex, endIndex);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [text, setText] = useState("");

  const [absentClassCode, setAbsentClassCode] = useState("");
  const [absentClassDay, setAbsentClassDay] = useState("");
  const [absentStartTime, setAbsentStartTime] = useState("");
  const [absentEndTime, setAbsentEndTime] = useState("");
  const [absentLaboratory, setAbsentLaboratory] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);

  const [classes, setClasses] = useState([]);
  // const classes = useSelector((state) => state.class.classes);

  const sessionToken = sessionStorage.getItem("Token");
  const decoded = jwtDecode(sessionToken);
  const tokenId = decoded.prof_id;

  //Function for fetching Class Schedules
  const fetchOpenClasses = () => {
    https
      .get(`get_open_class/${tokenId}`, {
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

  //Function for fetching Classes
  const fetchClasses = () => {
    https
      .get("classes", {
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
    fetchOpenClasses();
    fetchClasses();
  }, []);

  const [id, setId] = useState(0);
  const [status, setStatus] = useState("");
  //FUNCTION FOR PUTTING SELECTED COURSE TO UPDATE FIELDS
  const handleClassUpdate = (
    id,
    class_name,
    class_code,
    class_day,
    laboratory,
    start_time,
    end_time,
    cancel_class_status
  ) => {
    setId(id);

    setLaboratory(laboratory);
    setClassCode(class_code);
    setClassName(class_name);
    setClassDay(class_day);
    setStartTime(start_time);
    setEndTime(end_time);

    setStatus(cancel_class_status);
  };

  const clearClass = () => {
    setClassCode("");
    setClassDay("");
    setStartTime("");
    setEndTime("");
    setErrorMessage("");
    setStatus("");
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
        if (decodedToken.role !== "admin") {
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
          <b>{tokenFirstname}'S OPEN CLASSES PAGE</b>
        </h1>
        <h4 className="">LIST OF OPEN CLASSES</h4>
        <div className="shadow upper_bg rounded container-fluid w-100 p-3 px-5">
          <div className="table-responsive">
            <div className="w-100 d-flex justify-content-between align-items-center my-3">
              <div className="w-100 d-flex">
                <div className="w-75">
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="search"
                      placeholder="Search Cancel Class Requests..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-25 d-flex justify-content-end"></div>
            </div>

            <table className="table table-striped table-hover table-bordered border-secondary table-secondary align-middle">
              <thead className="table-light">
                <tr>
                  <th>DATE</th>
                  <th>CLASS NAME</th>
                  <th>CLASS RANGE</th>
                  <th>TIME IN</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length > 0 ? (
                  currentItems.map((open, index) => (
                    <tr className="table-light" key={index}>
                      <td className="p-2">{open.date}</td>
                      <td className="p-2">{open.class_name}</td>
                      <td className="p-2">
                        {open.start_time} - {open.end_time}
                      </td>

                      <td className="p-2">{open.time_in}</td>
                      <td className="p-2 text-success">{open.status}</td>
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
                pageCount={Math.ceil(classSchedules.length / itemsPerPage)}
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
    );
  }
}

export default AdminProfessorAttendancePage;
