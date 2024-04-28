import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import https from "../../https";
import { Link } from "react-router-dom";

function SuperAdminDashboard() {
  const [tokenFirstname, setTokenFirstname] = useState("");
  const [component, setComponent] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionToken = sessionStorage.getItem("Token");

  const goBackToLogin = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (sessionToken) {
    const decoded = jwtDecode(sessionToken);
    const tokenId = decoded.prof_id;
  } else {
    goBackToLogin();
  }

  const [classCount, setClassCount] = useState([]);
  const [studentsCount, setStudentsCount] = useState([]);
  const [makeupCount, setMakeupCount] = useState([]);
  const [cancelCount, setCancelCount] = useState([]);

  //Function for fetching Classes
  const fetchAllClasses = () => {
    https
      .get(`super_admin_all_classes`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setClassCount(result.data.class_count);
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

  const fetchAllStudents = () => {
    https
      .get(`super_admin_all_students`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setStudentsCount(result.data.student_count);
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

  const fetchPendingMakeupRequest = () => {
    https
      .get(`super_admin_all_pending_makeup`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setMakeupCount(result.data.pending_makeup_count);
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

  const fetchPendingCancelRequest = () => {
    https
      .get(`super_admin_all_pending_cancel`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
      })
      .then((result) => {
        setCancelCount(result.data.pending_cancel_count);
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

  useEffect(() => {
    fetchAllClasses();
    fetchAllStudents();
    fetchPendingMakeupRequest();
    fetchPendingCancelRequest();
  }, []);

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
          <b>{tokenFirstname}'S DASHBOARD</b>
        </h1>

        <div className="shadow upper_bg rounded container-fluid w-100 p-5 d-flex flex-column">
          <div className="container-fluid w-100 d-flex justify-content-md-between mb-2 mt-3">
            <div className="bg-light rounded w-25 p-4 shadow mx-3">
              <h3 className="text-dark">
                <b>CURRENT # OF CLASSES</b>
              </h3>
              <span className="text-dark fs-4">{classCount}</span>
            </div>
            <div className="bg-light rounded w-25 p-4 shadow mx-3">
              <h3 className="text-dark">
                <b>CURRENT # OF STUDENTS</b>
              </h3>
              <span className="text-dark fs-4">{studentsCount}</span>
            </div>
            <div className="bg-light rounded w-25 p-4 shadow mx-3">
              <h3 className="text-dark">
                <b>CURRENT # OF PENDING MAKEUP CLASS REQUESTS</b>
              </h3>
              <span className="text-dark fs-4">{makeupCount}</span>
            </div>
            <div className="bg-light rounded w-25 p-4 shadow mx-3">
              <h3 className="text-dark">
                <b>CURRENT # OF PENDING CANCEL CLASS REQUESTS</b>
              </h3>
              <span className="text-dark fs-4">{cancelCount}</span>
            </div>
          </div>
          <div className="container-fluid w-100 mt-5 d-flex">
            <div className="border container-fluid d-flex justify-content-between mb-3">
              <Link
                to="/labs/programming-lab"
                className="bg-primary rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/pl.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Programming Lab</span>
              </Link>

              <Link
                to="/labs/multimedia-lab"
                className="bg-secondary rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/ml.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Multimedia Lab</span>
              </Link>

              <Link
                to="/managements/students"
                className="bg-success rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/dashboard_attendance.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Students</span>
              </Link>

              <Link
                to="/managements/classes"
                className="bg-info rounded w-25 p-4 mx-2"
              >
                <img
                  src={require("../../Assets/images/classes.png")}
                  className="dashboard_img mx-1"
                  alt="list"
                />
                <span className="text-white mx-1">Classes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SuperAdminDashboard;
